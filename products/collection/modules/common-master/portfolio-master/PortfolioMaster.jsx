import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useIntl } from "react-intl";
import { HAxiosService, TitleBar, HTextField, HLabel, HButtonBar, HBox, HBreadCrumb, HAgGrid, useToast } from "@helix/component-library";

import { PortfolioAPI } from "../apiEndpoints";


import {emptyFormDraft,buildSaveItem,mapRowsFromResponse,extractPortfolioListFromPayload,getModifiedBy,} from "./portfolioMaster.mappers";
import { filterRowsBySearch } from "./portfolioMaster.state";
import { getPortfolioMasterColumnDefs } from "./portfolioMaster.columnDefs";
import "./portfolio-master.screen.css";
import { Typography } from "@mui/material";
import { useLocation } from "react-router-dom";


const PortfolioMaster = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const toast = useToast();
  const gridRef = useRef(null);

  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [uiMode, setUiMode] = useState("idle");
  const [formDraft, setFormDraft] = useState(() => emptyFormDraft());
  const [formSnapshot, setFormSnapshot] = useState(null);

  const location = useLocation();
  const menuId =  location.state.menuId;

  const columnDefs = useMemo(() => getPortfolioMasterColumnDefs(intl), [intl, intl.locale]);

  const filteredRows = useMemo(
    () => filterRowsBySearch(allRows, searchQuery),
    [allRows, searchQuery]
  );

  const loadPortfolios = useCallback(async () => {
    setLoading(true);
    try {
      const res = await HAxiosService.GET(PortfolioAPI.Portfolio(menuId));
      if (res == null) {
        setAllRows([]);
        return [];
      }
      const status = res.status;
      const payloadList = extractPortfolioListFromPayload(res.data);

      if (status === 406) {
        setAllRows([]);
        return [];
      }

      const isOk = typeof status === "number" && status >= 200 && status < 300;
      if (!isOk) {
        toast.error(
          intl.formatMessage({
            id: "error.portfolio.load",
            defaultMessage: "Unable to load portfolio records.",
          })
        );
        setAllRows([]);
        return [];
      }

      const rows = mapRowsFromResponse(payloadList);
      setAllRows(rows);
      return rows;
    } catch (err) {
      console.error(err);
      toast.error(
        intl.formatMessage({
          id: "error.portfolio.load",
          defaultMessage: "Unable to load portfolio records.",
        })
      );
      setAllRows([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [intl, toast]);

  useEffect(() => {
    loadPortfolios();
  }, [loadPortfolios]);

  const resetToBaseline = useCallback(async () => {
    setSearchQuery("");
    setUiMode("idle");
    setFormDraft(emptyFormDraft());
    setFormSnapshot(null);
    await loadPortfolios();
  }, [loadPortfolios]);


  const parseSaveSuccess = (res) => {
    if (!res) return false;
    if (res.status >= 400) return false;
    const st = res.data?.status;
    if (typeof st === "string" && st.toLowerCase() === "success") return true;
    return res.status === 200 && res.data != null;
  };

  const handleGridSave = useCallback(
    async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
      const allChanged = [...newRows, ...updatedRows, ...deletedRows];
      if (allChanged.length === 0) {
        toast.info(
          intl.formatMessage({
            id: "info.portfolio.noChanges",
            defaultMessage: "No changes to save.",
          })
        );
        return ;
      }

      for (const row of [...newRows, ...updatedRows]) {
        if (!String(row.code ?? "").trim()) {
          toast.error(
            intl.formatMessage({
              id: "validation.portfolio.codeRequired",
              defaultMessage: "Portfolio code is required.",
            })
          );
          return { success: false };
        }
        if (!String(row.description ?? "").trim()) {
          toast.error(
            intl.formatMessage({
              id: "validation.portfolio.descriptionRequired",
              defaultMessage: "Description is required.",
            })
          );
          return;
        }
      }

      const szModifiedBy = getModifiedBy();
      const normalize = (row) => ({
        code: row.code,
        description: String(row.description ?? "").trim(),
        active: Boolean(row.active),
      });

      const payload = [
        ...newRows.map((r) => buildSaveItem(normalize(r), "N", szModifiedBy)),
        ...updatedRows.map((r) => buildSaveItem(normalize(r), "E", szModifiedBy)),
        ...deletedRows.map((r) => buildSaveItem(normalize(r), "D", szModifiedBy)),
      ];

      try {
        const res = await HAxiosService.PUT(PortfolioAPI.Portfolio(menuId), payload);
        if (!parseSaveSuccess(res)) {
          toast.error(
            res?.data?.message ||
              intl.formatMessage({
                id: "error.portfolio.save",
                defaultMessage: "Save failed.",
              })
          );
          return { success: false };
        }
    
        await loadPortfolios();
        setUiMode("idle");
        const cleared = emptyFormDraft();
        setFormDraft({ ...cleared });
        setFormSnapshot(null);
        return { success: true };
      } catch (err) {
        console.error(err);
        toast.error(
          intl.formatMessage({
            id: "error.portfolio.save",
            defaultMessage: "Save failed.",
          })
        );
        return { success: false };
      }
    },
    [intl, loadPortfolios, toast]
  );

  const handleClose = useCallback(() => {
    navigate("/homelayout/welcomepage");
  }, [navigate]);

  return (
    <HBox className="portfolio-master-page">
      <HBox className="portfolio-master-header-card">
        <HBreadCrumb/>
        <TitleBar title={intl.formatMessage({ id: "label.PortfolioMaster.title", defaultMessage: "Portfolio Master" })} />
        <Typography className="portfolio-master-description">
          {intl.formatMessage({
            id: "label.PortfolioMaster.subtitle",
            defaultMessage:
              "Pre-defined loan portfolios. Activate or deactivate portfolios used across products and buckets.",
          })}
        </Typography>
      </HBox>

      <HBox className="portfolio-master-toolbar">
        <HBox className="portfolio-master-search-wrap">
          <HBox className="portfolio-master-search-label">
            <HLabel value={intl.formatMessage({ id: "label.PortfolioMaster.searchLabel", defaultMessage: "Search" })} colon={false} />
          </HBox>
          <HBox className="portfolio-master-search-field">
            <HTextField
              id="portfolio-master-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              editable
              placeholder="label.PortfolioMaster.searchPlaceholder"
              width="260px"
            />
          </HBox>
        </HBox>
      </HBox>


      <HBox className="portfolio-master-grid-wrap">
        <HAgGrid
          ref={gridRef}
          key={intl.locale}
          rowData={filteredRows}
          columnDefs={columnDefs}
          gridStyle={{ width: "100%", height: "57vh", minHeight: "360px" }}
          pagination
          paginationPageSize={10}
          sort
          allowAdd={false}
          allowDelete={false}
          allowUpdate={true}
          globalSearch={false}
          isLoading={loading}
          gridClassName="drs-list-grid"
          embeddedInSection
          onSave={handleGridSave}
        />
      </HBox>

      <HButtonBar
        onSave={() => gridRef.current?.submitChanges?.()}
        onReset={() => {
          resetToBaseline();
        }}
        onClose={handleClose}
      />
    </HBox>
  );
};

export default PortfolioMaster;
