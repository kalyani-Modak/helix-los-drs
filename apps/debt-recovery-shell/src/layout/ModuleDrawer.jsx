import React, { useMemo, useState, useEffect } from "react";

import {
    IconButton,
    InputBase,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
} from "@mui/material";
import { HBox, HLabel, useDrsTheme, HDrawer } from "@helix/component-library";

import {
    CloseOutlined,
    SearchOutlined,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    Clear as ClearIcon,
} from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom";
import { useIntl } from "react-intl";


const MODULE_GROUP_SESSION_KEY = "SEC_MODULE_GROUP";
const ACTIVE_MENU_ID_SESSION_KEY = "SEC_ACTIVE_MENU_ID";

/* ---------------- SAFE FIND ---------------- */
const findMenuById = (menus, id) => {
    for (const menu of menus) {
        if (menu.menuId === id) return menu;

        if (menu.children?.length) {
            const found = findMenuById(menu.children, id);
            if (found) return found;
        }
    }
    return null;
};

const resolveModuleGroup = (menu, menus) => {
    if (menu?.group) return menu.group;
    const firstParentId = Array.isArray(menu?.parentIds) ? menu.parentIds[0] : null;
    if (firstParentId) {
        const rootParent = findMenuById(menus, firstParentId);
        if (rootParent?.group) return rootParent.group;
    }
    return "";
};

/* ---------------- SAFE DISPLAY NAME ---------------- */
const getDisplayName = (intl, item) =>
    intl.formatMessage({
        id: `label.menu.${item.menuId}`,
        defaultMessage: item.label || item.name || item.id,
    });

const isPathInMenu = (menu, pathname) => {
    if (!menu) return false;
    if (menu?.path && pathname === menu.path) return true;

    if (menu.children?.length) {
        return menu.children.some((child) => isPathInMenu(child, pathname));
    }

    return false;
};

const flattenLeafMenuItems = (nodes = [], topParent = null) =>
    nodes.flatMap((node) => {
        const children = Array.isArray(node.children) ? node.children : [];
        const currentTopParent = topParent || node;

        if (children.length === 0) {
            return [{ ...node, parentId: topParent?.menuId }];
        }

        return flattenLeafMenuItems(children, currentTopParent);
    });

const ModuleDrawer = ({
    open,
    onClose,
    activeModule,
    menuJson,
    iconMap,
    icons,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const intl = useIntl();
    const drsTheme = useDrsTheme();
    const [search, setSearch] = useState("");
    const [favorites, setFavorites] = useState(() => {
        const stored = localStorage.getItem("module_favorites");
        return stored ? new Set(JSON.parse(stored)) : new Set();
    });
    const [hoveredItem, setHoveredItem] = useState(null);

    useEffect(() => {
        setSearch("");
    }, [activeModule]);

    useEffect(() => {
        localStorage.setItem("module_favorites", JSON.stringify(Array.from(favorites)));
    }, [favorites]);

    const toggleFavorite = (e, itemId) => {
        e.stopPropagation();
        const newFavorites = new Set(favorites);
        if (newFavorites.has(itemId)) {
            newFavorites.delete(itemId);
        } else {
            newFavorites.add(itemId);
        }
        setFavorites(newFavorites);
    };

    /* ---------------- FILTER ---------------- */
    const filteredGroups = useMemo(() => {
        if (!activeModule?.children) return [];

        const children = Array.isArray(activeModule.children)
            ? activeModule.children
            : [];

        const allLeafItems = flattenLeafMenuItems(menuJson);
        const filteredFavoriteItems = allLeafItems.filter((item) =>
            favorites.has(item.menuId) &&
            getDisplayName(intl, item)
                .toLowerCase()
                .includes(search.toLowerCase())
        );

        const favoriteGroup = filteredFavoriteItems.length
            ? [{
                    menuId: "__favorites__",
                    label: "Favorites",
                    children: filteredFavoriteItems,
              }]
            : [];

        /* ================= GLOBAL SEARCH ================= */
        if (activeModule.menuId === "__global_search__") {
            const allItems = children.flatMap((g) => g.children || []);

            const filteredItems = allItems.filter((item) =>
                getDisplayName(intl, item)
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );

            const grouped = filteredItems.reduce((acc, item) => {
                const groupName = item.description || "MENU";

                if (!acc[groupName]) acc[groupName] = [];
                acc[groupName].push(item);

                return acc;
            }, {});

            const result = Object.entries(grouped).map(([label, children]) => ({
                menuId: label,
                label,
                children,
            }));

            return [...favoriteGroup, ...result];
        }

        /* ================= NORMAL MODULES ================= */

        const hasDirectMenus = children.every(
            (item) => !item.children || item.children.length === 0
        );

        let result = [];

        if (hasDirectMenus) {
            const filteredMenus = children.filter((item) =>
                getDisplayName(intl, item)
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );

            result = filteredMenus.length
                ? [
                      {
                          menuId: "menu-group",
                          label: "MENU",
                          children: filteredMenus,
                      },
                  ]
                : [];
        } else {
            result = children
                .map((group) => {
                    const groupChildren = Array.isArray(group.children)
                        ? group.children
                        : [];

                    const filteredChildren = groupChildren.filter((item) =>
                        getDisplayName(intl, item)
                            .toLowerCase()
                            .includes(search.toLowerCase())
                    );

                    if (!filteredChildren.length) return null;

                    return {
                        menuId: group.menuId,

                        // ✅ FIX: NO RAW ID SHOWN
                        label: getDisplayName(intl, group),

                        children: filteredChildren,
                    };
                })
                .filter(Boolean);
        }

        return [...favoriteGroup, ...result];
    }, [activeModule, search, intl, favorites, menuJson]);

    if (!activeModule) return null;

    /* ---------------- NAVIGATION ---------------- */
    const isMenuActive = (item) => {
        const menu = findMenuById(menuJson, item.menuId);
        return isPathInMenu(menu, location.pathname);
    };

    const handleNavigate = (item) => {
        if (item?.children?.length) return;

        const menu = findMenuById(menuJson, item.menuId);

        if (menu?.path) {
            sessionStorage.setItem(
                MODULE_GROUP_SESSION_KEY,
                resolveModuleGroup(menu, menuJson)
            );
            sessionStorage.setItem(
                ACTIVE_MENU_ID_SESSION_KEY,
                menu.menuId || item.menuId || ""
            );
            navigate(menu.path, {
                state: {
                    menuId: menu.menuId,
                    parentIds: Array.isArray(menu.parentIds) ? menu.parentIds : [],
                },
            });
            onClose?.();
        }
    };

    return (
        <>
            {/* OVERLAY */}
            {open && (
                <HBox
                    onClick={onClose}
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        zIndex: 2100,
                        backgroundColor: "rgba(0,0,0,0.25)",
                    }}
                />
            )}

            {/* DRAWER */}
            <HDrawer variant="persistent" anchor="left" open={open} hideBackdrop slotProps={{ paper: {
                    sx: {
                        width: 280,
                        left: 56,
                        height: "100vh",
                        bgcolor: drsTheme.surfaces.panel,
                        color: drsTheme.text.secondary,
                        borderRight: `1px solid ${drsTheme.border.divider}`,
                        overflow: "hidden",
                        boxShadow: "0 0 14px rgba(0,0,0,0.35)",
                        zIndex: 2200,
                    },
                } }}>
                {/* HEADER */}
                <HBox
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 1.5,
                        py: 1.2,
                        borderBottom: `1px solid ${drsTheme.border.divider}`,
                    }}
                >
                    <HBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {activeModule.icon && (
                            <>
                                {(() => {
                                    const IconComponent = icons[activeModule.icon];
                                    return IconComponent ? (
                                        <IconComponent sx={{ fontSize: 18, color: drsTheme.text.primary }} />
                                    ) : null;
                                })()}
                            </>
                        )}
                        <HLabel
                            sx={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: drsTheme.text.primary,
                            }}
                            value= {getDisplayName(intl, activeModule)}
                            colon={false}
                        >       
                        </HLabel>
                    </HBox>

                    <IconButton
                        onClick={onClose}
                        size="small"
                        sx={{
                            color: drsTheme.text.secondary,
                            "&:hover": {
                                bgcolor: drsTheme.action.hover,
                                color: drsTheme.text.primary,
                            },
                        }}
                    >
                        <CloseOutlined sx={{ fontSize: 16 }} />
                    </IconButton>
                </HBox>

                {/* SEARCH */}
                <HBox sx={{ p: 1.2 }}>
                    <HBox
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            px: 1,
                            borderRadius: 1.5,
                            border: `1px solid ${drsTheme.border.divider}`,
                            bgcolor: drsTheme.surfaces.input,
                        }}
                    >
                        <SearchOutlined sx={{ fontSize: 14, mr: 1, color: drsTheme.text.secondary }} />

                        <InputBase
                            autoFocus
                            fullWidth
                            placeholder="Search modules..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{ color: drsTheme.text.primary }}
                        />
                    </HBox>
                </HBox>

                {/* LIST */}
                <HBox sx={{ flex: 1, overflowY: "auto", px: 1 }}>
                    {filteredGroups.length === 0 && (
                        <HLabel
                            sx={{
                                p: 1,
                                fontSize: 12,
                                color: drsTheme.text.secondary,
                            }}
                            value="No modules found"
                            colon={false}
                            align={"center"}
                        >
                        </HLabel>
                    )}

                    {filteredGroups.map((group) => (
                        <HBox key={group.menuId} sx={{ mb: 1 }}>
                            {/* GROUP TITLE */}
                            <HLabel
                                sx={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: drsTheme.text.secondary,
                                    px: 1,
                                    mb: 0.5,
                                    textTransform: "uppercase",
                                }}
                                value= {group.label}
                                colon={false}
                                align={"left"}
                            >
                            </HLabel>

                            <List sx={{ p: 0 }}>
                                {group.children.map((item) => {
                                    const hasChildren =
                                        item.children?.length > 0;

                                    /* LEAF */
                                    if (!hasChildren) {
                                        const Icon =
                                            icons[item.icon] ||
                                            SearchOutlined;
                                        const isFavorite = favorites.has(item.menuId);

                                        return (
                                            <ListItemButton
                                                key={item.menuId}
                                                selected={isMenuActive(item)}
                                                onClick={() =>
                                                    handleNavigate(item)
                                                }
                                                onMouseEnter={() => setHoveredItem(item.menuId)}
                                                onMouseLeave={() => setHoveredItem(null)}
                                                sx={{
                                                    borderRadius: 1.5,
                                                    mb: 0.3,
                                                    px: 1,
                                                    color: isMenuActive(item)
                                                        ? drsTheme.text.primary
                                                        : drsTheme.text.secondary,
                                                    bgcolor: isMenuActive(item)
                                                        ? drsTheme.action.selected
                                                        : "transparent",
                                                    "&:hover": {
                                                        bgcolor: drsTheme.action.hover,
                                                        color: drsTheme.text.primary,
                                                    },
                                                }}
                                            >
                                                <ListItemIcon
                                                    sx={{ minWidth: 28 }}
                                                >
                                                    <Icon
                                                        sx={{
                                                            fontSize: 15,
                                                            color: drsTheme.text.secondary,
                                                        }}
                                                    />
                                                </ListItemIcon>

                                                <ListItemText
                                                    primary={getDisplayName(intl, item)}
                                                    secondary={
                                                        group.menuId === "__favorites__" && item.parentId
                                                            ? getDisplayName(intl, { menuId: item.parentId })
                                                            : undefined
                                                    }
                                                    primaryTypographyProps={{
                                                        fontSize: 13,
                                                        color: drsTheme.text.primary,
                                                    }}
                                                    secondaryTypographyProps={{
                                                        fontSize: 11,
                                                        color: drsTheme.text.secondary,
                                                    }}
                                                />

                                                {(isFavorite || hoveredItem === item.menuId) && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => toggleFavorite(e, item.menuId)}
                                                        sx={{
                                                            ml: 1,
                                                            color: isFavorite ? drsTheme.colors.accent : drsTheme.text.secondary,
                                                            "&:hover": {
                                                                color: drsTheme.colors.accent,
                                                            },
                                                        }}
                                                    >
                                                        {isFavorite ? (
                                                            <StarIcon sx={{ fontSize: 16 }} />
                                                        ) : (
                                                            <HBox sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 16, height: 16 }}>
                                                                <StarBorderIcon sx={{ fontSize: 16, position: "absolute" }} />
                                                                <ClearIcon sx={{ fontSize: 12, position: "absolute" }} />
                                                            </HBox>
                                                        )}
                                                    </IconButton>
                                                )}
                                            </ListItemButton>
                                        );
                                    }

                                    /* LEVEL 3 */
                                    return item.children.map((subItem) => {
                                        const Icon =
                                            iconMap[subItem.menuId] ||
                                            SearchOutlined;
                                        const isFavorite = favorites.has(subItem.menuId);

                                        return (
                                            <ListItemButton
                                                key={subItem.menuId}
                                                selected={isMenuActive(subItem)}
                                                onClick={() =>
                                                    handleNavigate(subItem)
                                                }
                                                onMouseEnter={() => setHoveredItem(subItem.menuId)}
                                                onMouseLeave={() => setHoveredItem(null)}
                                                sx={{
                                                    borderRadius: 1.5,
                                                    mb: 0.3,
                                                    px: 1,
                                                    color: isMenuActive(subItem)
                                                        ? drsTheme.text.primary
                                                        : drsTheme.text.secondary,
                                                    bgcolor: isMenuActive(subItem)
                                                        ? drsTheme.action.selected
                                                        : "transparent",
                                                    "&:hover": {
                                                        bgcolor: drsTheme.action.hover,
                                                        color: drsTheme.text.primary,
                                                    },
                                                }}
                                            >
                                                <ListItemIcon
                                                    sx={{ minWidth: 28 }}
                                                >
                                                    <Icon
                                                        sx={{
                                                            fontSize: 15,
                                                            color: drsTheme.text.secondary,
                                                        }}
                                                    />
                                                </ListItemIcon>

                                                <ListItemText
                                                    primary={getDisplayName(intl, subItem)}
                                                    secondary={getDisplayName(intl, item)}
                                                    primaryTypographyProps={{
                                                        fontSize: 13,
                                                        color: drsTheme.text.primary,
                                                    }}
                                                />

                                                {(isFavorite || hoveredItem === subItem.menuId) && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => toggleFavorite(e, subItem.menuId)}
                                                        sx={{
                                                            ml: 1,
                                                            color: isFavorite ? drsTheme.colors.accent : drsTheme.text.secondary,
                                                            "&:hover": {
                                                                color: drsTheme.colors.accent,
                                                            },
                                                        }}
                                                    >
                                                        {isFavorite ? (
                                                            <StarIcon sx={{ fontSize: 16 }} />
                                                        ) : (
                                                            <HBox sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 16, height: 16 }}>
                                                                <StarBorderIcon sx={{ fontSize: 16, position: "absolute" }} />
                                                                <ClearIcon sx={{ fontSize: 12, position: "absolute" }} />
                                                            </HBox>
                                                        )}
                                                    </IconButton>
                                                )}
                                            </ListItemButton>
                                        );
                                    });
                                })}
                            </List>
                        </HBox>
                    ))}
                </HBox>

                {/* FOOTER */}
                <Divider sx={{ borderColor: drsTheme.border.divider }} />

                <HBox
                    sx={{
                        p: 1,
                        fontSize: 10,
                        color: drsTheme.text.secondary,
                    }}
                >
                    Type to search across all modules • ⭐ to pin favorites
                </HBox>
            </HDrawer>
        </>
    );
};

export default ModuleDrawer;