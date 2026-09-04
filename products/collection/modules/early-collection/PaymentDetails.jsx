import { HAxiosService } from "@helix/component-library";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";

import { OverviewAPI, PaymentAPI } from "./apiEndpoints";
import FunctionLayout from "./FunctionLayout";
import PaymentAndBilling, { PaymentBillingTabPanel } from "./payment-billing/PaymentAndBilling";
import {
  mapBillingGridRow,
  mapInstallmentGridRow,
} from "./payment-billing/paymentBillingApiMappers";
import { parseOverviewResponse } from "./account-overview/overviewApiHelpers";
import { useLocation } from "react-router-dom";

const DEFAULT_GRID_PAGE_SIZE = 10;

function buildPageRequest(pageNumber, size) {
  return {
    pageNumber,
    size,
    pageSize: size,
  };
}

function extractTotalElements(res, fallbackLength = 0) {
  const body = res?.data;
  const raw = Number(
    body?.totalElements ??
    body?.totalCount ??
    body?.responseJson?.totalElements ??
    body?.responseJson?.totalCount ??
    fallbackLength
  );
  return Number.isFinite(raw) ? raw : fallbackLength;
}

function parseListResponse(res, intl) {
  if (res.status === 204) {
    return { rows: [], info: intl.formatMessage({ id: "label.paymentBilling.info.noContent" }) };
  }
  const body = res.data;
  const responseJson = body?.responseJson;
  const rows = Array.isArray(responseJson)
    ? responseJson
    : Array.isArray(responseJson?.content)
      ? responseJson.content
      : null;

  if (body?.status === "Success" && Array.isArray(rows)) {
    return {
      rows,
      info:
        rows.length === 0
          ? intl.formatMessage({ id: "label.paymentBilling.info.noRows" })
          : "",
    };
  }
  return {
    rows: [],
    info:
      body?.message ||
      intl.formatMessage({ id: "label.paymentBilling.error.unexpectedResponse" }),
  };
}

const PaymentDetails = () => {
  const intl = useIntl();
  const [paymentRowData, setPaymentRowData] = useState([]);
  const [installmentRowData, setInstallmentRowData] = useState([]);
  const [billingRowData, setBillingRowData] = useState([]);
  const [accountDetails, setAccountDetails] = useState({});
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [installmentLoading, setInstallmentLoading] = useState(true);
  const [billingLoading, setBillingLoading] = useState(true);
  const [fetchErrorMessage, setFetchErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [installmentInfo, setInstallmentInfo] = useState("");
  const [billingInfo, setBillingInfo] = useState("");
  const [paymentTotalElements, setPaymentTotalElements] = useState(0);
  const [installmentTotalElements, setInstallmentTotalElements] = useState(0);
  const [billingTotalElements, setBillingTotalElements] = useState(0);
  const { selectedRow } = useSelector((state) => state.account);
  const locale = navigator.language || "en-IN";
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const loadAccountPaymentData = useCallback(() => {
    if (!selectedRow?.ACNT_SEQNO) {
      setPaymentLoading(false);
      setInstallmentLoading(false);
      setBillingLoading(false);
      setFetchErrorMessage(
        intl.formatMessage({ id: "label.paymentBilling.error.noAccount" })
      );
      setPaymentRowData([]);
      setInstallmentRowData([]);
      setBillingRowData([]);
      setPaymentTotalElements(0);
      setInstallmentTotalElements(0);
      setBillingTotalElements(0);
      setAccountDetails({});
      return;
    }

    setPaymentLoading(true);
    setInstallmentLoading(true);
    setBillingLoading(true);
    setFetchErrorMessage("");
    setInfoMessage("");
    setInstallmentInfo("");
    setBillingInfo("");
    setAccountDetails({});

    Promise.allSettled([
      HAxiosService.GET(PaymentAPI.Payment(screenMenuId), buildPageRequest(1, DEFAULT_GRID_PAGE_SIZE)),
      HAxiosService.GET(`${PaymentAPI.Payment(screenMenuId)}/fetchInstallmentDetails`, buildPageRequest(1, DEFAULT_GRID_PAGE_SIZE)),
      HAxiosService.GET(`${PaymentAPI.Payment(screenMenuId)}/fetchBillingDetails`, buildPageRequest(1, DEFAULT_GRID_PAGE_SIZE)),
      HAxiosService.GET(OverviewAPI.getAccountDetails()),
    ]).then((results) => {
      const [payResult, instResult, billResult, accountResult] = results;

      if (payResult.status === "fulfilled") {
        const res = payResult.value;
        const { rows, info } = parseListResponse(res, intl);
        const enriched = rows.map((item, index) => ({
          srNo: index + 1,
          ...item,
          szLogedInUser: "ADMIN",
          szresultcod: "",
        }));
        setPaymentRowData(enriched);
        setPaymentTotalElements(extractTotalElements(res, enriched.length));
        setInfoMessage(info);
        setFetchErrorMessage("");
      } else {
        setPaymentRowData([]);
        setPaymentTotalElements(0);
        setInfoMessage("");
        setFetchErrorMessage(
          intl.formatMessage({ id: "label.paymentBilling.error.generic" })
        );
      }

      if (instResult.status === "fulfilled") {
        const res = instResult.value;
        const { rows, info } = parseListResponse(res, intl);
        setInstallmentRowData(rows.map((e) => mapInstallmentGridRow(e, intl.locale)));
        setInstallmentTotalElements(extractTotalElements(res, rows.length));
        setInstallmentInfo(info);
      } else {
        setInstallmentRowData([]);
        setInstallmentTotalElements(0);
        setInstallmentInfo(
          intl.formatMessage({ id: "label.paymentBilling.error.generic" })
        );
      }

      if (billResult.status === "fulfilled") {
        const res = billResult.value;
        const { rows, info } = parseListResponse(res, intl);
        setBillingRowData(
          rows.map((e, index) => mapBillingGridRow(e, index, intl.locale))
        );
        setBillingTotalElements(extractTotalElements(res, rows.length));
        setBillingInfo(info);
      } else {
        setBillingRowData([]);
        setBillingTotalElements(0);
        setBillingInfo(
          intl.formatMessage({ id: "label.paymentBilling.error.generic" })
        );
      }

      if (accountResult.status === "fulfilled" && accountResult.value) {
        try {
          const { data } = parseOverviewResponse(accountResult.value);
          setAccountDetails(data || {});
        } catch {
          setAccountDetails({});
        }
      } else {
        setAccountDetails({});
      }
    }).finally(() => {
      setPaymentLoading(false);
      setInstallmentLoading(false);
      setBillingLoading(false);
    });
  }, [intl, selectedRow]);

  useEffect(() => {
    loadAccountPaymentData();
  }, [loadAccountPaymentData]);

  const paymentDatasource = useMemo(() => {
    if (!selectedRow?.ACNT_SEQNO) return null;

    return {
      getRows: async (params) => {
        const startRow = Number(params?.startRow) || 0;
        const endRow = Number(params?.endRow) || DEFAULT_GRID_PAGE_SIZE;
        const size = Math.max(1, endRow - startRow);
        const pageNumber = Math.floor(startRow / size) + 1;

        try {
          const res = await HAxiosService.GET(PaymentAPI.Payment(screenMenuId), buildPageRequest(pageNumber, size));
          const { rows, info } = parseListResponse(res, intl);
          const mappedRows = rows.map((item, index) => ({
            srNo: startRow + index + 1,
            ...item,
            szLogedInUser: "ADMIN",
            szresultcod: "",
          }));
          const total = extractTotalElements(res, mappedRows.length);

          setPaymentRowData(mappedRows);
          setPaymentTotalElements(total);
          setInfoMessage(info);
          setFetchErrorMessage("");
          params.successCallback?.(mappedRows, total);
        } catch {
          setPaymentRowData([]);
          setPaymentTotalElements(0);
          setFetchErrorMessage(intl.formatMessage({ id: "label.paymentBilling.error.generic" }));
          params.failCallback?.();
        }
      },
    };
  }, [intl, selectedRow?.ACNT_SEQNO]);

  const installmentDatasource = useMemo(() => {
    if (!selectedRow?.ACNT_SEQNO) return null;

    return {
      getRows: async (params) => {
        const startRow = Number(params?.startRow) || 0;
        const endRow = Number(params?.endRow) || DEFAULT_GRID_PAGE_SIZE;
        const size = Math.max(1, endRow - startRow);
        const pageNumber = Math.floor(startRow / size) + 1;

        try {
          const res = await HAxiosService.GET(`${PaymentAPI.Payment(screenMenuId)}/fetchInstallmentDetails`, buildPageRequest(pageNumber, size));
          const { rows, info } = parseListResponse(res, intl);
          const mappedRows = rows.map((e) => mapInstallmentGridRow(e, intl.locale));
          const total = extractTotalElements(res, mappedRows.length);

          setInstallmentRowData(mappedRows);
          setInstallmentTotalElements(total);
          setInstallmentInfo(info);
          params.successCallback?.(mappedRows, total);
        } catch {
          setInstallmentRowData([]);
          setInstallmentTotalElements(0);
          setInstallmentInfo(intl.formatMessage({ id: "label.paymentBilling.error.generic" }));
          params.failCallback?.();
        }
      },
    };
  }, [intl, selectedRow?.ACNT_SEQNO]);

  const billingDatasource = useMemo(() => {
    if (!selectedRow?.ACNT_SEQNO) return null;

    return {
      getRows: async (params) => {
        const startRow = Number(params?.startRow) || 0;
        const endRow = Number(params?.endRow) || DEFAULT_GRID_PAGE_SIZE;
        const size = Math.max(1, endRow - startRow);
        const pageNumber = Math.floor(startRow / size) + 1;

        try {
          const res = await HAxiosService.GET(`${PaymentAPI.Payment(screenMenuId)}/fetchBillingDetails`, buildPageRequest(pageNumber, size));
          const { rows, info } = parseListResponse(res, intl);
          const mappedRows = rows.map((e, index) => mapBillingGridRow(e, startRow + index, intl.locale));
          const total = extractTotalElements(res, mappedRows.length);

          setBillingRowData(mappedRows);
          setBillingTotalElements(total);
          setBillingInfo(info);
          params.successCallback?.(mappedRows, total);
        } catch {
          setBillingRowData([]);
          setBillingTotalElements(0);
          setBillingInfo(intl.formatMessage({ id: "label.paymentBilling.error.generic" }));
          params.failCallback?.();
        }
      },
    };
  }, [intl, selectedRow?.ACNT_SEQNO]);

  return (
    <FunctionLayout
      title={intl.formatMessage({ id: "label.paymentBilling.pageTitle" })}
      contentPaddingTop={0}
    >
      <Box
        sx={{
          px: { xs: 1.5, sm: 2 },
          pb: { xs: 1.5, sm: 2 },
          pt: 0,
          maxWidth: 1320,
          mx: "auto",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
        }}
      >
        <PaymentAndBilling
          paymentRowData={paymentRowData}
          installmentRowData={installmentRowData}
          billingRowData={billingRowData}
          fetchErrorMessage={fetchErrorMessage}
          infoMessage={infoMessage}
          selectedRow={{ ...selectedRow, ...accountDetails }}
          locale={locale}
        />
        <PaymentBillingTabPanel
          paymentRowData={paymentRowData}
          paymentLoading={paymentLoading}
          fetchErrorMessage={fetchErrorMessage}
          locale={locale}
          paymentTotalElements={paymentTotalElements}
          paymentDatasource={paymentDatasource}
          paymentPageSize={DEFAULT_GRID_PAGE_SIZE}
          installmentRowData={installmentRowData}
          installmentLoading={installmentLoading}
          installmentInfo={installmentInfo}
          installmentTotalElements={installmentTotalElements}
          installmentDatasource={installmentDatasource}
          installmentPageSize={DEFAULT_GRID_PAGE_SIZE}
          billingRowData={billingRowData}
          billingLoading={billingLoading}
          billingInfo={billingInfo}
          billingTotalElements={billingTotalElements}
          billingDatasource={billingDatasource}
          billingPageSize={DEFAULT_GRID_PAGE_SIZE}
        />
      </Box>
    </FunctionLayout>
  );
};

export default PaymentDetails;
