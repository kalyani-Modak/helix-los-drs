import React, { useEffect, useRef, useState, useMemo } from "react";
import { DialogContent, Divider, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Search, KeyboardOutlined, HelpOutline, Phone, Tag, Group, PersonAdd, LocalShipping, Refresh, Mail, MailOutline, StickyNote2, ManageAccounts, AddLocationAlt, Description, DirectionsCar, ListAlt, Inventory2, PieChart, Upload, Shield, TrendingUp, WarningAmber, AccountBalance, CreditCard, Payments, Schedule, AccountBalanceWallet, Block, List as ListIcon, PlayArrow, Forum, History, HeadsetMic} from "@mui/icons-material";
import { HBox, HLabel, HTextField, HDialog } from "@helix/component-library";

// ─── Icon map (mirrors FunctionGroupsBar) ────────────────────────────────────
const ICON_MAP = { Phone, Tag, Group, PersonAdd, LocalShipping, Refresh, Mail, MailOutline, StickyNote2, ManageAccounts, AddLocationAlt, Description, DirectionsCar, ListAlt, Inventory2, PieChart, Upload, Shield, TrendingUp, WarningAmber, AccountBalance, CreditCard, Payments, Schedule, AccountBalanceWallet, Block, List: ListIcon, PlayArrow, HelpOutline, Forum, History, HeadsetMic };
import { useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
/**
 * CommandPalette
 *
 * A keyboard-driven quick-search overlay for all function-group items.
 *
 * @param {{ functionMenus: Array, onNavigate: Function }} props
 *   - `functionMenus` – same shape as the menus loaded in FunctionGroupsBar
 *   - `onNavigate`    – same navigateToPath callback from FunctionGroupsBar
 *
 * Toggle with Ctrl+Space (or ⌘+Space). Close with Escape.
 */
export default function CommandPalette({ functionMenus = [], onNavigate }) {
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const listRef = useRef(null);
    const intl = useIntl();


    // Flatten all menu items with their group label for display
    const allItems = useMemo(() => {
        return functionMenus.flatMap((group) =>
            (group.children || [])
                .filter((item) => item?.Hide !== "Y" && item?.path)
                .map((item) => ({
                    ...item,
                    groupLabel: group.label,
                    groupIcon: group.icon,
                }))
        );
    }, [functionMenus]);

    // Filter based on search query
    const filtered = useMemo(() => {
        const q = query.toLowerCase();
        if (!q) return allItems;
        return allItems.filter(
            (item) =>
                item.label?.toLowerCase().includes(q) ||
                item.groupLabel?.toLowerCase().includes(q)
        );
    }, [allItems, query]);

    // Global keyboard toggle
    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.code === "Space") {
                e.preventDefault();
                setOpen((prev) => !prev);
                setQuery("");
                setSelectedIndex(0);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    // Focus input when dialog opens
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 80);
        }
    }, [open]);

    // Reset selection on query change
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);
    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    // Scroll selected item into view
    useEffect(() => {
        if (listRef.current) {
            const el = listRef.current.children[selectedIndex];
            el?.scrollIntoView({ block: "nearest" });
        }
    }, [selectedIndex]);

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter" && filtered[selectedIndex]) {
            e.preventDefault();
            handleSelect(filtered[selectedIndex]);
        }
    };

    const handleSelect = (item) => {
        onNavigate?.(item);
        setOpen(false);
    };

    const handleClose = () => setOpen(false);
    return (
        <>
            {/* Palette dialog */}
            <HDialog
                disableContentWrapper
                open={open}
                onClose={handleClose}
                maxWidth="xs"
                fullWidth
                scroll="paper"
                aria-label="Command palette"
                slotProps={{
                    backdrop: {
                        sx: { backdropFilter: "blur(3px)", backgroundColor: "rgba(0, 0, 0, 0.35)" },
                    },
                    paper: {
                        sx: {
                            m: 0,
                            borderRadius: 2,
                            border: 1,
                            borderColor: "divider",
                            overflow: "hidden",
                            boxShadow: 8,
                        },
                    },
                }}
                sx={{
                    "& .MuiDialog-container": {
                        alignItems: "flex-start",   // <-- don't center vertically
                        paddingTop: "15vh",         // <-- fixed top position
                    },
                }}
            >
                {/* Search input */}
                <HBox
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 1.5,
                        py: 1,
                        pb: 2,
                        borderBottom: 1,
                        borderColor: "divider",
                        bgcolor: "background.paper",
                    }}
                >
                    <HTextField
                        inputRef={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search functions…"
                        translate={false}
                        editable
                        fullWidth
                        sx={{
                            fontSize: 13,
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "transparent",
                                backgroundImage: "none",
                                boxShadow: "none",
                                "& fieldset": { border: "none" },
                                "&:hover fieldset": { border: "none" },
                                "&:hover": { backgroundColor: "transparent", backgroundImage: "none", boxShadow: "none" },
                                "&.Mui-focused fieldset": { border: "none" },
                                "&.Mui-focused": { backgroundColor: "transparent", backgroundImage: "none", boxShadow: "none" },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <Search sx={{ fontSize: 18, color: "text.disabled", mr: 0.5 }} />
                            ),
                        }}
                    />
                    <HLabel colon={false} value={intl.formatMessage({
                        id: "label.commandPalette.Esc",
                        defaultMessage: "ESC",
                    })}
                        sx={{
                            flexShrink: 0,
                            px: 0.75,
                            py: 0.25,
                            mt: 1,
                            borderRadius: 0.5,
                            border: 1,
                            borderColor: "divider",
                            bgcolor: "action.hover",
                            color: "text.secondary",
                            fontSize: 10,
                            fontFamily: "monospace",
                        }}
                    />

                </HBox>

                {/* Results list */}
                <DialogContent sx={{ p: 0, maxHeight: 280, overflow: "auto" }}>
                    {filtered.length === 0 ? (
                        <HBox
                            sx={{
                                py: 1,
                                textAlign: "center",
                            }}
                        >
                            <HLabel colon={false} value={intl.formatMessage({
                                id: "label.commandPalette.noResults",
                                defaultMessage: "No matching functions found.",
                            })}
                                sx={{ color: `text.disabled`, p: 0, ml: 2 }} align="left"
                            />
                        </HBox>
                    ) : (
                        <List ref={listRef} dense disablePadding>
                            {filtered.map((item, i) => {
                                const ItemIcon = ICON_MAP[item.icon] || HelpOutline;
                                const isSelected = i === selectedIndex;
                                return (
                                    <ListItemButton
                                        key={`${item.funId}-${i}`}
                                        selected={isSelected}
                                        onClick={() => handleSelect(item)}
                                        disabled={item.Active === "N"}
                                        sx={{
                                            px: 1.5,
                                            py: 0.75,
                                            gap: 1,
                                            "&.Mui-selected": {
                                                bgcolor: (t) => `${t.palette.primary.main}14`,
                                                "& .MuiListItemIcon-root": { color: "primary.main" },
                                                "& .MuiListItemText-primary": { color: "primary.main" },
                                            },
                                            "&.Mui-selected:hover": {
                                                bgcolor: (t) => `${t.palette.primary.main}1e`,
                                            },
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 28, color: "text.secondary" }}>
                                            <ItemIcon sx={{ fontSize: 15 }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={intl.formatMessage({
                                                id: `label.menu.${item.funId}`,
                                                defaultMessage: `${item.label}`,
                                            })}
                                            slotProps={{
                                                primary: { sx: { fontSize: 12, fontWeight: 500 } },
                                            }}
                                        />

                                        {/* Shortcut badge */}
                                        <HBox
                                            sx={{
                                                width: 60,
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                flexShrink: 0,
                                                backgroundColor: "transparent",
                                            }}
                                        >
                                            {item.shortcutKey && (
                                                <HLabel colon={false} value={item.shortcutKey}
                                                    sx={{
                                                        flexShrink: 0,
                                                        px: 0.75,
                                                        py: 0.25,
                                                        borderRadius: 0.5,
                                                        border: 1,
                                                        borderColor: "divider",
                                                        bgcolor: "action.hover",
                                                        color: "text.secondary",
                                                        fontSize: 10,
                                                        fontFamily: "monospace",
                                                    }}
                                                />
                                            )}
                                        </HBox>
                                        {/* Group badge */}
                                        <HLabel colon={false}
                                            value={intl.formatMessage({
                                                id: `label.menu.${item.parentIds[0]}`,
                                                defaultMessage: `${item.groupLabel}`,
                                            })}
                                            sx={{
                                                flexShrink: 0,
                                                width: 100,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                textAlign: "center",
                                                px: 0.75,
                                                py: 0.25,
                                                borderRadius: 0.5,
                                                bgcolor: "action.hover",
                                                color: "text.secondary",
                                                fontSize: 10,
                                                border: 1,
                                                borderColor: "divider",
                                            }}
                                        />
                                    </ListItemButton>
                                );
                            })}
                        </List>
                    )}
                </DialogContent>

                {/* Footer hint */}
                <Divider />
                <HBox
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        px: 1.5,
                        py: 0.75,
                        bgcolor: "action.hover",
                    }}
                >
                    <HBox
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            color: "text.disabled",
                            backgroundColor: "transparent",
                        }}
                    >
                        <KeyboardOutlined sx={{ fontSize: 11 }} />
                        <HLabel colon={false} value={intl.formatMessage({
                            id: "label.commandPalette.navigate",
                            defaultMessage: "Navigate: ↑↓",
                        })}
                            sx={{ fontSize: 10 }}
                        />
                    </HBox>
                    <HLabel colon={false} value={intl.formatMessage({
                        id: "label.commandPalette.enter",
                        defaultMessage: "Select: Enter",
                    })}
                        sx={{ fontSize: 10 }}
                    />
                    <HLabel colon={false} value={intl.formatMessage({
                        id: "label.commandPalette.close",
                        defaultMessage: "Close: Esc",
                    })}
                        sx={{ fontSize: 10 }}
                    />
                    <HLabel colon={false} value={intl.formatMessage({
                        id: "label.commandPalette.toggle",
                        defaultMessage: "Ctrl+Space to toggle",
                    })}
                        sx={{ fontSize: 10, ml: "auto" }}
                    />
                </HBox>
            </HDialog>
        </>
    );
}
