import {Typography } from "@mui/material";
import { HAxiosService, HBox, HButtonBar, HDropdown, HLabel, HTextField, TitleBar, HCheckBox, HButton, HBreadCrumb, HAgGrid, useToast } from "@helix/component-library";
import { useEffect, useState, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";

import { handleValidationErrors } from "../../early-collection/ValidationUtils.jsx";
import { TransactionMasterAPI } from "../apiEndpoints.jsx";
import { getTransactionMasterColumnDefs } from "./transactionMaster.columnDefs";
 import "./transaction-master.screen.css";


const TransactionMaster = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const gridRef = useRef(null);

  const [rowData, setRowData] = useState([]);

  const [systemOptions, setSystemOptions] = useState([]);     // [{ Code, Desc }]
  const [paymentTypeOptions, setPaymentTypeOptions] = useState([]); // [{ Code, Desc }]

  const [selectedSystem, setSelectedSystem] = useState("");
  const [loading,setLoading] = useState(true);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const translations = (key) =>
    key ? intl.formatMessage({ id: key, defaultMessage: key }) : "";

  const normalize = (item) => ({
    Code: item.szCondition ?? "",
    Desc: item.szi18nDesc || item.szCondition || "",
  });

const renderCheckBox = (field) => (params) => (
<HBox
  onMouseDown={(e) => e.stopPropagation()}
  onClick={(e) => e.stopPropagation()}
  sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
      backgroundColor: "transparent", // Force transparent background
      '&:hover': {
        backgroundColor: "transparent", // Prevent hover background on wrapper
      }
    }}
>
    <HCheckBox
      checked={params.data?.[field] === "Y"}
      label=""
      onChange={(e) => {
        const value = e.target.checked ? "Y" : "N";

        // IMPORTANT → use setDataValue
        params.node.setDataValue(field, value);

        // mark row modified
        params.node.setData({
          ...params.data,
          [field]: value,
          mode: params.data.mode || "E",
        });
      }}
    />
  </HBox>
);
  const columnDefs = useMemo(() =>getTransactionMasterColumnDefs(intl,paymentTypeOptions,translations,renderCheckBox),[intl.locale, paymentTypeOptions]);

  // ─── Fetch initial meta data ───────────────────────────────────────────────
  const fetchInitial = () => {
     setLoading(true);
    HAxiosService.GET(TransactionMasterAPI.TransactionMaster(screenMenuId) + `/initialFetch`)
      .then((res) => {
        const responseJson = res.data?.responseJson;

        if (
          responseJson &&
          Array.isArray(responseJson.lstLegacySystem) &&
          responseJson.lstLegacySystem.length > 0
        ) {
          // ✅ Normalize at fetch time — same as FeeMaster's setMetaData
          const normalizedSystems = responseJson.lstLegacySystem.map(normalize);
          const normalizedPaymentTypes = Array.isArray(responseJson.lstPaymentTypes)
            ? responseJson.lstPaymentTypes.map(normalize)
            : [];

          setSystemOptions(normalizedSystems);
          setPaymentTypeOptions(normalizedPaymentTypes);

          // Default select first system
          setSelectedSystem(normalizedSystems[0].Code);
        } else {
          toast.warn(
            intl.formatMessage({
              id: "label.TransactionMaster.noSystemOptions",
              defaultMessage: "No system options available",
            })
          );
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            id: "label.TransactionMaster.fetchSystemError",
            defaultMessage: "Error while fetching system options",
          })
        );
      }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchInitial();
  }, [intl.locale]);

  // ─── System dropdown change ────────────────────────────────────────────────
  const handleSystemChange = (event) => {
    setSelectedSystem(event.target.value);
  };

  // ─── Fetch transaction rows ────────────────────────────────────────────────
  const handleFetchData = () => {
    if (!selectedSystem) {
      toast.warn(
        intl.formatMessage({
          id: "label.TransactionMaster.selectSystem",
          defaultMessage: "Please select a system first",
        })
      );
      return;
    }
      setLoading(true);

    HAxiosService.GET(TransactionMasterAPI.TransactionMaster(screenMenuId) + `?szSystem=${selectedSystem}`)
      .then((res) => {
        const responseJson = res.data?.responseJson;
        if (!responseJson) {
          setRowData([]);
          toast.warn(
            intl.formatMessage({
              id: "label.TransactionMaster.noData",
              defaultMessage: "No transaction data found for selected system",
            })
          );
          return;
        }

        const transactions = Array.isArray(responseJson?.lstTransactionMaster)
          ? responseJson.lstTransactionMaster
          : [];

        setRowData(
          transactions.map((item) => ({
            ...item,
            chCreditYn: item.chCreditYn ?? "N",
            chPaymentYn: item.chPaymentYn ?? "N",
            chActive: item.chActive ?? "Y",
          }))
        );
      })
      .catch(() => {
        setRowData([]);
        toast.error(
          intl.formatMessage({
            id: "label.TransactionMaster.fetchError",
            defaultMessage: "Error while fetching transaction data",
          })
        );
      })  .finally(() => {
      setLoading(false);
    });
  };

  // ─── Save ──────────────────────────────────────────────────────────────────
  const handleSave = ({ newRows, updatedRows, deletedRows }) => {

    const allChanges = [...newRows, ...updatedRows, ...deletedRows];

    // Show warning when nothing changed
if (
  newRows.length === 0 &&
  updatedRows.length === 0 &&
  deletedRows.length === 0
) {
  toast.warning(
    intl.formatMessage({
      id: "label.TransactionMaster.noChanges",
      defaultMessage: "No changes to save",
    })
  );
  return;
}

    const transactionMasterDtoArray = allChanges.map((row) => ({
      szTransactionCode: row.szTransactionCode?.trim() || "",
      szTransactionDesc: row.szTransactionDesc?.trim() || "",
      chCreditYn: row.chCreditYn === "Y" || row.chCreditYn === true ? "Y" : "N",
      chPaymentYn: row.chPaymentYn === "Y" || row.chPaymentYn === true ? "Y" : "N",
      // ✅ Send raw Code (szCondition) to backend — never the translated label
      szPaymentType:
        paymentTypeOptions.find((opt) => opt.Code === row.szPaymentType)?.Code || "",
      chActive: row.chActive === "Y" || row.chActive === true ? "Y" : "N",
      szMode: row.mode || "E",
      szUser: sessionStorage.getItem("SEC_USERNAME") || "SYSTEM",
    }));

    const payload = {
      szSystem: selectedSystem || "",
      transactionMasterDto: transactionMasterDtoArray,
    };

    return HAxiosService.POST(
      TransactionMasterAPI.TransactionMaster(screenMenuId),
      payload
    )
      .then((response) => {
        const resData = response.data;

        if (resData.status === "Success") {
          handleFetchData();
          return { success: true };
        } else if (resData.message === "Validation Failed") {
         handleValidationErrors(intl, toast, resData.responseJson);
          return {};
        } else {
           return { success: false };
        }
      })
      .catch((error) => {
        return { success: false, message:  error.response?.data?.message ||
            intl.formatMessage({
              id: "label.TransactionMaster.saveError",
              defaultMessage: "Error while saving Transaction Master",
            })};
      });
  };

  // ─── Derived: system name from selected Code ───────────────────────────────
  // ✅ No separate systemName state needed — derive it from normalized options
  const systemName = useMemo(() => {
    const opt = systemOptions.find((o) => o.Code === selectedSystem);
    return opt ? translations(opt.Desc) : "";
  }, [selectedSystem, systemOptions, intl.locale]);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
  <HBox className="transaction-master-page">
    <HBox className="transaction-master-header-card">
      <HBreadCrumb/>
      <TitleBar
        title={intl.formatMessage({
          id: "label.TransactionMaster.title",
          defaultMessage: "Transaction Master",
        })}
      />

      <Typography className="transaction-master-description">
        {intl.formatMessage({
          id: "label.TransactionMaster.subtitle",
          defaultMessage:
            "Configure transaction parameters per host system. Keep these in sync with the host or downstream modules may misbehave.",
        })}
      </Typography>
    </HBox>

<HBox className="transaction-master-toolbar">
  <HBox className="transaction-master-toolbar-group">
    <HLabel
      value={intl.formatMessage({
        id: "label.TransactionMaster.SystemCode",
        defaultMessage: "System Code",
      })}
    />

    <HDropdown
      name="System Code"
      value={selectedSystem}
      onChange={handleSystemChange}
      options={systemOptions.map((opt) => ({
        value: opt.Code,
        label: translations(opt.Desc),
      }))}
      width="180px"
      required
    />
  </HBox>

  <HBox className="transaction-master-fetch-group">
    <HButton
      label="Fetch"
      onClick={handleFetchData}
      sx={{
        minWidth: "90px",
        height: "34px",
      }}
    />
  </HBox>

  <HBox className="transaction-master-toolbar-group">
<HLabel
  className="transaction-master-system-name-label"
  value={intl.formatMessage({
    id: "label.TransactionMaster.SystemName",
    defaultMessage: "System Name",
  })}
/>
</HBox>
<HBox>

    <HTextField
      value={systemName}
      editable={false}
    />
  </HBox>
</HBox>

      <HBox className="transaction-master-grid-host" loading={loading}>
        <HAgGrid
          ref={gridRef}
          key={intl.locale}
          rowData={rowData}
          columnDefs={columnDefs}
          gridStyle={{width: "100%",height: "57vh",minHeight: "360px"}}
          pagination
          paginationPageSize={10}
          onSave={handleSave}
          allowAdd={true}
          allowDelete={true}
          allowUpdate={true}
          rowDragging={false}
          rowSelection="multiple"
        />
        <HButtonBar
          onSave={() => gridRef.current?.submitChanges?.()}
          onClose={() => navigate("/homelayout/welcomepage")}
          disableToast={{  close: true }}
        />
      </HBox>
    </HBox>
  );
};

export default TransactionMaster;
