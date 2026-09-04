import React, { useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { useToast, HBox, HButton, HButtonBar, HDropdown, HLabel, TitleBar, HBreadCrumb, HAgGrid } from "@helix/component-library";


import { useBucketMaster } from "./useBucketMaster";
import { buildBucketColumnDefs } from "./bucketMasterGridConfig";
import "./bucketMasterPage.css";

const BucketMaster = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const gridRef = useRef(null);

  const {
    portfolio,
    portfolioOptions,
    rowData,
    setRowData,
    loading,
    isFetched,
    handlePortfolioChange,
    handleFetch,
    handleSave,
    handleAddRow,
    handleReset,
  } = useBucketMaster(toast);

  const columnDefs = useMemo(
    () => buildBucketColumnDefs(intl),
    [intl.locale]
  );

  return (
    <HBox className="bucket-master-page">
      <HBox className="bucket-master-header-card">
        <HBox style={{ display: "flex", marginBottom: "8px" }} >
         <HBreadCrumb/>
        </HBox>
        <TitleBar title="bucket.master" />

      <HLabel colon={false}
              align="left"
        value= {intl.formatMessage({
          id: "label.BucketMaster.description",
          defaultMessage: "Categorize accounts by delinquency days (DPD). Each bucket's 'From' is auto-suggested from the previous row.",
        })}
      />
     </HBox>
      <HBox className="bucket-master-toolbar">
        <HLabel
          value={intl.formatMessage({
            id: "label.ProductMaster.portfolio",
            defaultMessage: "Portfolio Code",
          })}
          sx={{ whiteSpace: "nowrap" }}
        />
        <HDropdown
          name="portfolio"
          value={portfolio}
          onChange={(e) => handlePortfolioChange(e.target.value)}
          options={portfolioOptions}
          width="180px"
          required
        />

        <HButton
          id="bucket-master-fetch"
          label="label.common.fetch"
          onClick={handleFetch}
          loading={loading}
          disabled={loading}
          style={{ minWidth: "150px", height: "30px" }}
        />

      </HBox>

      <HBox className="bucket-master-grid-section">
        <HBox className="bucket-master-grid-wrapper">
          <HAgGrid
            ref={gridRef}
            key={`${intl.locale}-${isFetched}`}
            rowData={rowData}
            setRowData={setRowData}
            columnDefs={columnDefs}
            gridStyle={{ width: "100%", height: "50vh", minHeight: "360px" }}
            pagination
            paginationPageSize={10}
            globalSearch={false}
            allowAdd={isFetched}
            allowDelete
            allowUpdate
            onSave={handleSave}
            onAddRow={handleAddRow}
            getRowId={(params) => params.data.key}
            overlayNoRowsTemplate={
              `<span>
            ${!isFetched
                ? intl.formatMessage({ id: "label.agGrid.fetch", defaultMessage: "Please click Fetch to load records" })
                : intl.formatMessage({ id: "label.agGrid.noData", defaultMessage: "No Data To Show" })}
            </span>`
            }
          />
        </HBox>
        <HButtonBar
          onSave={() => gridRef.current?.submitChanges?.()}
          onReset={handleReset}
          onClose={() => navigate("/homelayout/welcomepage")}
        />
      </HBox>
    </HBox>
  );
};

export default BucketMaster;
