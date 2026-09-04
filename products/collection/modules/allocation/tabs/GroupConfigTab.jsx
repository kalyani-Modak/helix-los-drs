import PropTypes from "prop-types";
import { useRef } from "react";
import { useIntl } from "react-intl";
import { HBox, HLabel, HTextField, HDropdown, HToggle, SearchCommonBox } from "@helix/component-library";
import { SEARCH_API_ENDPOINTS } from "../../../../../shared/config/apiConstants.jsx";

const gridSupervisorCodeDefObj = [
  {
    gridMappingName: "collectorcode",
    gridHeaderDesc: "Collector Code",
    gridHeaderId: "label.search.collector.code",
    gridColumnWidth: 180,
    gridColumnHeight: 20,
  },
  {
    gridMappingName: "collectorname",
    gridHeaderDesc: "Collector Name",
    gridHeaderId: "label.search.collector.name",
    gridColumnWidth: 350,
    gridColumnHeight: 20,
  },
];

const toSafeString = (value) => {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "object") {
    if (typeof value.label === "string") return value.label;
    if (typeof value.value === "string") return value.value;
    return "";
  }
  return "";
};

const normalizeSearchValue = (value) => {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "object") {
    if (typeof value.value === "string") return value.value;
    if (typeof value.code === "string") return value.code;
    if (typeof value.collectorcode === "string") return value.collectorcode;
    return "";
  }
  return "";
};

const buildOptions = (intl, emptyId, emptyDefault, options) => [
  {
    value: "",
    label: intl.formatMessage({ id: emptyId, defaultMessage: emptyDefault }),
  },
  ...options.map((opt) => ({
    value: toSafeString(opt?.value),
    label: toSafeString(opt?.label),
  })),
];

const GroupConfigTab = ({
  group,
  onChange,
  hasSubGroups,
  groupTypeOptions,
  allocationTypeOptions,
}) => {
  const intl = useIntl();
  const searchInitRef = useRef({
    groupId: null,
    supervisor: false,
  });

  if (!group) return null;

  if (searchInitRef.current.groupId !== group.id) {
    searchInitRef.current = {
      groupId: group.id,
      supervisor: false,
    };
  }

  const patch = (field, value) => {
    onChange({
      ...group,
      [field]: value,
      mode: group.mode === "N" ? "N" : "E",
    });
  };

  const typeOptions = buildOptions(
    intl,
    "label.groupAllocationMaster.selectType",
    "Select type",
    groupTypeOptions
  );

  const allocOptions = buildOptions(
    intl,
    "label.groupAllocationMaster.selectAllocationType",
    "Select allocation type",
    allocationTypeOptions
  );

  return (
    <HBox className="group-config-tab">
      <HBox className="group-config-parent-banner">
        <HBox style={{ backgroundColor: "transparent" }}>
          <HBox className="group-config-parent-banner-label" style={{ backgroundColor: "transparent" }}>
            {intl.formatMessage({
              id: "label.groupAllocationMaster.parent",
              defaultMessage: "Parent",
            })}
          </HBox>
          <HBox className="group-config-parent-banner-hint" style={{ backgroundColor: "transparent" }}>
            {intl.formatMessage({
              id: "label.groupAllocationMaster.parentHint",
              defaultMessage: "System-derived from sub-group configuration",
            })}
          </HBox>
        </HBox>
        <span className={`group-config-drawer-badge${hasSubGroups ? " is-parent" : ""}`}>
          {hasSubGroups
            ? intl.formatMessage({
              id: "label.groupAllocationMaster.parentYes",
              defaultMessage: "Yes · Parent",
            })
            : intl.formatMessage({
              id: "label.groupAllocationMaster.parentNo",
              defaultMessage: "No · Standalone",
            })}
        </span>
      </HBox>

      <HBox className="group-config-section">
        <h3 className="group-config-section-title">
          {intl.formatMessage({
            id: "label.groupAllocationMaster.identity",
            defaultMessage: "Identity",
          })}
        </h3>

        <HBox className="group-config-field-grid">
          <HBox className="group-config-field">
            <HLabel
              className="group-config-field-label"
              value={intl.formatMessage({
                id: "label.groupAllocationMaster.groupCode",
                defaultMessage: "Group Code",
              })}
              required
              align="left"
            />
            <HTextField
              id="group-config-code"
              value={toSafeString(group.groupCode)}
              editable={group.mode === "N"}
              required
              width="100%"
              onChange={(e) =>
                patch("groupCode", (e.target.value || "").toUpperCase())
              }
            />
          </HBox>

          <HBox className="group-config-field">
            <HLabel
              className="group-config-field-label"
              value={intl.formatMessage({
                id: "label.groupAllocationMaster.description",
                defaultMessage: "Description",
              })}
              required
              align="left"
            />
            <HTextField
              id="group-config-description"
              value={toSafeString(group.groupDescription)}
              editable
              required
              width="100%"
              onChange={(e) => patch("groupDescription", e.target.value)}
            />
          </HBox>

          <HBox className="group-config-field">
            <HLabel
              className="group-config-field-label"
              value={intl.formatMessage({
                id: "label.groupAllocationMaster.groupType",
                defaultMessage: "Group Type",
              })}
              required
              align="left"
            />
            <HDropdown
              name="groupType"
              value={toSafeString(group.grouptype)}
              onChange={(e) => patch("grouptype", e.target.value)}
              options={typeOptions}
              width="100%"
              required
            />
          </HBox>

          <HBox className="group-config-field">
            <HLabel
              className="group-config-field-label"
              value={intl.formatMessage({
                id: "label.groupAllocationMaster.supervisor",
                defaultMessage: "Supervisor",
              })}
              required
              align="left"
            />
            <SearchCommonBox
              apiEndpoint={SEARCH_API_ENDPOINTS.ALLOCATION()}
              searchCode="SUPERVISORCD"
              selectedValue={normalizeSearchValue(group.supervisor)}
              selectedColumn="collectorcode"
              gridDefObj={gridSupervisorCodeDefObj}
              gridWidth={450}
              gridHeight={300}
              gridNoOfRowsPerPage={5}
              searchBoxWidth={280}
              searchBoxHeight={28}
              searchBoxFontSize={11}
              error={false}
              setSelectedValue={(dataValue) => {
                if (!searchInitRef.current.supervisor) {
                  searchInitRef.current.supervisor = true;
                  return;
                }
                patch("supervisor", normalizeSearchValue(dataValue));
              }}
            />
          </HBox>

          <HBox className="group-config-field">
            <HLabel
              className="group-config-field-label"
              value={intl.formatMessage({
                id: "label.groupAllocationMaster.priority",
                defaultMessage: "Priority",
              })}
              align="left"
            />
            <HTextField
              id="group-config-priority"
              type="number"
              value={toSafeString(group.priority)}
              editable
              width="100%"
              onChange={(e) => patch("priority", e.target.value)}
            />
          </HBox>

          <HBox className="group-config-field">
            <HLabel
              className="group-config-field-label"
              value={intl.formatMessage({
                id: "label.groupAllocationMaster.level",
                defaultMessage: "Level",
              })}
              align="left"
            />
            <HTextField
              id="group-config-level"
              type="number"
              value={toSafeString(group.level)}
              editable
              width="100%"
              onChange={(e) => patch("level", e.target.value)}
            />
          </HBox>

          <HBox className="group-config-field">
            <HLabel
              className="group-config-field-label"
              value={intl.formatMessage({
                id: "label.groupAllocationMaster.allocationType",
                defaultMessage: "Allocation Type",
              })}
              required
              align="left"
            />
            <HDropdown
              name="allocationType"
              value={toSafeString(group.allocationtype)}
              onChange={(e) => patch("allocationtype", e.target.value)}
              options={allocOptions}
              width="100%"
              required
            />
          </HBox>

          {group.parentGroupCode ? (
            <HBox className="group-config-field">
              <HLabel
                className="group-config-field-label"
                value={intl.formatMessage({
                  id: "label.groupAllocationMaster.parentGroupCode",
                  defaultMessage: "Parent Group Code",
                })}
                align="left"
              />
              <HTextField
                id="group-config-parent"
                value={toSafeString(group.parentGroupCode)}
                editable={false}
                width="100%"
              />
            </HBox>
          ) : null}
        </HBox>

        <HBox className="group-config-toggles">
          <HBox className="group-config-toggle-item">
            <span className="group-config-field-label">
              {intl.formatMessage({
                id: "label.groupAllocationMaster.active",
                defaultMessage: "Active",
              })}
            </span>
            <HToggle
              checked={!!group.activeYn}
              onChange={(e) => patch("activeYn", e.target.checked)}
            />
          </HBox>
          <HBox className="group-config-toggle-item">
            <span className="group-config-field-label">
              {intl.formatMessage({
                id: "label.groupAllocationMaster.exceptionGroup",
                defaultMessage: "Exception",
              })}
            </span>
            <HToggle
              checked={!!group.exceptiongroup}
              onChange={(e) => patch("exceptiongroup", e.target.checked)}
            />
          </HBox>
        </HBox>
      </HBox>
    </HBox>
  );
};

GroupConfigTab.propTypes = {
  group: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  hasSubGroups: PropTypes.bool,
  groupTypeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  allocationTypeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
};

GroupConfigTab.defaultProps = {
  group: null,
  hasSubGroups: false,
  groupTypeOptions: [],
  allocationTypeOptions: [],
};

export default GroupConfigTab;
