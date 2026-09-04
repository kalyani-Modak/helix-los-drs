import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { Typography } from "@mui/material";
import { HAxiosService, HBox, HButton, HButtonBar, HLabel, HTextField, TitleBar, HBreadCrumb, HAgGrid, useToast } from "@helix/component-library";

import { WfStateMasterAPI } from "../apiEndpoints.jsx";
import { handleValidationErrors } from "../../early-collection/ValidationUtils.jsx";


import { getGlobalStatesMasterColumnDefs } from "./globalStatesMaster.columnDefs.jsx";
import {buildSaveRow, extractWfStateListFromPayload, mapRowsFromResponse} from "./globalStatesMaster.mappers.js";
import { filterRowsByStateAndDesc } from "./globalStatesMaster.state.js";
import "./global-states-master.screen.css";
import { useLocation } from "react-router-dom";

const GlobalStatesMasterScreen = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const gridRef = useRef(null);

  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stateFilterDraft, setStateFilterDraft] = useState("");
  const [descFilterDraft, setDescFilterDraft] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ state: "", desc: "" });
  const location = useLocation();
  const menuId =  location.state.menuId;

  const columnDefs = useMemo(
    () => getGlobalStatesMasterColumnDefs(intl),
    [intl, intl.locale]
  );

  const filteredRows = useMemo(
    () => filterRowsByStateAndDesc(allRows, appliedFilters.state, appliedFilters.desc),
    [allRows, appliedFilters]
  );

  const loadWfStates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await HAxiosService.GET(WfStateMasterAPI.WfStates(menuId));
      const payload = res?.data;
      const status = res?.status;
      const isOk = typeof status === "number" && status >= 200 && status < 300;

      if (!isOk || payload?.status === "Failure") {
        toast.error(
          intl.formatMessage({
            id: "message.GlobalStatesMaster.fetchError",
            defaultMessage: "Error while fetching global states.",
          })
        );
        setAllRows([]);
        return [];
      }

      const list = extractWfStateListFromPayload(payload);
      const rows = mapRowsFromResponse(list);
      setAllRows(rows);
      return rows;
    } catch (err) {
      console.error(err);
      const data = err?.response?.data;
      if (data?.errors || data?.responseJson) {
        handleValidationErrors(intl, toast, data.errors || data.responseJson);
      } else {
        toast.error(
          intl.formatMessage({
            id: "message.GlobalStatesMaster.fetchError",
            defaultMessage: "Error while fetching global states.",
          })
        );
      }
      setAllRows([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [intl, toast]);

  useEffect(() => {
    loadWfStates();
  }, [loadWfStates]);

  const handleApplyFilters = () => {
    setAppliedFilters({
      state: stateFilterDraft.trim(),
      desc: descFilterDraft.trim(),
    });
  };

  const handleClearFilters = () => {
    setStateFilterDraft("");
    setDescFilterDraft("");
    setAppliedFilters({ state: "", desc: "" });
  };

  const validateActiveRows = (rows) => {
    for (const row of rows) {
      const code = (row.szStateCode ?? "").trim();
      const desc = (row.szDesc ?? "").trim();
      if (!code) {
        toast.error(
          intl.formatMessage({
            id: "error.GlobalStatesMaster.codeMandatory",
            defaultMessage: "State code is mandatory",
          })
        );
        return false;
      }
      if (!desc) {
        toast.error(
          intl.formatMessage({
            id: "error.GlobalStatesMaster.descMandatory",
            defaultMessage: "Description is mandatory",
          })
        );
        return false;
      }
    }

    const seen = new Set();
    for (const row of rows) {
      const key = (row.szStateCode ?? "").trim().toUpperCase();
      if (seen.has(key)) {
        toast.error(
          intl.formatMessage(
            {
              id: "error.GlobalStatesMaster.duplicateCode",
              defaultMessage: "Duplicate state code: {code}",
            },
            { code: (row.szStateCode ?? "").trim() }
          )
        );
        return false;
      }
      seen.add(key);
    }
    return true;
  };

  const handleGridSave = useCallback(
    async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
      const activeRows = [...newRows, ...updatedRows];
      if (!validateActiveRows(activeRows)) {
        return { success: false };
      }

      const payload = [
        ...newRows.map((row) => buildSaveRow(row, "N")),
        ...updatedRows.map((row) => buildSaveRow(row, "E")),
        ...deletedRows.map((row) => buildSaveRow(row, "D")),
      ];

      if (payload.length === 0) {
        toast.info(
          intl.formatMessage({
            id: "message.GlobalStatesMaster.noChanges",
            defaultMessage: "No changes to save.",
          })
        );
        return { success: false };
      }

      try {
        const res = await HAxiosService.POST(WfStateMasterAPI.WfStates(menuId), payload);
        const data = res?.data;

        if (data?.status === "Success") {
          await loadWfStates();
          return { success: true };
        }

        if (data?.errors || data?.responseJson) {
          handleValidationErrors(intl, toast, data.errors || data.responseJson);
          return { success: false };
        }
        return { success: false };
      } catch (err) {
        const data = err?.response?.data;
        if (data?.errors || data?.responseJson) {
          handleValidationErrors(intl, toast, data.errors || data.responseJson);
        } else {
     }
        return { success: false };
      }
    },
    [intl, toast, loadWfStates]
  );

  const handleReset = async () => {
    handleClearFilters();
    await loadWfStates();
    return { success: true };
  };

  const hasAppliedFilters = Boolean(appliedFilters.state || appliedFilters.desc);

  return (
    <HBox className="global-states-master-page">
      <HBox className="global-states-master-header-card">
        <HBreadCrumb />

        <TitleBar
          title={intl.formatMessage({
            id: "label.GlobalStatesMaster.title",
            defaultMessage: "Global States",
          })}
        />
        <Typography variant="body1" className="global-states-master-description">
          {intl.formatMessage({
            id: "label.GlobalStatesMaster.pageHeaderDescription",
            defaultMessage:
              "Workflow stages of an account. State movement rules are configured in the Workflows screen.",
          })}
        </Typography>
      </HBox>

      <HBox className="global-states-master-filter-bar">
        <HBox className="global-states-master-filter-field">
          <span className="global-states-master-filter-label">
            {intl.formatMessage({
              id: "label.GlobalStatesMaster.stateFilter",
              defaultMessage: "State",
            })}
          </span>
          <HBox className="global-states-master-filter-input">
            <HTextField
              id="global-states-filter-state"
              value={stateFilterDraft}
              onChange={(e) => setStateFilterDraft(e.target.value)}
              editable
              placeholder="label.GlobalStatesMaster.stateFilterPlaceholder"
              width="176px"
            />
          </HBox>
        </HBox>

        <HBox className="global-states-master-filter-field">
          <span className="global-states-master-filter-label">
            {intl.formatMessage({
              id: "label.GlobalStatesMaster.descriptionFilter",
              defaultMessage: "Description",
            })}
          </span>
          <HBox className="global-states-master-filter-input-desc">
            <HTextField
              id="global-states-filter-desc"
              value={descFilterDraft}
              onChange={(e) => setDescFilterDraft(e.target.value)}
              editable
              placeholder="label.GlobalStatesMaster.descriptionFilterPlaceholder"
              width="224px"
            />
          </HBox>
        </HBox>

        <HBox className="global-states-master-filter-actions">
          <HButton sx={{ height: "30px", mt: 0.5, minWidth: "80px", }}
            label={intl.formatMessage({
              id: "label.GlobalStatesMaster.fetch",
              defaultMessage: "Fetch",
            })}
            onClick={handleApplyFilters}
          />
          {/* {hasAppliedFilters && (
            <HButton
              label={intl.formatMessage({
                id: "label.GlobalStatesMaster.clear",
                defaultMessage: "Clear",
              })}
              onClick={handleClearFilters}
            />
          )} */}
        </HBox>
      </HBox>

      <HBox className="global-states-master-grid-wrap">
        <HAgGrid
          ref={gridRef}
          key={intl.locale}
          rowData={filteredRows}
          columnDefs={columnDefs}
          gridClassName="drs-list-grid global-states-master-grid"
          embeddedInSection
          pagination
          paginationPageSize={10}
          sort
          allowAdd
          allowUpdate
          allowDelete
          globalSearch={false}
          isLoading={loading}
          onSave={handleGridSave}
        />
      </HBox>

      <HButtonBar
        onSave={() => gridRef.current?.submitChanges?.()}
        onReset={handleReset}
        onClose={() => navigate("/homelayout/welcomepage")}
      />
    </HBox>
  );
};

export default GlobalStatesMasterScreen;
