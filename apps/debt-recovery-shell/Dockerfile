FROM nginx:1.27-alpine

RUN apk add --no-cache gettext \
  && mkdir -p /etc/drs/env

# Pre-built portal (must exist before docker build)
COPY drs-build/drs /usr/share/nginx/html/drs
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/config.json.template /etc/drs/config.json.template
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

# Runtime config targets
ENV CONFIG_PATH=/usr/share/nginx/html/drs/config.json \
  CONFIG_TEMPLATE_PATH=/etc/drs/config.json.template

# Runtime API URLs (empty defaults)
ENV BASE_API_PATH="" \
  BASE_FOLLOWUP_API_PATH="" \
  BASE_RULEENINGE_API_PATH="" \
    BASE_KEYCLOAK_API_PATH="" \
    BASE_HELIX_EARLY_COLLECTIONS_API_PATH="" \
    BASE_AI_PREDICT_API_PATH="" \
    BASE_HELIX_COL_LISTING_API_PATH="" \
    BASE_INTEGRATION_FRAMEWORK_API_PATH="" \
    BASE_ALLOCATION_API_PATH="" \
    BASE_COMMON_MASTER_API_PATH="" \
    BASE_HELIX_BATCH_MASTERS_API_PATH="" \
    BASE_HELIX_BATCH_EXECUTION_API_PATH="" \
    BASE_UTILITY_API_PATH="" \
    BASE_DMS_API_PATH="" \
    LOG_LEVEL="debug" \
    ASSISTED_CALLING_BASE_URL="" \
    ASSISTED_CALLING_API_KEY="" \
    NGINX_CSP_TAKES_PRECEDENCE="true" \
    STRICT_ENV_VALIDATION="false" \
    CSP_CONNECT_ORIGIN="" \
    ENV=""

EXPOSE 80
ENTRYPOINT ["/bin/sh", "/usr/local/bin/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
