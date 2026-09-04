import React, { useEffect, useState, useRef, useMemo } from "react";
import { useIntl } from "react-intl";
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Chip, Tooltip,
    useMediaQuery, useTheme, CircularProgress,
} from "@mui/material";
import { AdminPanelSettings, Search } from "@mui/icons-material";
import { UserManagementAPI, ClientDetailsAPI } from "./apiEndpoints";
import { HAxiosService, ALIGNMENT, HBox, HLabel, HPaper, HCheckBox, HTextField, HButton, HBreadCrumb, TitleBar, HDropdown, useDrsTheme, useToast } from "@helix/component-library";

// ==================== Color Palette ====================
const colors = {
    primary: "#0378A6",
    secondary: "#2FBF71",
    primaryLight: "#79cff1",
    primaryDark: "#025a8c",
    secondaryLight: "#43da87",
    text: { primary: "#1a2b3c", secondary: "#5f6c7b" },
};

// ==================== Reusable Styles ====================
const selectSx = {
    borderRadius: "8px",
    backgroundColor: "rgba(255,255,255,0.8)",
    fontSize: "12px",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.primaryLight },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.primary },
};

const paperSx = {
    borderRadius: { xs: "10px", sm: "14px" },
    boxShadow: "0 4px 24px rgba(3,120,166,0.10)",
    backgroundColor: "rgba(255,255,255,0.98)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
};

const tableHeaderSx = {
    backgroundColor: "var(--drs-grid-header-bg, hsla(215, 20%, 95%, 0.92))",
    position: "sticky",
    top: 0,
    fontWeight: 700,
    color: theme => theme.palette.text.primary,
    fontFamily: "'Inter', sans-serif",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.7px",
    borderBottom: `2px solid ${colors.primary}30`,
    "&&": {
       zIndex: 2,
        backgroundColor: "var(--drs-grid-header-bg, hsla(215, 20%, 95%, 0.92))",
    }
};

// ==================== Helper Functions ====================
const METHOD_URI_KEYS = {
    read: "get-uris",
    create: "post-uris",
    update: "put-uris",
    delete: "delete-uris",
};
const PERMISSION_METHODS = ["read", "create", "update", "delete"];

function buildInitialPermissions() {
    return {
        read: false,
        create: false,
        update: false,
        delete: false,
        full: false,
        readIndeterminate: false,
        createIndeterminate: false,
        updateIndeterminate: false,
        deleteIndeterminate: false,
    };
}

function hasNonEmptyUriList(menu, uriKey) {
    const list = menu?.[uriKey];
    return Array.isArray(list) && list.length > 0;
}

/** Methods enabled for a menu leaf, or union of descendants for a parent. */
function availableMethods(menu) {
    const empty = { read: false, create: false, update: false, delete: false };
    if (!menu) return empty;

    if (Array.isArray(menu.children) && menu.children.length > 0) {
        const agg = { ...empty };
        const walk = (node) => {
            if (!node) return;
            if (Array.isArray(node.children) && node.children.length > 0) {
                node.children.forEach(walk);
                return;
            }
            PERMISSION_METHODS.forEach((method) => {
                if (hasNonEmptyUriList(node, METHOD_URI_KEYS[method])) {
                    agg[method] = true;
                }
            });
        };
        walk(menu);
        return agg;
    }

    return {
        read: hasNonEmptyUriList(menu, METHOD_URI_KEYS.read),
        create: hasNonEmptyUriList(menu, METHOD_URI_KEYS.create),
        update: hasNonEmptyUriList(menu, METHOD_URI_KEYS.update),
        delete: hasNonEmptyUriList(menu, METHOD_URI_KEYS.delete),
    };
}

function menuHasAnyMethodUris(menu) {
    const avail = availableMethods(menu);
    return PERMISSION_METHODS.some((method) => avail[method]);
}

function computeFullFlag(permissions, avail) {
    const enabled = PERMISSION_METHODS.filter((method) => avail?.[method]);
    if (enabled.length === 0) return false;
    return enabled.every((method) => permissions[method]);
}

/**
 * Roll up child checkbox states onto a parent folder.
 * Eligible children = those that expose the method via URI tags (or descendant URIs).
 * - all eligible checked → parent checked
 * - some eligible checked → parent indeterminate
 * - none checked → unchecked
 */
function aggregateParentPermissions(menu, getChildPermissions) {
    const avail = availableMethods(menu);
    const result = buildInitialPermissions();

    PERMISSION_METHODS.forEach((method) => {
        if (!avail[method] || !menu?.children?.length) {
            result[method] = false;
            result[`${method}Indeterminate`] = false;
            return;
        }

        const relevant = [];
        menu.children.forEach((child) => {
            const childAvail = availableMethods(child);
            if (!childAvail[method]) return;
            const childPerms = getChildPermissions(child) || buildInitialPermissions();
            // Treat child indeterminate as "partially on" for parent roll-up
            if (childPerms[`${method}Indeterminate`]) {
                relevant.push("partial");
            } else {
                relevant.push(childPerms[method] ? "on" : "off");
            }
        });

        if (relevant.length === 0) {
            result[method] = false;
            result[`${method}Indeterminate`] = false;
            return;
        }

        const allOn = relevant.every((v) => v === "on");
        const allOff = relevant.every((v) => v === "off");
        result[method] = allOn;
        result[`${method}Indeterminate`] = !allOn && !allOff;
    });

    result.full = computeFullFlag(result, avail);
    return result;
}

/** Bottom-up: write aggregated parent states for an entire section tree. */
function recalculateParentPermissionsInTree(menu, selectedGroup, sectionName, state) {
    if (!menu?.children?.length) return;

    menu.children.forEach((child) => {
        recalculateParentPermissionsInTree(child, selectedGroup, sectionName, state);
    });

    const parentKey = getModuleKey(menu, selectedGroup, sectionName);
    state[parentKey] = aggregateParentPermissions(menu, (child) => {
        const childKey = getModuleKey(child, selectedGroup, sectionName);
        return state[childKey] || buildInitialPermissions();
    });
}

function initializeMenuTreeState(menu, selectedGroup, sectionName, state) {
    if (!menu) return;
    const key = getModuleKey(menu, selectedGroup, sectionName);
    if (!state[key]) {
        state[key] = buildInitialPermissions();
    }
    if (Array.isArray(menu.children)) {
        menu.children.forEach((child) => {
            initializeMenuTreeState(child, selectedGroup, sectionName, state);
        });
    }
}

function getModuleDisplayName(module, intl) {
    if (!module) return "";
    if (!intl) {
        return module?.name || module?.label || "";
    }
    const menuKey = module?.menuId || module?.funId;
    return intl.formatMessage({
        id: `label.menu.${menuKey}`,
        defaultMessage: module?.name || module?.label || module?.menuId,
    });
}

function getModuleKey(module, selectedGroup, sectionName) {
    const identifier = module?.menuId || module?.label || module?.name || "";
    return `${selectedGroup}-${sectionName}-${identifier}`;
}

function computeInitialStates(fetchedMenus) {
    const initialState = {};
    const initialExpandedState = {};
    Object.entries(fetchedMenus).forEach(([parentName, parentData]) => {
        Object.entries(parentData).forEach(([sectionName, functions]) => {
            functions.forEach((module) => {
                initializeMenuTreeState(module, parentName, sectionName, initialState);
            });
            const uniqueSectionKey = `${parentName}-${sectionName}`;
            initialExpandedState[uniqueSectionKey] = true;
        });
    });
    return { initialState, initialExpandedState };
}

function getPermissionsFromScopes(scopes, avail = null) {
    const permissions = {
        ...buildInitialPermissions(),
        read: scopes.includes(1),
        create: scopes.includes(2),
        update: scopes.includes(4),
        delete: scopes.includes(8),
    };
    permissions.full = avail
        ? computeFullFlag(permissions, avail)
        : permissions.read && permissions.create && permissions.update && permissions.delete;
    return permissions;
}

function buildMenuPayload({
    module,
    sectionName,
    selectedGroup,
    checkboxState,
    seenMenuIds,
    selectedRoleObj,
    intl
}) {
    const result = [];
    const processMenu = (menu, parentId = null) => {
        if (!menu) return;
        if (seenMenuIds.has(menu.menuId)) return;
        seenMenuIds.add(menu.menuId);

        const uniqueKey = getModuleKey(menu, selectedGroup, sectionName);
        const permissions = checkboxState[uniqueKey] || {};
        const roleMenu = selectedRoleObj?.menus?.find((m) => m.menuId === menu.menuId);
        const scopes = [];

        const avail = availableMethods(menu);
        if (permissions.read && avail.read) scopes.push(1);
        if (permissions.create && avail.create) scopes.push(2);
        if (permissions.update && avail.update) scopes.push(4);
        if (permissions.delete && avail.delete) scopes.push(8);

        if (menuHasAnyMethodUris(menu) && !menu.children?.length) {
            if (!menu.menuId) {
                return;
            }
            result.push({
                // Stable menuId for Keycloak AuthZ naming (must match init / RoleServiceImpl)
                menuName: menu.menuId,
                menuId: menu.menuId,
                parentMenuId: parentId,
                resourceId: roleMenu?.resourceId ?? menu.resourceId ?? null,
                resourceIds: roleMenu?.resourceIds ?? menu.resourceIds ?? null,
                policyId: roleMenu?.policyId ?? menu.policyId ?? null,
                permissionId: roleMenu?.permissionId ?? menu.permissionId ?? null,
                scopes,
            });
        }

        if (Array.isArray(menu.children)) {
            menu.children.forEach((child) => {
                processMenu(child, menu.menuId);
            });
        }
    };

    processMenu(module);
    return result;
}

function updateCheckboxStateForRole({ prevState, menus, selectedGroup, role }) {
    const newState = { ...prevState };

    const populateModule = (menu, sectionName) => {
        const uniqueKey = getModuleKey(menu, selectedGroup, sectionName);
        const roleMenu = role?.menus?.find((m) => m.menuId === menu.menuId);
        const scopes = roleMenu?.scopes || [];
        // Leaves get scopes from role; parents are overwritten by roll-up below
        if (!menu.children?.length) {
            newState[uniqueKey] = getPermissionsFromScopes(scopes, availableMethods(menu));
        } else {
            newState[uniqueKey] = buildInitialPermissions();
            menu.children.forEach((child) => populateModule(child, sectionName));
        }
    };

    Object.entries(menus[selectedGroup] || {}).forEach(([sectionName, functions]) => {
        functions.forEach((module) => {
            populateModule(module, sectionName);
            recalculateParentPermissionsInTree(module, selectedGroup, sectionName, newState);
        });
    });

    return newState;
}

// ==================== Mobile Card ====================
function MobileModuleCard({ module, uniqueModuleKey, checkboxState, handleCheckboxChange, selectedGroup, sectionName }) {
    const intl = useIntl();
    const theme = useTheme();
    const perms = checkboxState[uniqueModuleKey] || buildInitialPermissions();
    const avail = availableMethods(module);
    const enabledMethods = PERMISSION_METHODS.filter((m) => avail[m]);
    const allChecked = computeFullFlag(perms, avail);
    const someChecked = enabledMethods.some(
        (m) => perms[m] || perms[`${m}Indeterminate`]
    );
    const fullDisabled = enabledMethods.length === 0;
    const permActions = [
        { key: "read", label: "Read", color: "#0378A6" },
        { key: "create", label: "Create", color: "#2FBF71" },
        { key: "update", label: "Update", color: "#F5A623" },
        { key: "delete", label: "Delete", color: "#E05A5A" },
    ];
    return (
        <HBox sx={{
            borderRadius: "10px", border: "1px solid #e2edf8", mb: 1.5, overflow: "hidden",
            boxShadow: "0 1px 6px rgba(3,120,166,0.06)", transition: "box-shadow 0.2s",
            "&:hover": { boxShadow: "0 3px 14px rgba(3,120,166,0.13)" },
        }}>
            <HBox sx={{
                px: 2, py: 1.2, display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "linear-gradient(90deg, #f0f7ff, #f0fdf8)", borderBottom: "1px solid #e2edf8",
            }}>
                <HLabel
                    value={getModuleDisplayName(module, intl)}
                    colon={false}
                    translate={false}
                    align="left"
                    component="div"
                    sx={{ fontWeight: 600, fontSize: "13px", color: theme.palette.text.primary, fontFamily: "'Inter', sans-serif" }}
                />
                <HBox sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <HLabel
                        value={intl.formatMessage({
                            id: "label.accessMenu.full",
                            defaultMessage: "Full"
                        })}
                        colon={false}
                        translate={false}
                        align="left"
                        component="span"
                        sx={{ fontSize: "11px", color: theme.palette.text.primary, fontFamily: "'Inter', sans-serif", background: `var(--drs-grid-header-bg, #fbfdff)` }}
                    />
                    <HBox>
                        <HCheckBox
                            checked={allChecked}
                            indeterminate={someChecked && !allChecked}
                            disabled={fullDisabled}
                            onChange={() => handleCheckboxChange(selectedGroup, sectionName, module, "full")}
                            align={ALIGNMENT.CENTER}
                            label=""
                            sx={{ p: 0.3, color: colors.primary, '&.Mui-checked': { color: colors.primary }, '&.MuiCheckbox-indeterminate': { color: colors.primary } }}
                        />
                    </HBox>
                </HBox>
            </HBox>
            <HBox sx={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                {permActions.map(({ key, label, color }, idx) => (
                    <HBox key={key} sx={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        px: 2, py: 0.9,
                        borderRight: idx % 2 === 0 ? "1px solid #f0f4f8" : "none",
                        borderBottom: idx < 2 ? "1px solid #f0f4f8" : "none",
                        background: (perms[key] || perms[`${key}Indeterminate`]) ? `${color}0d` : "transparent",
                        transition: "background 0.15s",
                        opacity: avail[key] ? 1 : 0.45,
                    }}>
                        <HBox sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                            <HBox sx={{
                                width: 7, height: 7, borderRadius: "50%",
                                background: (perms[key] || perms[`${key}Indeterminate`]) ? color : "#dde4ef",
                                transition: "background 0.2s", flexShrink: 0,
                            }} />
                            <HLabel
                                value={label}
                                colon={false}
                                translate={false}
                                align="left"
                                component="span"
                                sx={{
                                    fontSize: "12px", fontFamily: "'Inter', sans-serif",
                                    color: (perms[key] || perms[`${key}Indeterminate`]) ? color : colors.text.secondary,
                                    fontWeight: perms[key] ? 600 : 400, transition: "all 0.2s",
                                }}
                            />
                        </HBox>
                        <HBox>
                            <HCheckBox
                                checked={!!perms[key]}
                                indeterminate={!!perms[`${key}Indeterminate`]}
                                disabled={!avail[key]}
                                onChange={() => handleCheckboxChange(selectedGroup, sectionName, module, key)}
                                align={ALIGNMENT.CENTER}
                                label=""
                                sx={{
                                    p: 0.3, color,
                                    '&.Mui-checked': { color },
                                    '&.MuiCheckbox-indeterminate': { color },
                                }}
                            />
                        </HBox>
                    </HBox>
                ))}
            </HBox>
        </HBox>
    );
}
MobileModuleCard.propTypes = {
    module: PropTypes.object.isRequired, uniqueModuleKey: PropTypes.string.isRequired,
    checkboxState: PropTypes.object.isRequired, handleCheckboxChange: PropTypes.func.isRequired,
    selectedGroup: PropTypes.string.isRequired, sectionName: PropTypes.string.isRequired,
};

// ==================== Desktop Table Row ====================
function ModuleRow({
    module,
    uniqueModuleKey,
    checkboxState,
    handleCheckboxChange,
    selectedGroup,
    sectionName,
    level = 0,
    isLast = false,
    parentLines = [],
    searchTerm = "",
}) {
    const intl = useIntl();
    const theme = useTheme();
    const [openChildren, setOpenChildren] = React.useState(false);

    const hasChildren = module?.children?.length > 0;
    const normalizedSearchTerm = (searchTerm || "").trim();

    React.useEffect(() => {
        if (normalizedSearchTerm) {
            setOpenChildren(true);
        }
    }, [normalizedSearchTerm]);

    const perms = checkboxState[uniqueModuleKey] || buildInitialPermissions();
    const avail = availableMethods(module);
    const enabledMethods = PERMISSION_METHODS.filter((m) => avail[m]);
    const allChecked = computeFullFlag(perms, avail);
    const someChecked = enabledMethods.some(
        (m) => perms[m] || perms[`${m}Indeterminate`]
    );
    const fullDisabled = enabledMethods.length === 0;

    return (
        <>
            <TableRow
                hover
                sx={{
                    transition: "all 0.18s ease",
                    background: "transparent",
                    
                }}
            >
                <TableCell
                    sx={{
                        position: "relative",
                        py: 1,
                    }}
                >
                    <HBox
                        sx={{
                            background: "transparent",
                            display: "flex",
                            alignItems: "center",
                            position: "relative",
                            minHeight: 34,
                        }}
                    >
                        {/* Tree Lines */}
                        <HBox
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                position: "relative",
                                background: "transparent",
                                mr: 1,
                            }}
                        >
                            {parentLines.map((show, idx) => (
                                <HBox
                                    key={idx}
                                    sx={{
                                        width: 20,
                                        height: 34,
                                        position: "relative",
                                        background: "transparent",
                                    }}
                                >
                                    {show && (
                                        <HBox
                                            sx={{
                                                position: "absolute",
                                                left: "50%",
                                                top: 0,
                                                bottom: 0,
                                                width: "1.5px",
                                                background: "linear-gradient(to bottom,#b7d7e8,#d7eaf5)",
                                            }}
                                        />
                                    )}
                                </HBox>
                            ))}

                            {level > 0 && (
                                <HBox
                                    sx={{
                                        width: 20,
                                        height: 34,
                                        position: "relative",
                                        flexShrink: 0,
                                        background: "transparent",
                                    }}
                                >
                                    {!isLast && (
                                        <HBox
                                            sx={{
                                                position: "absolute",
                                                left: "50%",
                                                top: 0,
                                                bottom: 0,
                                                width: "1.5px",
                                                background: "linear-gradient(to bottom,#b7d7e8,#d7eaf5)",
                                            }}
                                        />
                                    )}
                                    <HBox
                                        sx={{
                                            position: "absolute",
                                            left: "50%",
                                            top: 0,
                                            height: "50%",
                                            width: "1.5px",
                                            background: "linear-gradient(to bottom,#b7d7e8,#d7eaf5)",
                                        }}
                                    />
                                    <HBox
                                        sx={{
                                            position: "absolute",
                                            left: "50%",
                                            top: "50%",
                                            width: 16,
                                            height: "1.5px",
                                            background: "linear-gradient(to right,#b7d7e8,#d7eaf5)",
                                        }}
                                    />
                                </HBox>
                            )}

                            {/* Expand Button — kept as MUI Button (tiny icon control, no H equivalent) */}
                            {hasChildren ? (
                                <HButton
                                    label={openChildren ? "−" : "+"}
                                    size="small"
                                    variant="outlined"
                                    onClick={() => setOpenChildren(!openChildren)}
                                    sx={{
                                        minWidth: 22,
                                        width: 22,
                                        height: 22,
                                        p: 0,
                                        borderRadius: "7px",
                                        fontSize: "14px",
                                        fontWeight: 700,
                                        transition: "all 0.18s ease",
                                    }}
                                />
                                    
                            ) : (
                                <HBox
                                    sx={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: "50%",
                                        background: "var(--drs-button-outline-bg, transparent)",
                                        border: "1px solid rgb(213, 229, 241)",
                                        boxSizing: "border-box",
                                    }}
                                />
                            )}
                        </HBox>

                        {/* Label */}
                        <HLabel
                            value={getModuleDisplayName(module, intl)}
                            colon={false}
                            translate={false}
                            align="left"
                            component="span"
                            sx={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: level === 0 ? "13px" : "12px",
                                fontWeight: level === 0 ? 600 : 500,
                                color: level === 0 ? theme.palette.text.primary : theme.palette.text.secondary,
                                letterSpacing: "0.2px",
                            }}
                        />
                    </HBox>
                </TableCell>

                {/* Permissions */}
                {["read", "create", "update", "delete"].map((action) => (
                    <TableCell key={action} align="center" sx={{justifyItems: "center"}}>
                        <HBox sx={{background: "transparent", opacity: avail[action] ? 1 : 0.45}}>
                            <HCheckBox
                                checked={!!perms[action]}
                                indeterminate={!!perms[`${action}Indeterminate`]}
                                disabled={!avail[action]}
                                onChange={() =>
                                    handleCheckboxChange(selectedGroup, sectionName, module, action)
                                }
                                label=""
                                sx={{
                                    color: colors.primary,
                                    "&.Mui-checked": { color: colors.primary },
                                    "&.MuiCheckbox-indeterminate": { color: colors.primary },
                                    "& .MuiSvgIcon-root": { fontSize: 20 },
                                }}
                            />
                        </HBox>
                    </TableCell>
                ))}

                {/* Full */}
                <TableCell align='center' sx={{justifyItems: "center"}}>
                    <HBox sx={{background: "transparent", justifyItems: "center", alignItems: "center", opacity: fullDisabled ? 0.45 : 1}}>
                        <HCheckBox
                            checked={allChecked}
                            indeterminate={someChecked && !allChecked}
                            disabled={fullDisabled}
                            onChange={() =>
                                handleCheckboxChange(selectedGroup, sectionName, module, "full")
                            }
                            align={ALIGNMENT.CENTER}
                            label=""
                            sx={{
                                color: colors.primary,
                                "&.Mui-checked": { color: colors.primary },
                                "&.MuiCheckbox-indeterminate": { color: colors.primary },
                                "& .MuiSvgIcon-root": { fontSize: 20 },
                                background: "transparent",
                            }}
                        />
                    </HBox>
                </TableCell>
            </TableRow>

            {/* Children */}
            {openChildren &&
                module?.children?.map((child, index) => {
                    const childKey = getModuleKey(child, selectedGroup, sectionName);
                    const childIsLast = index === module.children.length - 1;
                    return (
                        <ModuleRow
                            key={childKey}
                            module={child}
                            uniqueModuleKey={childKey}
                            checkboxState={checkboxState}
                            handleCheckboxChange={handleCheckboxChange}
                            selectedGroup={selectedGroup}
                            sectionName={sectionName}
                            level={level + 1}
                            isLast={childIsLast}
                            parentLines={[...parentLines, !isLast]}
                            searchTerm={searchTerm}
                        />
                    );
                })}
        </>
    );
}
ModuleRow.propTypes = {
    module: PropTypes.object.isRequired, uniqueModuleKey: PropTypes.string.isRequired,
    checkboxState: PropTypes.object.isRequired, handleCheckboxChange: PropTypes.func.isRequired,
    selectedGroup: PropTypes.string.isRequired, sectionName: PropTypes.string.isRequired,
    searchTerm: PropTypes.string,
};

// ==================== MergedSectionBox ====================
function MergedSectionBox({ groupName, groupSections, checkboxState, handleCheckboxChange, searchTerm }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const lowerSearch = searchTerm.toLowerCase();
    const intl = useIntl();

    const filterModuleTree = (module) => {
        if (!module) return null;
        const displayName = getModuleDisplayName(module, intl).toLowerCase();
        const nameMatches = displayName.includes(lowerSearch);

        let filteredChildren = [];
        if (Array.isArray(module.children)) {
            filteredChildren = module.children
                .map((child) => filterModuleTree(child))
                .filter((child) => child !== null);
        }

        if (nameMatches || filteredChildren.length > 0) {
            return {
                ...module,
                children: filteredChildren.length > 0 ? filteredChildren : module.children
            };
        }
        return null;
    };

    const allModules = [];
    Object.entries(groupSections).forEach(([sectionName, functions]) => {
        functions.forEach((module) => {
            const filtered = filterModuleTree(module);
            if (filtered) {
                allModules.push({ ...filtered, sectionName });
            }
        });
    });

    if (allModules.length === 0) return (
        <HBox sx={{ py: 4, textAlign: "center" }}>
            <HLabel
                value={intl.formatMessage({
                    id: "label.accessMenu.noModulesFound",
                    defaultMessage: "No modules match your search."
                })}
                colon={false}
                translate={false}
                align="center"
                component="div"
                sx={{ fontFamily: "'Inter', sans-serif", color: colors.text.secondary, fontSize: "13px" }}
            />
        </HBox>
    );

    return (
        <>
            {isMobile ? (
                <HBox>
                    {allModules.map((module) => {
                        const uniqueModuleKey = getModuleKey(module, groupName, module.sectionName);
                        return (
                            <MobileModuleCard key={uniqueModuleKey} module={module} uniqueModuleKey={uniqueModuleKey}
                                checkboxState={checkboxState} handleCheckboxChange={handleCheckboxChange}
                                selectedGroup={groupName} sectionName={module.sectionName} intl={intl}
                            />
                        );
                    })}
                </HBox>
            ) : (
                <TableContainer component={Paper} sx={{
                    borderRadius: "10px", border: "2px solid var(--drs-grid-header-bg, hsla(215, 20%, 95%, 0.92))", boxShadow: "0 2px 12px rgba(3,120,166,0.07)",
                    flex: 1, minHeight: 0, overflow: "auto"
                }}>
                    <Table size="small" stickyHeader>
                        <TableHead >
                            <TableRow>
                                <TableCell sx={{ ...tableHeaderSx, minWidth: { sm: 150, md: 200 } }}>Menu</TableCell>
                                {["Read", "Create", "Update", "Delete"].map((action) => (
                                    <TableCell key={action} align="center" sx={{ ...tableHeaderSx, minWidth: 70 }}>
                                        <Tooltip title={intl.formatMessage({
                                            id: `label.accessMenu.tooltip.${action.toLowerCase()}`,
                                            defaultMessage: `Can ${action} this menu`,
                                        })} arrow><span>{action}</span></Tooltip>
                                    </TableCell>
                                ))}
                                <TableCell align="center" sx={{ ...tableHeaderSx, minWidth: 60 }}>
                                    <Tooltip title="All permissions" arrow><span>Full</span></Tooltip>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allModules.map((module) => {
                                const uniqueModuleKey = getModuleKey(module, groupName, module.sectionName);
                                return (
                                    <ModuleRow key={uniqueModuleKey} module={module} uniqueModuleKey={uniqueModuleKey}
                                        checkboxState={checkboxState} handleCheckboxChange={handleCheckboxChange}
                                        selectedGroup={groupName} sectionName={module.sectionName} intl={intl}
                                        searchTerm={searchTerm}
                                    />
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
    );
}
MergedSectionBox.propTypes = {
    groupName: PropTypes.string.isRequired, groupSections: PropTypes.object.isRequired,
    checkboxState: PropTypes.object.isRequired, handleCheckboxChange: PropTypes.func.isRequired,
    searchTerm: PropTypes.string.isRequired,
};

// ==================== Main Component ====================
function AccessMenu({ preselectedRole, preselectedGroup, onClose }) {
    const [menus, setMenus] = useState({});
    const [checkboxState, setCheckboxState] = useState({});
    const [selectedRole, setSelectedRole] = useState(preselectedRole || "");
    const [expandedSections, setExpandedSections] = useState({});
    const realm = sessionStorage.getItem("SEC_REALM");
    const [roleGroups, setRoleGroups] = useState({});
    const [selectedGroup, setSelectedGroup] = useState(preselectedGroup || "");
    const [searchTerm, setSearchTerm] = useState("");
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [loadingClients, setLoadingClients] = useState(false);
    const [saving, setSaving] = useState(false);
    const toast = useToast();
    const intl = useIntl();
    const isInitialLoadRef = useRef(true);
    const theme = useTheme();
    const { themeVars, text, colors, border } = useDrsTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchClients = async () => {
        try {
            setLoadingClients(true);
            const response = await HAxiosService.GET(ClientDetailsAPI.GET_CLIENTS_BY_REALM(realm));
            if (response.data) setClients(response.data);
        } catch (error) {
            console.error("Error fetching clients:", error);
            toast.error(intl.formatMessage({
                id: "label.accessMenu.loadClientsError",
                defaultMessage: "Failed to load clients"
            }));
        } finally { setLoadingClients(false); }
    };

    const fetchRoles = async (clientId) => {
        try {
            const response = await HAxiosService.GET(ClientDetailsAPI.ROLES(realm, clientId));
            const data = response.data;
            setRoleGroups(data && typeof data === "object" && !Array.isArray(data) ? data : {});
        } catch (error) {
            console.error("Error fetching roles:", error);
            setRoleGroups({});
            toast.error("Failed to load roles");
        }
    };

    const fetchMenus = async () => {
        try {
            const response = await HAxiosService.GET(UserManagementAPI.fetchAllMenus());
            const fetchedMenus = response.data?.menus || {};

            const replaceFunIdRecursively = items =>
                (items || []).map(({ funId, children, ...rest }) => ({
                    ...rest,
                    ...(funId && { menuId: funId }),
                    children: replaceFunIdRecursively(children)
                }));
            const functionMenus = Object.values(fetchedMenus)
                .flatMap(v => (v.hangingFunctions || []).filter(i => i.funId));
            const updatedFunctionMenus = replaceFunIdRecursively(functionMenus);
            Object.values(fetchedMenus).forEach(client => {
                client.hangingFunctions = (client.hangingFunctions || []).filter(i => !i.funId);
                (client.hangingFunctions || []).forEach(menu => {
                    if (
                        menu.includeChildrenFromFunctions === true ||
                        menu.includeChildrenFromFunctions === "Y"
                    ) {
                        menu.children = [...(menu.children || []), ...updatedFunctionMenus];
                    }
                });
            });
            setMenus(fetchedMenus);
            if (isInitialLoadRef.current) {
                const { initialState, initialExpandedState } = computeInitialStates(fetchedMenus);
                setCheckboxState(initialState);
                setExpandedSections(initialExpandedState);
                isInitialLoadRef.current = false;
            }
        } catch (error) {
            console.error("Error fetching menus:", error);
            toast.error("Failed to load menus");
        }
    };

    useEffect(() => { if (realm) fetchClients(); }, [realm]);

    useEffect(() => {
        if (preselectedGroup && clients.length > 0 && preselectedRole ) {
            const client = clients.find(c => c.clientId === preselectedGroup);
            if (client) setSelectedClient(client);
        }
    }, [preselectedRole, preselectedGroup, clients]);

    useEffect(() => {
        if (selectedClient) {
            setSelectedRole("");
            setSelectedGroup("");
            fetchRoles(selectedClient.clientId);
            fetchMenus();
        }
    }, [selectedClient]);

    useEffect(() => {
        if (!preselectedRole || Object.keys(roleGroups).length === 0 || !preselectedGroup ) return;
        let foundGroup = null;
        for (const [groupName, roles] of Object.entries(roleGroups)) {
             const roleExists = (Array.isArray(roles) ? roles : []).find(role => role.name === preselectedRole);
            if (roleExists) {
                foundGroup = groupName;
                break;
            }
        }
        if (foundGroup) { setSelectedGroup(foundGroup); setSelectedRole(`${foundGroup}__${preselectedRole}`); }
    }, [preselectedRole, roleGroups, preselectedGroup]);

    const handleCheckboxChange = (
        parentName,
        sectionName,
        module,
        action
    ) => {
        const setPermissionsForMenu = (menu, current, actionType, targetValue) => {
            const avail = availableMethods(menu);
            const updated = { ...buildInitialPermissions(), ...current };
            // Clear indeterminate on leaves when explicitly toggled
            PERMISSION_METHODS.forEach((method) => {
                updated[`${method}Indeterminate`] = false;
            });

            if (actionType === "full") {
                PERMISSION_METHODS.forEach((method) => {
                    if (avail[method]) {
                        updated[method] = targetValue;
                    }
                });
            } else if (avail[actionType]) {
                updated[actionType] = targetValue;
            }
            updated.full = computeFullFlag(updated, avail);
            return updated;
        };

        setCheckboxState((prevState) => {
            const newState = { ...prevState };
            const nodeAvail = availableMethods(module);
            if (action !== "full" && !nodeAvail[action]) {
                return prevState;
            }
            if (action === "full" && !PERMISSION_METHODS.some((m) => nodeAvail[m])) {
                return prevState;
            }

            const currentNodeState =
                newState[getModuleKey(module, parentName, sectionName)] || buildInitialPermissions();

            let targetValue = false;
            if (action === "full") {
                // If fully checked → uncheck; if unchecked or partial → check all
                targetValue = !computeFullFlag(currentNodeState, nodeAvail);
            } else {
                // If checked (not indeterminate) → uncheck; if unchecked or partial → check
                targetValue = !(currentNodeState[action] && !currentNodeState[`${action}Indeterminate`]);
            }

            const applyToTree = (menuNode) => {
                if (!menuNode) return;
                const key = getModuleKey(menuNode, parentName, sectionName);
                if (!newState[key]) {
                    newState[key] = buildInitialPermissions();
                }
                if (!menuNode.children?.length) {
                    newState[key] = setPermissionsForMenu(menuNode, newState[key], action, targetValue);
                } else {
                    menuNode.children.forEach(applyToTree);
                }
            };
            applyToTree(module);

            const sectionModules = menus[parentName]?.[sectionName] || [];
            sectionModules.forEach((rootModule) => {
                recalculateParentPermissionsInTree(rootModule, parentName, sectionName, newState);
            });

            return newState;
        });
    };

    const handleSave = () => {
        if (!selectedRole || !selectedClient) {
            toast.warning(intl.formatMessage({
                id: "label.accessMenu.selectClientRoleBeforeSave",
                defaultMessage: "Please select a client and role before saving."
            }), { position: "top-right", autoClose: 700 });
            return;
        }
        const selectedMenus = menus[selectedGroup] || {};
        const roleName = selectedRole?.includes("__") ? selectedRole.split("__")[1] : selectedRole;
        const selectedRoleObj = roleGroups[selectedGroup]?.find(role => role.name === roleName);
        if (!selectedRoleObj) { toast.error(intl.formatMessage({
            id: "label.accessMenu.roleNotFound",
            defaultMessage: "Selected role not found."
        })); return; }
        const seenMenuIds = new Set();
        const menusPayload = [];
        Object.entries(selectedMenus).forEach(([sectionName, functions]) => {
            functions.forEach((module) => {
                const payloadItem = buildMenuPayload({ module, sectionName, selectedGroup, checkboxState, seenMenuIds, selectedRoleObj, intl });
                if (payloadItem?.length) {
                    menusPayload.push(...payloadItem);
                }
            });
        });
        const payload = {
            realm, clientId: selectedClient.clientId, product: selectedGroup,
            roleId: selectedRoleObj?.id || "", roleName: selectedRoleObj?.name || "", description: selectedRoleObj?.description || "",
            menus: menusPayload,
        };
        setSaving(true);
        HAxiosService.PUT(UserManagementAPI.roles_menu_access(), payload)
            .then((response) => {
                toast.success(response.data.msg || intl.formatMessage({
                    id: "label.accessMenu.saveSuccess",
                    defaultMessage: "Menu access saved successfully!"
                }), { position: "top-right", autoClose: 700 });
                Promise.all([fetchRoles(selectedClient.clientId), fetchMenus()]).catch(console.error);
            })
            .catch((error) => {
                console.error("Error saving menu access:", error);
                toast.error(intl.formatMessage({
                    id: "label.accessMenu.saveError",
                    defaultMessage: "Error saving menu access!"
                }), { position: "top-right", autoClose: 700 });
            })
            .finally(() => {
                setSaving(false);
            });
    };

    useEffect(() => {
        if (!selectedGroup || !selectedRole) return;
        let role = roleGroups[selectedGroup]?.find(role => role.name === selectedRole);
        if (!role) return;
        setCheckboxState((prevState) => updateCheckboxStateForRole({ prevState, menus, selectedGroup, role }));
    }, [selectedGroup, selectedRole, roleGroups, menus]);

    const totalModules = useMemo(() => {
        let count = 0;
        Object.values(checkboxState).forEach(perms => { if (perms.read || perms.create || perms.update || perms.delete) count++; });
        return count;
    }, [checkboxState]);

    const totalPermissions = useMemo(() => {
        let sum = 0;
        Object.values(checkboxState).forEach(perms => {
            if (perms.read) sum++; if (perms.create) sum++; if (perms.update) sum++; if (perms.delete) sum++;
        });
        return sum;
    }, [checkboxState]);

    const clientChipSx = { background: "#79cff145", border: "1px solid #79cff1", fontSize: "11px" };
    const roleChipSx = { background: "#43da8745", border: "1px solid #43da87", fontSize: "11px" };

    return (
        <HBox sx={{
            height: "100vh", display: "flex", flexDirection: "column",
            background: "transparent",
            boxSizing: "border-box",
        }}>
            <HPaper elevation={0} sx={{ ...paperSx, flex: 1, minHeight: 0 }}>

                {/* Gradient Header */}
                <HBox sx={{ flexShrink: 0, height: '9%' }}>
                    <HBreadCrumb />
                    <HBox sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
                        <HBox sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 }, borderRadius: "8px", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <AdminPanelSettings sx={{ color: theme.palette.text.primary, fontSize: { xs: 17, sm: 20 } }} />
                        </HBox>
                        <TitleBar
                            title={intl.formatMessage({ id: "label.accessMenu.accessControl", defaultMessage: "Access Control" })}
                        />
                    </HBox>
                </HBox>

                {/* Controls Bar */}
                <HBox sx={{
                    px: { xs: 1.5, sm: 2, md: 3 }, pt: { xs: 1.5, sm: 2 }, pb: 1.5,
                    flexShrink: 0, borderBottom: "1px solid #edf2f8",
                }}>
                    <HBox sx={{
                        display: "flex", flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "stretch", sm: "center" },
                        gap: { xs: 1.2, sm: 1.5 }, flexWrap: "wrap",
                    }}>
                        <HDropdown
                            options={clients.map((c) => ({ value: c.clientId, label: c.clientId }))}
                            value={selectedClient?.clientId || ""}
                            onChange={(e) => {
                                const client = clients.find(c => c.clientId === e.target.value);
                                setSelectedClient(client || null);
                                setSelectedRole("");
                                setSelectedGroup("");
                                setRoleGroups({});
                            }}
                            placeholder={intl.formatMessage({
                                id: "label.accessMenu.selectClient",
                                defaultMessage: "Select Client"
                            })}
                            disabled={loadingClients}
                            width={{ xs: "100%", sm: 200, md: 230 }}
                        />

                        {/* Role selector */}
                        {selectedClient && !preselectedRole && (
                        
                            <HDropdown
                                options={Object.entries(roleGroups).flatMap(([group, roles]) =>
                                    (Array.isArray(roles) ? roles : []).map((role) => ({
                                        value: `${group}__${role.name}`,
                                        label: `${role.name} (${group})`,
                                    }))
                                )}
                                value={selectedRole ? `${selectedGroup}__${selectedRole}` : ""}
                                onChange={(e) => {
                                    const [groupName, roleName] = e.target.value.split("__");
                                    setSelectedGroup(groupName);
                                    setSelectedRole(roleName);
                                    setSearchTerm("");
                                }}
                                placeholder={intl.formatMessage({
                                    id: "label.accessMenu.selectRole",
                                    defaultMessage: "Select Role"
                                })}
                                width={{ xs: "100%", sm: 230, md: 270 }}
                            />
                        )}

                        {/* Preselected read-only display */}
                        {preselectedRole && selectedClient && (
                            <HBox sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap", flexShrink: 0 }}>
                                <Chip label={selectedClient.clientId} size="small" sx={clientChipSx} />
                                <HLabel value="/" colon={false} translate={false} align="left" component="span"
                                    sx={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: theme.palette.text.secondary }} />
                                <Chip label={preselectedRole} size="small" sx={roleChipSx} />
                            </HBox>
                        )}
                        {/* Search box */}
                        {selectedRole && (
                            <HTextField
                                placeholder={intl.formatMessage({
                                    id: "label.accessMenu.searchModules",
                                    defaultMessage: "Search modules..."
                                })}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                editable
                                InputProps={{ startAdornment: <Search sx={{ color: colors.text.secondary, mr: 1, fontSize: 18 }} /> }}
                                sx={{
                                    flex: 1, minWidth: 0, width: { xs: "100%", sm: "auto" },
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "8px",
                                    },
                                    mb: { xs: 1, sm: 1}
                                }}
                            />
                        )}

                        {/* Counts pills */}
                        {selectedRole && (
                            <HBox sx={{ display: "flex", flexDirection: "row", gap: { xs: 1.5, sm: 1 }, flexShrink: 0, flexWrap: "wrap", alignItems: "center" }}>
                                <HBox sx={{
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 0.6,
                                    width: "130px", py: 0.5, borderRadius: "20px",
                                    background: "rgba(3,120,166,0.07)", border: "1px solid rgba(3,120,166,0.15)", whiteSpace: "nowrap",
                                }}>
                                    <HBox sx={{ width: 7, height: 7, borderRadius: "50%", background: "linear-gradient(135deg, #0378A6, #2FBF71)", flexShrink: 0 }} />
                                    <HLabel
                                        value={<>Modules:&nbsp;<strong style={{ color: colors.primary }}>{totalModules}</strong></>}
                                        colon={false}
                                        translate={false}
                                        align="left"
                                        component="span"
                                        sx={{ fontFamily: "'Inter', sans-serif", color: colors.text.secondary, fontSize: "11px" }}
                                    />
                                </HBox>
                                <HBox sx={{
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 0.6,
                                    width: "150px", py: 0.5, borderRadius: "20px",
                                    background: "rgba(47,191,113,0.07)", border: "1px solid rgba(47,191,113,0.2)", whiteSpace: "nowrap",
                                }}>
                                    <HBox sx={{ width: 7, height: 7, borderRadius: "50%", background: "linear-gradient(135deg, #2FBF71, #0378A6)", flexShrink: 0 }} />
                                    <HLabel
                                        value={<>Permissions:&nbsp;<strong style={{ color: colors.secondary }}>{totalPermissions}</strong></>}
                                        colon={false}
                                        translate={false}
                                        align="left"
                                        component="span"
                                        sx={{ fontFamily: "'Inter', sans-serif", color: colors.text.secondary, fontSize: "11px" }}
                                    />
                                </HBox>
                            </HBox>
                        )}
                    </HBox>
                </HBox>

                <HBox sx={{
                    flex: 1, minHeight: 0, display: "flex", flexDirection: "column",
                    px: { xs: 1.5, sm: 2, md: 3 }, py: { xs: 1.5, sm: 2 },
                }}>
                    <HBox sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                        {!selectedGroup ? (
                            <HBox sx={{ textAlign: "center", py: { xs: 4, sm: 6 } }}>
                                <AdminPanelSettings sx={{ fontSize: { xs: 44, sm: 56 }, mb: 1 }} />
                                <HLabel
                                    value={intl.formatMessage({
                                        id: "label.accessMenu.selectClientRole",
                                        defaultMessage: "Select a client and role to view and manage permissions"
                                    })}
                                    colon={false}
                                    translate={false}
                                    align="center"
                                    component="div"
                                    sx={{ fontFamily: "'Inter', sans-serif", color: theme.palette.text.secondary, fontSize: { xs: "13px", sm: "14px" } }}
                                />
                            </HBox>
                        ) : !menus[selectedGroup] ? (
                            <HLabel
                                value={intl.formatMessage({
                                    id: "label.accessMenu.noMenuAvailable",
                                    defaultMessage: "No menu available for the selected group"
                                })}
                                colon={false}
                                translate={false}
                                align="left"
                                component="div"
                                sx={{ fontFamily: "'Inter', sans-serif", color: theme.palette.text.secondary }}
                            />
                        ) : (
                            <HBox key={selectedGroup} sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
                                <HBox sx={{ mb: 1.5 }}>
                                    <HLabel
                                        value={selectedGroup}
                                        colon={false}
                                        translate={false}
                                        align="left"
                                        component="div"
                                        sx={{
                                            display: "inline-block", fontWeight: 700,
                                            fontSize: { xs: "11px", sm: "13px" }, color: "white",
                                            textTransform: "uppercase", letterSpacing: "1px",
                                            fontFamily: "'Inter', sans-serif",
                                            background: "var(--drs-button-primary-bg, transparent)",
                                            px: { xs: 1.5, sm: 2 }, py: 0.6, borderRadius: "8px",
                                        }}
                                    />
                                </HBox>
                                <HBox sx={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                                    <MergedSectionBox
                                        groupName={selectedGroup} groupSections={menus[selectedGroup]}
                                        checkboxState={checkboxState} handleCheckboxChange={handleCheckboxChange}
                                        searchTerm={searchTerm} intl={intl}
                                    />
                                </HBox>
                            </HBox>
                        )}
                    </HBox>

                    {/* Action Buttons */}
                    <HBox mt={3} display="flex" justifyContent="flex-end" gap={1.5} flexWrap="wrap" flexShrink={0}>
                        {preselectedRole && (
                            <HButton
                                label={intl.formatMessage({
                                    id: "label.accessMenu.close",
                                    defaultMessage: "Close"
                                })}
                                variant="outlined"
                                onClick={onClose}
                            />
                        )}
                        {selectedClient && selectedRole && (
                            <HButton
                                label={saving
                                    ? intl.formatMessage({
                                        id: "label.accessMenu.saving",
                                        defaultMessage: "Saving..."
                                    })
                                    : intl.formatMessage({
                                        id: "label.accessMenu.save",
                                        defaultMessage: "Save"
                                    })
                                }
                                variant="contained"
                                onClick={handleSave}
                                align="right"
                                disabled={!selectedRole || !selectedClient || saving}
                                startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
                            />
                        )}
                    </HBox>
                </HBox>

            </HPaper>
        </HBox>
    );
}

AccessMenu.propTypes = {
    preselectedRole: PropTypes.string,
    preselectedGroup: PropTypes.string,
    onClose: PropTypes.func.isRequired,
};

export default AccessMenu;