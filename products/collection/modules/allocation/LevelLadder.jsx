import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  HBox,
  HLabel,
  HDropdown,
  HButton,
  SearchCommonBox,
} from "@helix/component-library";
import { SEARCH_API_ENDPOINTS } from "../../../../shared/config/apiConstants.jsx";
import { newLevel } from "./groupHierarchy.mappers";

const renumber = (rows) => rows.map((r, i) => ({ ...r, level: i + 1 }));

const approverGridDefObj = [
  {
    gridMappingName: "collectorcode",
    gridHeaderDesc: "Collector Code",
    gridHeaderId: "label.search.collector.code",
    gridColumnWidth: 130,
    gridColumnHeight: 20,
  },
  {
    gridMappingName: "szcollectorname",
    gridHeaderDesc: "Collector Name",
    gridHeaderId: "label.search.collector.name",
    gridColumnWidth: 170,
    gridColumnHeight: 20,
  },
];

const LevelLadder = ({ levels, roleOptions = [], onChange, warnings = {} }) => {
  const intl = useIntl();

  const move = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= levels.length) return;
    const copy = [...levels];
    [copy[idx], copy[j]] = [copy[j], copy[idx]];
    onChange(renumber(copy));
  };

  const patch = (id, partial) =>
    onChange(levels.map((l) => (l.id === id ? { ...l, ...partial } : l)));

  const remove = (id) => onChange(renumber(levels.filter((l) => l.id !== id)));

  const add = () => onChange([...levels, newLevel(levels.length + 1)]);

  if (levels.length === 0) {
    return (
      <HBox className="group-hierarchy-ladder-empty">
        <HLabel
          value={intl.formatMessage({
            id: "label.GroupHierarchy.NoLevelsYet",
            defaultMessage: "No levels defined yet.",
          })}
          colon={false}
        />
        <HButton
          label="label.GroupHierarchy.AddFirstLevel"
          onClick={add}
          startIcon={<AddIcon fontSize="small" />}
          size="small"
          variant="outlined"
        />
      </HBox>
    );
  }

  return (
    <HBox className="group-hierarchy-ladder">
      <HBox className="group-hierarchy-ladder-connector" aria-hidden />
      <ul className="group-hierarchy-ladder-list">
        {levels.map((lvl, idx) => {
          const warn = warnings[lvl.id];
          return (
            <li
              key={lvl.id}
              className={`group-hierarchy-ladder-item${warn ? " is-warn" : ""}`}
            >
              <span
                className={`group-hierarchy-ladder-dot${idx === 0 ? " is-top" : ""}`}
                aria-hidden
              />
              <HBox className="group-hierarchy-ladder-card">
                <HBox className="group-hierarchy-ladder-card-body">
                  <HBox className="group-hierarchy-level-badge">
                    <span>{`L${lvl.level}`}</span>
                  </HBox>
                  <HBox className="group-hierarchy-ladder-fields">
                    <HBox className="group-hierarchy-ladder-field">
                      <HLabel
                        value={intl.formatMessage({
                          id: "label.GroupHierarchy.Role",
                          defaultMessage: "Role / Designation",
                        })}
                        colon={false}
                      />
                      <HDropdown
                        id={`gh-role-${lvl.id}`}
                        name={`gh-role-${lvl.id}`}
                        options={roleOptions}
                        value={lvl.roleLabel || ""}
                        onChange={(e) => patch(lvl.id, { roleLabel: e?.target?.value || "" })}
                        placeholder={intl.formatMessage({
                          id: "label.GroupHierarchy.RolePlaceholder",
                          defaultMessage: "Select role",
                        })}
                        width="100%"
                      />
                    </HBox>
                    <HBox className="group-hierarchy-ladder-field">
                      <HLabel
                        value={intl.formatMessage({
                          id: "label.GroupHierarchy.Approver",
                          defaultMessage: "Approver",
                        })}
                        colon={false}
                      />
                      <SearchCommonBox
                        apiEndpoint={SEARCH_API_ENDPOINTS.ALLOCATION()}
                        searchCode="USERCD"
                        selectedValue={lvl.approverUserCode || ""}
                        selectedColumn="collectorcode"
                        gridDefObj={approverGridDefObj}
                        gridWidth={260}
                        gridHeight={220}
                        gridNoOfRowsPerPage={5}
                        searchBoxWidth="100%"
                        searchBoxHeight={28}
                        searchBoxFontSize={12}
                        setSelectedValue={(code, row) => {
                          if (!code && !row && lvl.approverUserCode) {
                            return;
                          }
                          patch(lvl.id, {
                            approverUserCode: code || "",
                            approverName:
                              row?.szcollectorname ||
                              row?.collectorname ||
                              row?.name ||
                              code ||
                              "",
                          });
                        }}
                      />
                    </HBox>
                  </HBox>
                  <HBox className="group-hierarchy-ladder-actions">
                    <button
                      type="button"
                      className="group-hierarchy-icon-btn"
                      disabled={idx === 0}
                      onClick={() => move(idx, -1)}
                      aria-label={intl.formatMessage({
                        id: "label.GroupHierarchy.MoveUp",
                        defaultMessage: "Move up",
                      })}
                    >
                      <ArrowUpwardIcon fontSize="inherit" />
                    </button>
                    <button
                      type="button"
                      className="group-hierarchy-icon-btn"
                      disabled={idx === levels.length - 1}
                      onClick={() => move(idx, 1)}
                      aria-label={intl.formatMessage({
                        id: "label.GroupHierarchy.MoveDown",
                        defaultMessage: "Move down",
                      })}
                    >
                      <ArrowDownwardIcon fontSize="inherit" />
                    </button>
                    <button
                      type="button"
                      className="group-hierarchy-icon-btn is-danger"
                      onClick={() => remove(lvl.id)}
                      aria-label={intl.formatMessage({
                        id: "label.GroupHierarchy.RemoveLevel",
                        defaultMessage: "Remove level",
                      })}
                    >
                      <DeleteOutlineIcon fontSize="inherit" />
                    </button>
                  </HBox>
                </HBox>
                {warn ? (
                  <HBox className="group-hierarchy-ladder-warn">
                    <WarningAmberIcon fontSize="inherit" />
                    <span>{warn}</span>
                  </HBox>
                ) : null}
              </HBox>
            </li>
          );
        })}
      </ul>
      <HBox className="group-hierarchy-ladder-add">
        <HButton
          label="label.GroupHierarchy.AddLevel"
          onClick={add}
          startIcon={<AddIcon fontSize="small" />}
          size="small"
          variant="outlined"
        />
      </HBox>
    </HBox>
  );
};

LevelLadder.propTypes = {
  levels: PropTypes.array.isRequired,
  roleOptions: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  warnings: PropTypes.object,
};

export default LevelLadder;
