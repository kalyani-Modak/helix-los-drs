import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { useToast, HAxiosService, HBox, HButtonBar, HDropdown, HLabel, TitleBar, HTextField, HBreadCrumb, HAgGrid } from "@helix/component-library";

import { BlockCodeMasterAPI } from "../apiEndpoints.jsx";
import { handleValidationErrors } from "../../early-collection/ValidationUtils.jsx";
import { getBlockcodeMasterColumnDefs } from "./blockcodeMaster.columnDefs.jsx";


import "../portfolio-master/portfolio-master.screen.css";
import { filterRowsBySearch } from "./blockCodeMaster.state.js";
import { Typography } from "@mui/material";
 import { useLocation } from "react-router-dom";   

const BlockCodeMaster = () => {
  const [rowData, setRowData] = useState([]);
  const [selectedType, setSelectedType] = useState("BLKCD");
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const screenMenuId =  location.state.menuId;
  const columnDefs = useMemo(() => getBlockcodeMasterColumnDefs(intl), [intl, intl.locale]);
  const filteredRows = useMemo(
    () => filterRowsBySearch(rowData, searchQuery),
    [rowData, searchQuery]
  );
  const fetchBlockCodeDetails = async (type) => {
    try {
      const res = await HAxiosService.GET(
        BlockCodeMasterAPI.BlockCode(screenMenuId) + `?szBlockCodeType=${type}`
      );
      const data = res?.data?.responseJson || [];
      if (!Array.isArray(data)) {
        setRowData([]);
        return;
      }
      setRowData(
        data.map((row) => ({
          ...row,
          szMode: "E",
          chActiveYn: row.chActiveYn?.trim() === "Y" ? "Y" : "N",
        })),
      );
    } catch (error) {
      const data = error?.response?.data;

      if (data?.responseJson) {
        handleValidationErrors(intl, toast, data.responseJson);
      } else {
        toast.error(
          intl.formatMessage({
            id: "error.blockCode.fetchFailed",
            defaultMessage: "Failed to fetch block codes",
          }),
        );
      }

      setRowData([]);
    }
  };

  useEffect(() => {
    fetchBlockCodeDetails(selectedType, screenMenuId);
  }, [selectedType]);

  const handleSave = async ({
    newRows = [],
    updatedRows = [],
    deletedRows = [],
  }) => {
    try {
      const mappedRows = [
        ...newRows.map((row) => ({
          szBlockCode: row.szBlockCode,
          szBlockDesc: row.szBlockDesc,
          chActiveYn: row.chActiveYn || "N",
          szMode: "N",
        })),
        ...updatedRows.map((row) => ({
          szBlockCode: row.szBlockCode,
          szBlockDesc: row.szBlockDesc,
          chActiveYn: row.chActiveYn || "N",
          szMode: "E",
        })),
        ...deletedRows.map((row) => ({
          szBlockCode: row.szBlockCode,
          szBlockDesc: row.szBlockDesc,
          chActiveYn: row.chActiveYn || "N",
          szMode: "D",
        })),
      ];

      if (mappedRows.length === 0) {
        toast.warning("No changes to save");
        return;
      }

      const payload = {
        szBlockCodeType: selectedType,
        lstBlockCodeMasterDto: mappedRows,
      };
      console.log("Final Payload:", payload);
      const res = await HAxiosService.POST(
        BlockCodeMasterAPI.BlockCode(screenMenuId),
        payload
      );

      const data = res?.data;

      if (data?.status !== "Success") {
        if (data?.responseJson) {
          handleValidationErrors(intl, toast, data.responseJson);
        } else {
          toast.error(
            data?.message ||
            intl.formatMessage({
              id: "error.blockCode.saveFailed",
              defaultMessage: "Block Code Save failed",
            }),
          );
        }

        return { success: false };
      }
      fetchBlockCodeDetails(selectedType);
      return { success: true };
    } catch (e) {
      const data = e?.response?.data;

      if (data?.responseJson) {
        handleValidationErrors(intl, toast, data.responseJson);
        return { success: false };
      }

      return { success: false };
    }
  };

  return (
    <HBox className="portfolio-master-page">
      {/* Header Section */}
      <HBox className="portfolio-master-header-card">
       <HBreadCrumb />

        <TitleBar
          title={intl.formatMessage({
            id: "label.BlockCodeMaster.title",
            defaultMessage: "Block Code Master",
          })}
        />
        <Typography
          variant="body1"
          className="portfolio-master-description"
        >
          {intl.formatMessage({
            id: "label.BlockCodeMaster.subtitle",
            defaultMessage:
              "Define block codes for credit cards. Codes must match host system values.",
          })}
        </Typography>
      </HBox>

      {/* Toolbar Section */}
      <HBox className="portfolio-master-toolbar">
        <HBox className="portfolio-master-search-wrap">
          <HBox className="portfolio-master-search-label">
            <HLabel
              value={intl.formatMessage({
                id: "label.BlockCodeMaster.search",
                defaultMessage: "Search block codes",
              })}
              colon={false}
            />
          </HBox>
          <HBox className="portfolio-master-search-field">
            <HTextField
              id="blockcode-master-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              editable
              placeholder="label.PortfolioMaster.searchPlaceholder"
              width="260px"
            />
          </HBox>
        </HBox>
      </HBox>

      {/* Grid Section */}
      <HBox className="portfolio-master-grid-wrap">
        <HAgGrid
          ref={gridRef}
          key={intl.locale}
          rowData={filteredRows}
          columnDefs={columnDefs}
          isLoading={true}
          gridStyle={{
            width: "100%",
            height: "55vh",
            minHeight: "360px",
          }}
          pagination
          paginationPageSize={10}
          allowAdd
          allowUpdate
          allowDelete
          gridClassName="drs-list-grid"
          embeddedInSection
          onSave={handleSave}
        />
      </HBox>

      {/* Button Bar */}
      <HButtonBar
        onSave={() => gridRef.current?.submitChanges?.()}
        onClose={() => navigate("/homelayout/welcomepage")}
        disableToast={{ close: true }}
      />
    </HBox>
  );
};

export default BlockCodeMaster;
