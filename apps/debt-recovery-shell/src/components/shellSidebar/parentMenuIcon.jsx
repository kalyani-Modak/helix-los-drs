import React from "react";
import {
  Dashboard as DashboardIcon,
  Hub as HubIcon,
  Layers as LayersIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  ViewModule as ViewModuleIcon,
  AccountTree as AccountTreeIcon,
} from "@mui/icons-material";

const FRAGMENTS = [
  { re: /configuration|settings|config/i, Icon: SettingsIcon },
  { re: /workflow|registry|bpmn/i, Icon: AccountTreeIcon },
  { re: /cni|network/i, Icon: HubIcon },
  { re: /security|auth/i, Icon: SecurityIcon },
  { re: /user|people|admin/i, Icon: PeopleIcon },
  { re: /dashboard|home/i, Icon: DashboardIcon },
  { re: /portfolio|layer|module/i, Icon: LayersIcon },
];

/**
 * @param {string} parentMenu
 * @returns {React.ElementType}
 */
export function getParentMenuIcon(parentMenu) {
  const label = parentMenu || "";
  for (const { re, Icon } of FRAGMENTS) {
    if (re.test(label)) return Icon;
  }
  return ViewModuleIcon;
}
