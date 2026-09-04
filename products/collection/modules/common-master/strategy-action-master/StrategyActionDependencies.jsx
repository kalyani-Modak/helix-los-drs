import React, { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { HBox, HButton } from "@helix/component-library";
import {
  getTypeShortForRow,
  splitActionTokens,
} from "./strategyActionMaster.mappers";

const TypeBadge = ({ actionType, actionTypeOptions }) => {
  const short = getTypeShortForRow(actionType, actionTypeOptions);
  if (!short) return null;
  return (
    <span className="strategy-action-master-deps-type-badge">{short}</span>
  );
};

const StrategyActionDependencies = ({ rows, actionTypeOptions, onToggleDependency }) => {
  const intl = useIntl();
  const [focusCode, setFocusCode] = useState(null);

  const focusRow = useMemo(
    () => rows.find((row) => row.szActionCode === focusCode) || null,
    [rows, focusCode],
  );

  const focusDependsOn = splitActionTokens(focusRow?.szDependsOn);
  const focusSuccessors = splitActionTokens(focusRow?.szSuccessors);

  const getCellState = (row, column) => {
    const rowCode = row.szActionCode;
    const colCode = column.szActionCode;
    if (!rowCode || !colCode || rowCode === colCode) {
      return "self";
    }

    const dependsOn = splitActionTokens(row.szDependsOn);

    if (dependsOn.includes(colCode)) return "dependency";
    if (focusCode === rowCode && dependsOn.includes(colCode)) return "transitive";
    return "empty";
  };

  return (
    <HBox className="strategy-action-master-deps">
      <HBox className="strategy-action-master-deps-legend">
        <span className="strategy-action-master-deps-legend-item">
          <span className="strategy-action-master-deps-swatch is-dependency" />
          {intl.formatMessage({
            id: "label.StrategyActionMaster.deps.legend.dependency",
            defaultMessage: "Direct dependency",
          })}
        </span>
        <span className="strategy-action-master-deps-legend-hint">
          {intl.formatMessage({
            id: "label.StrategyActionMaster.deps.legend.hint",
            defaultMessage:
              "Layout preview only. Dependency editing is available in Grid and Detail views.",
          })}
        </span>
        {/* Export button moved to main toolbar; keep legend only */}
      </HBox>

      <HBox className="strategy-action-master-deps-body">
        <HBox className="strategy-action-master-deps-matrix-wrap">
          {rows.length === 0 ? (
            <p className="strategy-action-master-deps-empty">
              {intl.formatMessage({
                id: "label.StrategyActionMaster.deps.noActions",
                defaultMessage: "No strategy actions to display.",
              })}
            </p>
          ) : (
            <table className="strategy-action-master-deps-matrix">
              <thead>
                <tr>
                  <th className="strategy-action-master-deps-corner">
                    {intl.formatMessage({
                      id: "label.StrategyActionMaster.deps.matrixCorner",
                      defaultMessage: "Action ↓ / depends on →",
                    })}
                  </th>
                  {rows.map((column) => (
                    <th
                      key={column.id}
                      className={`strategy-action-master-deps-col-header${
                        focusCode === column.szActionCode ? " is-focus" : ""
                      }`}
                    >
                      <span className="strategy-action-master-deps-code">
                        {column.szActionCode || "—"}
                      </span>
                      <TypeBadge
                        actionType={column.szActionType}
                        actionTypeOptions={actionTypeOptions}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr
                    key={row.id}
                    className={focusCode === row.szActionCode ? "is-focus-row" : ""}
                  >
                    <th
                      className="strategy-action-master-deps-row-header"
                      onClick={() =>
                        setFocusCode(
                          focusCode === row.szActionCode ? null : row.szActionCode,
                        )
                      }
                    >
                      <span className="strategy-action-master-deps-code">
                        {row.szActionCode || "—"}
                      </span>
                      <TypeBadge
                        actionType={row.szActionType}
                        actionTypeOptions={actionTypeOptions}
                      />
                    </th>
                    {rows.map((column) => {
                      const state = getCellState(row, column);
                      return (
                        <td
                          key={`${row.id}-${column.id}`}
                          className={`strategy-action-master-deps-cell is-${state}${
                            rowIndex % 2 ? " is-alt" : ""
                          }`}
                          onClick={() => {
                            if (onToggleDependency && state !== "self") {
                              onToggleDependency(row.szActionCode, column.szActionCode);
                            }
                          }}
                        >
                          {state === "self"
                            ? "—"
                            : state === "dependency"
                              ? "D"
                              : ""}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </HBox>

        <aside className="strategy-action-master-deps-aside">
          {!focusRow ? (
            <p className="strategy-action-master-deps-aside-empty">
              {intl.formatMessage({
                id: "label.StrategyActionMaster.deps.selectAction",
                defaultMessage:
                  "Click an action row label to inspect its dependency chain.",
              })}
            </p>
          ) : (
            <>
              <HBox className="strategy-action-master-deps-aside-header">
                <span className="strategy-action-master-deps-code">
                  {focusRow.szActionCode}
                </span>
                <TypeBadge
                  actionType={focusRow.szActionType}
                  actionTypeOptions={actionTypeOptions}
                />
              </HBox>
              <p className="strategy-action-master-deps-aside-desc">
                {focusRow.szDescription || "—"}
              </p>

              <div className="strategy-action-master-deps-aside-block">
                <div className="strategy-action-master-deps-aside-label">
                  {intl.formatMessage({
                    id: "label.StrategyActionMaster.deps.predecessors",
                    defaultMessage: "Predecessors",
                  })}
                </div>
                {focusDependsOn.length === 0 ? (
                  <span className="strategy-action-master-deps-aside-none">
                    {intl.formatMessage({
                      id: "label.StrategyActionMaster.deps.none",
                      defaultMessage: "None",
                    })}
                  </span>
                ) : (
                  <HBox className="strategy-action-master-deps-chip-row">
                    {focusDependsOn.map((code) => (
                      <span
                        key={code}
                        className="strategy-action-master-deps-chip is-dependency"
                      >
                        {code}
                      </span>
                    ))}
                  </HBox>
                )}
              </div>

              <div className="strategy-action-master-deps-aside-block">
                <div className="strategy-action-master-deps-aside-label">
                  {intl.formatMessage({
                    id: "label.StrategyActionMaster.deps.successors",
                    defaultMessage: "Successors",
                  })}
                </div>
                {focusSuccessors.length === 0 ? (
                  <span className="strategy-action-master-deps-aside-none">
                    {intl.formatMessage({
                      id: "label.StrategyActionMaster.deps.none",
                      defaultMessage: "None",
                    })}
                  </span>
                ) : (
                  <HBox className="strategy-action-master-deps-chip-row">
                    {focusSuccessors.map((code) => (
                      <span
                        key={code}
                        className="strategy-action-master-deps-chip is-successor"
                      >
                        {code}
                      </span>
                    ))}
                  </HBox>
                )}
              </div>
            </>
          )}
        </aside>
      </HBox>
    </HBox>
  );
};

export default StrategyActionDependencies;
