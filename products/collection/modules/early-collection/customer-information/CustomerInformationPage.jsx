import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Typography } from "@mui/material";
import { HBox, HAxiosService } from "@helix/component-library";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";

import FunctionLayout from "../FunctionLayout";
import LinkedCustomersGrid from "./LinkedCustomersGrid";
import LinkedCustomerTileStrip from "./LinkedCustomerTileStrip";
import CustomerDetailsSection from "./CustomerDetailsSection";
import CustomerGroupSummarySection from "./CustomerGroupSummarySection";
import AddressSummarySection from "./AddressSummarySection";
import CommunicationPreferenceSection from "./CommunicationPreferenceSection";
import { CustomerInformationAPI } from "../apiEndpoints";
import { useLocation } from "react-router-dom";

/** @typedef {'list' | 'detail'} CustomerInformationViewMode */

function normalizeLinkedCustomersFromApi(rawData) {
  const list = Array.isArray(rawData) ? rawData : rawData ? [rawData] : [];
  return list.map((raw) => ({
    id: String(raw.lnCustomerSeqNo ?? raw.lnAccountSeqNo ?? raw.szLegacyCustomerNo ?? raw.szCustomerSeqNo ?? ""),
    name: raw.szName ?? "",
    role: raw.szCustomerTypeDesc || raw.szCustomerType || "",
    customerNo: raw.szLegacyCustomerNo ?? raw.szCustomerNo ?? "",
    accountNo: raw.szLegacyAccountNo ?? raw.szAccountNo ?? "",
    delinquent: (Number(raw.bdOverdueAmt) || 0) > 0 ? "Y" : "N",
    portfolio: raw.szPortfolioCode ?? "",
    partitionCode: raw.szPartitionCode ?? raw.PARTITION_CODE ?? "",
    customerSeqNo: raw.lnCustomerSeqNo ?? raw.CUST_SEQNO ?? raw.customerSeqNo ?? null,
    accountSeqNo: raw.lnAccountSeqNo ?? raw.ACNT_SEQNO ?? raw.accountSeqNo ?? null,
    caseSeqNo: raw.lnCaseSeqNo ?? raw.CASE_SEQNO ?? raw.caseSeqNo ?? null,
    odAmount: Number(raw.bdOverdueAmt) || 0,
    osAmount: Number(raw.bdOsAmt) || 0,
    details: {},
  }));
}

export default function CustomerInformationPage() {
  const intl = useIntl();
  const { selectedRow } = useSelector((state) => state.account);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  /** @type {CustomerInformationViewMode} */
  const [viewMode, setViewMode] = useState("list");
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

useEffect(() => {
  let cancelled = false;

  if (!selectedRow) {
    setRows([]);
    setLoading(false);

    return () => {
      cancelled = true;
    };
  }

  setLoading(true);

  HAxiosService.GET(
    CustomerInformationAPI.fetchLinkedCustomers(screenMenuId),
  )
    .then((res) => {
      if (cancelled) return;

      if (
        res?.data?.status === "Success" &&
        res?.data?.responseJson
      ) {
        setRows(
          normalizeLinkedCustomersFromApi(
            res.data.responseJson
          )
        );
      } else {
        setRows([]);
      }
    })
    .catch((err) => {
      console.error("fetchLinkedCustomers error:", err);

      if (!cancelled) {
        setRows([]);
      }
    })
    .finally(() => {
      if (!cancelled) {
        setLoading(false);
      }
    });

  return () => {
    cancelled = true;
  };
}, [selectedRow]);

  const selectedCustomer = useMemo(
    () => rows.find((r) => r.id === selectedCustomerId) || null,
    [rows, selectedCustomerId],
  );

  const handleCustomerNameClick = useCallback((id) => {
    setSelectedCustomerId(id);
    setViewMode("detail");
  }, []);

  const handleBackToList = useCallback(() => {
    setViewMode("list");
    setSelectedCustomerId(null);
  }, []);

  const handleTileSelectCustomer = useCallback((id) => {
    setSelectedCustomerId(id);
  }, []);

  return (
    <FunctionLayout
      title={intl.formatMessage({ id: "label.customerInformation.title" })}
      contentPaddingTop={0}
      scrollMode="contain"
    >
      <HBox
        className="drs-page-container"
        sx={{
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
        }}
      >
        <HBox
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            pb: 10,
          }}
        >
          {viewMode === "list" ? (
            <>
              <LinkedCustomersGrid
                rowData={rows}
                onCustomerNameClick={handleCustomerNameClick}
                isLoading={loading}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontSize: 13 }}>
                {intl.formatMessage({ id: "label.customerInformation.listHint" })}
              </Typography>
            </>
          ) : (
            <HBox sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Button
                type="button"
                size="small"

                variant="text"
                startIcon={<ChevronLeft sx={{ fontSize: 18 }} />}
                onClick={handleBackToList}
                sx={{ alignSelf: "flex-start", textTransform: "none", fontSize: 12, minHeight: 28 }}
              >
                {intl.formatMessage({ id: "label.customerInformation.backToList" })}
              </Button>

              <LinkedCustomerTileStrip
                customers={rows}
                selectedCustomerId={selectedCustomerId}
                onSelectCustomer={handleTileSelectCustomer}
              />

              {selectedCustomer ? (
                <HBox sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                  <HBox
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                      gap: 2,
                      alignItems: "start",
                    }}
                  >
                    <CustomerDetailsSection customer={selectedCustomer} />
                    <HBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <AddressSummarySection customer={selectedCustomer} />
                      <CustomerGroupSummarySection groupAccounts={selectedCustomer.groupAccounts} />
                      <CommunicationPreferenceSection
                        key={selectedCustomer.id}
                        customerId={selectedCustomer.id}
                        customer={selectedCustomer}
                        initialDraft={selectedCustomer.communicationDraft}
                      />
                    </HBox>
                  </HBox>
                </HBox>
              ) : null}
            </HBox>
          )}
        </HBox>
      </HBox>
    </FunctionLayout>
  );
}
