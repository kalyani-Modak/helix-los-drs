#!/usr/bin/env node
/**
 * Release helper for debt-recovery-shell
 *
 * What it does:
 *  - Ensures we're on 'main' and the tree is clean
 *  - Tags repo with app version (drs-vX.Y.Z) and pushes the tag
 *  - Archives apps/<APP-SUBDIR>/drs-build/drs -> <APP>-<version>.tgz (or .zip on Windows if tar missing)
 *  - Generates manifest.json (size, sha256, git tag/commit, build number, timestamp)
 *  - Uploads BOTH artifact and manifest.json to Nexus RAW:
 *      - helix-web-releases for releases
 *      - helix-web-snapshots when PUBLISH_AS_SNAPSHOT=1
 *
 * Required env:
 *   NEXUS_BASE_URL               e.g. http://inpl-pun-nexus.indussoft.com:8081
 *   NEXUS_USER / NEXUS_PASS  (or) NEXUS_TOKEN
 *
 * Optional env (with defaults):
 *   NEXUS_RAW_RELEASE_REPO=helix-web-releases
 *   NEXUS_RAW_SNAPSHOT_REPO=helix-web-snapshots
 *   APP=drs
 *   APP_SUBDIR=debt-recovery-shell   (folder under apps/)
 *   CLASSIFIER=web                   (only used in manifest notes)
 *   GROUP_ID=com.ebixcash.drs        (only used in manifest notes)
 *   PUBLISH_AS_SNAPSHOT=0|1
 */

const { execSync, execFileSync, spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// ---------- Config (env with sensible defaults) ----------
const env = process.env;

const APP                = env.APP || "drs";
const APP_SUBDIR         = env.APP_SUBDIR || "debt-recovery-shell";
const CLASSIFIER         = env.CLASSIFIER || "web";
const GROUP_ID           = env.GROUP_ID || "com.ebixcash.drs";

const NEXUS_BASE_URL     = (env.NEXUS_BASE_URL || "").replace(/\/+$/, "");
const RAW_RELEASE_REPO   = env.NEXUS_RAW_RELEASE_REPO || "helix-web-releases";
const RAW_SNAPSHOT_REPO  = env.NEXUS_RAW_SNAPSHOT_REPO || "helix-web-snapshots";
const NEXUS_USER         = env.NEXUS_USER;
const NEXUS_PASS         = env.NEXUS_PASS;
const NEXUS_TOKEN        = env.NEXUS_TOKEN;

const FORCE_SNAPSHOT     = env.PUBLISH_AS_SNAPSHOT === "1";

// Derived paths
const APP_DIR   = path.join(__dirname, "..", "apps", APP_SUBDIR);
const PKG_PATH  = path.join(APP_DIR, "package.json");
const BUILD_DIR = path.join(APP_DIR, "drs-build", "drs");

// ---------- helpers ----------
// run: accepts either (string) or (command, args[]) signature.
function run(cmd, args = [], opts = {}) {
  // Support legacy single-string commands for simple use cases
  if (typeof cmd === "string" && Array.isArray(args) && args.length === 0) {
    const final = { stdio: "pipe", encoding: "utf8", ...opts };
    const out = execSync(cmd, final);
    return (out || "").toString().trim();
  }
  // Use execFileSync for safer execution of commands with arguments
  const final = { stdio: "pipe", encoding: "utf8", ...opts };
  const out = execFileSync(cmd, args, final);
  return (out || "").toString().trim();
}
function which(bin) {
  const r = spawnSync(process.platform === "win32" ? "where" : "which", [bin]);
  return r.status === 0;
}
function fail(msg) {
  console.error(`❌ ${msg}`);
  process.exit(1);
}
function log(msg) {
  console.log(`➡️  ${msg}`);
}
function sha256File(fp) {
  const hash = crypto.createHash("sha256");
  const buf = fs.readFileSync(fp);
  hash.update(buf);
  return hash.digest("hex");
}

// ---------- sanity checks ----------
if (!fs.existsSync(PKG_PATH)) fail(`package.json not found: ${PKG_PATH}`);
const appPkg = JSON.parse(fs.readFileSync(PKG_PATH, "utf8"));
if (!appPkg.version) fail(`No version in ${PKG_PATH}`);

try { run("git rev-parse --is-inside-work-tree"); } catch { fail("Not a git repo"); }
const branch = run("git rev-parse --abbrev-ref HEAD");
if (branch !== "main") fail(`Current branch is '${branch}', expected 'main'`);
const dirty = run("git status --porcelain");
if (dirty) fail("Working tree not clean. Commit/stash changes before tagging.");
try { run("git remote -v"); } catch { fail("No git remotes configured (origin missing?)"); }

// ---------- tag repo ----------
const version = appPkg.version;
const repoTag = `${APP}-v${version}`;
log(`Creating repo tag: ${repoTag}`);
try { run(`git tag -f ${repoTag}`, { stdio: "inherit" }); }
catch (e) { fail(`Failed to create tag ${repoTag}: ${e.message}`); }

log(`Pushing tag: ${repoTag}`);
try { run(`git push origin ${repoTag} --force`, { stdio: "inherit" }); }
catch (e) { fail(`Failed to push tag ${repoTag}: ${e.message}`); }

console.log(`✅ Repo tagged & pushed: ${repoTag}`);

// ---------- verify build output ----------
if (!fs.existsSync(BUILD_DIR)) {
  fail(`Build folder not found: ${BUILD_DIR}\nRun: pnpm --filter ${APP_SUBDIR} build`);
}

// ---------- create archive (tgz preferred; zip fallback on Windows) ----------
let ext = "tgz";
let outName = `${APP}-${version}.${ext}`;
let outPath = path.join(process.cwd(), outName);

log(`Creating artifact: ${outName}`);
try {
  if (which("tar")) {
    // Use execFileSync with arguments instead of string interpolation
    // Use "-C", output dir, "-czf", output tgz, inputdir
    run(
      "tar", 
      [
        "-C",
        path.dirname(BUILD_DIR),
        "-czf",
        outPath,
        path.basename(BUILD_DIR)
      ],
      { stdio: "inherit" }
    );
  } else {
    if (process.platform !== "win32") {
      fail("tar not found and zip fallback only implemented for Windows agents.");
    }
    // Windows fallback to zip
    ext = "zip";
    outName = `${APP}-${version}.${ext}`;
    outPath = path.join(process.cwd(), outName);
    log("tar not found; falling back to zip");
    // Use execFileSync for PowerShell zip command with arguments instead of string interpolation
    run(
      "powershell",
      [
        "-NoLogo",
        "-NoProfile",
        "-Command",
        `Compress-Archive -Path '${BUILD_DIR}\\*' -DestinationPath '${outPath}' -Force`
      ],
      { stdio: "inherit" }
    );
  }
} catch (e) {
  fail(`Failed to create archive: ${e.message}`);
}
if (!fs.existsSync(outPath)) fail("Archive not created");

// ---------- generate manifest.json ----------
const sizeBytes = fs.statSync(outPath).size;
const sha256 = sha256File(outPath);
const commit = run("git rev-parse --short HEAD");
const createdAt = new Date().toISOString();
const buildNumber = env.BUILD_NUMBER || "local";
const manifest = {
  app: APP,
  version,
  artifact: {
    filename: outName,
    sizeBytes,
    sha256
  },
  git: {
    tag: repoTag,
    commit
  },
  classifier: CLASSIFIER,
  groupId: GROUP_ID,
  buildNumber,
  createdAt
};
const manifestPath = path.join(process.cwd(), "manifest.json");
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
console.log(`✅ Generated manifest.json`);

// ---------- upload to Nexus RAW ----------
if (!NEXUS_BASE_URL) {
  console.warn("⚠️  NEXUS_BASE_URL not set; skipping Nexus upload.");
  process.exit(0);
}

const isSnapshot = FORCE_SNAPSHOT;
const remoteVersion = isSnapshot ? `${version}-SNAPSHOT` : version;
const repoName = isSnapshot ? RAW_SNAPSHOT_REPO : RAW_RELEASE_REPO;

const baseUrl = `${NEXUS_BASE_URL}/repository/${repoName}/${APP}/${remoteVersion}`;
const artifactUrl = `${baseUrl}/${outName}`;
const manifestUrl = `${baseUrl}/manifest.json`;

log(`Uploading artifact to RAW: ${artifactUrl}`);
const authArgs = NEXUS_TOKEN
  ? `-H "Authorization: Bearer ${NEXUS_TOKEN}"`
  : (NEXUS_USER && NEXUS_PASS) ? `-u "${NEXUS_USER}:${NEXUS_PASS}"` : "";

if (!which("curl")) fail("curl not found on agent. Install curl.");

try {
  run(`curl --fail --show-error --location ${authArgs} --upload-file "${outPath}" "${artifactUrl}"`, { stdio: "inherit", shell: true });
  console.log("✅ Artifact uploaded");
  run(`curl --fail --show-error --location ${authArgs} -H "Content-Type: application/json" --upload-file "${manifestPath}" "${manifestUrl}"`, { stdio: "inherit", shell: true });
  console.log("✅ Manifest uploaded");
  console.log(`📦 ${artifactUrl}`);
  console.log(`🧾 ${manifestUrl}`);
} catch (e) {
  fail(`Upload failed: ${e.message}`);
}
