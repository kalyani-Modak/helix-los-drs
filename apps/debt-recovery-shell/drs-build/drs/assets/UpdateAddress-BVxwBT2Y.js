import { cH as createSvgIcon, dB as jsxRuntimeExports, ed as useIntl, v as Box, N as CircularProgress, cf as Typography, $ as $e, aW as Kg, ac as Dt, dK as ps, b0 as Lg, g as AddIcon, c2 as TableContainer, b$ as Table, c3 as TableHead, c4 as TableRow, c1 as TableCell, c0 as TableBody, bH as SE, cs as ap, ct as ar, eh as useNavigate, el as useSelector, ef as useLocation, dN as reactExports, aX as Kr, Y as CustomerInformationAPI, ch as UpdateAddressAPI, cM as fetchCustomerAddressAPI, w as Button, cj as Vg } from "./index-BhdgJqva.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
import { L as LinkedCustomerTileStrip } from "./LinkedCustomerTileStrip-BVwxQKbk.js";
import { H as HistoryOutlined } from "./HistoryOutlined-CWU8xApR.js";
const ArrowBackIosNew = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M17.77 3.77 16 2 6 12l10 10 1.77-1.77L9.54 12z"
}));
const EditOutlined = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "m14.06 9.02.92.92L5.92 19H5v-.92zM17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94z"
}));
const PlaceOutlined = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2m6-1.8C18 6.57 15.35 4 12 4s-6 2.57-6 6.2c0 2.34 1.95 5.44 6 9.14 4.05-3.7 6-6.8 6-9.14M12 2c4.2 0 8 3.22 8 8.2 0 3.32-2.67 7.25-8 11.8-5.33-4.55-8-8.48-8-11.8C4 5.22 7.8 2 12 2"
}));
function CustomerCardsSection({
  customers,
  selectedCustomerId,
  onSelectCustomer,
  loading,
  emptyMessageId
}) {
  const intl = useIntl();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { pt: 0.75, pb: 1.5 }, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1, py: 1 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircularProgress, { size: 22 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.secondary", sx: { fontSize: 12 }, children: intl.formatMessage({ id: "label.updateAddress.loadingCustomers" }) })
  ] }) : (customers == null ? void 0 : customers.length) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    LinkedCustomerTileStrip,
    {
      customers,
      selectedCustomerId,
      onSelectCustomer
    }
  ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.secondary", sx: { fontSize: 12 }, children: intl.formatMessage({
    id: emptyMessageId || "label.updateAddress.noCustomers"
  }) }) });
}
function isEditableAddressType(szAddressType2) {
  return isCollectionAddressType(szAddressType2);
}
function isCollectionAddressType(szAddressType2) {
  if (szAddressType2 == null) return false;
  const n = String(szAddressType2).trim().toLowerCase().replace(/\s+/g, " ");
  if (!n) return false;
  if (n === "cu") return true;
  if (n === "co") return true;
  if (n === "collection address") return true;
  if (n === "collections") return true;
  if (n.includes("collection") && n.includes("address")) return true;
  return n === "collection" || n.endsWith("collection address");
}
function combinedAddress(row) {
  return `${(row == null ? void 0 : row.szAddress1) || ""} ${(row == null ? void 0 : row.szAddress2) || ""} ${(row == null ? void 0 : row.szAddress3) || ""} ${(row == null ? void 0 : row.szAddress4) || ""}`.trim();
}
function AddressSummarySection({ rowData, loading, onSelectAddress, onAddCollectionsAddress, selectedAddressKey, getAddressKey }) {
  const intl = useIntl();
  const { surfaces, text, border, action, colors } = $e();
  const rows = rowData || [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Kg,
    {
      variant: "outlined",
      elevation: 0,
      sx: {
        borderRadius: "8px 8px 0 0",
        borderColor: border.divider,
        boxShadow: 1,
        overflow: "hidden",
        borderBottom: 0
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { px: 2, pt: 1.5, pb: 1, display: "flex", alignItems: "center", gap: 1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlaceOutlined, { sx: { fontSize: 16, color: colors.primary } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: intl.formatMessage({ id: "label.UpdateAddress.Address summary", defaultMessage: "Address Summary" }),
              translate: false,
              colon: false,
              align: "left",
              sx: { fontWeight: 700, fontSize: 13, flex: 1, color: text.primary }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { width: "auto", background: "transparent", "& .hbutton-wrapper": { width: "auto" } }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Lg,
            {
              label: "Add Collections Address",
              variant: "outlined",
              size: "small",
              startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(AddIcon, { sx: { fontSize: 14 } }),
              onClick: onAddCollectionsAddress,
              sx: { height: 26, borderRadius: "6px", fontSize: 11, px: 1.25, whiteSpace: "nowrap" }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableContainer, { sx: { px: 2, pb: 1.5 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { size: "small", "aria-label": "address summary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { sx: { bgcolor: surfaces.panel }, children: ["Type", "Address", "City", "State", "Zip"].map((head) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { py: 0.75, fontSize: 11, color: text.secondary, borderBottomColor: border.divider }, children: head }, head)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 5, sx: { py: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 1, background: "transparent" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircularProgress, { size: 18 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ps,
              {
                value: intl.formatMessage({ id: "label.common.loading", defaultMessage: "Loading..." }),
                translate: false,
                colon: false,
                align: "left",
                sx: { fontSize: 12 }
              }
            )
          ] }) }) }) : rows.length ? rows.map((row, index) => {
            const addressKey = (getAddressKey == null ? void 0 : getAddressKey(row)) ?? `${row.szAddressType || "address"}-${index}`;
            const selected = selectedAddressKey != null && addressKey === selectedAddressKey;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TableRow,
              {
                hover: true,
                selected,
                onClick: () => onSelectAddress == null ? void 0 : onSelectAddress(row),
                sx: {
                  cursor: "pointer",
                  "&.Mui-selected": {
                    bgcolor: action.selected
                  },
                  "&.Mui-selected:hover": {
                    bgcolor: action.hover
                  }
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { sx: { py: 0.9, fontSize: 12, color: colors.primary, fontWeight: 600 }, children: [
                    row.szAddressType || "-",
                    isEditableAddressType(row.szAddressType) ? /* @__PURE__ */ jsxRuntimeExports.jsx(EditOutlined, { sx: { ml: 0.5, fontSize: 12, verticalAlign: "middle", color: text.secondary } }) : null
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { py: 0.9, fontSize: 12, color: text.secondary }, children: combinedAddress(row) || "-" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { py: 0.9, fontSize: 12, color: text.primary }, children: row.szCity || "-" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { py: 0.9, fontSize: 12, color: text.primary }, children: row.szState || "-" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { py: 0.9, fontSize: 12, color: text.primary, fontFamily: "ui-monospace, monospace" }, children: row.szZip || "-" })
                ]
              },
              addressKey
            );
          }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 5, sx: { py: 2, fontSize: 12, color: text.secondary }, children: intl.formatMessage({ id: "label.updateAddress.noAddressRows", defaultMessage: "No addresses available." }) }) }) })
        ] }) })
      ]
    }
  );
}
function Field({ label, required, value, onChange, editable, error, type = "text", children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { minWidth: 0, background: "transparent" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ps,
      {
        value: label,
        translate: false,
        colon: false,
        required,
        align: "left",
        sx: { mb: 0.45, fontSize: 11, fontWeight: 600 }
      }
    ),
    children || /* @__PURE__ */ jsxRuntimeExports.jsx(
      ap,
      {
        width: "100%",
        editable,
        disabled: false,
        value: value || "",
        onChange: (e) => onChange == null ? void 0 : onChange(e.target.value),
        type,
        required,
        error: Boolean(error),
        sx: {
          "& .MuiInputBase-root": {
            minHeight: 30,
            borderRadius: "5px"
          },
          "& .MuiInputBase-input": {
            py: 0.25,
            fontSize: 12
          }
        }
      }
    )
  ] });
}
function AddressDetailsSection({ draftDetails, onFieldChange, fieldErrors, addressTypeForRule }) {
  const intl = useIntl();
  const { surfaces, text, border, colors } = $e();
  const hasAddressType = Boolean(draftDetails == null ? void 0 : draftDetails.szAddressType);
  const editable = isEditableAddressType(addressTypeForRule ?? (draftDetails == null ? void 0 : draftDetails.szAddressType));
  if (!hasAddressType) return null;
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback });
  const hasExistingAddressKey = Boolean(draftDetails.lnAddressSeq || draftDetails.lnSNo);
  const isCollection = isCollectionAddressType(draftDetails.szAddressType);
  const showRequired = editable && isCollection;
  const title = editable ? !isCollection ? `${t("label.updateAddress.updateAddress", "Update Address")} - ${draftDetails.szAddressType}` : hasExistingAddressKey ? t("label.updateAddress.updateCollectionsAddress", "Update Collections Address") : t("label.updateAddress.addNewCollectionsAddress", "Add New Collections Address") : `${t("label.UpdateAddress.Address details", "Address Details")} - ${draftDetails.szAddressType}`;
  const currentAddressType = draftDetails.szAddressType || "Collections";
  const addressTypeOptions = [{ label: currentAddressType, value: currentAddressType }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Kg,
    {
      variant: "outlined",
      elevation: 0,
      sx: {
        borderRadius: "8px",
        borderColor: border.divider,
        boxShadow: 1,
        overflow: "hidden",
        height: "100%"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { px: 2, pt: 1.5, pb: 1, display: "flex", alignItems: "center", gap: 1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(EditOutlined, { sx: { fontSize: 16, color: colors.primary } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: title,
              translate: false,
              colon: false,
              align: "left",
              sx: { fontWeight: 700, fontSize: 13, color: text.primary, flex: 1 }
            }
          ),
          !editable ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: t("label.updateAddress.readOnly", "Read Only"),
              translate: false,
              colon: false,
              align: "center",
              sx: {
                px: 1,
                py: 0.35,
                borderRadius: "999px",
                backgroundColor: surfaces.panel,
                fontSize: 10,
                fontWeight: 700
              }
            }
          ) : null
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            sx: {
              px: 2,
              pb: 2,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
              columnGap: 2,
              rowGap: 1.45,
              background: "transparent"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { gridColumn: "1 / -1", background: "transparent" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Field,
                {
                  label: t("label.UpdateAddress.Address Type", "Address Type"),
                  required: showRequired,
                  value: draftDetails.szAddressType,
                  editable: false,
                  error: fieldErrors.szAddressType,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SE,
                    {
                      value: draftDetails.szAddressType || "Collections",
                      options: addressTypeOptions,
                      onChange: (e) => onFieldChange("szAddressType", e.target.value),
                      readOnly: hasExistingAddressKey || !editable,
                      required: showRequired,
                      width: "100%",
                      error: Boolean(fieldErrors.szAddressType)
                    }
                  )
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Field,
                {
                  label: t("label.UpdateAddress.Contact Person", "Contact Person"),
                  required: showRequired,
                  value: draftDetails.szContactPerson,
                  editable,
                  onChange: (value) => onFieldChange("szContactPerson", value),
                  error: fieldErrors.szContactPerson
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Field,
                {
                  label: t("label.UpdateAddress.Address line 1", "Address 1"),
                  required: showRequired,
                  value: draftDetails.szAddress1,
                  editable,
                  onChange: (value) => onFieldChange("szAddress1", value),
                  error: fieldErrors.szAddress1
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Field,
                {
                  label: t("label.UpdateAddress.Address line 2", "Address 2"),
                  value: draftDetails.szAddress2,
                  editable,
                  onChange: (value) => onFieldChange("szAddress2", value),
                  error: fieldErrors.szAddress2
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Field,
                {
                  label: t("label.UpdateAddress.Address line 3", "Address 3"),
                  value: draftDetails.szAddress3,
                  editable,
                  onChange: (value) => onFieldChange("szAddress3", value)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Field,
                {
                  label: t("label.UpdateAddress.Address line 4", "Address 4"),
                  value: draftDetails.szAddress4,
                  editable,
                  onChange: (value) => onFieldChange("szAddress4", value)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Field,
                {
                  label: t("label.UpdateAddress.City", "City"),
                  required: showRequired,
                  value: draftDetails.szCity,
                  editable,
                  onChange: (value) => onFieldChange("szCity", value),
                  error: fieldErrors.szCity
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Field,
                {
                  label: t("label.UpdateAddress.State", "State"),
                  required: showRequired,
                  value: draftDetails.szState,
                  editable,
                  onChange: (value) => onFieldChange("szState", value),
                  error: fieldErrors.szState
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Field,
                {
                  label: t("label.UpdateAddress.Country", "Country"),
                  required: showRequired,
                  value: draftDetails.szCountry || "India",
                  editable,
                  onChange: (value) => onFieldChange("szCountry", value),
                  error: fieldErrors.szCountry
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Field,
                {
                  label: t("label.UpdateAddress.Zip", "Zip"),
                  required: showRequired,
                  value: draftDetails.szZip,
                  editable,
                  onChange: (value) => onFieldChange("szZip", value),
                  error: fieldErrors.szZip
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Field,
                {
                  label: t("label.UpdateAddress.Mobile No", "Mobile"),
                  required: showRequired,
                  value: draftDetails.szMobileNo,
                  editable,
                  onChange: (value) => onFieldChange("szMobileNo", value),
                  error: fieldErrors.szMobileNo,
                  type: "phone"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Field,
                {
                  label: t("label.UpdateAddress.Email", "Email"),
                  value: draftDetails.szMailId,
                  editable,
                  onChange: (value) => onFieldChange("szMailId", value)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Field,
                {
                  label: t("label.UpdateAddress.Phone 1", "Telephone"),
                  value: draftDetails.szPhone1,
                  editable,
                  onChange: (value) => onFieldChange("szPhone1", value),
                  type: "phone"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Field,
                {
                  label: t("label.UpdateAddress.Fax", "Fax"),
                  value: draftDetails.szFax,
                  editable,
                  onChange: (value) => onFieldChange("szFax", value)
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function combinedHistoryAddress(row) {
  return `${(row == null ? void 0 : row.szAddress1) || ""} ${(row == null ? void 0 : row.szAddress2) || ""} ${(row == null ? void 0 : row.szAddress3) || ""} ${(row == null ? void 0 : row.szAddress4) || ""}`.trim();
}
function formatChangedOn(val) {
  if (val == null || val === "") return "";
  if (typeof val === "string") return val.length >= 10 ? val.slice(0, 10) : val;
  if (Array.isArray(val) && val.length >= 3) {
    const [y, m, d2] = val;
    return `${y}-${String(m).padStart(2, "0")}-${String(d2).padStart(2, "0")}`;
  }
  const d = new Date(val);
  return Number.isNaN(d.getTime()) ? String(val) : d.toISOString().slice(0, 10);
}
function AddressHistorySection({ rowData, loading }) {
  const intl = useIntl();
  const { surfaces, text, border, colors } = $e();
  const rows = rowData || [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Kg,
    {
      variant: "outlined",
      elevation: 0,
      sx: {
        borderRadius: "0 0 8px 8px",
        borderColor: border.divider,
        boxShadow: 1,
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { px: 2, pt: 1.5, pb: 1, display: "flex", alignItems: "center", gap: 1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryOutlined, { sx: { fontSize: 16, color: colors.primary } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: intl.formatMessage({ id: "label.UpdateAddress.Update Address History", defaultMessage: "Update History" }),
              translate: false,
              colon: false,
              align: "left",
              sx: { fontWeight: 700, fontSize: 13, color: text.primary }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { px: 2, pb: 1.5 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { size: "small", "aria-label": "address update history", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { sx: { bgcolor: surfaces.panel }, children: ["Contact", "Type", "Address", "City", "Zip", "Changed"].map((head) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { py: 0.75, fontSize: 11, color: text.secondary, borderBottomColor: border.divider }, children: head }, head)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, sx: { py: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 1, background: "transparent" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircularProgress, { size: 18 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ps,
              {
                value: intl.formatMessage({ id: "label.common.loading", defaultMessage: "Loading..." }),
                translate: false,
                colon: false,
                align: "left",
                sx: { fontSize: 12 }
              }
            )
          ] }) }) }) : rows.length ? rows.map((row, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { py: 0.85, fontSize: 11, color: text.primary }, children: row.szContactPerson || row.szCreatedBy || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { py: 0.85, fontSize: 11, color: text.primary }, children: row.szAddressType || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { py: 0.85, fontSize: 11, color: text.secondary }, children: combinedHistoryAddress(row) || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { py: 0.85, fontSize: 11, color: text.primary }, children: row.szCity || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { py: 0.85, fontSize: 11, color: text.primary, fontFamily: "ui-monospace, monospace" }, children: row.szZip || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { py: 0.85, fontSize: 11, color: text.primary }, children: formatChangedOn(row.dtCreatedOn) })
          ] }, `${row.szAddressType || "history"}-${index}`)) : /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, sx: { py: 2, fontSize: 12, color: text.secondary }, children: intl.formatMessage({ id: "label.updateAddress.noHistoryRows", defaultMessage: "No update history available." }) }) }) })
        ] }) })
      ]
    }
  );
}
function normalizeLinkedCustomersFromApi(responseJson, selectedRow) {
  const rawList = Array.isArray(responseJson) ? responseJson : responseJson != null ? [responseJson] : [];
  const mapped = rawList.map((raw, idx) => {
    if (!raw || typeof raw !== "object") return null;
    const custSeq = raw.lnCustomerSeqNo ?? raw.custSeqNo ?? raw.CUST_SEQNO ?? raw.iCustomerSeqNo ?? raw.customerSeqNo;
    if (custSeq == null || custSeq === "") return null;
    const seqNum = Number(custSeq);
    if (Number.isNaN(seqNum)) return null;
    const name = raw.szName ?? raw.customerName ?? raw.szCustomerName ?? raw.name ?? raw.CUSTOMER_NAME ?? raw.custName ?? "";
    const role = raw.szRelationType ?? raw.szCustomerType ?? raw.szRole ?? raw.role ?? raw.RELATION_TYPE ?? "";
    const customerNo = raw.szLegacyCustomerNo ?? raw.customerNo ?? raw.legacyCustomerNo ?? raw.CUSTOMER_NO ?? "";
    return {
      id: String(seqNum),
      custSeqNo: seqNum,
      name: String(name || "").trim() || `Customer ${seqNum}`,
      role: String(role || "").trim() || "—",
      customerNo: customerNo != null ? String(customerNo) : ""
    };
  }).filter(Boolean);
  if (mapped.length > 0) return mapped;
  return [];
}
const emptyAddressDetails = () => ({
  lnAddressSeq: "",
  lnSNo: 1,
  szAddressType: "",
  szContactPerson: "",
  szAddress1: "",
  szAddress2: "",
  szAddress3: "",
  szAddress4: "",
  szCity: "",
  szState: "",
  szCountry: "",
  szZip: "",
  szMobileNo: "",
  szMailId: "",
  szPhone1: "",
  szFax: ""
});
function extractResponseJsonObject(res) {
  var _a;
  const j = (_a = res == null ? void 0 : res.data) == null ? void 0 : _a.responseJson;
  if (j == null) return null;
  if (Array.isArray(j)) return j[0] ?? null;
  return typeof j === "object" ? j : null;
}
function firstPresent(...values) {
  return values.find((value) => value !== void 0 && value !== null && value !== "") ?? "";
}
function UpdateAddress() {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((state) => state.account);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const [customers, setCustomers] = reactExports.useState([]);
  const [customersLoading, setCustomersLoading] = reactExports.useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = reactExports.useState(null);
  const [summaryRows, setSummaryRows] = reactExports.useState([]);
  const [summaryLoading, setSummaryLoading] = reactExports.useState(false);
  const [historyRows, setHistoryRows] = reactExports.useState([]);
  const [historyLoading, setHistoryLoading] = reactExports.useState(false);
  const [detailsLoading, setDetailsLoading] = reactExports.useState(false);
  const [draftDetails, setDraftDetails] = reactExports.useState(emptyAddressDetails);
  const [baselineDetails, setBaselineDetails] = reactExports.useState(emptyAddressDetails);
  const [fieldErrors, setFieldErrors] = reactExports.useState({});
  const [selectedAddress, setSelectedAddress] = reactExports.useState(null);
  const [isEditMode, setIsEditMode] = reactExports.useState(false);
  const selectedCustomer = reactExports.useMemo(
    () => customers.find((c) => c.id === selectedCustomerId) || null,
    [customers, selectedCustomerId]
  );
  const hasCustomerContext = Boolean(selectedRow && selectedCustomer);
  const getAddressKey = reactExports.useCallback((row) => {
    if (!row) return "";
    return [
      row.lnAddressSeq ?? row.iaddressseq ?? "",
      row.lnSNo ?? row.lnsno ?? "",
      row.szAddressType ?? "",
      row.szAddress1 ?? "",
      row.szCity ?? "",
      row.szZip ?? ""
    ].join("|");
  }, []);
  const selectedAddressKey = reactExports.useMemo(
    () => selectedAddress ? getAddressKey(selectedAddress) : null,
    [getAddressKey, selectedAddress]
  );
  const clearEditState = reactExports.useCallback(() => {
    setSelectedAddress(null);
    setIsEditMode(false);
    setDraftDetails(emptyAddressDetails());
    setBaselineDetails(emptyAddressDetails());
    setFieldErrors({});
  }, []);
  const fetchLinkedCustomersList = reactExports.useCallback(() => {
    if (!selectedRow) return;
    setCustomersLoading(true);
    Kr.GET(
      CustomerInformationAPI.fetchLinkedCustomers(screenMenuId)
    ).then((res) => {
      var _a, _b, _c, _d, _e;
      if (((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.status) === "Success" && Array.isArray((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.responseJson)) {
        const normalized = normalizeLinkedCustomersFromApi(
          res.data.responseJson
        );
        setCustomers(normalized);
        setSelectedCustomerId((prev) => {
          var _a2;
          if (prev && normalized.some((c) => c.id === prev)) {
            return prev;
          }
          return ((_a2 = normalized[0]) == null ? void 0 : _a2.id) ?? null;
        });
      } else if (((_c = res == null ? void 0 : res.data) == null ? void 0 : _c.status) === "Failure" && ((_d = res == null ? void 0 : res.data) == null ? void 0 : _d.message) === "Validation Failed") {
        handleValidationErrors(
          intl,
          toast,
          res.data.responseJson
        );
        setCustomers([]);
        setSelectedCustomerId(null);
      } else {
        setCustomers([]);
        setSelectedCustomerId(null);
        if ((_e = res == null ? void 0 : res.data) == null ? void 0 : _e.message) {
          toast.warning(res.data.message);
        }
      }
    }).catch((err) => {
      var _a;
      console.error(
        "fetchLinkedCustomers error:",
        err
      );
      setCustomers([]);
      setSelectedCustomerId(null);
      if (!((_a = err == null ? void 0 : err.response) == null ? void 0 : _a.status) || err.response.status < 500) {
        toast.error(
          intl.formatMessage({
            id: "label.updateAddress.customersLoadError"
          })
        );
      }
    }).finally(() => {
      setCustomersLoading(false);
    });
  }, [selectedRow, intl, toast]);
  reactExports.useEffect(() => {
    if (!selectedRow) {
      setCustomers([]);
      setSelectedCustomerId(null);
      return;
    }
    fetchLinkedCustomersList();
  }, [selectedRow, fetchLinkedCustomersList]);
  const refreshSummaryRows = reactExports.useCallback(() => {
    if (!hasCustomerContext) return Promise.resolve();
    setSummaryLoading(true);
    console.log("Before GET");
    return Kr.GET(UpdateAddressAPI.UpdateAddressApi(screenMenuId)).then((res) => {
      if (res.data.status === "Success" && Array.isArray(res.data.responseJson)) {
        setSummaryRows(res.data.responseJson);
      } else if (res.data.status === "Failure" && res.data.message === "Validation Failed") {
        handleValidationErrors(intl, toast, res.data.responseJson);
      } else {
        setSummaryRows([]);
      }
    }).catch((err) => {
      console.error("fetchAddressSummary error:", err);
      toast.error(intl.formatMessage({ id: "label.updateAddress.summaryLoadError" }));
      setSummaryRows([]);
    }).finally(() => setSummaryLoading(false));
  }, [hasCustomerContext, intl, toast]);
  const refreshHistoryRows = reactExports.useCallback(() => {
    if (!hasCustomerContext) return Promise.resolve();
    setHistoryLoading(true);
    return Kr.GET(`${UpdateAddressAPI.UpdateAddressApi(screenMenuId)}/fetchCustomerAddressHistory`).then((res) => {
      if (res.data.status === "Success" && Array.isArray(res.data.responseJson)) {
        setHistoryRows(res.data.responseJson);
      } else if (res.data.status === "Failure" && res.data.message === "Validation Failed") {
        handleValidationErrors(intl, toast, res.data.responseJson);
        setHistoryRows([]);
      } else {
        setHistoryRows([]);
      }
    }).catch((err) => {
      console.error("fetchAddressHistory error:", err);
      setHistoryRows([]);
    }).finally(() => setHistoryLoading(false));
  }, [hasCustomerContext, intl, toast]);
  reactExports.useEffect(() => {
    if (!hasCustomerContext) return;
    setSummaryRows([]);
    setHistoryRows([]);
    clearEditState();
    refreshSummaryRows();
    refreshHistoryRows();
  }, [hasCustomerContext, refreshSummaryRows, refreshHistoryRows, clearEditState]);
  const handleSelectCustomer = reactExports.useCallback((id) => {
    setSelectedCustomerId(id);
    setSummaryRows([]);
    setHistoryRows([]);
    clearEditState();
  }, [clearEditState]);
  const loadDetailsAndHistory = reactExports.useCallback(
    async (addressType, sourceRow = null) => {
      if (!hasCustomerContext || !addressType) return false;
      setDetailsLoading(true);
      setHistoryLoading(true);
      try {
        const [dRes, hRes] = await Promise.all([
          Kr.GET(fetchCustomerAddressAPI.fetchCustomerAddress(screenMenuId), `${szAddressType}`),
          Kr.GET(`${UpdateAddressAPI.UpdateAddressApi(screenMenuId)}/fetchCustomerAddressHistory`)
        ]);
        let detailsLoaded = false;
        if (dRes.data.status === "Success") {
          const row = extractResponseJsonObject(dRes);
          if (row) {
            const next = {
              ...emptyAddressDetails(),
              ...sourceRow,
              ...row,
              lnAddressSeq: firstPresent(row.lnAddressSeq, sourceRow == null ? void 0 : sourceRow.lnAddressSeq, sourceRow == null ? void 0 : sourceRow.iaddressseq),
              lnSNo: firstPresent(row.lnSNo, sourceRow == null ? void 0 : sourceRow.lnSNo, sourceRow == null ? void 0 : sourceRow.lnsno)
            };
            setDraftDetails(next);
            setBaselineDetails({ ...next });
            setSelectedAddress(next);
            detailsLoaded = true;
          } else {
            const fallback = sourceRow ? {
              ...emptyAddressDetails(),
              ...sourceRow,
              lnAddressSeq: firstPresent(sourceRow.lnAddressSeq, sourceRow.iaddressseq),
              lnSNo: firstPresent(sourceRow.lnSNo, sourceRow.lnsno)
            } : emptyAddressDetails();
            setDraftDetails(fallback);
            setBaselineDetails({ ...fallback });
            setSelectedAddress(sourceRow ? fallback : null);
            detailsLoaded = Boolean(sourceRow);
          }
        } else if (dRes.data.status === "Failure" && dRes.data.message === "Validation Failed") {
          handleValidationErrors(intl, toast, dRes.data.responseJson);
          setDraftDetails(emptyAddressDetails());
          setBaselineDetails(emptyAddressDetails());
          setSelectedAddress(null);
        } else {
          setDraftDetails(emptyAddressDetails());
          setBaselineDetails(emptyAddressDetails());
          setSelectedAddress(null);
        }
        if (hRes.data.status === "Success" && Array.isArray(hRes.data.responseJson)) {
          setHistoryRows(hRes.data.responseJson);
        } else if (hRes.data.status === "Failure" && hRes.data.message === "Validation Failed") {
          handleValidationErrors(intl, toast, hRes.data.responseJson);
          setHistoryRows([]);
        } else {
          setHistoryRows([]);
        }
        return detailsLoaded;
      } catch (err) {
        console.error("loadDetailsAndHistory error:", err);
        toast.error(intl.formatMessage({ id: "label.updateAddress.detailsLoadError" }));
        setDraftDetails(emptyAddressDetails());
        setBaselineDetails(emptyAddressDetails());
        setSelectedAddress(null);
        setHistoryRows([]);
        return false;
      } finally {
        setDetailsLoading(false);
        setHistoryLoading(false);
      }
    },
    [hasCustomerContext, intl, toast]
  );
  const handleSelectAddressRow = reactExports.useCallback(
    async (row) => {
      if (!(row == null ? void 0 : row.szAddressType)) return;
      setFieldErrors({});
      setSelectedAddress(row);
      setIsEditMode(false);
      const loaded = await loadDetailsAndHistory(row.szAddressType, row);
      setIsEditMode(Boolean(loaded));
    },
    [loadDetailsAndHistory]
  );
  const handleFieldChange = reactExports.useCallback((field, value) => {
    setDraftDetails((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);
  reactExports.useCallback(() => {
    setDraftDetails({ ...baselineDetails });
    setFieldErrors({});
    return { success: true };
  }, [baselineDetails]);
  const handleBack = reactExports.useCallback(() => {
    navigate("/homelayout/OverView");
  }, [navigate]);
  const handleAddCollectionsAddress = reactExports.useCallback(() => {
    const next = {
      ...emptyAddressDetails(),
      szAddressType: "Co",
      szCountry: "India",
      szContactPerson: (selectedCustomer == null ? void 0 : selectedCustomer.name) || (selectedRow == null ? void 0 : selectedRow.CUSTOMER_NAME) || (selectedRow == null ? void 0 : selectedRow.szCustomerName) || ""
    };
    setSelectedAddress(next);
    setDraftDetails(next);
    setBaselineDetails(next);
    setFieldErrors({});
    setIsEditMode(true);
  }, [selectedCustomer, selectedRow]);
  const handleSaveAddress = reactExports.useCallback(async () => {
    if (!isEditMode || !selectedAddress) {
      return { success: false, message: intl.formatMessage({ id: "label.updateAddress.selectAddressToUpdate", defaultMessage: "Select an address to update." }) };
    }
    if (!isEditableAddressType(draftDetails.szAddressType)) {
      return { success: false, message: intl.formatMessage({ id: "label.updateAddress.saveNotAllowed" }) };
    }
    if (!hasCustomerContext) {
      return { success: false, message: intl.formatMessage({ id: "label.updateAddress.noAccountContext" }) };
    }
    const objRequiredFields = [
      { field: "szAddressType", label: "label.UpdateAddress.Address Type" },
      { field: "szContactPerson", label: "label.UpdateAddress.Contact Person" },
      { field: "szAddress1", label: "label.UpdateAddress.Address line 1" },
      { field: "szCity", label: "label.UpdateAddress.City" },
      { field: "szState", label: "label.UpdateAddress.State" },
      { field: "szCountry", label: "label.UpdateAddress.Country" },
      { field: "szZip", label: "label.UpdateAddress.Zip" },
      { field: "szMobileNo", label: "label.UpdateAddress.Mobile No" }
    ];
    const newFieldErrors = {};
    const objMissingFields = objRequiredFields.filter((item) => !draftDetails[item.field] || String(draftDetails[item.field]).trim() === "").map((item) => {
      newFieldErrors[item.field] = true;
      const translatedLabel = intl.formatMessage({
        id: item.label,
        defaultMessage: item.label
      });
      return `${translatedLabel} is mandatory`;
    });
    setFieldErrors(newFieldErrors);
    if (objMissingFields.length > 0) {
      if (objMissingFields.length === objRequiredFields.length) {
        toast.error(intl.formatMessage({ id: "label.updateAddress.allRequired" }), { autoClose: 5e3 });
      } else {
        toast.error(
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: objMissingFields.map((msg, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: msg }, idx)) }),
          { autoClose: 5e3 }
        );
      }
      return { success: false, message: intl.formatMessage({ id: "label.updateAddress.validationFailed" }) };
    }
    const objSaveRequest = {
      addressRequestDto: { ...selectedAddress, ...draftDetails }
    };
    try {
      const res = await Kr.POST(`${UpdateAddressAPI.UpdateAddressApi(screenMenuId)}/saveCustomerAddress`, objSaveRequest);
      if (res.data.status === "Success") {
        setFieldErrors({});
        await refreshSummaryRows();
        await refreshHistoryRows();
        clearEditState();
        return { data: { status: "Success", message: res.data.message } };
      }
      return { data: { status: "Failure", message: res.data.message || "Save failed" } };
    } catch (err) {
      console.error("Save API error:", err);
      return { data: { status: "Failure", message: intl.formatMessage({ id: "label.updateAddress.saveGenericError" }) } };
    }
  }, [isEditMode, selectedAddress, draftDetails, hasCustomerContext, intl, toast, refreshSummaryRows, refreshHistoryRows, clearEditState]);
  const showFloatingBar = isEditMode && isEditableAddressType(draftDetails.szAddressType) && Boolean(draftDetails.szAddressType) && !detailsLoading;
  if (!selectedRow) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      FunctionLayout,
      {
        title: intl.formatMessage({
          id: "label.UpdateAddress.Update Address",
          defaultMessage: "Update Address"
        }),
        contentPaddingTop: 0,
        scrollMode: "contain",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Kg, { sx: { m: 2, p: 2, borderRadius: "8px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ps,
          {
            value: intl.formatMessage({ id: "label.updateAddress.noAccountSelected" }),
            translate: false,
            colon: false,
            align: "left",
            sx: { fontSize: 13 }
          }
        ) })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    FunctionLayout,
    {
      title: intl.formatMessage({
        id: "label.UpdateAddress.Update Address",
        defaultMessage: "Update Address"
      }),
      contentPaddingTop: 0,
      scrollMode: "contain",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            className: "drs-page-container",
            sx: {
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              px: { xs: 1.5, sm: 2 },
              pt: 0,
              pb: 0,
              maxWidth: 1320,
              mx: "auto",
              width: "100%",
              background: "transparent"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Dt,
              {
                sx: {
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  overflowX: "hidden",
                  pb: showFloatingBar ? 8 : 2,
                  background: "transparent"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "small",
                      startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowBackIosNew, { sx: { fontSize: 14 } }),
                      onClick: handleBack,
                      sx: { mb: 1, px: 0, color: "text.primary", textTransform: "none", fontSize: 13 },
                      children: "Back"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CustomerCardsSection,
                    {
                      customers,
                      selectedCustomerId,
                      onSelectCustomer: handleSelectCustomer,
                      loading: customersLoading
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Dt,
                    {
                      sx: {
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", lg: draftDetails.szAddressType ? "minmax(0, 1fr) minmax(420px, 1fr)" : "minmax(0, 628px)" },
                        gap: 2,
                        alignItems: "flex-start",
                        background: "transparent"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 1.25, width: "100%", minWidth: 0, background: "transparent" }, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            AddressSummarySection,
                            {
                              rowData: summaryRows,
                              loading: summaryLoading,
                              onSelectAddress: handleSelectAddressRow,
                              onAddCollectionsAddress: handleAddCollectionsAddress,
                              selectedAddressKey,
                              getAddressKey
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(AddressHistorySection, { rowData: historyRows, loading: historyLoading })
                        ] }),
                        draftDetails.szAddressType ? /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { minWidth: 0, background: "transparent" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          AddressDetailsSection,
                          {
                            draftDetails,
                            onFieldChange: handleFieldChange,
                            fieldErrors,
                            addressTypeForRule: draftDetails.szAddressType
                          }
                        ) }) : null
                      ]
                    }
                  )
                ]
              }
            )
          }
        ),
        showFloatingBar ? /* @__PURE__ */ jsxRuntimeExports.jsx(Vg, { onSave: handleSaveAddress, onClose: handleBack }) : null
      ]
    }
  );
}
export {
  UpdateAddress as default
};
