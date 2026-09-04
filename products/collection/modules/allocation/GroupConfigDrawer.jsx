import { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import TuneOutlined from "@mui/icons-material/TuneOutlined";
import AccountTreeOutlined from "@mui/icons-material/AccountTreeOutlined";
import FormatListBulletedOutlined from "@mui/icons-material/FormatListBulletedOutlined";
import { HBox, HButton, HTabs, HTab } from "@helix/component-library";
import GroupConfigTab from "./tabs/GroupConfigTab";
import AllocationConfigTab from "./tabs/AllocationConfigTab";
import SubGroupConfigTab from "./tabs/SubGroupConfigTab";

const TABS = [
  {
    key: "group",
    labelId: "label.groupAllocationMaster.tabGroupConfig",
    defaultLabel: "Group Configuration",
    icon: TuneOutlined,
  },
  {
    key: "allocation",
    labelId: "label.groupAllocationMaster.tabAllocationConfig",
    defaultLabel: "Allocation Configuration",
    icon: AccountTreeOutlined,
  },
  {
    key: "subgroups",
    labelId: "label.subGroupAllocationMaster.subGroupConfig",
    defaultLabel: "Sub Group Configuration",
    icon: FormatListBulletedOutlined,
  },
];

const PANEL_STYLE = { height: "100%" };

const getGroupCodeLabel = (groupCode, intl) => {
  if (groupCode && groupCode.trim() !== "") return groupCode;
  return (
    intl.formatMessage({
      id: "label.groupAllocationMaster.newGroup",
      defaultMessage: "New group",
    }) || "New group"
  );
};

const GroupConfigDrawer = ({
  open,
  onClose,
  onSave,
  group,
  hasSubGroups,
  groupTypeOptions,
  allocationTypeOptions,
  onGroupChange,
  allocationRef,
  subGroupRef,
  initialTab = "group",
}) => {
  const intl = useIntl();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [cachedGroup, setCachedGroup] = useState(group);
  const localAllocationRef = useRef(null);
  const localSubGroupRef = useRef(null);

  useEffect(() => {
    if (open) setActiveTab(initialTab);
  }, [open, initialTab, group?.id]);

  useEffect(() => {
    if (group) setCachedGroup(group);
  }, [group]);

  const bindRef = (localRef, externalRef) => (node) => {
    localRef.current = node;
    if (externalRef) externalRef.current = node;
  };

  const bindAllocationRef = bindRef(localAllocationRef, allocationRef);
  const bindSubGroupRef = bindRef(localSubGroupRef, subGroupRef);

  if (!cachedGroup) return null;

  const displayGroup = group || cachedGroup;

  const typeLabel =
    groupTypeOptions.find((o) => o.value === displayGroup.grouptype)?.label ||
    displayGroup.grouptype ||
    "";

  const tabPanels = {
    group: (
      <GroupConfigTab
        group={displayGroup}
        onChange={onGroupChange}
        hasSubGroups={hasSubGroups}
        groupTypeOptions={groupTypeOptions}
        allocationTypeOptions={allocationTypeOptions}
      />
    ),
    allocation: (
      <AllocationConfigTab
        ref={bindAllocationRef}
        selectedGroupCode={displayGroup.groupCode}
      />
    ),
    subgroups: (
      <SubGroupConfigTab
        ref={bindSubGroupRef}
        selectedGroupCode={displayGroup.groupCode}
        parentGroupCode={displayGroup.parentGroupCode}
        groupTypeOptions={groupTypeOptions}
      />
    ),
  };

  return (
    <HBox
      className="group-config-drawer-overlay"
      style={{ display: open ? "flex" : "none" }}
      onClick={onClose}
    >
      <HBox className="group-config-drawer-paper" onClick={(e) => e.stopPropagation()}>
        <HBox className="group-config-drawer-header">
          <HBox className="group-config-drawer-title-row">
            <span className="group-config-drawer-code">
            {getGroupCodeLabel(displayGroup.groupCode, intl)}
            </span>
            {typeLabel ? (
              <span className="group-config-drawer-badge">{typeLabel}</span>
            ) : null}
            {hasSubGroups ? (
              <span className="group-config-drawer-badge is-parent">
                {intl.formatMessage({
                  id: "label.groupAllocationMaster.parentBadge",
                  defaultMessage: "Parent",
                })}
              </span>
            ) : null}
          </HBox>
          <p className="group-config-drawer-desc">
            {displayGroup.groupDescription ||
              intl.formatMessage({
                id: "label.groupAllocationMaster.configureHint",
                defaultMessage:
                  "Configure this group's identity, allocation, and sub-groups.",
              })}
          </p>
        </HBox>

        <HBox className="group-config-drawer-body">
          <HTabs value={activeTab} onChange={(e, val) => setActiveTab(val)} className="group-config-drawer-tabs">
          {TABS.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <HTab
                key={tab.key}
                value={tab.key}
                className={`group-config-drawer-tab${activeTab === tab.key ? " is-active" : ""}`}
                icon={<TabIcon className="group-config-drawer-tab-icon" aria-hidden="true" />}
                iconPosition="start"
                label={intl.formatMessage({
                  id: tab.labelId,
                  defaultMessage: tab.defaultLabel,
                })}
              />
            );
          })}
          </HTabs>

          {TABS.map((tab) => (
            <HBox
              key={`panel-${tab.key}`}
              style={{ ...PANEL_STYLE, display: activeTab === tab.key ? "block" : "none" }}
            >
              {tabPanels[tab.key]}
            </HBox>
          ))}
        </HBox>

        <HBox className="group-config-drawer-footer">
          <HButton
            label={intl.formatMessage({
              id: "label.groupAllocationMaster.save",
              defaultMessage: "Save",
            })}
            onClick={onSave}
          />
        </HBox>
      </HBox>
    </HBox>
  );
};

GroupConfigDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  group: PropTypes.object,
  hasSubGroups: PropTypes.bool,
  groupTypeOptions: PropTypes.array,
  allocationTypeOptions: PropTypes.array,
  onGroupChange: PropTypes.func.isRequired,
  allocationRef: PropTypes.shape({ current: PropTypes.any }),
  subGroupRef: PropTypes.shape({ current: PropTypes.any }),
  initialTab: PropTypes.string,
};

GroupConfigDrawer.defaultProps = {
  group: null,
  hasSubGroups: false,
  groupTypeOptions: [],
  allocationTypeOptions: [],
  allocationRef: null,
  subGroupRef: null,
  initialTab: "group",
};

export default GroupConfigDrawer;
