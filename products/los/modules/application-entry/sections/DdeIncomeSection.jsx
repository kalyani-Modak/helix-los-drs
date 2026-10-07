import { useMemo } from "react";
import { Grid } from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import {
  HAgGrid,
  HBox,
  HCheckBox,
  HDropdown,
  HLabel,
  HTextField,
  useDrsTheme,
} from "@helix/component-library";
import { useIntl } from "react-intl";
import SectionBlock from "../components/SectionBlock";
import { DDE_FIELDS } from "../constants/ddeFieldMetadata";
import { DDE_INCOME_SOURCES } from "../constants/ddeIncomeSources";
import { resolveDdeLookupKey } from "../hooks/useDdeLookups";
import { filterVisibleFields } from "../utils/ddeFieldVisibility";
import { calculateDdeIncomeAverage } from "../utils/ddeIncomeCalculations";

const GRID_FIELDS = new Set(
  DDE_INCOME_SOURCES.flatMap((source) =>
    [source.include, source.amount, source.consideration].filter(Boolean)
  )
);
const SUMMARY_FIELDS = DDE_FIELDS.filter(
  (field) => field.section === "Income Details" && !GRID_FIELDS.has(field.name)
);

const toGridNumber = (value) => {
  if (value === "" || value == null) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};
const formatAmount = (value) => String(Number(value.toFixed(2)));
const getRowAverage = (data) =>
  Math.round(
    ([data.month1, data.month2, data.month3].reduce(
      (sum, value) => sum + (Number(value) || 0),
      0
    ) /
      3) *
      100
  ) / 100;

const DdeIncomeSection = ({
  form,
  setField,
  errors,
  lookups,
  expanded,
  onExpandedChange,
}) => {
  const intl = useIntl();
  const text = intl.formatMessage;
  const { colors, text: themeText, border, action } = useDrsTheme();
  const visibleSummaryFields = filterVisibleFields(SUMMARY_FIELDS, form);

  const rowData = useMemo(() => {
    return DDE_INCOME_SOURCES.map((source) => ({
      id: source.id,
      source,
      incomeType: text({ id: source.labelKey }),
      include: source.include ? Boolean(form[source.include]) : null,
      month1: toGridNumber(form[source.months[0]]),
      month2: toGridNumber(form[source.months[1]]),
      month3: toGridNumber(form[source.months[2]]),
      consideration: 100,
    }));
  }, [form, text]);

  const columnDefs = useMemo(() => {
    const headerStyle = {
      backgroundColor: action.hover,
      color: colors.primary,
      fontWeight: 700,
      whiteSpace: "normal",
      textAlign: "center",
    };
    const amountColumn = (field, headerKey) => ({
      headerName: text({ id: headerKey }),
      field,
      minWidth: 110,
      flex: 1,
      cellDataType: "number",
      editable: (params) =>
        !params.data?.source.include || Boolean(params.data?.include),
      valueParser: (params) => {
        if (params.newValue === "" || params.newValue == null) return null;
        const value = Number(params.newValue);
        return Number.isFinite(value) ? value : null;
      },
      onCellValueChanged: (params) => {
        setField(
          params.data.source.months[Number(field.slice(-1)) - 1],
          params.newValue == null ? "" : String(params.newValue)
        );
        params.api.refreshCells({
          rowNodes: [params.node],
          columns: ["average", "considered"],
          force: true,
        });
      },
      filter: false,
      sortable: false,
      headerStyle,
    });

    return [
      {
        headerName: text({ id: "label.dde.income.include" }),
        field: "include",
        width: 85,
        cellDataType: "boolean",
        editable: (params) => !params.data?.total && Boolean(params.data?.source.include),
        cellStyle: { display: "flex", justifyContent: "center" },
        onCellValueChanged: (params) => {
          setField(params.data.source.include, Boolean(params.newValue));
          params.api.refreshCells({
            rowNodes: [params.node],
            columns: ["considered"],
            force: true,
          });
        },
        filter: false,
        sortable: false,
        headerStyle,
      },
      {
        headerName: text({ id: "label.dde.income.type" }),
        field: "incomeType",
        minWidth: 140,
        flex: 1,
        filter: false,
        sortable: false,
        headerStyle,
      },
      {
        headerName: text({ id: "label.dde.income.monthlyAmount" }),
        marryChildren: true,
        headerStyle,
        children: [
          amountColumn("month1", "label.dde.income.month1"),
          amountColumn("month2", "label.dde.income.month2"),
          amountColumn("month3", "label.dde.income.month3"),
        ],
      },
      {
        headerName: text({ id: "label.dde.income.averageAmount" }),
        field: "average",
        minWidth: 115,
        flex: 1,
        cellDataType: "number",
        valueGetter: (params) => getRowAverage(params.data),
        filter: false,
        sortable: false,
        headerStyle,
        editable: false,
        cellStyle: { textAlign: "right" },
      },
      {
        headerName: text({ id: "label.dde.income.consideration" }),
        field: "consideration",
        minWidth: 120,
        flex: 1,
        editable: false,
        filter: false,
        sortable: false,
        headerStyle,
      },
      {
        headerName: text({ id: "label.dde.income.monthlyConsidered" }),
        field: "considered",
        minWidth: 150,
        flex: 1.2,
        cellDataType: "number",
        valueGetter: (params) =>
          params.data.source.include && !params.data.include ? 0 : getRowAverage(params.data),
        filter: false,
        sortable: false,
        headerStyle,
        editable: false,
        cellStyle: { textAlign: "right" },
      },
    ];
  }, [action.hover, colors.primary, setField, text]);

  const averageTotal = DDE_INCOME_SOURCES.reduce(
    (sum, source) =>
      sum +
      (!source.include || form[source.include]
        ? calculateDdeIncomeAverage(source, form)
        : 0),
    0
  );
  const consideredTotal = Number(form.netMonthlyIncome) || 0;

  const summaryOptions = (field) => {
    if (field.options?.length) {
      return field.options.map((option) => ({ label: option, value: option }));
    }
    if (field.optionsMaster) {
      return lookups?.[resolveDdeLookupKey(field.optionsMaster)] || [];
    }
    return [];
  };

  const renderSummaryControl = (field) => {
    const disabled = Boolean(field.disabled);
    if (field.type === "select") {
      return (
        <HDropdown
          name={field.name}
          options={summaryOptions(field)}
          value={form[field.name] ?? ""}
          onChange={(event) => setField(field.name, event.target.value)}
          disabled={disabled}
          required={Boolean(field.required)}
          error={Boolean(errors?.[field.name])}
          width="100%"
        />
      );
    }
    if (field.type === "checkbox") {
      return (
        <HBox sx={{ display: "flex", alignItems: "center", minHeight: 36 }}>
          <HCheckBox
            checked={Boolean(form[field.name])}
            onChange={(event) => setField(field.name, event.target.checked)}
            disabled={disabled}
          />
        </HBox>
      );
    }
    return (
      <HTextField
        value={form[field.name] ?? ""}
        onChange={(event) => setField(field.name, event.target.value)}
        editable={!disabled}
        disabled={disabled}
        required={Boolean(field.required)}
        error={Boolean(errors?.[field.name])}
        type={field.type === "number" ? "number" : "text"}
        width="100%"
      />
    );
  };

  return (
    <SectionBlock
      sectionKey="income"
      titleKey="label.dde.section.income"
      subTitleKey="label.dde.section.income.subtitle"
      icon={<AccountBalanceWalletOutlinedIcon fontSize="small" />}
      defaultExpanded={false}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
    >
      <Grid size={12} sx={{ minWidth: 0, p: "0 !important" }}>
        <HBox sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <HBox
            sx={{
              width: "100%",
              border: "1px solid",
              borderColor: border.control,
              borderRadius: 1,
              overflow: "hidden",
              "& .ag-header": {
                backgroundColor: action.hover,
                borderBottomColor: border.control,
              },
              "& .ag-header-cell, & .ag-header-group-cell": {
                color: themeText.primary,
                borderRight: "1px solid",
                borderColor: border.control,
              },
              "& .ag-theme-alpine .ag-header-cell .ag-header-cell-text, & .ag-theme-alpine-dark .ag-header-cell .ag-header-cell-text, & .ag-theme-alpine .ag-header-group-text, & .ag-theme-alpine-dark .ag-header-group-text": {
                fontWeight: "650 !important",
                fontSize: "14px !important",
              },
              "& .ag-cell": {
                borderRight: "1px solid",
                borderColor: border.control,
                display: "flex",
                alignItems: "center",
              },
              "& .ag-row": { borderBottomColor: border.control },
            }}
          >
            <HAgGrid
              rowData={rowData}
              columnDefs={columnDefs}
              gridStyle={{
                width: "100%",
                height: 290,
                "--ag-header-background-color": action.hover,
                "--ag-header-foreground-color": colors.primary,
                "--ag-foreground-color": themeText.primary,
                "--ag-border-color": border.control,
                "--ag-row-border-color": border.control,
              }}
              pagination={false}
              sort={false}
              hideInternalSaveButton
              embeddedInSection
              getRowId={(params) => params.data.id}
              rowHeight={40}
              headerHeight={38}
              groupHeaderHeight={34}
            />
          </HBox>
          <HBox
            sx={{
              width: "100%",
              px: 1,
              py: 0.5,
              minHeight: 28,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              color: "primary.main",
              backgroundColor: action.hover,
            }}
          >
            <HLabel
              value="label.dde.income.summary"
              align="left"
              colon={false}
              sx={{ fontSize: 11, fontWeight: 600 }}
            />
          </HBox>
          <HBox
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" },
              borderTop: "1px solid",
              borderLeft: "1px solid",
              borderColor: border.control,
            }}
          >
            {visibleSummaryFields.map((field) => (
              <HBox
                key={field.name}
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "minmax(125px, 38%) minmax(0, 62%)", md: "40% minmax(0, 60%)" },
                  alignItems: "stretch",
                  minHeight: field.help ? 112 : 78,
                  minWidth: 0,
                  borderRight: "1px solid",
                  borderBottom: "1px solid",
                  borderColor: border.control,
                }}
              >
                <HBox
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 1.25,
                    py: 0.75,
                    backgroundColor: action.hover,
                    borderRight: "1px solid",
                    borderColor: border.control,
                  }}
                >
                  <HLabel
                    value={`label.dde.field.${field.name}`}
                    required={Boolean(field.required)}
                    align="left"
                    colon={false}
                    sx={{
                      color: "text.primary",
                      fontSize: 14,
                      fontWeight: 600,
                      lineHeight: 1.35,
                    }}
                  />
                </HBox>
                <HBox
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    minWidth: 0,
                    px: 1,
                    py: 1,
                    boxSizing: "border-box",
                  }}
                >
                    {field.type !== "checkbox" ? (
                      <HBox
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          minHeight: 18,
                        }}
                      >
                        <HLabel
                          value={field.name}
                          translate={false}
                          required={Boolean(field.required)}
                          align="left"
                          colon={false}
                          sx={{ fontSize: 12, fontWeight: "800 !important" }}
                        />
                      </HBox>
                    ) : null}
                    <HBox
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        minWidth: 0,
                        minHeight: 20,
                        flex: "0 0 auto",
                        "& > *": { width: "100%", minWidth: 0 },
                      }}
                    >
                      {renderSummaryControl(field)}
                    </HBox>
                    {field.help ? (
                      <HLabel
                        value={`label.dde.help.${field.name}`}
                        align="left"
                        colon={false}
                        sx={{
                          display: "block",
                          color: "text.secondary",
                          fontSize: 9,
                          lineHeight: 1.4,
                          whiteSpace: "normal",
                          mt: 1,
                        }}
                      />
                    ) : null}
                </HBox>
              </HBox>
            ))}
          </HBox>
          <HBox
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns:
                "76px minmax(140px, 1fr) repeat(3, minmax(80px, 1fr)) minmax(100px, 1fr) minmax(100px, 1fr) minmax(130px, 1.2fr)",
              backgroundColor: action.hover,
              color: colors.primary,
              fontWeight: 600,
              borderLeft: "1px solid",
              borderBottom: "1px solid",
              borderColor: border.control,
            }}
          >
              <HBox
                sx={{
                  gridColumn: "1 / span 5",
                  display: "flex",
                  alignItems: "center",
                  px: 1.25,
                  py: 0.75,
                  borderTop: "1px solid",
                  borderRight: "1px solid",
                  borderColor: border.control,
                }}
              >
                <HLabel
                  value="label.dde.income.monthlyTotal"
                  align="left"
                  colon={false}
                  sx={{ fontWeight: 600 }}
                />
              </HBox>
              <HBox
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  px: 1,
                  borderTop: "1px solid",
                  borderRight: "1px solid",
                  borderColor: border.control,
                }}
              >
                {formatAmount(averageTotal)}
              </HBox>
              <HBox
                sx={{
                  borderTop: "1px solid",
                  borderRight: "1px solid",
                  borderColor: border.control,
                }}
              />
              <HBox
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  px: 1,
                  borderTop: "1px solid",
                  borderRight: "1px solid",
                  borderColor: border.control,
                }}
              >
                {formatAmount(consideredTotal)}
              </HBox>
          </HBox>
        </HBox>
      </Grid>
    </SectionBlock>
  );
};

export default DdeIncomeSection;
