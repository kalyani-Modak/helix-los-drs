/**
 * @typedef {{ parentMenu: string, menuId: string, name: string, uris: string[], path: string }} HangingMenuItem
 * @typedef {{ parentMenu: string, items: HangingMenuItem[] }} MenuGroupModel
 */

/**
 * @param {HangingMenuItem[]} items
 * @returns {MenuGroupModel[]}
 */
export function groupByParentMenu(items) {
  if (!items?.length) return [];
  const map = new Map();
  for (const item of items) {
    const key = item.parentMenu || "Other";
    const list = map.get(key);
    if (list) list.push(item);
    else map.set(key, [item]);
  }
  return [...map.entries()]
    .map(([parentMenu, groupItems]) => ({ parentMenu, items: groupItems }))
    .sort((a, b) => a.parentMenu.localeCompare(b.parentMenu));
}

/**
 * @param {MenuGroupModel[]} groups
 * @param {string} query
 * @returns {MenuGroupModel[]}
 */
export function filterGroupsByName(groups, query) {
  const q = query.trim().toLowerCase();
  if (!q) return groups;
  return groups
    .map((g) => ({
      ...g,
      items: g.items.filter((i) => i.name.toLowerCase().includes(q)),
    }))
    .filter((g) => g.items.length > 0);
}
