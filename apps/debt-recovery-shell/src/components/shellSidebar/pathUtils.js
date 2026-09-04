/**
 * @param {string} pathname
 * @param {string} itemPath
 * @returns {boolean}
 */
export function isPathActive(pathname, itemPath) {
  if (!itemPath) return false;
  if (pathname === itemPath) return true;
  const base = itemPath.replace(/\/$/, "");
  if (!base || base === "/") return pathname === "/";
  return pathname.startsWith(`${base}/`);
}
