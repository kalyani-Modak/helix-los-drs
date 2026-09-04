import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { HAxiosService, HBox, HButton, HButtonBar, HDropdown, HLabel, TitleBar, HBreadCrumb, HAgGrid, useToast } from "@helix/component-library";
import { useIntl } from "react-intl";

import { handleValidationErrors } from "../../early-collection/ValidationUtils.jsx";
 
import { FeeMasterAPI } from "../apiEndpoints.jsx";
import { buildFeeMasterColumnDefs } from "./feeMasterGridConfig.js";


import "./fee-master-screen.css";
import { useLocation } from "react-router-dom";
const FeeMasterScreen = () => {
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [originalRowData, setOriginalRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [metaData, setMetaData] = useState({
    FEE_TYPE: [],
    PMTHEAD: [],
    FEEWAIVESTATUS: [],
  });
  const [selectedFeeType, setSelectedFeeType] = useState("");
  const intl = useIntl();
  const toast = useToast();

  const [defaultWaiveAmount, setDefaultWaiveAmount] = useState("");
  const location = useLocation();
  const screenMenuId  = location.state?.menuId ;

  // Add this useEffect to set default value when metadata loads
  useEffect(() => {
    if (metaData.FEEWAIVESTATUS && metaData.FEEWAIVESTATUS.length > 0) {
      setDefaultWaiveAmount(metaData.FEEWAIVESTATUS[0].Code);
    }
  }, [metaData.FEEWAIVESTATUS]);
  

  // Helper: translate a Desc key from the DB
  const t = (key) =>
    key
      ? intl.formatMessage({ id: key, defaultMessage: key })
      : "";

  // Meta Data
  const fetchMetaData = async () => {
    try {
      setLoading(true);
      const res = await HAxiosService.GET(
        FeeMasterAPI.feeMaster(screenMenuId ),
        {}
      );
      if (res.data?.responseJson) {
        setMetaData(res.data.responseJson);
        setSelectedFeeType("");
        setLoading(false);
      } else {
        toast.error("No meta data found.");
      }
    } catch (err) {
      console.error("Error fetching fee meta data:", err);
      toast.error("Error fetching fee meta data.");
    }
  };

  useEffect(() => {
    fetchMetaData();
  }, []);

  // Fetch fee master data
  const handleFetch = async () => {
    if (!selectedFeeType) {
      toast.error(
        intl.formatMessage({
          id: "error.feeType.required",
          defaultMessage: "Please select a fee type.",
        })
      );
      return;
    }

    setLoading(true);
    try {
      const res = await HAxiosService.GET(
        `${FeeMasterAPI.feeMaster(screenMenuId)}/fetchFeeMaster?szFeeType=${selectedFeeType}`
      );

      if (Array.isArray(res.data?.responseJson)) {
        const mapped = res.data.responseJson.map((item, index) => ({
          id: item.szFeeCode || `row-${Date.now()}-${index}`,
          feeCode: item.szFeeCode ?? "",
          feeDesc: item.szFeeDesc ?? "",
          paymentHead: item.szPmtHeadType ?? "",
          waiveAllowed: item.szWaiveable === "Y",
          waiveAuth: item.szWaiveAuthYn === "Y",
          waiveAmount: item.szWaivableAmt ?? "",
          chargeAllowed: item.szChargeable === "Y",
          chargeAuth: item.szChrgAuthYn === "Y",
          mode: "E",
        }));
        setRowData(mapped);
        setOriginalRowData(JSON.parse(JSON.stringify(mapped)));
      } else {
        toast.error("Unexpected data format received.");
        setRowData([]);
      }
    } catch (err) {
      console.error("Error fetching Fee Master:", err);
      toast.error("Error fetching fee details.");
    } finally {
      setLoading(false);
    }
  };

  // Save
  const handleSave = async ({ newRows, updatedRows, deletedRows }) => {
    if (!selectedFeeType) {
      toast.error(
        intl.formatMessage({
          id: "error.feeType.fetchFirst",
          defaultMessage: "Select the fee type and fetch the data first",
        })
      );
      return { success: false };
    }

    const buildRow = (row, mode) => ({
      szFeeCode: row.feeCode,
      szFeeDesc: row.feeDesc,
      szChargeable: row.chargeAllowed ? "Y" : "N",
      szChrgAuthYn: row.chargeAuth ? "Y" : "N",
      szWaiveable: row.waiveAllowed ? "Y" : "N",
      szWaiveAuthYn: row.waiveAuth ? "Y" : "N",
      szWaivableAmt: row.waiveAmount || "",
      szFeeType: selectedFeeType,
      szPmtHeadType: row.paymentHead || "",
      szMode: mode,
      szUserId: "ADMIN",
    });

    const payload = [
      ...newRows.map((row) => buildRow(row, "N")),
      ...updatedRows.map((row) => buildRow(row, "E")),
      ...deletedRows.map((row) => buildRow(row, "D")),
    ];

    if (payload.length === 0) {
      toast.error("Nothing to save.");
      return ;
    }

    try {
      const res = await HAxiosService.POST(
        FeeMasterAPI.feeMaster(screenMenuId),
        payload
      );
      setTimeout(async () => {
        await handleFetch();
      }, 100);
      return { success: true };
    } catch (err) {
      console.error("Error saving Fee Master:", err);
      if (err.response?.data?.errors) {
        handleValidationErrors(intl, toast, err.response.data.errors);
      } else {
        toast.error(err.response?.data?.message || "Error saving fee details.");
      }
      return { success: false };
    }
  };

  // Delete
  const handleDelete = (selectedRows) => {
    if (!selectedRows || selectedRows.length === 0) {
      toast.error("Please select at least one row to delete.");
      return;
    }

    const updated = rowData
      .map((row) =>
        selectedRows.includes(row)
          ? row.mode === "N"
            ? null
            : { ...row, mode: "D" }
          : row
      )
      .filter(Boolean);

    setRowData(updated);
  };

  // Dropdown options
  const feeTypeOptions = useMemo(
    () =>
      metaData.FEE_TYPE?.map((item) => ({
        label: t(item.Desc),
        value: item.Code,
      })) || [],
    [metaData.FEE_TYPE, t]
  );

  const columnDefs = useMemo(
    () => buildFeeMasterColumnDefs(intl, metaData, t, defaultWaiveAmount),
    [intl, metaData, t, defaultWaiveAmount]
  );

  const gridStyle = {
    width: "100%",
    height: "50vh",
    marginTop: "10px",
    backgroundColor: "white",
  };

  // Add this useEffect to set default value for new rows
useEffect(() => {
  if (gridRef.current && defaultWaiveAmount) {
    const checkAndSetDefaultValues = () => {
      const api = gridRef.current?.api;
      if (!api) return;
      
      api.forEachNode((node) => {
        const row = node.data;
        // Check if it's a new row and waiveAmount is empty
        if (row.mode === "N" && (!row.waiveAmount || row.waiveAmount === "")) {
          // Set the default value
          node.setDataValue('waiveAmount', defaultWaiveAmount);
        }
      });
    };
    
    // Initial check
    const timeoutId = setTimeout(checkAndSetDefaultValues, 100);
    
    // Also listen for row updates
    const intervalId = setInterval(checkAndSetDefaultValues, 100);
    
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }
}, [defaultWaiveAmount, rowData]);

  const handleReset = () => {
    setRowData(JSON.parse(JSON.stringify(originalRowData)));
    return { success: true };
  };

 return (
  <HBox className="fee-master-page">
    <HBox>
      <HBox className="fee-master-header-row">
        <HBox className="fee-type-wrapper">
          <HBreadCrumb/>
          <TitleBar
            title={intl.formatMessage({
              id: "label.FeeMaster.title",
              defaultMessage: "Fee Master",
            })}
          />
          <HLabel
            className="fee-master-description"
            value={intl.formatMessage({
              id: "label.FeeMaster.titleDesc",
              defaultMessage: "Configure fee codes, charge & waive permissions, and authorization requirements per business unit and fee type.",
            })}
          />
        </HBox>

        <HBox className="fee-master-controls">
          <HBox className="fee-type-wrapper">
            <HLabel
              value={intl.formatMessage({
                id: "label.FeeMaster.FeeType",
                defaultMessage: "FEE TYPE",
              })}
            />
            <HBox className="fee-master-fetch-button">
              <HDropdown
                name="feeType"
                options={feeTypeOptions}
                value={selectedFeeType}
                onChange={(e) => setSelectedFeeType(e.target.value)}
                placeholder={intl.formatMessage({
                  id: "label.FeeMaster.feeTypePlaceholder",
                  defaultMessage: "Select fee type",
                })}
              />

              <HButton
                variant="contained"
                onClick={handleFetch}
                label="label.common.fetch"
                defaultMessage="FETCH"
                sx={{ height: "28px" }}
              />
            </HBox>
          </HBox>
        </HBox>
      </HBox>
    </HBox>

    <HBox className="fee-master-stack" loading={loading}>
      <HAgGrid
        ref={gridRef}
        key={intl.locale}
        rowData={rowData}
        columnDefs={columnDefs}
        pagination
        paginationPageSize={10}
        sort
        rowSelection="multiple"
        allowAdd
        allowDelete
        allowUpdate
        onDelete={handleDelete}
        onSave={handleSave}
        getRowId={(params) => params.data.id}
        gridClassName="fee-master-ag-host"
        gridStyle={{ width: "100%", marginTop: "20px" }}
      />

      <HButtonBar
        onSave={() => gridRef.current?.submitChanges?.()}
        onClose={() => navigate("/homelayout/welcomepage")}
        onReset={handleReset}
      />
    </HBox>
  </HBox>
);
};

export default FeeMasterScreen; 
