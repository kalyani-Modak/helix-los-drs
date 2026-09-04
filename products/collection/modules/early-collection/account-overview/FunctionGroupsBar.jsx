import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Menu, MenuItem, Typography, Divider } from "@mui/material";
import {
  Phone,
  Tag,
  Group,
  PersonAdd,
  LocalShipping,
  Refresh,
  Mail,
  MailOutline,
  StickyNote2,
  ManageAccounts,
  AddLocationAlt,
  Description,
  DirectionsCar,
  ListAlt,
  Inventory2,
  PieChart,
  Upload,
  Shield,
  TrendingUp,
  WarningAmber,
  AccountBalance,
  CreditCard,
  Payments,
  Schedule,
  AccountBalanceWallet,
  Block,
  List,
  PlayArrow,
  HelpOutline,
  Forum,
  History,
  HeadsetMic,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { useColorTheme } from "../../../../../apps/debt-recovery-shell/src/themeSelectionConfig";
import { HBox, HAxiosService } from "@helix/component-library";

import { FunctionFrameworkAPI } from "../apiEndpoints";
import CircularProgress from '@mui/material/CircularProgress';
import ShortCut from "./ShortCut";
import CommandPalette from "./CommandPalette";

const MODULE_GROUP_SESSION_KEY = "SEC_MODULE_GROUP";
const ACTIVE_MENU_ID_SESSION_KEY = "SEC_ACTIVE_MENU_ID";

const ICON_MAP = {
  Phone,
  Tag,
  Group,
  PersonAdd,
  LocalShipping,
  Refresh,
  Mail,
  MailOutline,
  StickyNote2,
  ManageAccounts,
  AddLocationAlt,
  Description,
  DirectionsCar,
  ListAlt,
  Inventory2,
  PieChart,
  Upload,
  Shield,
  TrendingUp,
  WarningAmber,
  AccountBalance,
  CreditCard,
  Payments,
  Schedule,
  AccountBalanceWallet,
  Block,
  List,
  PlayArrow,
  HelpOutline,
  Forum,
  History,
  HeadsetMic,
};

const addParentIdsToMenus = (menus = []) => {
  const traverse = (nodes = [], parentIds = []) =>
    nodes.map((node) => {
      const current = { ...node, parentIds };
      const nextParentIds = node.funId ? [...parentIds, node.funId] : parentIds;

      return {
        ...current,
        children: Array.isArray(node.children) ? traverse(node.children, nextParentIds) : node.children,
        hangingFunctions: Array.isArray(node.hangingFunctions)
          ? traverse(node.hangingFunctions, nextParentIds)
          : node.hangingFunctions,
      };
    });

  return traverse(menus, []);
};
/**
 * @param {{ embedded?: boolean }} props
 * When embedded (e.g. inside Account header chrome), omit outer bottom border so the parent section frame reads as one unit.
 */
export default function FunctionGroupsBar({ embedded = false }) {
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const [menu, setMenu] = useState(null);
  const { colors } = useColorTheme();
  const { selectedRow } = useSelector((s) => s.account);
  const [functionMenus, setFunctionMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const intl = useIntl();

  useEffect(() => {
    setLoading(true);
    HAxiosService.POST(
      FunctionFrameworkAPI.fetchMenuFunctionJson(),
      {},
      {},
      false,
      { "X-Menu-Id": "EC-ListView" }
    )
      .then((res) => {
        if (res.data?.status === "SUCCESS" && res.data?.responseJson) {
          const menus = addParentIdsToMenus(res.data.responseJson || []);
          setFunctionMenus(menus);
        } else {
          console.error("Menu function response error", res);
        }
      })
      .catch((err) => {
        console.error("Menu function error", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const activeItem = useMemo(() => {
    const candidates = functionMenus.flatMap((group) =>
      (group.children || []).map((item) => ({
        funId: item.funId,
        route: item?.path,
      }))
    );

    const routeMatch = candidates.find((candidate) => {
      return (
        candidate.route &&
        typeof candidate.route === "string" &&
        pathname.includes(candidate.route.replace("/homelayout/", ""))
      );
    });

    if (routeMatch) return routeMatch.funId;

    const funIdMatch = candidates.find((candidate) => pathname.includes(candidate.funId));
    return funIdMatch?.funId || null;
  }, [pathname, functionMenus]);

  const open = Boolean(menu);
  const handleClose = () => setMenu(null);

  const shortcuts = useMemo(() => {
    return functionMenus.flatMap((group) =>
      (group.children || [])
        .filter((item) => item?.shortcutKey && item?.path)
        .map((item) => ({
          funId: item.funId,
          label: item.label,
          keyCombination: item.shortcutKey,
          path: item.path,
          parentIds: item.parentIds || [],
        }))
    );
  }, [functionMenus]);

  const navigateToPath = useCallback(
    (itemOrPath) => {
      if (!itemOrPath) return;
      handleClose();

      if (typeof itemOrPath === "string") {
        navigate(itemOrPath, { state });
        return;
      }

      const { path, funId, parentIds } = itemOrPath;
      if (!path) return;
      sessionStorage.setItem(MODULE_GROUP_SESSION_KEY, "EARLY-COLLECTIONS");
      sessionStorage.setItem(ACTIVE_MENU_ID_SESSION_KEY, funId || "");
      navigate(path, {
        state: {
          ...state,
          menuId: funId,
          parentIds: Array.isArray(parentIds) ? ["List View", ...parentIds] : [],
        },
      });
    },
    [navigate, state]
  );

  const selectItem = (item) => {
    const path = item?.path;
    handleClose();
    if (path) {
      sessionStorage.setItem(MODULE_GROUP_SESSION_KEY, "EARLY-COLLECTIONS");
      sessionStorage.setItem(ACTIVE_MENU_ID_SESSION_KEY, item.funId || "");
      navigate(path, {
        state: {
          ...state,
          menuId: item.funId,
          parentIds: ["List View", ...(Array.isArray(item.parentIds) ? item.parentIds : [])],
        },
      });
    }
  };

  return (
    <HBox
      sx={{
        flexShrink: 0,
        ...(embedded
          ? {}
          : {
              borderBottom: 1,
              borderColor: "divider",
            }),
        px: 1.5,
        py: 0.5,
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        flexWrap: "wrap",
      }}
    >
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" width="100%">
          <CircularProgress size={22} />
        </Box>
      ) : (functionMenus && functionMenus.map((group) => {
        const GroupIcon = ICON_MAP[group.icon] || HelpOutline;
        const hasActive = (group.children || []).some((i) => i.funId === activeItem);
        return (
          <React.Fragment key={group.funId}>
            <Button
              size="small"
              variant="text"
              onClick={(e) => setMenu({ groupId: group.funId, anchorEl: e.currentTarget })}
              startIcon={<GroupIcon sx={{ fontSize: 14, color: hasActive ? colors?.text?.white : "inherit" }} />}
              endIcon={<KeyboardArrowDown sx={{ fontSize: 14, opacity: 0.6, color: hasActive ? colors?.text?.white : "inherit" }} />}
              sx={{
                textTransform: "none",
                fontSize: 12,
                minHeight: 28,
                px: 1,
                borderRadius: 1,
                color: hasActive ? colors?.text?.white : "inherit",
                background: hasActive
                  ? colors?.gradients?.primary || colors?.primary || "primary.main"
                  : "transparent",
                boxShadow: hasActive ? `0 2px 8px ${colors?.primary}44` : "none",
                "&:hover": {
                  background: hasActive
                    ? colors?.gradients?.primaryHover || colors?.primaryDark
                    : undefined,
                },
              }}
            >
              {intl.formatMessage({
                id: `label.menu.${group.funId}`,
                defaultMessage: `${group.label}`,
              })}
            </Button>
            <Menu
              anchorEl={menu?.groupId === group.funId ? menu.anchorEl : null}
              open={open && menu?.groupId === group.funId}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              slotProps={{ paper: { sx: { minWidth: 200, mt: 0.5 } } }}
              MenuListProps={{ dense: true }}
            >
              {(group.children || []).map((item) => {
                const ItemIcon = ICON_MAP[item.icon] || HelpOutline;
                const isActiveFunction = item?.Active;
                const isFunctionHidden = item?.Hide;
                const route = item?.path;
                const isActive = activeItem === item.funId;
                if (isFunctionHidden === "Y") {
                  return null;
                }
                return (
                  <MenuItem
                    key={item.funId}
                    disabled={!route || isActiveFunction == 'N' ? true : false}
                    onClick={() => selectItem(item)}
                    selected={isActive}
                    sx={{ fontSize: 12, gap: 1, py: 0.75 }}
                  >
                    <ItemIcon sx={{ fontSize: 16, color: isActive ? "primary.main" : "text.secondary" }} />
                    {intl.formatMessage({
                      id: `label.menu.${item.funId}`,
                      defaultMessage: `${item.label}`,
                    })}
                  </MenuItem>
                );
              })}
            </Menu>
          </React.Fragment>
        );
      })
      )}
      <Box sx={{ flex: 1 }} />
      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, display: { xs: "none", md: "block" } }} />
      <ShortCut shortcuts={shortcuts} onNavigate={navigateToPath} />
      <CommandPalette functionMenus={functionMenus} onNavigate={navigateToPath} />
    </HBox>
  );
}
