import { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { HBox, HButton, HCheckBox, HDropdown, HLabel, HTextField, FilterMaster, SearchCommonBox } from "@helix/component-library";
import { gridCollectorDefObj, gridMailCodeDefObj } from "../../../../common/components/SearchGridDefObj";
import { SEARCH_API_ENDPOINTS } from "../../../../../shared/config/apiConstants.jsx";
import { getTypeShortForRow, splitActionTokens, joinActionTokens, } from "./strategyActionMaster.mappers";
import StrategyActionAccess from "./StrategyActionAccess";

const gridStrategyActionRelationDefObj = [
  {
    gridHeaderDesc: "Action",
    gridMappingName: "code",
    gridColumnWidth: 140,
  },
  {
    gridHeaderDesc: "Description",
    gridMappingName: "description",
    gridColumnWidth: 220,
  },
];

function normalizeActionCode(value) {
  return String(value ?? "").trim();
}

function buildOrderedActionOptions(rows, currentIndex, direction) {
  if (!Array.isArray(rows) || currentIndex < 0) return [];

  const currentCode = normalizeActionCode(rows[currentIndex]?.szActionCode).toLowerCase();
  const candidateRows =
    direction === "dependsOn"
      ? rows.slice(0, currentIndex)
      : rows.slice(currentIndex + 1);

  const seen = new Set();
  const options = [];

  candidateRows.forEach((row) => {
    const code = normalizeActionCode(row?.szActionCode);
    const codeKey = code.toLowerCase();
    if (!code || codeKey === currentCode || seen.has(codeKey)) return;
    seen.add(codeKey);
    options.push(code);
  });

  return options;
}

function sanitizeRelationshipSelection(value, allowedOptions) {
  const allowedMap = new Map(
    (allowedOptions || []).map((option) => [String(option).toLowerCase(), option]),
  );
  const selectedTokens = parseRelationshipTokens(value);

  const seen = new Set();
  const normalized = [];

  selectedTokens.forEach((token) => {
    const tokenKey = String(token || "").trim().toLowerCase();
    if (!tokenKey || seen.has(tokenKey) || !allowedMap.has(tokenKey)) return;
    seen.add(tokenKey);
    normalized.push(allowedMap.get(tokenKey));
  });

  return joinActionTokens(normalized);
}

function parseRelationshipTokens(value) {
  const parseToken = (token) =>
    String(token ?? "")
      .split(/[.,;|]/)
      .map((part) => part.trim())
      .filter(Boolean);

  if (Array.isArray(value)) {
    return value.flatMap((token) => parseToken(token));
  }

  return parseToken(value);
}

const DetailSection = ({ title, children }) => (
  <section className="strategy-action-master-detail-section">
    <h3 className="strategy-action-master-detail-section-title">{title}</h3>
    {children}
  </section>
);

const DetailField = ({ label, required, hint, children, className = "" }) => (
  <HBox className={`strategy-action-master-detail-field ${className}`.trim()}>
    <HLabel value={label} required={required} colon={false} translate={false} align="left" />
    {children}
    {hint ? <p className="strategy-action-master-detail-hint">{hint}</p> : null}
  </HBox>
);

const TypeBadge = ({ actionType, actionTypeOptions }) => {
  const short = getTypeShortForRow(actionType, actionTypeOptions);
  if (!short) return null;
  return (
    <span className="strategy-action-master-type-badge">{short}</span>
  );
};

function isGenerateMailType(actionType, actionTypeOptions) {
  const short = getTypeShortForRow(actionType, actionTypeOptions);
  return short === "GM" || String(actionType || "").toUpperCase() === "GM";
}

function isSearchCommonBoxValueType(actionType, actionTypeOptions) {
  const short = getTypeShortForRow(actionType, actionTypeOptions);
  return short === "GM" || short === "CW";
}

function getValueSearchCode(actionType, actionTypeOptions) {
  const short = String(getTypeShortForRow(actionType, actionTypeOptions) || "").toUpperCase();
  const normalized = short || String(actionType || "").toUpperCase();
  return normalized === "CW" ? "COLLCDE" : "MAILCODE";
}

function isCollectorValueType(actionType, actionTypeOptions) {
  const short = String(getTypeShortForRow(actionType, actionTypeOptions) || "").toUpperCase();
  const normalized = short || String(actionType || "").toUpperCase();
  return normalized === "CW";
}

const StrategyActionDetail = ({
  rows,
  allRows,
  actionTypeOptions,
  focusRowId,
  onFocusRow,
  onUpdateRow,
  onDeleteRow,
  onOpenFilter,
}) => {
  const intl = useIntl();
  const [listQuery, setListQuery] = useState("");

  const listedRows = useMemo(() => {
    const query = listQuery.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter(
      (row) =>
        String(row.szActionCode || "")
          .toLowerCase()
          .includes(query) ||
        String(row.szDescription || "")
          .toLowerCase()
          .includes(query),
    );
  }, [rows, listQuery]);

  const activeRow = useMemo(() => {
    if (!listedRows.length) return null;
    return (
      listedRows.find((row) => row.id === focusRowId) || listedRows[0]
    );
  }, [listedRows, focusRowId]);

  useEffect(() => {
    if (activeRow && activeRow.id !== focusRowId) {
      onFocusRow(activeRow.id);
    }
  }, [activeRow, focusRowId, onFocusRow]);

  const typeDropdownOptions = useMemo(
    () =>
      actionTypeOptions.map((opt) => ({
        value: opt.value,
        label: opt.label,
      })),
    [actionTypeOptions],
  );

  const updateActive = (fields) => {
    if (!activeRow) return;
    onUpdateRow(activeRow.id, fields);
  };

  const orderedRowsForRelations = useMemo(() => {
    if (Array.isArray(allRows) && allRows.length > 0) return allRows;
    return rows;
  }, [allRows, rows]);

  const relationOptionRows = useMemo(() => {
    if (!activeRow || !Array.isArray(orderedRowsForRelations)) return { dependsOn: [], successors: [] };

    const currentIndex = orderedRowsForRelations.findIndex((row) => row.id === activeRow.id);
    const codeToDescription = new Map();
    orderedRowsForRelations.forEach((row) => {
      const code = normalizeActionCode(row?.szActionCode);
      if (!code || codeToDescription.has(code)) return;
      codeToDescription.set(code, String(row?.szDescription || "").trim());
    });

    const toOptionRows = (codes) =>
      codes.map((code) => ({
        code,
        description: codeToDescription.get(code) || "",
      }));

    return {
      dependsOn: toOptionRows(buildOrderedActionOptions(orderedRowsForRelations, currentIndex, "dependsOn")),
      successors: toOptionRows(buildOrderedActionOptions(orderedRowsForRelations, currentIndex, "successors")),
    };
  }, [activeRow, orderedRowsForRelations]);

  const dependsOnTokens = parseRelationshipTokens(activeRow?.szDependsOn);
  const successorsTokens = parseRelationshipTokens(activeRow?.szSuccessors);

  const safeDependsOnTokens = useMemo(
    () => splitActionTokens(sanitizeRelationshipSelection(dependsOnTokens, relationOptionRows.dependsOn.map((opt) => opt.code))),
    [dependsOnTokens, relationOptionRows.dependsOn],
  );

  const safeSuccessorsTokens = useMemo(
    () => splitActionTokens(sanitizeRelationshipSelection(successorsTokens, relationOptionRows.successors.map((opt) => opt.code))),
    [successorsTokens, relationOptionRows.successors],
  );

  return (
    <HBox className="strategy-action-master-detail">
      <aside className="strategy-action-master-detail-list">
        <HBox className="strategy-action-master-detail-list-search">
          <HTextField
            id="strategy-action-detail-list-search"
            value={listQuery}
            onChange={(e) => setListQuery(e.target.value)}
            editable
            placeholder="label.StrategyActionMaster.detail.listSearchPlaceholder"
            width="100%"
          />
        </HBox>
        <HBox className="strategy-action-master-detail-list-items">
          {listedRows.length === 0 ? (
            <p className="strategy-action-master-detail-empty">
              {intl.formatMessage({
                id: "label.StrategyActionMaster.detail.noActions",
                defaultMessage: "No actions match the current filters.",
              })}
            </p>
          ) : (
            listedRows.map((row) => {
              const isActive = row.id === activeRow?.id;
              return (
                <button
                  key={row.id}
                  type="button"
                  className={`strategy-action-master-detail-list-item${isActive ? " is-active" : ""}`}
                  onClick={() => onFocusRow(row.id)}
                >
                  <span
                    className={`strategy-action-master-detail-status-dot${row.chActiveYn ? " is-active" : ""}`}
                  />
                  <HBox className="strategy-action-master-detail-list-item-body">
                    <HBox className="strategy-action-master-detail-list-item-title">
                      <span className="strategy-action-master-detail-action-code">
                        {row.szActionCode ||
                          intl.formatMessage({
                            id: "label.StrategyActionMaster.detail.untitled",
                            defaultMessage: "(untitled)",
                          })}
                      </span>
                      <TypeBadge
                        actionType={row.szActionType}
                        actionTypeOptions={actionTypeOptions}
                      />
                    </HBox>
                    <span className="strategy-action-master-detail-list-desc">
                      {row.szDescription || "—"}
                    </span>
                  </HBox>
                  {row.mode === "E" || row.mode === "N" ? (
                    <span className="strategy-action-master-detail-dirty-dot" />
                  ) : null}
                </button>
              );
            })
          )}
        </HBox>
      </aside>

      <HBox className="strategy-action-master-detail-form-wrap">
        {!activeRow ? (
          <HBox className="strategy-action-master-detail-empty-form">
            <p>
              {intl.formatMessage({
                id: "label.StrategyActionMaster.detail.selectAction",
                defaultMessage: "Select a strategy action to edit.",
              })}
            </p>
          </HBox>
        ) : (
          <HBox className="strategy-action-master-detail-form">
            <header className="strategy-action-master-detail-form-header">
              <HBox className="strategy-action-master-detail-form-heading">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h2 className="strategy-action-master-detail-form-title">
                    {activeRow.szActionCode ||
                      intl.formatMessage({
                        id: "label.StrategyActionMaster.detail.untitled",
                        defaultMessage: "(untitled)",
                      })}
                  </h2>
                  <TypeBadge
                    actionType={activeRow.szActionType}
                    actionTypeOptions={actionTypeOptions}
                  />
                  {!activeRow.chActiveYn ? (
                    <span className="strategy-action-master-detail-inactive-badge">
                      {intl.formatMessage({
                        id: "label.StrategyActionMaster.detail.inactive",
                        defaultMessage: "Inactive",
                      })}
                    </span>
                  ) : null}
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <HButton
                    label={intl.formatMessage({
                      id: "label.StrategyActionMaster.detail.delete",
                      defaultMessage: "Delete",
                    })}
                    size="small"
                    className="strategy-action-master-detail-delete-btn"
                    onClick={() => onDeleteRow(activeRow)}
                  />
                </div>
              </HBox>
              <p className="strategy-action-master-detail-form-subtitle">
                {activeRow.szDescription ||
                  intl.formatMessage({
                    id: "label.StrategyActionMaster.detail.noDescription",
                    defaultMessage: "No description",
                  })}
              </p>
            </header>

            <DetailSection
              title={intl.formatMessage({
                id: "label.StrategyActionMaster.detail.section.identity",
                defaultMessage: "Identity",
              })}
            >
              <HBox className="strategy-action-master-detail-grid-2">
                <DetailField
                  label={intl.formatMessage({
                    id: "label.StrategyActionMaster.action",
                    defaultMessage: "Action",
                  })}
                  required
                >
                  <HTextField
                    id="strategy-action-detail-code"
                    value={activeRow.szActionCode}
                    onChange={(e) =>
                      updateActive({ szActionCode: e.target.value })
                    }
                    editable={activeRow.mode === "N"}
                    width="100%"
                  />
                </DetailField>
                <DetailField
                  label={intl.formatMessage({
                    id: "label.StrategyActionMaster.description",
                    defaultMessage: "Description",
                  })}
                  required
                >
                  <HTextField
                    id="strategy-action-detail-description"
                    value={activeRow.szDescription}
                    onChange={(e) =>
                      updateActive({ szDescription: e.target.value })
                    }
                    editable
                    width="100%"
                  />
                </DetailField>
              </HBox>
            </DetailSection>

            <DetailSection
              title={intl.formatMessage({
                id: "label.StrategyActionMaster.actionDefinition",
                defaultMessage: "Action Definition",
              })}
            >
              <HBox className="strategy-action-master-detail-grid-2">
                <DetailField
                  label={intl.formatMessage({
                    id: "label.StrategyActionMaster.type",
                    defaultMessage: "Type",
                  })}
                  required
                  hint={intl.formatMessage({
                    id: "label.StrategyActionMaster.detail.typeHint",
                    defaultMessage:
                      "Determines where this action is available across rules.",
                  })}
                >
                  <HDropdown
                    name="strategy-action-detail-type"
                    value={activeRow.szActionType}
                    onChange={(e) =>
                      updateActive({ szActionType: e.target.value })
                    }
                    options={typeDropdownOptions}
                    width="100%"
                  />
                </DetailField>
                <DetailField
                  label={intl.formatMessage({
                    id: "label.StrategyActionMaster.value",
                    defaultMessage: "Value",
                  })}
                  required
                >
                  {isSearchCommonBoxValueType(activeRow.szActionType, actionTypeOptions) ? (
                    (() => {
                      const collectorType = isCollectorValueType(activeRow.szActionType, actionTypeOptions);
                      return (
                        <SearchCommonBox
                          apiEndpoint={SEARCH_API_ENDPOINTS.EARLY_COLLECTIONS()}
                          searchCode={getValueSearchCode(activeRow.szActionType, actionTypeOptions)}
                          setSelectedValue={(value) => {
                            updateActive({ szActionTarget: value || "" });
                          }}
                          selectedValue={activeRow.szActionTarget || ""}
                          selectedColumn={collectorType ? "szCollectorCode" : "szMailCode"}
                          gridDefObj={collectorType ? gridCollectorDefObj : gridMailCodeDefObj}
                          gridWidth={300}
                          gridHeight={300}
                          gridNoOfRowsPerPage={5}
                          searchBoxWidth="100%"
                          searchBoxHeight={30}
                          searchBoxFontSize={12}
                          placeholder={intl.formatMessage({
                            id: collectorType
                              ? "label.collector.collectorCode.placeholder"
                              : "label.generateMail.mailCode.placeholder",
                            defaultMessage: collectorType ? "Select collector code" : "Select mail code",
                          })}
                        />
                      );
                    })()
                  ) : (
                    <HTextField
                      id="strategy-action-detail-target"
                      value={activeRow.szActionTarget}
                      onChange={(e) =>
                        updateActive({ szActionTarget: e.target.value })
                      }
                      editable
                      width="100%"
                    />
                  )}
                </DetailField>
              </HBox>
            </DetailSection>

            <DetailSection
              title={intl.formatMessage({
                id: "label.StrategyActionMaster.detail.section.dependencies",
                defaultMessage: "Dependencies",
              })}
            >
              <HBox className="strategy-action-master-detail-grid-2">
                <DetailField
                  label={intl.formatMessage({
                    id: "label.StrategyActionMaster.dependsOn",
                    defaultMessage: "Depends On",
                  })}
                  hint={intl.formatMessage({
                    id: "label.StrategyActionMaster.detail.dependsOnHint",
                    defaultMessage:
                      "This action only executes after the selected predecessor actions.",
                  })}
                >
                  <SearchCommonBox
                    key={`detail-depends-${activeRow?.id}-${safeDependsOnTokens.join("|")}`}
                    multiSelect={true}
                    searchCode={`detail_depends_${activeRow?.id || "row"}`}
                    placeholder={intl.formatMessage({
                      id: "label.StrategyActionMaster.detail.placeholder.dependsOn",
                      defaultMessage: "Select depends on",
                    })}
                    customFetchFunction={async () => ({ data: { responseJson: relationOptionRows.dependsOn } })}
                    setSelectedValue={(selectedCodes) => {
                      const nextValue = sanitizeRelationshipSelection(
                        selectedCodes,
                        relationOptionRows.dependsOn.map((opt) => opt.code),
                      );
                      updateActive({ szDependsOn: nextValue });
                    }}
                    selectedValue={safeDependsOnTokens}
                    selectedColumn="code"
                    gridDefObj={gridStrategyActionRelationDefObj}
                    gridWidth={360}
                    gridHeight={300}
                    gridNoOfRowsPerPage={5}
                    searchBoxWidth={260}
                    searchBoxHeight={30}
                    searchBoxFontSize={12}
                    translate={false}
                    error={false}
                  />
                  {safeDependsOnTokens.length > 0 ? (
                    <HBox className="strategy-action-master-detail-token-row">
                      <span className="strategy-action-master-detail-token">
                        {joinActionTokens(safeDependsOnTokens)}
                      </span>
                    </HBox>
                  ) : null}
                </DetailField>
                <DetailField
                  label={intl.formatMessage({
                    id: "label.StrategyActionMaster.successors",
                    defaultMessage: "Successors",
                  })}
                  hint={intl.formatMessage({
                    id: "label.StrategyActionMaster.detail.successorsHint",
                    defaultMessage:
                      "This action will be skipped if any successor action has already executed.",
                  })}
                >
                  <SearchCommonBox
                    key={`detail-successors-${activeRow?.id}-${safeSuccessorsTokens.join("|")}`}
                    multiSelect={true}
                    searchCode={`detail_successors_${activeRow?.id || "row"}`}
                    placeholder={intl.formatMessage({
                      id: "label.StrategyActionMaster.detail.placeholder.successors",
                      defaultMessage: "Select successors",
                    })}
                    customFetchFunction={async () => ({ data: { responseJson: relationOptionRows.successors } })}
                    setSelectedValue={(selectedCodes) => {
                      const nextValue = sanitizeRelationshipSelection(
                        selectedCodes,
                        relationOptionRows.successors.map((opt) => opt.code),
                      );
                      updateActive({ szSuccessors: nextValue });
                    }}
                    selectedValue={safeSuccessorsTokens}
                    selectedColumn="code"
                    gridDefObj={gridStrategyActionRelationDefObj}
                    gridWidth={360}
                    gridHeight={300}
                    gridNoOfRowsPerPage={5}
                    searchBoxWidth={260}
                    searchBoxHeight={30}
                    searchBoxFontSize={12}
                    translate={false}
                    error={false}
                  />
                  {safeSuccessorsTokens.length > 0 ? (
                    <HBox className="strategy-action-master-detail-token-row">
                      <span className="strategy-action-master-detail-token">
                        {joinActionTokens(safeSuccessorsTokens)}
                      </span>
                    </HBox>
                  ) : null}
                </DetailField>
              </HBox>
            </DetailSection>

            <DetailSection
              title={intl.formatMessage({
                id: "label.StrategyActionMaster.detail.section.filters",
                defaultMessage: "Filters",
              })}
            >
              <HBox className="strategy-action-master-detail-grid-1">
                <DetailField
                  className="strategy-action-master-detail-filter-field"
                  label={intl.formatMessage({
                    id: "label.StrategyActionMaster.excludeCases",
                    defaultMessage: "Exclude cases with",
                  })}
                >
                  <HBox className="strategy-action-master-detail-filter-row is-stacked">
                    <FilterMaster
                      ruleName={`${activeRow?.szActionCode || activeRow?.id || "DRAFT"}_SA_EX`}
                      moduleName="COL"
                      entityCode="ACNT"
                      filterTitle={intl.formatMessage({ id: "label.StrategyActionMaster.excludeCases", defaultMessage: "Exclude cases with" })}
                      isPopedUp={false}
                      parentFilterProps={(filterData) => {
                        const humanText = (filterData?.ruleDesc && String(filterData.ruleDesc).trim()) ||
                          (filterData?.criteriaDto || []).map(i => i.szDescription).filter(Boolean).join(' ').trim();
                        updateActive({
                          szExcludeCasesWith: humanText,
                          szExcludeCasesWithRuleDesc: filterData?.ruleDesc || "",
                          szExcludeCasesWithCriteriaDto: filterData?.criteriaDto || [],
                          szExcludeCasesWithRuleName: `${activeRow?.szActionCode || activeRow?.id || "DRAFT"}_SA_EX`,
                        });
                      }}
                      parentRuleEngineFilterProps={(obj) => {
                        updateActive({
                          szExcludeCasesWithObj: obj,
                          szExcludeCasesWithRuleName: `${activeRow?.szActionCode || activeRow?.id || "DRAFT"}_SA_EX`,
                        });
                      }}
                      ruleEngineDmnContext={(dmnContextJson) => {
                        updateActive({
                          szExcludeCasesWithObj: dmnContextJson,
                          szExcludeCasesWithRuleName: `${activeRow?.szActionCode || activeRow?.id || "DRAFT"}_SA_EX`,
                        });
                      }}
                      IsRuleEngBased={true}
                      compact={true}
                    />
                  </HBox>
                </DetailField>
                <DetailField
                  className="strategy-action-master-detail-filter-field"
                  label={intl.formatMessage({
                    id: "label.StrategyActionMaster.includeCases",
                    defaultMessage: "Include cases with",
                  })}
                >
                  <HBox className="strategy-action-master-detail-filter-row is-stacked">
                    <FilterMaster
                      ruleName={`${activeRow?.szActionCode || activeRow?.id || "DRAFT"}_SA_IN`}
                      moduleName="COL"
                      entityCode="ACNT"
                      filterTitle={intl.formatMessage({ id: "label.StrategyActionMaster.includeCases", defaultMessage: "Include cases with" })}
                      isPopedUp={false}
                      parentFilterProps={(filterData) => {
                        const humanText = (filterData?.ruleDesc && String(filterData.ruleDesc).trim()) ||
                          (filterData?.criteriaDto || []).map(i => i.szDescription).filter(Boolean).join(' ').trim();
                        updateActive({
                          szIncludeCasesWith: humanText,
                          szIncludeCasesWithRuleDesc: filterData?.ruleDesc || "",
                          szIncludeCasesWithCriteriaDto: filterData?.criteriaDto || [],
                          szIncludeCasesWithRuleName: `${activeRow?.szActionCode || activeRow?.id || "DRAFT"}_SA_IN`,
                        });
                      }}
                      parentRuleEngineFilterProps={(obj) => {
                        updateActive({
                          szIncludeCasesWithObj: obj,
                          szIncludeCasesWithRuleName: `${activeRow?.szActionCode || activeRow?.id || "DRAFT"}_SA_IN`,
                        });
                      }}
                      ruleEngineDmnContext={(dmnContextJson) => {
                        updateActive({
                          szIncludeCasesWithObj: dmnContextJson,
                          szIncludeCasesWithRuleName: `${activeRow?.szActionCode || activeRow?.id || "DRAFT"}_SA_IN`,
                        });
                      }}
                      IsRuleEngBased={true}
                      compact={true}
                    />
                  </HBox>
                </DetailField>
              </HBox>
            </DetailSection>

            <DetailSection
              title={intl.formatMessage({
                id: "label.StrategyActionMaster.detail.section.behaviour",
                defaultMessage: "Access & Behaviour",
              })}
            >
              <HBox className="strategy-action-master-detail-grid-2" sx={{ gap: 10 }}>
                <DetailField
                  label={intl.formatMessage({
                    id: "label.StrategyActionMaster.active",
                    defaultMessage: "Active",
                  })}
                >
                  <HCheckBox
                    className="strategy-action-detail-checkbox"
                    checked={!!activeRow.chActiveYn}
                    label={intl.formatMessage({
                      id: activeRow.chActiveYn
                        ? "label.StrategyActionMaster.detail.activeOn"
                        : "label.StrategyActionMaster.detail.activeOff",
                      defaultMessage: activeRow.chActiveYn
                        ? "Action is active"
                        : "Action is disabled",
                    })}
                    onChange={(e) =>
                      updateActive({ chActiveYn: e.target.checked })
                    }
                  />
                </DetailField>
                <DetailField
                  label={intl.formatMessage({
                    id: "label.StrategyActionMaster.auto",
                    defaultMessage: "Auto",
                  })}
                >
                  <HCheckBox
                    className="strategy-action-detail-checkbox"
                    checked={!!activeRow.chAutoActionYn}
                    label={intl.formatMessage({
                      id: activeRow.chAutoActionYn
                        ? "label.StrategyActionMaster.detail.autoOn"
                        : "label.StrategyActionMaster.detail.autoOff",
                      defaultMessage: activeRow.chAutoActionYn
                        ? "Runs automatically by engine"
                        : "Engine will not auto-trigger",
                    })}
                    onChange={(e) =>
                      updateActive({ chAutoActionYn: e.target.checked })
                    }
                  />
                </DetailField>
                <DetailField
                  label={intl.formatMessage({
                    id: "label.StrategyActionMaster.accessControl",
                    defaultMessage: "Access Control",
                  })}
                >
                  {activeRow?.szActionCode ? (
                    <StrategyActionAccess actionCode={activeRow.szActionCode} />
                  ) : (
                    <p className="strategy-action-master-detail-hint">
                      {intl.formatMessage({
                        id: "label.StrategyActionMaster.detail.accessControlHint",
                        defaultMessage: "Save action code to configure access control.",
                      })}
                    </p>
                  )}
                </DetailField>
              </HBox>
            </DetailSection>
          </HBox>
        )}
      </HBox>
    </HBox>
  );
};

export default StrategyActionDetail;
