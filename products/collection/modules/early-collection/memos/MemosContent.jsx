import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HAxiosService, HBox, HButtonBar, useToast } from "@helix/component-library";

import { MemosAPI } from "../apiEndpoints";
import FunctionLayout from "../FunctionLayout";
import { handleValidationErrors } from "../ValidationUtils.jsx";


import AddNotesForm from "./AddNotesForm";
import AccountCustomerNotesTabs from "./AccountCustomerNotesTabs";
import { mapNotesHistoryPayload } from "./memosRowMapper";
import { memosFontFamily } from "./memosStyles";
import { useLocation } from "react-router-dom";

const NOTES_PAGE_SIZE = 7;

function pickLatestNoteSnippet(rows) {
  const latest = pickLatestGridNote(rows);
  return latest ? toStickySnippet(latest) : null;
}

function toDateTime(value) {
  if (value == null || value === "") return null;

  if (Array.isArray(value) && value.length >= 3) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = value;
    const time = new Date(year, Number(month) - 1, day, hour, minute, second).getTime();
    return Number.isNaN(time) ? null : time;
  }

  if (typeof value === "object") {
    const { year, monthValue, month, dayOfMonth, day, hour = 0, minute = 0, second = 0 } = value;
    if (year && (monthValue || month) && (dayOfMonth || day)) {
      const time = new Date(year, Number(monthValue ?? month) - 1, dayOfMonth ?? day, hour, minute, second).getTime();
      return Number.isNaN(time) ? null : time;
    }
    return null;
  }

  const normalized = String(value).trim().replace(" ", "T");
  const time = new Date(normalized).getTime();
  return Number.isNaN(time) ? null : time;
}

function getRowTime(row) {
  return (
    toDateTime(row?.dtNote) ??
    toDateTime(row?.dtCreated) ??
    toDateTime(row?.dtCreatedOn) ??
    toDateTime(row?.createdDate) ??
    toDateTime(row?.createdOn) ??
    toDateTime(row?.dtDisplay)
  );
}

function pickLatestGridNote(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return null;

  let latest = null;
  rows.forEach((row, index) => {
    if (!row || !row.szNotes) return;

    const text = String(row.szNotes).trim();
    if (!text) return;

    const time = getRowTime(row);
    if (
      !latest ||
      (time != null && latest.time == null) ||
      (time != null && latest.time != null && time > latest.time) ||
      (time != null && latest.time != null && time === latest.time && index < latest.index) ||
      (time == null && latest.time == null && index < latest.index)
    ) {
      latest = { text, time, index };
    }
  });

  return latest?.text || null;
}

function toStickySnippet(text) {
  if (!text) return null;
  return text.length > 160 ? `${text.slice(0, 157)}...` : text;
}

function buildCustomerNotesDto({
  szNoteType = "",
  szNotes = "",
  szIsStickyNote = "N",
  szAccountCustLevel = "A",
} = {}) {
  return ({
    szNoteType,
    szNotes,
    szIsStickyNote,
    szAccountCustLevel,
  });
}

export default function MemosContent() {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((state) => state.account);

  const [accountCustLevel, setAccountCustLevel] = useState("A");
  const [interactionType, setInteractionType] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const [notes, setNotes] = useState("");
  const [historyTab, setHistoryTab] = useState(0);

  const [accountRows, setAccountRows] = useState([]);
  const [customerRows, setCustomerRows] = useState([]);
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [accountTotalElements, setAccountTotalElements] = useState(0);
  const [customerTotalElements, setCustomerTotalElements] = useState(0);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const extractRowsAndTotal = useCallback((res) => {
    const body = res?.data;
    const responseJson = body?.responseJson;
    const rows = mapNotesHistoryPayload(responseJson);
    const total = Number(
      body?.totalElements ??
      body?.totalCount ??
      responseJson?.totalElements ??
      responseJson?.totalCount ??
      rows.length
    );
    return {
      rows,
      total: Number.isFinite(total) ? total : rows.length,
    };
  }, []);

  const loadGrids = useCallback(() => {
    if (!selectedRow) {
      setAccountRows([]);
      setCustomerRows([]);
      setAccountTotalElements(0);
      setCustomerTotalElements(0);
      setLoadingAccount(false);
      setLoadingCustomer(false);
      return;
    }

    const accPayload = {
      "customerNotesDto.szAccountCustLevel": "A",
      "customerNotesDto.szNoteType": "",
      "customerNotesDto.szNotes": "",
      "customerNotesDto.szIsStickyNote": "N",
      pageNumber: 1, 
      size: NOTES_PAGE_SIZE, 
      pageSize: NOTES_PAGE_SIZE
    };
    const custPayload = {
      "customerNotesDto.szAccountCustLevel": "C",
      "customerNotesDto.szNoteType": "",
      "customerNotesDto.szNotes": "",
      "customerNotesDto.szIsStickyNote": "N",
      pageNumber: 1,
      size: NOTES_PAGE_SIZE, 
      pageSize: NOTES_PAGE_SIZE
    };

    const accReq = {
      customerNotesDto: buildCustomerNotesDto({ szAccountCustLevel: "A" }),
    };
    const custReq = {
      customerNotesDto: buildCustomerNotesDto({ szAccountCustLevel: "C" }),
    };

    setLoadingAccount(true);
    setLoadingCustomer(true);

    console.log("accPayload being sent:", accPayload);

    Promise.allSettled([
      HAxiosService.GET(MemosAPI.MemosApi(screenMenuId), { params: accPayload }),
      HAxiosService.GET(`${MemosAPI.MemosApi(screenMenuId)}/getCustomerNotes`, { params: custPayload }),
    ])
      .then(([accResult, custResult]) => {
        const accRes = accResult.status === "fulfilled" ? accResult.value : accResult.reason?.response;
        const custRes = custResult.status === "fulfilled" ? custResult.value : custResult.reason?.response;

        if (accResult.status === "fulfilled" && accRes?.data?.status !== "Failure") {
          const { rows, total } = extractRowsAndTotal(accRes);
          setAccountRows(rows);
          setAccountTotalElements(total);
        } else {
          setAccountRows([]);
          setAccountTotalElements(0);
        }

        if (custResult.status === "fulfilled" && custRes?.data?.status !== "Failure") {
          const { rows, total } = extractRowsAndTotal(custRes);
          setCustomerRows(rows);
          setCustomerTotalElements(total);
        } else {
          setCustomerRows([]);
          setCustomerTotalElements(0);
        }

        const fetchFailed =
          accResult.status === "rejected" ||
          custResult.status === "rejected" ||
          accRes?.data?.status === "Failure" ||
          custRes?.data?.status === "Failure";
        const validationFailed =
          accRes?.data?.message === "Validation Failed" ||
          custRes?.data?.message === "Validation Failed";

        if (fetchFailed && !validationFailed) {
          toast.error(intl.formatMessage({ id: "error.NotesHistory" }));
        }
      })
      .catch(() => {
        toast.error(intl.formatMessage({ id: "error.NotesHistory" }));
      })
      .finally(() => {
        setLoadingAccount(false);
        setLoadingCustomer(false);
      });
  }, [extractRowsAndTotal, intl, selectedRow, toast]);

  useEffect(() => {
    loadGrids();
  }, [loadGrids, refreshVersion]);

  const accountDatasource = useMemo(() => {
    if (!selectedRow) return null;

    return {
      getRows: async (params) => {
        const startRow = Number(params?.startRow) || 0;
        const endRow = Number(params?.endRow) || NOTES_PAGE_SIZE;
        const size = Math.max(1, endRow - startRow);
        const pageNumber = Math.floor(startRow / size) + 1;
        const accPayload = {
          "customerNotesDto.szAccountCustLevel": "A",
          pageNumber,
          size,
          pageSize: size,
        };

        setLoadingAccount(true);
        try {
          const res = await HAxiosService.GET(MemosAPI.MemosApi(screenMenuId), { params: accPayload });

          if (res?.data?.status === "Failure") {
            if (res?.data?.message === "Validation Failed") {
              handleValidationErrors(intl, toast, res?.data?.responseJson);
            }
            params.failCallback?.();
            return;
          }

          const { rows, total } = extractRowsAndTotal(res);
          setAccountRows(rows);
          setAccountTotalElements(total);
          params.successCallback?.(rows, total);
        } catch {
          params.failCallback?.();
        } finally {
          setLoadingAccount(false);
        }
      },
    };
  }, [extractRowsAndTotal, intl, selectedRow, toast, refreshVersion]);

  const customerDatasource = useMemo(() => {
    if (!selectedRow) return null;

    return {
      getRows: async (params) => {
        const startRow = Number(params?.startRow) || 0;
        const endRow = Number(params?.endRow) || NOTES_PAGE_SIZE;
        const size = Math.max(1, endRow - startRow);
        const pageNumber = Math.floor(startRow / size) + 1;
        const custPayload = {
          "customerNotesDto.szAccountCustLevel": "C",
          pageNumber,
          size,
          pageSize: size,
        };

        setLoadingCustomer(true);
        try {
          const res = await HAxiosService.GET(`${MemosAPI.MemosApi(screenMenuId)}/getCustomerNotes`, { params: custPayload });

          if (res?.data?.status === "Failure") {
            if (res?.data?.message === "Validation Failed") {
              handleValidationErrors(intl, toast, res?.data?.responseJson);
            }
            params.failCallback?.();
            return;
          }

          const { rows, total } = extractRowsAndTotal(res);
          setCustomerRows(rows);
          setCustomerTotalElements(total);
          params.successCallback?.(rows, total);
        } catch {
          params.failCallback?.();
        } finally {
          setLoadingCustomer(false);
        }
      },
    };
  }, [extractRowsAndTotal, intl, selectedRow, toast, refreshVersion]);

  const stickyPreviewText = useMemo(() => {
    if (!isSticky) return null;
    return pickLatestNoteSnippet(accountCustLevel === "A" ? accountRows : customerRows);
  }, [isSticky, accountCustLevel, accountRows, customerRows]);

  const populateLatestGridNote = useCallback(
    (level) => {
      const rows = level === "A" ? accountRows : customerRows;
      setNotes(pickLatestGridNote(rows) || "");
    },
    [accountRows, customerRows]
  );

  const handleAccountCustLevelChange = useCallback(
    (level) => {
      setAccountCustLevel(level);
      if (isSticky) {
        populateLatestGridNote(level);
      }
    },
    [isSticky, populateLatestGridNote]
  );

  const handleStickyChange = useCallback(
    (checked) => {
      setIsSticky(checked);
      if (checked) {
        populateLatestGridNote(accountCustLevel);
      } else {
        setNotes("");
      }
    },
    [accountCustLevel, populateLatestGridNote]
  );

  const resetForm = useCallback(() => {
    setAccountCustLevel("A");
    setInteractionType("");
    setIsSticky(false);
    setNotes("");
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmedNotes = (notes || "").trim();
    const trimmedType = (interactionType || "").trim();

    if (!trimmedType) {
      toast.error(intl.formatMessage({ id: "error.memos.requiredInteraction" }));
      return;
    }
    if (!trimmedNotes) {
      toast.error(intl.formatMessage({ id: "error.memos.requiredNote" }));
      return;
    }

    if (!selectedRow) {
      toast.error(intl.formatMessage({ id: "error.memos.noAccount" }));
      return;
    }

    const requestData = {
      customerNotesDto: buildCustomerNotesDto({
        szNoteType: trimmedType,
        szNotes: trimmedNotes,
        szIsStickyNote: isSticky ? "Y" : "N",
        szAccountCustLevel: accountCustLevel,
      }),
    };

    return HAxiosService.POST(`${MemosAPI.MemosApi(screenMenuId)}/addNotes`, requestData)
      .then((res) => {
        const status = res?.data?.status ?? res?.status;
        const message = res?.data?.message ?? res?.data?.responseMessage;
        const isSuccess =
          status === 200 ||
          status === "200" ||
          String(status).trim().toLowerCase() === "success" ||
          (typeof message === "string" && String(message).trim().toLowerCase() === "success");

        if (isSuccess) {
          toast.success(intl.formatMessage({ id: "success.Memos.saved" }));
          const savedRow = mapNotesHistoryPayload([
            {
              dtNote: new Date().toISOString(),
              szCreatedBy: sessionStorage.getItem("SEC_USERNAME") || "SYSTEM",
              szNoteType: trimmedType,
              szNotes: trimmedNotes,
              szIsStickyNote: isSticky ? "Y" : "N",
              szAccountCustLevel: accountCustLevel,
            },
          ])[0];

          if (accountCustLevel === "A") {
            setAccountRows((rows) => [savedRow, ...rows]);
            setHistoryTab(0);
          } else {
            setCustomerRows((rows) => [savedRow, ...rows]);
            setHistoryTab(1);
          }
          setNotes("");
          setRefreshVersion((v) => v + 1);
        } else if (status === "Failure" || message === "Validation Failed") {
          handleValidationErrors(intl, toast, res?.data?.responseJson);
        } else {
          toast.error(intl.formatMessage({ id: "error.Memos.failed" }));
        }
      })
      .catch(() => {
        toast.error(intl.formatMessage({ id: "error.Saving.Memos" }));
      });
  }, [
    accountCustLevel,
    interactionType,
    intl,
    isSticky,
    notes,
    selectedRow,
    toast,
  ]);

  return (
    <FunctionLayout
      title={intl.formatMessage({ id: "Memos", defaultMessage: "Memos" })}
      contentPaddingTop={0}
    >
      <HBox
        sx={{
          display: "flex",
          flexDirection: "column",
          px: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 10, sm: 11 },
          pt: 1,
          width: "100%",
          boxSizing: "border-box",
          bgcolor: "background.default",
          color: "text.primary",
          fontFamily: memosFontFamily,
          backgroundImage: "none",
        }}
      >
        <HBox
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            maxWidth: "100%",
            flex: 1,
            minHeight: 0,
            bgcolor: "transparent",
            background: "transparent",
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        >
          <AddNotesForm
            accountCustLevel={accountCustLevel}
            setAccountCustLevel={handleAccountCustLevelChange}
            interactionType={interactionType}
            setInteractionType={setInteractionType}
            isSticky={isSticky}
            setIsSticky={handleStickyChange}
            notes={notes}
            setNotes={setNotes}
            stickyPreviewText={stickyPreviewText}
          />

          <AccountCustomerNotesTabs
            historyTab={historyTab}
            setHistoryTab={setHistoryTab}
            accountRows={accountRows}
            customerRows={customerRows}
            loadingAccount={loadingAccount}
            loadingCustomer={loadingCustomer}
            accountTotalElements={accountTotalElements}
            customerTotalElements={customerTotalElements}
            accountDatasource={accountDatasource}
            customerDatasource={customerDatasource}
            notesPageSize={NOTES_PAGE_SIZE}
            refreshVersion={refreshVersion}
          />
        </HBox>

        <HBox
          sx={{
            position: "relative",
            zIndex: 2000,
            bgcolor: "transparent",
            background: "transparent",
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        >
          <HButtonBar
            onSave={handleSubmit}
            onReset={resetForm}
            onClose={() => navigate("/homelayout/welcomepage")}
          />
        </HBox>
      </HBox>
    </FunctionLayout>
  );
}
