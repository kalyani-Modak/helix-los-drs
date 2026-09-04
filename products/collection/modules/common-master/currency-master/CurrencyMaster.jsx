import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { HAxiosService, TitleBar, HTextField, HButtonBar, HBox, HBreadCrumb, HAgGrid, useToast } from "@helix/component-library";

import { handleValidationErrors } from "../../early-collection/ValidationUtils.jsx";
import { CurrencyMasterAPI } from "../apiEndpoints";


import {extractFetchWrapper, mapGridRowsFromApi, buildSaveDto, getModifiedBy,} from "./currencyMaster.mappers";
import { getCurrencyMasterColumnDefs } from "./currencyMaster.columnDefs";
import { filterRowsBySearch } from "./currencyMaster.state";
import "./currency-master.screen.css";
import { Typography } from "@mui/material";
import { validateCurrencyForm } from "./currencyMaster.validation";
import { useLocation } from "react-router-dom";
function parseSaveSuccess(res) {
  if (!res) return false;
  if (res.status >= 400) return false;
  const st = res.data?.status;
  if (typeof st === "string" && st.toLowerCase() === "success") return true;
  return res.status === 200 && res.data != null;
}

const CurrencyMaster = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const toast = useToast();
  const gridRef = useRef(null);
  
  const [allRows, setAllRows] = useState([]);
  const [convOperatorOptions, setConvOperatorOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const screenMenuId  = location.state?.menuId ;

  const columnDefs = useMemo(
    () => getCurrencyMasterColumnDefs(intl, convOperatorOptions),
    [intl, intl.locale, convOperatorOptions]
  );

  const filteredRows = useMemo(
    () => filterRowsBySearch(allRows, searchQuery),
    [allRows, searchQuery]
  );

  const existingCodes = useMemo(
    () => new Set(allRows.map(row => row.szCurrencyCode?.toUpperCase()).filter(Boolean)),
    [allRows]
  );

  const loadCurrencies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await HAxiosService.GET(CurrencyMasterAPI.currencyMaster(screenMenuId ), {});
      if (res.status >= 400) {
        toast.error(
          intl.formatMessage({
            id: "message.CurrencyMaster.FetchFailed",
            defaultMessage: "Failed to fetch currency data",
          })
        );
        setAllRows([]);
        setConvOperatorOptions([]);
        return [];
      }
      const { currencyList, convOperators: ops } = extractFetchWrapper(res.data);
      setConvOperatorOptions(ops || []);
      setAllRows(mapGridRowsFromApi(currencyList || []));
      setLoading(false);
      return currencyList;
    } catch (err) {
      console.error(err);
      setAllRows([]);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [intl, toast]);

  useEffect(() => {
    loadCurrencies();
  }, [loadCurrencies]);

  const resetToBaseline = useCallback(async () => {
    setSearchQuery("");
    await loadCurrencies();
    return {success : true};
  }, [loadCurrencies]);

  const handleGridSave = useCallback(
      async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
      const allChanged = [...newRows, ...updatedRows, ...deletedRows];
      if (allChanged.length === 0) {
        toast.info(
          intl.formatMessage({
            id: "message.currencyMaster.noChanges",
            defaultMessage: "No changes to save.",
          })
        );
        return { success: false };
      }

    for (const row of [...newRows, ...updatedRows]) {
      const uiMode = row.mode === "N" ? "new" : "edit";
      const validation = validateCurrencyForm(
        row,
        intl,
        { 
          uiMode: uiMode,
          existingCodes: existingCodes    
        }
      );
      
      if (!validation.ok) {
        return { success: false, message: validation.message };
      }
    }

    const szModifiedBy = getModifiedBy();
    
    const payload = [
      ...newRows.map((r) => buildSaveDto(r, "N", szModifiedBy)),
      ...updatedRows.map((r) => buildSaveDto(r, "E", szModifiedBy)),
      ...deletedRows.map((r) => buildSaveDto(r, "D", szModifiedBy)),
    ];

      try {
        const res = await HAxiosService.POST(CurrencyMasterAPI.currencyMaster(screenMenuId ), payload);

        if (res.status >= 400) {
          const data = res.data;
          if (data?.responseJson && typeof data.responseJson === "object") {
            handleValidationErrors(intl, toast, data.responseJson);
            return { success: false };
          }
          toast.error(
            data?.message ||
              intl.formatMessage({
                id: "message.CurrencyMaster.SaveError",
                defaultMessage: "Error while saving currency",
              })
          );
          return { success: false };
        }

        if (res?.data?.status === "Failure" && res.data?.responseJson) {
          handleValidationErrors(intl, toast, res.data.responseJson);
          return { success: false };
        }

        if (!parseSaveSuccess(res)) {
          toast.error(
            res?.data?.message ||
              intl.formatMessage({
                id: "message.CurrencyMaster.SaveError",
                defaultMessage: "Error while saving currency",
              })
          );
          return { success: false };
        }

        await loadCurrencies();
        return { success: true };
      } catch (err) {
        console.error(err);
        const data = err.response?.data;
        if (data?.responseJson && typeof data.responseJson === "object") {
          handleValidationErrors(intl, toast, data.responseJson);
        } else if (data?.message) {
          toast.error(data.message);
        } else {
          toast.error(
            intl.formatMessage({
              id: "message.CurrencyMaster.SaveError",
              defaultMessage: "Error while saving currency",
            })
          );
        }
        return { success: false };
      }
    },
    [intl, toast, loadCurrencies, existingCodes]
  );

  const handleClose = useCallback(() => {
    navigate("/homelayout/welcomepage");
  }, [navigate]);

  const titleText = intl.formatMessage({
    id: "label.CurrencyMaster.title",
    defaultMessage: "Currency Master",
  });

  return (
    <HBox className="currency-master-page">
      <HBox className="currency-master-header-card">
        <HBreadCrumb/>
        <TitleBar title={titleText} />
       
        <Typography className="currency-master-description">
          {intl.formatMessage({
            id: "label.CurrencyMaster.subtitle",
            defaultMessage:
              "Maintain currencies, conversion operators, and buying/selling rates against the base currency.",
          })}
        </Typography>
      </HBox>

      <HBox className="currency-master-toolbar">
        <HBox className="currency-master-search-wrap">
          <HBox className="currency-master-search-field">
            <HTextField
              id="currency-master-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              editable
              placeholder="label.CurrencyMaster.searchPlaceholder"
              width="260px"
            />
          </HBox>
        </HBox>
      </HBox>

      <HBox className="currency-master-grid-wrap">
        <HAgGrid
          ref={gridRef}
          key={intl.locale}
          rowData={filteredRows}
          columnDefs={columnDefs}
          gridStyle={{ width: "100%", height: "380px" }}
          pagination
          paginationPageSize={10}
          sort
          allowAdd={true}
          allowDelete={true}
          allowUpdate={true}
          globalSearch={false}
          isLoading={loading}
          embeddedInSection
          onSave={handleGridSave}
        />
      </HBox>

      <HButtonBar
        onSave={() => gridRef.current?.submitChanges?.()}
        onReset={() => resetToBaseline()}
        onClose={handleClose}
      />
    </HBox>
  );
};

export default CurrencyMaster;
