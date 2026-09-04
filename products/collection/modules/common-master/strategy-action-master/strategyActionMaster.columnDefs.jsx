import React from "react";
import { HBox, HButton, HCheckBox } from "@helix/component-library";

function markRowEdited(data) {
  if (data && data.mode !== "N") {
    data.mode = "E";
  }
}

function BoolCheckboxRenderer({ field, params }) {
  const checked = !!params.value;
  return (
    <HCheckBox
      checked={checked}
      label=""
      align="center"
      margin="15px"
      gridMode
      onChange={(e) => {
        params.node.setDataValue(field, e.target.checked);
        markRowEdited(params.data);
      }}
    />
  );
}

export function getStrategyActionMasterColumnDefs({
  intl,
  actionTypeOptions,
  onOpenFilter,
  onOpenAccess,
}) {
  const typeValues = actionTypeOptions.map((opt) => opt.value);

  return [
    {
      headerName: "",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
      pinned: "left",
      filter: false,
      sortable: false,
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.action",
        defaultMessage: "Action",
      }),
      field: "szActionCode",
      width: 128,
      minWidth: 120,
      pinned: "left",
      editable: (params) => params.data?.mode === "N",
      filter: false,
      required: true,
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.description",
        defaultMessage: "Description",
      }),
      field: "szDescription",
      width: 176,
      minWidth: 160,
      pinned: "left",
      editable: true,
      filter: false,
      required: true,
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.actionDefinition",
        defaultMessage: "Action Definition",
      }),
      children: [
        {
          headerName: intl.formatMessage({
            id: "label.StrategyActionMaster.type",
            defaultMessage: "Type",
          }),
          field: "szActionType",
          width: 180,
          editable: true,
          filter: false,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: { values: typeValues },
          valueFormatter: (params) => {
            const option = actionTypeOptions.find(
              (opt) => opt.value === params.value,
            );
            return option ? option.label : params.value;
          },
        },
        {
          headerName: intl.formatMessage({
            id: "label.StrategyActionMaster.value",
            defaultMessage: "Value",
          }),
          field: "szActionTarget",
          width: 176,
          editable: true,
          filter: false,
          required: true,
        },
      ],
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.dependsOn",
        defaultMessage: "Depends On",
      }),
      field: "szDependsOn",
      width: 144,
      editable: true,
      filter: false,
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.successors",
        defaultMessage: "Successors",
      }),
      field: "szSuccessors",
      width: 144,
      editable: true,
      filter: false,
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.excludeCases",
        defaultMessage: "Exclude cases with",
      }),
      field: "szExcludeCasesWith",
      width: 144,
      editable: false,
      filter: false,
      cellRenderer: (params) => (
        <HBox className="strategy-action-master-cell-action">
          <HButton
            label={intl.formatMessage({
              id: "label.StrategyActionMaster.define",
              defaultMessage: "Define",
            })}
            variant="text"
            size="small"
            className="strategy-action-master-link-btn"
            onClick={() =>
              onOpenFilter({
                rowKey: params.data?.id,
                gridRowId: params.data?.gridRowId,
                field: "szExcludeCasesWith",
                initialValue: params.data?.szExcludeCasesWith || "",
              })
            }
          />
        </HBox>
      ),
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.includeCases",
        defaultMessage: "Include cases with",
      }),
      field: "szIncludeCasesWith",
      width: 144,
      editable: false,
      filter: false,
      cellRenderer: (params) => (
        <HBox className="strategy-action-master-cell-action">
          <HButton
            label={intl.formatMessage({
              id: "label.StrategyActionMaster.define",
              defaultMessage: "Define",
            })}
            variant="text"
            size="small"
            className="strategy-action-master-link-btn"
            onClick={() =>
              onOpenFilter({
                rowKey: params.data?.id,
                gridRowId: params.data?.gridRowId,
                field: "szIncludeCasesWith",
                initialValue: params.data?.szIncludeCasesWith || "",
              })
            }
          />
        </HBox>
      ),
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.active",
        defaultMessage: "Active",
      }),
      field: "chActiveYn",
      width: 80,
      editable: false,
      filter: false,
      isCheckbox: true,
      cellRenderer: (params) => (
        <BoolCheckboxRenderer field="chActiveYn" params={params} />
      ),
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.auto",
        defaultMessage: "Auto",
      }),
      field: "chAutoActionYn",
      width: 80,
      editable: false,
      filter: false,
      isCheckbox: true,
      cellRenderer: (params) => (
        <BoolCheckboxRenderer field="chAutoActionYn" params={params} />
      ),
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.accessControl",
        defaultMessage: "Access Control",
      }),
      field: "accessControl",
      width: 128,
      editable: false,
      filter: false,
      cellRenderer: (params) => (
        <HBox className="strategy-action-master-cell-action">
          <HButton
            label={intl.formatMessage({
              id: "label.StrategyActionMaster.accessControl",
              defaultMessage: "Access Control",
            })}
            variant="text"
            size="small"
            className="strategy-action-master-link-btn"
            onClick={() => onOpenAccess(params.data?.szActionCode)}
          />
        </HBox>
      ),
    },
  ];
}
