import { useMemo } from "react";
import { Grid } from "@mui/material";
import {
  HAgGrid,
  HBox,
  HCheckBox,
  HLabel,
  HTextField,
  useDrsTheme,
} from "@helix/component-library";
import { useIntl } from "react-intl";
import SectionBlock from "../components/SectionBlock";
import { DDE_FIELDS } from "../constants/ddeFieldMetadata";

const TAX_FIELDS = DDE_FIELDS.filter((field) => field.section === "Tax Details");
const YEAR_FIELDS = [1, 2, 3].map((year) => ({
  year,
  assessment: TAX_FIELDS.find((field) => field.name === `taxYear${year}`),
  statutory: TAX_FIELDS.find((field) => field.name === `taxYear${year}StatutoryIncome`),
  assessable: TAX_FIELDS.find((field) => field.name === `taxYear${year}AssessableIncome`),
  paid: TAX_FIELDS.find((field) => field.name === `taxYear${year}TaxPaid`),
}));
const NUMBER_ROW_IDS = new Set(["statutory-income", "assessable-income", "tax-paid"]);

const DdeTaxSection = ({
  form,
  setField,
  errors,
  expanded,
  onExpandedChange,
  icon,
}) => {
  const intl = useIntl();
  const text = intl.formatMessage;
  const { colors, text: themeText, border, action } = useDrsTheme();
  const fieldByName = (name) => TAX_FIELDS.find((field) => field.name === name);

  const renderInput = (field, placeholder) => (
    <HTextField
      value={form[field.name] ?? ""}
      onChange={(event) => setField(field.name, event.target.value)}
      editable
      required={Boolean(field.required)}
      error={Boolean(errors?.[field.name])}
      type={field.type === "number" ? "number" : "text"}
      placeholder={placeholder ?? field.placeholder}
      width="100%"
    />
  );

  const renderCheckbox = (field) => (
    <HBox
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 0.75,
        minHeight: 36,
        minWidth: 0,
      }}
    >
      <HCheckBox
        sx={{ width: 20, flex: "0 0 20px", p: 0, m: 0 }}
        checked={Boolean(form[field.name])}
        onChange={(event) => setField(field.name, event.target.checked)}
      />
      <HBox sx={{ minWidth: 0, "& > *": { whiteSpace: "normal" } }}>
        <HLabel sx={{color: "text.primary" }} value={`label.dde.field.${field.name}`} align="left" colon={false} />
      </HBox>
    </HBox>
  );

  const rowData = useMemo(
    () => [
     
      {
        id: "statutory-income",
        particular: text({ id: "label.dde.tax.statutoryIncome" }),
        ...Object.fromEntries(
          YEAR_FIELDS.map(({ year }) => [
            `taxYear${year}`,
            form[`taxYear${year}StatutoryIncome`] ?? "",
          ])
        ),
      },
      {
        id: "assessable-income",
        particular: text({ id: "label.dde.tax.assessableIncome" }),
        ...Object.fromEntries(
          YEAR_FIELDS.map(({ year }) => [
            `taxYear${year}`,
            form[`taxYear${year}AssessableIncome`] ?? "",
          ])
        ),
      },
      {
        id: "tax-paid",
        particular: text({ id: "label.dde.tax.taxPaid" }),
        ...Object.fromEntries(
          YEAR_FIELDS.map(({ year }) => [
            `taxYear${year}`,
            form[`taxYear${year}TaxPaid`] ?? "",
          ])
        ),
      },
    ],
    [form, text]
  );

  const columnDefs = useMemo(() => {
    const headerStyle = {
      backgroundColor: action.hover,
      color: colors.primary,
      fontWeight: 600,
      whiteSpace: "normal",
    };
    const valueColumns = YEAR_FIELDS.map(({ year }) => ({
      headerName: text({ id: `label.dde.tax.year${year}` }),
      field: `taxYear${year}`,
      minWidth: 150,
      flex: 1,
      editable: true,
      cellEditorSelector: (params) => ({
        component: NUMBER_ROW_IDS.has(params.data?.id)
          ? "agNumberCellEditor"
          : "agTextCellEditor",
      }),
      valueParser: (params) => {
        if (!NUMBER_ROW_IDS.has(params.data?.id)) return params.newValue ?? "";
        if (params.newValue === "" || params.newValue == null) return "";
        const number = Number(params.newValue);
        return Number.isFinite(number) ? number : "";
      },
      onCellValueChanged: (params) => {
        const field = YEAR_FIELDS.find((item) => `taxYear${item.year}` === params.colDef.field);
        if (!field) return;
        const formField =
         params.data.id === "statutory-income"
              ? field.statutory.name
              : params.data.id === "assessable-income"
                ? field.assessable.name
                : field.paid.name;
        setField(formField, params.newValue == null ? "" : String(params.newValue));
      },
      filter: false,
      sortable: false,
      headerStyle,
    }));

    return [
      {
        headerName: text({ id: "label.dde.tax.particulars" }),
        field: "particular",
        minWidth: 190,
        flex: 1.1,
        editable: false,
        filter: false,
        sortable: false,
        headerStyle,
        cellStyle: { fontWeight: 500 },
      },
      ...valueColumns,
    ];
  }, [action.hover, colors.primary, setField, text]);

  return (
    <SectionBlock
      sectionKey="tax"
      titleKey="label.dde.section.tax"
      subTitleKey="label.dde.section.tax.subtitle"
      icon={icon}
      defaultExpanded={false}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
    >
      <Grid size={12} sx={{ minWidth: 0, p: "0 !important" }}>
        <HBox sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <HBox
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(3, minmax(0, 1fr))" },
              columnGap: 1.5,
              rowGap: 1.5,
              mb: 1.5,
              alignItems: "start",
            }}
          >
            {["taxPayerTin", "taxFileNumber", "taxAssessedBy"].map((name) => {
              const field = fieldByName(name);
              return (
                <HBox
                  key={name}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    minWidth: 0,
                    minHeight: field.help ? 80 : 54,
                  }}
                >
                  <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <HLabel
                    sx={{color: "text.primary"}}
                      value={`label.dde.field.${name}`}
                      required={Boolean(field.required)}
                      align="left"
                      colon={false}
                    />
                    <HBox
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        minWidth: 0,
                        minHeight: 36,
                        flex: "0 0 auto",
                        "& > *": { width: "100%", minWidth: 0 },
                      }}
                    >
                      {renderInput(field)}
                    </HBox>
                    {field.help ? (
                      <HLabel
                        value={`label.dde.help.${name}`}
                        align="left"
                        colon={false}
                        sx={{
                          display: "block",
                          color: "text.secondary",
                          fontSize: 10,
                          lineHeight: 1.4,
                          whiteSpace: "normal",
                          mt: 0.75,
                        }}
                      />
                    ) : null}
                  </HBox>
                </HBox>
              );
            })}
          </HBox>

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
                fontWeight: "500 !important",
                fontSize: "14px !important",
              },
                "& .ag-header .ag-header-cell.dde-tax-particulars-header .ag-header-cell-text": {
                  fontWeight: "900 !important",
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
                height: 150,
                "--ag-header-background-color": action.hover,
                "--ag-header-foreground-color": colors.primary,
                "--ag-foreground-color": themeText.primary,
                "--ag-border-color": border.control,
                "--ag-row-border-color": border.control,
              }}
              pagination={false}
              suppressPaginationPanel
              sort={false}
              hideInternalSaveButton
              embeddedInSection
              getRowId={(params) => params.data.id}
            />
          </HBox>

          <HBox
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(3, minmax(0, 1fr))" },
              columnGap: 1.5,
              rowGap: 0.5,
              mb : 1,
              alignItems: "center",
            }}
          >
            <HBox sx={{ minWidth: 0 }}>
              {renderCheckbox(fieldByName("taxReturnsFiledOnTime"))}
            </HBox>
            <HBox sx={{ minWidth: 0 }}>
              {renderCheckbox(fieldByName("taxDuesOutstanding"))}
            </HBox>
            <HBox sx={{ minWidth: 0 }}>
              <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <HLabel
                  sx={{color: "text.primary" }}
                  value="label.dde.field.taxOutstandingAmount"
                  align="left"
                  colon={false}
                />
                {renderInput(fieldByName("taxOutstandingAmount"))}
              </HBox>
            </HBox>
          </HBox>
        </HBox>
      </Grid>
    </SectionBlock>
  );
};

export default DdeTaxSection;
