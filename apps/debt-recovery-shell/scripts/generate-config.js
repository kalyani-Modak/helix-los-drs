import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const shellRoot = path.resolve(__dirname, "..");

/** Keys that must never be taken from process.env as config values. */
const ENV_BLOCKLIST = new Set([
  "PATH",
  "HOME",
  "USER",
  "SHELL",
  "PWD",
  "HOSTNAME",
  "NODE_VERSION",
  "NODE_PATH",
  "TERM",
  "SHLVL",
  "MODE",
  "DRS_PROFILE",
  "CONFIG_PATH",
  "ENV_DIR",
  "GENERATE_CONFIG_SCRIPT",
  "NGINX_VERSION",
  "NJS_VERSION",
  "NJS_RELEASE",
  "PKG_RELEASE",
  "DYNPKG_RELEASE",
]);

function isSet(value) {
  return value != null && String(value).trim() !== "";
}

function trimValue(value) {
  return typeof value === "string" ? value.trim() : value;
}

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const env = {};
  const text = fs.readFileSync(filePath, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function loadEnvFiles(mode, envDir) {
  const files = [
    ".env",
    ".env.local",
    `.env.${mode}`,
    `.env.${mode}.local`,
  ];
  const merged = {};
  for (const name of files) {
    Object.assign(merged, parseEnvFile(path.join(envDir, name)));
  }
  return merged;
}

function looksLikeConfigKey(key) {
  if (!key || ENV_BLOCKLIST.has(key)) return false;
  if (key.startsWith("VITE_")) return false;
  return (
    key.startsWith("BASE_") ||
    key.startsWith("ASSISTED_") ||
    key.startsWith("CSP_") ||
    key === "LOG_LEVEL" ||
    key === "ENV"
  );
}

function readExistingConfig(outPath) {
  try {
    if (!fs.existsSync(outPath)) return {};
    const parsed = JSON.parse(fs.readFileSync(outPath, "utf8"));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

/**
 * Build config map:
 * 1) existing config.json at output path (keeps key set / defaults)
 * 2) .env.[mode] VITE_* values
 * 3) process.env VITE_* and matching config keys (Dockerfile ENV / -e) — highest priority
 */
export function resolveConfig(mode = "production", envDir = shellRoot, outPath) {
  const config = { ...readExistingConfig(outPath) };
  const sources = {};
  for (const key of Object.keys(config)) {
    sources[key] = "existing";
  }

  const fileEnv = loadEnvFiles(mode, envDir);
  for (const [key, value] of Object.entries(fileEnv)) {
    if (!key.startsWith("VITE_") || !isSet(value)) continue;
    const configKey = key.slice("VITE_".length);
    config[configKey] = trimValue(value);
    sources[configKey] = "file";
  }

  for (const [key, value] of Object.entries(process.env)) {
    if (!isSet(value)) continue;

    if (key.startsWith("VITE_")) {
      const configKey = key.slice("VITE_".length);
      config[configKey] = trimValue(value);
      sources[configKey] = "process.env";
      continue;
    }

    if (looksLikeConfigKey(key)) {
      config[key] = trimValue(value);
      sources[key] = "process.env";
    }
  }

  return { config, sources };
}

function resolveOutPaths(explicitOut) {
  if (isSet(explicitOut)) return [path.resolve(explicitOut)];
  if (isSet(process.env.CONFIG_PATH)) {
    return [path.resolve(process.env.CONFIG_PATH)];
  }

  return [
    path.resolve(shellRoot, "public/config.json"),
    path.resolve(shellRoot, "drs-build/drs/config.json"),
  ];
}

function resolveEnvDir() {
  if (isSet(process.env.ENV_DIR)) return path.resolve(process.env.ENV_DIR);
  return shellRoot;
}

/**
 * Write config.json from Dockerfile/process ENV (preferred), then .env.[mode], then existing file.
 *
 * @param {string} [mode]
 * @param {{ outPath?: string, envDir?: string }} [options]
 */
export function generateRuntimeConfig(mode = "production", options = {}) {
  const envDir = options.envDir || resolveEnvDir();
  const outPaths = resolveOutPaths(options.outPath);
  let lastConfig = {};

  for (const outPath of outPaths) {
    const { config, sources } = resolveConfig(mode, envDir, outPath);
    const fromProcess = Object.values(sources).filter((s) => s === "process.env").length;
    const fromFile = Object.values(sources).filter((s) => s === "file").length;

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, `${JSON.stringify(config, null, 2)}\n`);
    console.log(
      `[generate-config] Wrote ${outPath} (${Object.keys(config).length} keys) mode="${mode}"` +
        ` — process.env: ${fromProcess}, .env files: ${fromFile} (envDir=${envDir})`
    );
    lastConfig = config;
  }

  return lastConfig;
}

/** @deprecated use resolveConfig — kept for vite.config.js import compatibility */
export function resolveViteEnv(mode = "production", envDir = shellRoot) {
  const { config, sources } = resolveConfig(mode, envDir);
  const merged = {};
  const viteSources = {};
  for (const [key, value] of Object.entries(config)) {
    merged[`VITE_${key}`] = value;
    viteSources[`VITE_${key}`] = sources[key] === "process.env" ? "process.env" : "file";
  }
  return { merged, sources: viteSources };
}

function parseCliArgs(argv) {
  const args = { mode: null, outPath: null };
  const rest = [];
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--out" || a === "-o") {
      args.outPath = argv[i + 1];
      i += 1;
    } else if (a.startsWith("--out=")) {
      args.outPath = a.slice("--out=".length);
    } else {
      rest.push(a);
    }
  }
  args.mode =
    rest[0] || process.env.MODE || process.env.DRS_PROFILE || "production";
  return args;
}

const isCli =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCli) {
  const { mode, outPath } = parseCliArgs(process.argv.slice(2));
  generateRuntimeConfig(mode, { outPath });
}