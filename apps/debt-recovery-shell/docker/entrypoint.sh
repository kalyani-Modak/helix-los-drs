#!/bin/sh
set -e

CONFIG_PATH="${CONFIG_PATH:-/usr/share/nginx/html/drs/config.json}"
CONFIG_TEMPLATE_PATH="${CONFIG_TEMPLATE_PATH:-/etc/drs/config.json.template}"
STRICT_ENV_VALIDATION="${STRICT_ENV_VALIDATION:-false}"

echo "[entrypoint] Generating runtime config from template..."
if [ ! -f "$CONFIG_TEMPLATE_PATH" ]; then
  echo "[entrypoint] Missing config template at $CONFIG_TEMPLATE_PATH"
  exit 1
fi

REQUIRED_VARS="BASE_RULEENINGE_API_PATH BASE_KEYCLOAK_API_PATH BASE_HELIX_EARLY_COLLECTIONS_API_PATH BASE_HELIX_COL_LISTING_API_PATH CSP_CONNECT_ORIGIN"
missing_any=false
for var_name in $REQUIRED_VARS; do
  eval "var_value=\${$var_name:-}"
  if [ -z "$var_value" ]; then
    echo "[entrypoint] WARNING: Missing env var: $var_name"
    missing_any=true
  fi
done

if [ "$STRICT_ENV_VALIDATION" = "true" ] && [ "$missing_any" = "true" ]; then
  echo "[entrypoint] STRICT_ENV_VALIDATION=true and required env vars are missing. Aborting startup."
  exit 1
fi

# Replace placeholders and output the final JSON configuration file.
envsubst < "$CONFIG_TEMPLATE_PATH" > "$CONFIG_PATH"

NGINX_CSP_TAKES_PRECEDENCE="${NGINX_CSP_TAKES_PRECEDENCE:-true}"
INDEX_HTML_PATH="${INDEX_HTML_PATH:-/usr/share/nginx/html/drs/index.html}"

if [ -f "$INDEX_HTML_PATH" ]; then
  CSP_STYLE_NONCE="$(tr '\n' ' ' < "$INDEX_HTML_PATH" | sed -n "s/.*<meta[^>]*property=['\"']csp-nonce['\"'][^>]*nonce=['\"']\([^'\"']*\)['\"'][^>]*>.*/\1/p")"
  if [ -z "$CSP_STYLE_NONCE" ]; then
    echo "[entrypoint] Failed to extract CSP style nonce from $INDEX_HTML_PATH"
    echo "[entrypoint] Expected a meta tag like: <meta property=\"csp-nonce\" nonce=\"...\">"
    exit 1
  fi
  export CSP_STYLE_NONCE
else
  echo "[entrypoint] Index file not found at $INDEX_HTML_PATH"
  exit 1
fi

if [ "$NGINX_CSP_TAKES_PRECEDENCE" = "true" ]; then
  echo "[entrypoint] Removing CSP meta from $INDEX_HTML_PATH so nginx CSP header is authoritative..."
  awk '
    BEGIN {
      in_meta = 0
      drop_block = 0
      block = ""
    }
    {
      line = $0

      if (in_meta == 0) {
        if (line ~ /<meta([[:space:]]|>|$)/) {
          in_meta = 1
          block = line ORS
          drop_block = (line ~ /http-equiv=["\047]Content-Security-Policy["\047]/) ? 1 : 0

          if (line ~ /\/>/) {
            if (drop_block == 0) {
              printf "%s", block
            }
            in_meta = 0
            drop_block = 0
            block = ""
          }
          next
        }

        print line
        next
      }

      block = block line ORS
      if (line ~ /http-equiv=["\047]Content-Security-Policy["\047]/) {
        drop_block = 1
      }

      if (line ~ /\/>/) {
        if (drop_block == 0) {
          printf "%s", block
        }
        in_meta = 0
        drop_block = 0
        block = ""
      }
    }
    END {
      if (in_meta == 1 && drop_block == 0) {
        printf "%s", block
      }
    }
  ' "$INDEX_HTML_PATH" > "$INDEX_HTML_PATH.tmp"
  mv "$INDEX_HTML_PATH.tmp" "$INDEX_HTML_PATH"
fi

echo "[entrypoint] Generating nginx.conf..."
envsubst '${CSP_CONNECT_ORIGIN} ${CSP_STYLE_NONCE}' \
  < /etc/nginx/conf.d/default.conf \
  > /etc/nginx/conf.d/default.conf.tmp
mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf

# Execute the primary container command (passed from CMD in Dockerfile).
exec "$@"