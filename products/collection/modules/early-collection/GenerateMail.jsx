import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HAxiosService, HBox, HButtonBar, useToast } from "@helix/component-library";

import FunctionLayout from "./FunctionLayout";
import { GenerateMailAPI } from "./apiEndpoints.jsx";
import GenerateMailForm from "./generate-mail/GenerateMailForm.jsx";
import MailHistoryGrid from "./generate-mail/MailHistoryGrid.jsx";
import { useLocation } from "react-router-dom";

const MAIL_HISTORY_PAGE_SIZE = 10;

function extractMailHistoryRows(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.mailHistory)) return payload.mailHistory;
  if (Array.isArray(payload?.mailHistory?.content)) return payload.mailHistory.content;
  return [];
}

function extractMailHistoryTotal(responseData, fallbackLength = 0) {
  const responseJson = responseData?.responseJson;
  const source = responseJson ?? responseData;
  const totalRaw = Number(
    responseData?.totalElements ??
      responseJson?.totalElements ??
      source?.totalElements ??
      source?.total ??
      source?.count ??
      fallbackLength,
  );
  return Number.isFinite(totalRaw) ? totalRaw : fallbackLength;
}

export default function GenerateMail() {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((state) => state.account);

  const [selectedMailCode, setSelectedMailCode] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [selectedEntityCode, setSelectedEntityCode] = useState("");
  const [notes, setNotes] = useState("");
  const [generatedReady, setGeneratedReady] = useState(false);
  const [sendInFlight, setSendInFlight] = useState(false);

  const [mailTypeUi, setMailTypeUi] = useState("");
  const [addressToIds, setAddressToIds] = useState([]);

  const [communicationDetails, setCommunicationDetails] = useState([]);
  const [communicationLoading, setCommunicationLoading] = useState(false);
  const [selectedCommunicationValue, setSelectedCommunicationValue] = useState("");

  // ADD
  const [addressTypeOptions, setAddressTypeOptions] = useState([]);
  const [addressTypeLoading, setAddressTypeLoading] = useState(false);

  const [mailHistoryRows, setMailHistoryRows] = useState([]);
  const [mailHistoryLoading, setMailHistoryLoading] = useState(false);
  const [mailHistoryError, setMailHistoryError] = useState(null);
  const [mailHistoryTotalElements, setMailHistoryTotalElements] = useState(0);
  const [mailHistoryRefreshVersion, setMailHistoryRefreshVersion] = useState(0);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  useEffect(() => {
    if (!selectedRow?.CUST_SEQNO || !selectedRow?.CASE_SEQNO || !selectedRow?.PARTITION_CODE) {
      setMailHistoryRows([]);
      setMailHistoryTotalElements(0);
      setMailHistoryError(null);
      return;
    }
    setMailHistoryRefreshVersion((v) => v + 1);
  }, [selectedRow?.CUST_SEQNO, selectedRow?.CASE_SEQNO, selectedRow?.PARTITION_CODE]);

  const mailHistoryDatasource = useMemo(() => {
    if (!selectedRow?.CUST_SEQNO || !selectedRow?.CASE_SEQNO || !selectedRow?.PARTITION_CODE) {
      return null;
    }

    return {
      getRows: async (params) => {
        const startRow = Number(params?.startRow) || 0;
        const endRow = Number(params?.endRow) || MAIL_HISTORY_PAGE_SIZE;
        const size = Math.max(1, endRow - startRow);
        const pageNumber = Math.floor(startRow / size) + 1;

        setMailHistoryLoading(true);
        setMailHistoryError(null);
        try {
          const res = await HAxiosService.GET(GenerateMailAPI.GenerateMailApi(screenMenuId), {
            pageNumber,
            size,
            pageSize: size,
          });

          const data = res?.data ?? {};
          const ok = typeof data?.status === "string" && data.status.toLowerCase() === "success";
          if (!ok) {
            setMailHistoryRows([]);
            setMailHistoryTotalElements(0);
            setMailHistoryError(
              data?.message ||
                intl.formatMessage({ id: "label.generateMail.history.loadFailed" }),
            );
            params.failCallback?.();
            return;
          }

          const rows = extractMailHistoryRows(data?.responseJson);
          const total = extractMailHistoryTotal(data, rows.length);
          setMailHistoryRows(rows);
          setMailHistoryTotalElements(total);
          params.successCallback?.(rows, total);
        } catch (err) {
          setMailHistoryRows([]);
          setMailHistoryTotalElements(0);
          setMailHistoryError(
            err?.response?.data?.message ||
              intl.formatMessage({ id: "label.generateMail.history.loadFailed" }),
          );
          params.failCallback?.();
        } finally {
          setMailHistoryLoading(false);
        }
      },
    };
  }, [intl, selectedRow]);

  const fetchCommunicationDetails = useCallback(() => {
    if (!selectedRow || !mailTypeUi) {
      setCommunicationDetails([]);
      return;
    }
    if (!selectedRow?.CUST_SEQNO || !selectedRow?.PARTITION_CODE) {
      setCommunicationDetails([]);
      return;
    }
    setCommunicationLoading(true);
    HAxiosService.GET(`${GenerateMailAPI.GenerateMailApi(screenMenuId)}/fetchCommunicationDetails`, {
      mailType: mailTypeUi,
    })
      .then((res) => {
        const data = res.data;
        const ok = typeof data?.status === "string" && data.status.toLowerCase() === "success";
        if (ok) {
          const result = data?.responseJson;
          const list =
            mailTypeUi?.toUpperCase() === "EMAIL"
              ? result?.emailId || []
              : result?.mobileNo || [];
          setCommunicationDetails(list);
        } else {
          setCommunicationDetails([]);
        }
      })
      .catch(() => setCommunicationDetails([]))
      .finally(() => setCommunicationLoading(false));
  }, [selectedRow, mailTypeUi]);

  useEffect(() => {
    fetchCommunicationDetails();
  }, [fetchCommunicationDetails]);

  // ADD: fetch address types from API
  const fetchAddressTypes = useCallback(() => {
    if (!selectedRow) {
      setAddressTypeOptions([]);
      return;
    }
    if (!selectedRow?.CUST_SEQNO || !selectedRow?.PARTITION_CODE) {
      setAddressTypeOptions([]);
      return;
    }
    setAddressTypeLoading(true);
    HAxiosService.GET(`${GenerateMailAPI.GenerateMailApi(screenMenuId)}/fetchCustomerType`)
      .then((res) => {
        const data = res.data;
        const ok = typeof data?.status === "string" && data.status.toLowerCase() === "success";
        if (ok) {
          const result = data?.responseJson;
          setAddressTypeOptions(result?.customerTypes || []);
        } else {
          setAddressTypeOptions([]);
        }
      })
      .catch(() => setAddressTypeOptions([]))
      .finally(() => setAddressTypeLoading(false));
  }, [selectedRow]);

  useEffect(() => {
    fetchAddressTypes();
  }, [fetchAddressTypes]);

  useEffect(() => {
    setGeneratedReady(false);
    setSelectedCommunicationValue("");
  }, [selectedTemplateId, selectedMailCode, mailTypeUi]);

  const resetForm = useCallback(() => {
    setSelectedMailCode("");
    setSelectedTemplateId("");
    setNotes("");
    setGeneratedReady(false);
    setMailTypeUi("");
    setAddressToIds([]);
    setCommunicationDetails([]);
    setSelectedCommunicationValue("");
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!selectedRow?.ACNT_SEQNO) {
      toast.error(intl.formatMessage({ id: "label.generateMail.error.noAccount" }));
      return { data: { status: "Failure", message: "no account" } };
    }
    if (!selectedTemplateId) {
      toast.error(
        intl.formatMessage({
          id: "label.template.required",
          defaultMessage: "Please select template",
        })
      );
      return { data: { status: "Failure", message: "template" } };
    }
    if (!addressToIds.length) {
      toast.error(intl.formatMessage({ id: "label.generateMail.error.addressToRequired" }));
      return { data: { status: "Failure", message: "addressTo" } };
    }
    if (!notes.trim()) {
      toast.error(intl.formatMessage({ id: "error.szNotes.required" }));
      return { data: { status: "Failure", message: "notes" } };
    }
    setGeneratedReady(true);
    return { data: { status: "success" } };
  }, [selectedRow, selectedTemplateId, addressToIds, notes, mailTypeUi, intl, toast]);

  const handleSend = useCallback(async () => {
    if (sendInFlight) return { data: { status: "Failure" } };
    const generateResult = await handleGenerate();
    if (generateResult?.data?.status !== "success") {
      return generateResult;
    }
    if (!selectedRow) {
      toast.error(intl.formatMessage({ id: "label.generateMail.error.noAccount" }));
      return { data: { status: "Failure" } };
    }
    const payload = {
      request: {
        templateId: selectedTemplateId || "",
        mailCode: selectedMailCode || "",
        entityCode: selectedEntityCode || "ACNT",
        contact: selectedCommunicationValue || "",
        communicationType: mailTypeUi || "",
        notes: (notes && notes.trim()) || "",
        mailChannel: mailTypeUi,
        addressToCsv: addressToIds.join(","),
        cGenerationMode: selectedMailCode || "",
      },
    };

    setSendInFlight(true);
    try {
      const res = await HAxiosService.POST(`${GenerateMailAPI.GenerateMailApi(screenMenuId)}/send-email`, payload);
      const data = res.data;
      const statusOk =
        typeof data?.status === "string" && data.status.toLowerCase() === "success";
      const messageOk =
        typeof data?.message === "string" && data.message.toLowerCase().includes("success");

      if (statusOk || messageOk) {
        toast.success(
          data?.message ||
          intl.formatMessage({
            id: "label.email.success",
            defaultMessage: "Email sent successfully",
          })
        );
        setGeneratedReady(false);
        setMailHistoryRefreshVersion((v) => v + 1);
        return { data: { status: "success", message: data?.message } };
      }
      toast.error(
        data?.message ||
        intl.formatMessage({
          id: "label.email.error",
          defaultMessage: "Failed to send email",
        })
      );
      return { data: { status: "Failure", message: data?.message } };
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        intl.formatMessage({
          id: "label.email.error",
          defaultMessage: "Failed to send email",
        })
      );
      return { data: { status: "Failure" } };
    } finally {
      setSendInFlight(false);
    }
  }, [
    sendInFlight,
    selectedRow,
    generatedReady,
    selectedTemplateId,
    selectedMailCode,
    notes,
    mailTypeUi,
    addressToIds,
    intl,
    toast,
  ]);

  return (
    <FunctionLayout
      title={intl.formatMessage({ id: "label.generateMail.title" })}
      contentPaddingTop={0}
      scrollMode="contain"
    >
      <HBox
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <HBox
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            px: { xs: 2, sm: 3, md: 4 },
            pb: { xs: 10, sm: 12 },
            pt: 1,
            width: "100%",
            boxSizing: "border-box",
            background: "var(--drs-bg-page)",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <GenerateMailForm
            selectedRow={selectedRow}
            selectedMailCode={selectedMailCode}
            setSelectedMailCode={setSelectedMailCode}
            selectedTemplateId={selectedTemplateId}
            setSelectedTemplateId={setSelectedTemplateId}
            selectedEntityCode={selectedEntityCode}
            setSelectedEntityCode={setSelectedEntityCode}
            notes={notes}
            setNotes={setNotes}
            mailTypeUi={mailTypeUi}
            setMailTypeUi={setMailTypeUi}
            addressToIds={addressToIds}
            setAddressToIds={setAddressToIds}
            communicationDetails={communicationDetails}
            communicationLoading={communicationLoading}
            selectedCommunicationValue={selectedCommunicationValue}
            setSelectedCommunicationValue={setSelectedCommunicationValue}
            addressTypeOptions={addressTypeOptions}
            addressTypeLoading={addressTypeLoading}
            generatedReady={generatedReady}
          />
          <MailHistoryGrid
            key={`mail-history-${mailHistoryRefreshVersion}-${selectedRow?.CASE_SEQNO || "none"}`}
            rowData={mailHistoryRows}
            datasource={mailHistoryDatasource}
            cacheBlockSize={MAIL_HISTORY_PAGE_SIZE}
            maxBlocksInCache={2}
            totalElements={mailHistoryTotalElements}
            loading={mailHistoryLoading}
            loadError={mailHistoryError}
          />
        </HBox>
        <HBox sx={{ position: "relative", zIndex: 2000, flexShrink: 0, height: 0 }}>
          <HButtonBar
            onSave={handleSend}
            onReset={resetForm}
            onClose={() => navigate("/homelayout/welcomepage")}
            disableToast={{ save: true, reset: true, close: true }}
          />
        </HBox>
      </HBox>
    </FunctionLayout>
  );
}
