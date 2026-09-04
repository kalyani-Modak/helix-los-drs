import React, { useState, useCallback ,useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ModuleDrawer from "./ModuleDrawer";
import { useIntl } from "react-intl";
import { HBox } from "@helix/component-library";

import {
    DashboardOutlined as DashboardOutlinedIcon,
    ListAltOutlined as ListAltOutlinedIcon,
    SettingsOutlined as SettingsOutlinedIcon,
    BuildOutlined as BuildOutlinedIcon,
    MailOutlined as MailOutlinedIcon,
    Inventory2Outlined as Inventory2OutlinedIcon,
    CategoryOutlined as CategoryOutlinedIcon,
    PlayCircleOutlineOutlined as PlayCircleOutlineOutlinedIcon,
    AssignmentIndOutlined as AssignmentIndOutlinedIcon,
    AssignmentTurnedInOutlined as AssignmentTurnedInOutlinedIcon,
    FunctionsOutlined as FunctionsOutlinedIcon,
    SearchOutlined as SearchOutlinedIcon,
    SecurityOutlined as SecurityOutlinedIcon,
    ShieldOutlined as ShieldOutlinedIcon,
    CalendarMonthOutlined as CalendarMonthOutlinedIcon,
    AccountTreeOutlined as AccountTreeOutlinedIcon,
    TaskAltOutlined as TaskAltOutlinedIcon,
    BusinessOutlined as BusinessOutlinedIcon,
    PolicyOutlined as PolicyOutlinedIcon,
    HandshakeOutlined as HandshakeOutlinedIcon,
    BlockOutlined as BlockOutlinedIcon,
    RuleOutlined as RuleOutlinedIcon,
    PublishedWithChangesOutlined as PublishedWithChangesOutlinedIcon,
    EditNoteOutlined as EditNoteOutlinedIcon,
    HubOutlined as HubOutlinedIcon,
    InsightsOutlined as InsightsOutlinedIcon,
    SpeedOutlined as SpeedOutlinedIcon,
    TuneOutlined as TuneOutlinedIcon,
    FlashOnOutlined as FlashOnOutlinedIcon,
    VisibilityOutlined as VisibilityOutlinedIcon,
    ManageAccountsOutlined as ManageAccountsOutlinedIcon,
    SettingsBackupRestoreOutlined as SettingsBackupRestoreOutlinedIcon,
    CurrencyRupeeOutlined as CurrencyRupeeOutlinedIcon,
    ReceiptLongOutlined as ReceiptLongOutlinedIcon,
    DnsOutlined as DnsOutlinedIcon,
    CompareArrowsOutlined as CompareArrowsOutlinedIcon,
    HandymanOutlined as BuildCircleOutlinedIcon,
    BoltOutlined as BoltOutlinedIcon,
    LocalOfferOutlined as LocalOfferOutlinedIcon,
    FolderOpenOutlined as FolderOpenOutlinedIcon,
    AccountTreeOutlined,
    HubOutlined,
    BuildOutlined,
    CloudUploadOutlined,
    FileUploadOutlined,
    ApiOutlined,
    FactCheckOutlined,
    SettingsApplicationsOutlined,
    BugReportOutlined,
    StorageOutlined,
    SchemaOutlined,
    DescriptionOutlined,
    ScheduleOutlined,
    MenuBookOutlined,
    LockResetOutlined,
    SecurityOutlined,
    EventOutlined,
    HistoryToggleOffOutlined,
    LockOutlined,
    CloudSyncOutlined,
    DnsOutlined,
    Hub as HubIcon,
    Category as CategoryIcon,
    AccountTree as AccountTreeIcon,
    SettingsApplications as SettingsApplicationsIcon,
    BatchPrediction as BatchPredictionIcon,
    CreditCard,
    Autorenew,
    GroupsOutlined as GroupsOutlinedIcon,
    FormatListBulleted, 
    BusinessCenter,
    PeopleAlt as PeopleAltIcon,
    CallSplitOutlined as CallSplitOutlinedIcon,
    AssessmentOutlined,
    ReceiptLong as ReceiptLongIcon,
} from "@mui/icons-material";

import {Tooltip, IconButton, Badge } from "@mui/material";

const MODULE_GROUP_SESSION_KEY = "SEC_MODULE_GROUP";
const ACTIVE_MENU_ID_SESSION_KEY = "SEC_ACTIVE_MENU_ID";

/* ================= ICON REGISTRY =================
   Backend will send icon names as string.
   We map them dynamically here.
================================================== */

const ICONS = {
    DashboardOutlinedIcon,
    ListAltOutlinedIcon,
    SettingsOutlinedIcon,
    BuildOutlinedIcon,
    MailOutlinedIcon,
    Inventory2OutlinedIcon,
    CategoryOutlinedIcon,
    PlayCircleOutlineOutlinedIcon,
    AssignmentIndOutlinedIcon,
    AssignmentTurnedInOutlinedIcon,
    FunctionsOutlinedIcon,
    SearchOutlinedIcon,
    SecurityOutlinedIcon,
    ShieldOutlinedIcon,
    CalendarMonthOutlinedIcon,
    AccountTreeOutlinedIcon,
    TaskAltOutlinedIcon,
    BusinessOutlinedIcon,
    PolicyOutlinedIcon,
    HandshakeOutlinedIcon,
    BlockOutlinedIcon,
    RuleOutlinedIcon,
    PublishedWithChangesOutlinedIcon,
    EditNoteOutlinedIcon,
    HubOutlinedIcon,
    InsightsOutlinedIcon,
    SpeedOutlinedIcon,
    TuneOutlinedIcon,
    FlashOnOutlinedIcon,
    VisibilityOutlinedIcon,
    ManageAccountsOutlinedIcon,
    SettingsBackupRestoreOutlinedIcon,
    CurrencyRupeeOutlinedIcon,
    ReceiptLongOutlinedIcon,
    DnsOutlinedIcon,
    CompareArrowsOutlinedIcon,
    BuildCircleOutlinedIcon,
    BoltOutlinedIcon,
    AccountTreeOutlined,
    BuildOutlined,
     HubOutlined,
    CloudUploadOutlined,
    FileUploadOutlined,
    ApiOutlined,
    FactCheckOutlined,
    SettingsApplicationsOutlined,
    BugReportOutlined,
    StorageOutlined,
    SchemaOutlined,
    DescriptionOutlined,
    ScheduleOutlined,
    MenuBookOutlined,
    LockResetOutlined,
    HistoryToggleOffOutlined,
    LockOutlined,
    CloudSyncOutlined,
    DnsOutlined,
    HubIcon,
    CategoryIcon,
    AccountTreeIcon,
    SettingsApplicationsIcon,
    BatchPredictionIcon,
    LocalOfferOutlinedIcon,
    CreditCard, 
    Autorenew,
    FolderOpenOutlinedIcon,
    GroupsOutlinedIcon,
    FormatListBulleted, 
    BusinessCenter,
    PeopleAltIcon,
    CallSplitOutlinedIcon,
    AssessmentOutlined,
    ReceiptLongIcon,
};

/* ================= CHECK IF PATH IS IN MENU OR ITS CHILDREN ================= */

const isPathInMenu = (menu, pathname) => {
    if (menu?.path && pathname === menu.path) {
        return true;
    }

    // Check if any children match
    if (menu?.children?.length) {
        for (const child of menu.children) {
            if (isPathInMenu(child, pathname)) {
                return true;
            }
        }
    }

    return false;
};

/* ================= FIND MENU ================= */

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

/* ================= SIDEBAR ================= */
    //const modules = menuJson?.["EARLY-COLLECTIONS"]?.hangingFunctions || [];

const MainSidebar = (flatMenus) => {
    const navigate = useNavigate();
    const location = useLocation();
    const intl = useIntl();
    const [drawerModule, setDrawerModule] = useState(null);
    const modules = flatMenus.flatMenus|| [];

useEffect(() => {
    const handler = (e) => {
        if ((e.metaKey || e.ctrlKey) &&
            e.key.toLowerCase() === "k") {
            e.preventDefault();
            setDrawerModule((prev) => {
                if (prev?.menuId === "__global_search__") {
                    return null;
                }
                return getGlobalSearchModule();
            });
        }
    };
    window.addEventListener("keydown", handler);
    return () => {
        window.removeEventListener("keydown", handler);
    };

}, [modules]);

    const isActive = (mod) => {
        const menu = findMenuById(modules, mod.menuId);
        return isPathInMenu(menu, location.pathname);
    };
  const getLabel = (id,label) =>
    intl.formatMessage({
        id: `label.menu.${id}`,
        defaultMessage: label || id,
    });
    const flattenMenu = (nodes = []) => {
        let result = [];

        nodes.forEach((node) => {
            const children = Array.isArray(node.children)
                ? node.children
                : [];

            if (children.length === 0) {
                result.push({
                    menuId: node.menuId,
                    label: getLabel(node.menuId, node.label ?? node.name),
                    path: node.path,
                    icon: node.icon,
                    description: "MENU",
                });

                return;
            }

            children.forEach((child) => {
                const subChildren = Array.isArray(child.children)
                    ? child.children
                    : [];

                if (subChildren.length === 0) {
                    result.push({
                        menuId: child.menuId,
                        label: getLabel(child.menuId, child.label ?? child.name),
                        path: child.path,
                        icon: child.icon,
                        description: getLabel(node.menuId, node.label ?? node.name),
                    });

                    return;
                }

                subChildren.forEach((sub) => {
                    result.push({
                        menuId: sub.menuId,
                        label: getLabel(sub.menuId, sub.label ?? sub.name),
                        path: sub.path,
                        icon: sub.icon,
                        description: getLabel(child.menuId, child.label ?? child.name),
                    });
                });
            });
        });

        return result;
    };

    const getGlobalSearchModule = () => ({
        menuId: "__global_search__",
        label: "Global Search",
        icon: "SearchOutlinedIcon",
        children: [
            {
                menuId: "all-modules",
                label: "All Modules",
                children: flattenMenu(modules),
            },
        ],
    });

    const handleModuleClick = useCallback(
        (mod) => {
            if (mod.children && mod.children.length > 0) {
                if (drawerModule?.menuId === mod.menuId) {
                    setDrawerModule(null);
                } else {
                    setDrawerModule(mod);
                }
            } else {
                const menu = findMenuById(modules, mod.menuId);

                if (menu?.path) {
                    sessionStorage.setItem(
                        MODULE_GROUP_SESSION_KEY,
                        menu.group || mod.group || ""
                    );
                    sessionStorage.setItem(
                        ACTIVE_MENU_ID_SESSION_KEY,
                        menu.menuId || mod.menuId || ""
                    );
                    navigate(menu.path, {
                        state: {
                            menuId: menu.menuId,
                            parentIds: Array.isArray(menu.parentIds) ? menu.parentIds : [],
                        },
                    });
                    setDrawerModule(null);
                }
            }
        },
        [drawerModule, navigate, modules]
    );

    return (
        <>
            <HBox
                sx={{
                    width: 45,
                    flexShrink: 0,
                    overflow: "hidden",
                    background: "#111827",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    py: 0.8,
                    gap: 0.4,
                    borderRight: "1px solid #1f2937",
                    marginTop: 7,
                }}
            >
                <Tooltip title="Global Search (ctrl+k)" placement="right">
                    <IconButton
                        onClick={() =>
                            setDrawerModule(getGlobalSearchModule())
                        }
                        sx={{
                            width: 38,
                            height: 38,
                            borderRadius: 2,
                            color: "#fff",
                            "&:hover": {
                                bgcolor: "#1f2937",
                            },
                        }}
                    >
                        <SearchOutlinedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Tooltip>

                <HBox
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 0.4,
                        "&::-webkit-scrollbar": {
                            width: 0,
                        },
                       background:"#111827"
                    }}
                >
                    {modules.map((mod) => {
                        const IconComponent =
                            ICONS[mod?.icon] ||
                            SettingsOutlinedIcon;

                        const active =
                            drawerModule?.menuId === mod.menuId ||
                            (!drawerModule && isActive(mod));

                        return (
                            <HBox key={mod.menuId} sx={{ position: "relative" ,background:"#111827"}}>
                                <Tooltip
                                    title={getLabel(mod.menuId,mod.label ?? mod.name)}
                                    placement="right"
                                >
                                    <IconButton
                                        onClick={() =>
                                            handleModuleClick(mod)
                                        }
                                        sx={{
                                            width: 38,
                                            height: 38,
                                            borderRadius: 2,
                                            color: "#fff",
                                            background: active
                                                ? "#2563eb"
                                                : "#111827",
                                            "&:hover": {
                                                background: active
                                                    ? "#2563eb"
                                                    : "#1f2937",
                                            },
                                        }}
                                    >
                                        <IconComponent
                                            sx={{
                                                fontSize: 18,
                                                color: "#fff",
                                            }}
                                        />
                                    </IconButton>
                                </Tooltip>

                                {mod.badge && (
                                    <Badge
                                        badgeContent={mod.badge}
                                        color="error"
                                        sx={{
                                            position: "absolute",
                                            top: 2,
                                            right: 2,
                                        }}
                                    />
                                )}
                            </HBox>
                        );
                    })}
                </HBox>
            </HBox>

            <ModuleDrawer
                key={drawerModule?.menuId || "drawer"}
                open={Boolean(drawerModule)}
                onClose={() => setDrawerModule(null)}
                activeModule={drawerModule}
                menuJson={modules}
                icons={ICONS}
            />
        </>
    );
};

export default MainSidebar;