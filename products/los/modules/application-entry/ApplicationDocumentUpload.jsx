import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import {
  HAccordion,
  HAxiosService,
  HBox,
  HBreadCrumb,
  HButton,
  HButtonBar,
  HDatePicker,
  HDialog,
  HDropdown,
  HLabel,
  HPaper,
  HTextField,
  HTextarea,
  TitleBar,
  useToast,
} from "@helix/component-library";
import dayjs from "dayjs";

import { LosDocumentAPI } from "./apiEndpoints";
import { unwrapApiResponse } from "./unwrapApiResponse";

const ALL_BORROWERS = "ALL_BORROWERS";
const STATUS = {
  PENDING: "Pending",
  RECEIVED: "Received",
  DEFERRED: "Deferred",
  WAIVED: "Waived",
};

const toDropdownOptions = (rows = []) =>
  (Array.isArray(rows) ? rows : []).map((row) => ({
    label: row.label || row.value,
    value: row.value,
  }));

const newCustomId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `custom-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const flattenItems = (families = []) => families.flatMap((family) => family.items || []);

const ApplicationDocumentUpload = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const screenMenuId = location.state?.menuId;
  const incomingApplicationNo = location.state?.applicationNo;
  const borrowerType = location.state?.borrowerType || "Individual";
  const applicantOptions = useMemo(() => {
    const fromState = location.state?.applicants;
    if (Array.isArray(fromState) && fromState.length > 0) {
      return fromState.map((name) => ({ label: name, value: name }));
    }
    return [
      {
        label: intl.formatMessage({
          id: "label.docupload.option.allBorrowers",
          defaultMessage: "All Borrowers",
        }),
        value: ALL_BORROWERS,
      },
    ];
  }, [intl, location.state?.applicants]);

  const t = useCallback(
    (id, defaultMessage, values) => intl.formatMessage({ id, defaultMessage }, values),
    [intl]
  );

  const [applicationNo, setApplicationNo] = useState(incomingApplicationNo || "");
  const [stageOptions, setStageOptions] = useState([]);
  const [customerTypeOptions, setCustomerTypeOptions] = useState([]);
  const [waiveReasonOptions, setWaiveReasonOptions] = useState([]);
  const [applicableFor, setApplicableFor] = useState(applicantOptions[0]?.value || ALL_BORROWERS);
  const [stage, setStage] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [families, setFamilies] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [addingFor, setAddingFor] = useState("");
  const [newDocName, setNewDocName] = useState("");
  const [pendingFiles, setPendingFiles] = useState({});
  const [savedItemIds, setSavedItemIds] = useState(() => new Set());
  const [preview, setPreview] = useState(null);
  const [waiveDialog, setWaiveDialog] = useState(null);
  const [deferDialog, setDeferDialog] = useState(null);
  const fileInputs = useRef({});

  const items = useMemo(() => flattenItems(families), [families]);
  const receivedCount = items.filter((item) => item.status === STATUS.RECEIVED).length;

  const loadMasters = useCallback(async () => {
    try {
      const [stages, types, reasons] = await Promise.all([
        HAxiosService.GET(LosDocumentAPI.stages()).then(unwrapApiResponse),
        HAxiosService.GET(LosDocumentAPI.customerTypes(borrowerType)).then(unwrapApiResponse),
        HAxiosService.GET(LosDocumentAPI.waiveReasons()).then(unwrapApiResponse),
      ]);
      const stageOpts = toDropdownOptions(stages);
      const typeOpts = toDropdownOptions(types);
      setStageOptions(stageOpts);
      setCustomerTypeOptions(typeOpts);
      setWaiveReasonOptions(toDropdownOptions(reasons));
      setStage((current) => current || stageOpts.find((o) => o.value === "PRE_SUBMISSION")?.value || stageOpts[0]?.value || "");
      setCustomerType((current) => current || typeOpts[0]?.value || "");
    } catch (error) {
      toast.error(error?.message || t("label.docupload.msg.loadFailed", "Unable to load document masters"));
    }
  }, [borrowerType, t, toast]);

  const applyFamilies = useCallback((payload) => {
    const nextFamilies = payload?.families || [];
    setFamilies(nextFamilies);
    setSavedItemIds(new Set(flattenItems(nextFamilies).map((item) => item.itemId)));
    setExpanded((prev) => {
      const next = { ...prev };
      nextFamilies.forEach((family) => {
        if (next[family.docFamilyCode] === undefined) next[family.docFamilyCode] = true;
      });
      return next;
    });
    if (payload?.applicationNo) setApplicationNo(payload.applicationNo);
    if (payload?.applicableFor) setApplicableFor(payload.applicableFor);
  }, []);

  const loadChecklist = useCallback(async () => {
    if (!stage || !customerType) return;
    try {
      const payload = incomingApplicationNo
        ? unwrapApiResponse(
            await HAxiosService.GET(
              LosDocumentAPI.getByAppNo(incomingApplicationNo, stage, customerType, applicableFor)
            )
          )
        : unwrapApiResponse(await HAxiosService.GET(LosDocumentAPI.checklist(stage, customerType)));
      applyFamilies(payload);
      setPendingFiles({});
      setAddingFor("");
      setNewDocName("");
    } catch (error) {
      toast.error(error?.message || t("label.docupload.msg.loadFailed", "Unable to load document checklist"));
    }
  }, [applicableFor, applyFamilies, customerType, incomingApplicationNo, stage, t, toast]);

  useEffect(() => {
    loadMasters();
  }, [loadMasters]);

  useEffect(() => {
    loadChecklist();
  }, [loadChecklist]);

  const updateItem = useCallback((itemId, patch) => {
    setFamilies((prev) =>
      prev.map((family) => ({
        ...family,
        items: (family.items || []).map((item) => (item.itemId === itemId ? { ...item, ...patch } : item)),
      }))
    );
  }, []);

  const handleStatusClick = (item, status) => {
    if (item.status === status) {
      updateItem(item.itemId, { status: STATUS.PENDING });
      return;
    }
    if (status === STATUS.WAIVED) {
      setWaiveDialog({
        itemId: item.itemId,
        reason: item.waiveReason || "",
        comments: item.waiveComments || "",
      });
      return;
    }
    if (status === STATUS.DEFERRED) {
      setDeferDialog({
        itemId: item.itemId,
        stage: item.deferralStage || stage,
        date: item.deferralDate || "",
      });
      return;
    }
    updateItem(item.itemId, { status });
  };

  const handleAddCustom = (family) => {
    if (!newDocName.trim()) return;
    const item = {
      itemId: newCustomId(),
      docFamilyCode: family.docFamilyCode,
      docFamilyName: family.docFamilyName,
      docCode: "",
      docName: newDocName.trim(),
      required: false,
      custom: true,
      status: STATUS.PENDING,
      hasFile: false,
    };
    setFamilies((prev) =>
      prev.map((row) =>
        row.docFamilyCode === family.docFamilyCode ? { ...row, items: [...(row.items || []), item] } : row
      )
    );
    setNewDocName("");
    setAddingFor("");
  };

  const handleDeleteCustom = async (item) => {
    if (!item.custom) {
      toast.error(t("label.docupload.msg.masterDeleteDenied", "Master checklist documents cannot be deleted"));
      return;
    }
    if (item.custom && applicationNo && savedItemIds.has(item.itemId)) {
      try {
        unwrapApiResponse(await HAxiosService.DELETE(LosDocumentAPI.deleteItem(applicationNo, item.itemId)));
      } catch (error) {
        toast.error(error?.message || t("label.docupload.msg.deleteFailed", "Unable to delete document"));
        return;
      }
    }
    setFamilies((prev) =>
      prev.map((family) => ({
        ...family,
        items: (family.items || []).filter((row) => row.itemId !== item.itemId),
      }))
    );
    setPendingFiles((prev) => {
      const next = { ...prev };
      delete next[item.itemId];
      return next;
    });
  };

  const handleFilePicked = (item, file) => {
    if (!file) return;
    const fileUrl = URL.createObjectURL(file);
    setPendingFiles((prev) => ({ ...prev, [item.itemId]: file }));
    updateItem(item.itemId, {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileUrl,
      hasFile: true,
      status: item.status === STATUS.PENDING ? STATUS.RECEIVED : item.status,
    });
  };

  const handleRemoveFile = (item) => {
    setPendingFiles((prev) => {
      const next = { ...prev };
      delete next[item.itemId];
      return next;
    });
    updateItem(item.itemId, {
      fileName: undefined,
      fileSize: undefined,
      fileType: undefined,
      fileUrl: undefined,
      hasFile: false,
      status: item.status === STATUS.RECEIVED ? STATUS.PENDING : item.status,
    });
  };

  const handlePreview = async (item) => {
    if (item.fileUrl) {
      setPreview(item);
      return;
    }
    if (!applicationNo || !item.hasFile) return;
    try {
      const data = unwrapApiResponse(await HAxiosService.GET(LosDocumentAPI.file(applicationNo, item.itemId)));
      const binary = atob(data.contentBase64 || "");
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: data.fileType || item.fileType || "application/octet-stream" });
      setPreview({
        ...item,
        fileName: data.fileName || item.fileName,
        fileType: data.fileType || item.fileType,
        fileUrl: URL.createObjectURL(blob),
      });
    } catch (error) {
      toast.error(error?.message || t("label.docupload.preview.unavailable", "No preview available"));
    }
  };

  const persistFiles = async (appNo) => {
    const entries = Object.entries(pendingFiles);
    for (const [itemId, file] of entries) {
      const form = new FormData();
      form.append("file", file);
      unwrapApiResponse(
        await HAxiosService.POST(LosDocumentAPI.upload(appNo, itemId), form, {}, false, { Accept: "application/json" })
      );
    }
  };

  const handleSave = useCallback(async () => {
    try {
      const appNo = applicationNo || incomingApplicationNo || `APP-${Date.now()}`;
      if (!applicationNo) setApplicationNo(appNo);
      const payload = {
        stage,
        customerType,
        applicableFor,
        items: flattenItems(families).map((item) => ({
          itemId: item.itemId,
          docFamilyCode: item.docFamilyCode,
          docFamilyName: item.docFamilyName,
          docCode: item.docCode,
          docName: item.docName,
          required: item.required,
          custom: item.custom,
          status: item.status,
          fileName: item.fileName,
          fileSize: item.fileSize,
          fileType: item.fileType,
          hasFile: Boolean(item.hasFile),
          waiveReason: item.waiveReason,
          waiveComments: item.waiveComments,
          deferralStage: item.deferralStage,
          deferralDate: item.deferralDate,
          remarks: item.remarks,
        })),
      };
      const saved = unwrapApiResponse(await HAxiosService.PUT(LosDocumentAPI.save(appNo), payload));
      await persistFiles(appNo);
      applyFamilies(
        unwrapApiResponse(
          await HAxiosService.GET(LosDocumentAPI.getByAppNo(appNo, stage, customerType, applicableFor))
        ) || saved
      );
      setPendingFiles({});
      toast.success(t("label.docupload.msg.saved", "Documents saved"));
      return { success: true };
    } catch (error) {
      toast.error(error?.message || t("label.docupload.msg.saveFailed", "Save failed"));
      return { success: false };
    }
  }, [applicableFor, applicationNo, applyFamilies, customerType, families, incomingApplicationNo, pendingFiles, stage, t, toast]);

  const handleReset = useCallback(async () => {
    await loadChecklist();
    toast.success(t("label.docupload.msg.reset", "Form reset"));
    return { success: true };
  }, [loadChecklist, t, toast]);

  return (
    <HBox>
      <HBreadCrumb />
      <TitleBar title={t("label.docupload.title", "Document upload")} />
      <HBox>
        <HPaper>
          <HBox data-menu-id={screenMenuId}>
            <HLabel value="label.docupload.field.applicableFor" required align="left" colon={false} />
            <HDropdown
              name="applicableFor"
              options={applicantOptions}
              value={applicableFor}
              onChange={(e) => setApplicableFor(e.target.value)}
              width="100%"
            />
            <HLabel value="label.docupload.field.stage" required align="left" colon={false} />
            <HDropdown
              name="stage"
              options={stageOptions}
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              width="100%"
            />
            <HLabel value="label.docupload.field.customerType" required align="left" colon={false} />
            <HDropdown
              name="customerType"
              options={customerTypeOptions}
              value={customerType}
              onChange={(e) => setCustomerType(e.target.value)}
              width="100%"
            />

            <HLabel value="label.docupload.checklist.title" align="left" colon={false} />
            <HLabel value="label.docupload.checklist.hint" align="left" colon={false} />
            <HLabel
              value={t("label.docupload.checklist.receivedCount", "{received}/{total} received", {
                received: receivedCount,
                total: items.length,
              })}
              translate={false}
              align="left"
              colon={false}
            />

            {families.map((family) => (
              <HAccordion
                key={family.docFamilyCode}
                id={`doc-family-${family.docFamilyCode}`}
                title={family.docFamilyName}
                childKeyProp={family.docFamilyCode}
                isExpandedChildrenProp={expanded}
                onChangeEvent={() =>
                  setExpanded((prev) => ({ ...prev, [family.docFamilyCode]: !prev[family.docFamilyCode] }))
                }
              >
                <HButton
                  label="label.docupload.button.addDocument"
                  variant="outlined"
                  inline
                  onClick={() => setAddingFor(addingFor === family.docFamilyCode ? "" : family.docFamilyCode)}
                />
                {addingFor === family.docFamilyCode ? (
                  <HBox>
                    <HTextField
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      editable
                      placeholder="label.docupload.placeholder.docName"
                      width="100%"
                    />
                    <HButton label="label.docupload.button.add" variant="contained" inline onClick={() => handleAddCustom(family)} />
                    <HButton
                      label="label.docupload.button.cancel"
                      variant="outlined"
                      inline
                      onClick={() => {
                        setAddingFor("");
                        setNewDocName("");
                      }}
                    />
                  </HBox>
                ) : null}

                {(family.items || []).length === 0 ? (
                  <HLabel value="label.docupload.empty.section" align="left" colon={false} />
                ) : (
                  (family.items || []).map((item) => (
                    <HBox key={item.itemId}>
                      <HLabel value={item.docName} translate={false} align="left" colon={false} />
                      <HLabel
                        value={item.custom ? "label.docupload.flag.custom" : "label.docupload.flag.system"}
                        align="left"
                        colon={false}
                      />
                      {item.fileName ? (
                        <HLabel
                          value={`${item.fileName}${item.fileSize ? ` (${item.fileSize})` : ""}`}
                          translate={false}
                          align="left"
                          colon={false}
                        />
                      ) : null}
                      <input
                        ref={(el) => {
                          fileInputs.current[item.itemId] = el;
                        }}
                        type="file"
                        hidden
                        onChange={(e) => {
                          handleFilePicked(item, e.target.files?.[0]);
                          e.target.value = "";
                        }}
                      />
                      <HButton
                        label={item.fileName ? "label.docupload.button.replace" : "label.docupload.button.upload"}
                        variant="outlined"
                        inline
                        onClick={() => fileInputs.current[item.itemId]?.click()}
                      />
                      <HButton
                        label="label.docupload.button.received"
                        variant={item.status === STATUS.RECEIVED ? "contained" : "outlined"}
                        inline
                        onClick={() => handleStatusClick(item, STATUS.RECEIVED)}
                      />
                      <HButton
                        label="label.docupload.button.deferred"
                        variant={item.status === STATUS.DEFERRED ? "contained" : "outlined"}
                        inline
                        onClick={() => handleStatusClick(item, STATUS.DEFERRED)}
                      />
                      <HButton
                        label="label.docupload.button.waived"
                        variant={item.status === STATUS.WAIVED ? "contained" : "outlined"}
                        inline
                        onClick={() => handleStatusClick(item, STATUS.WAIVED)}
                      />
                      <HLabel
                        value={
                          item.status === STATUS.RECEIVED
                            ? "label.docupload.status.received"
                            : item.status === STATUS.DEFERRED
                              ? "label.docupload.status.deferred"
                              : item.status === STATUS.WAIVED
                                ? "label.docupload.status.waived"
                                : "label.docupload.status.pending"
                        }
                        align="left"
                        colon={false}
                      />
                      {item.hasFile || item.fileUrl ? (
                        <HButton
                          label="label.docupload.button.preview"
                          variant="outlined"
                          inline
                          onClick={() => handlePreview(item)}
                        />
                      ) : null}
                      {item.fileName ? (
                        <HButton
                          label="label.docupload.button.removeFile"
                          variant="outlined"
                          inline
                          onClick={() => handleRemoveFile(item)}
                        />
                      ) : null}
                      {item.custom ? (
                        <HButton
                          label="label.docupload.button.delete"
                          variant="outlined"
                          inline
                          onClick={() => handleDeleteCustom(item)}
                        />
                      ) : null}
                    </HBox>
                  ))
                )}
              </HAccordion>
            ))}
          </HBox>
        </HPaper>
      </HBox>

      <HButtonBar
        onSave={handleSave}
        onReset={handleReset}
        onClose={() => navigate("/homelayout/welcomepage")}
        disableToast={{ save: true, reset: true, close: true }}
      />

      <HDialog
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        title={preview?.docName || t("label.docupload.dialog.previewTitle", "Document preview")}
        maxWidth="md"
        fullWidth
        actions={
          <HButton label="label.docupload.button.cancel" variant="outlined" inline onClick={() => setPreview(null)} />
        }
      >
        {preview?.fileUrl && (preview.fileType || "").startsWith("image/") ? (
          <img src={preview.fileUrl} alt={preview.docName} width="100%" />
        ) : preview?.fileUrl && ((preview.fileType || "").includes("pdf") || /\.pdf$/i.test(preview.fileName || "")) ? (
          <iframe title={preview.docName} src={preview.fileUrl} width="100%" height="480" />
        ) : (
          <HLabel value="label.docupload.preview.unavailable" align="left" colon={false} />
        )}
      </HDialog>

      <HDialog
        open={Boolean(waiveDialog)}
        onClose={() => setWaiveDialog(null)}
        title={t("label.docupload.dialog.waiveTitle", "Waive document")}
        maxWidth="sm"
        fullWidth
        actions={
          <HBox>
            <HButton label="label.docupload.button.cancel" variant="outlined" inline onClick={() => setWaiveDialog(null)} />
            <HButton
              label="label.docupload.button.confirmWaive"
              variant="contained"
              inline
              disabled={!waiveDialog?.reason}
              onClick={() => {
                updateItem(waiveDialog.itemId, {
                  status: STATUS.WAIVED,
                  waiveReason: waiveDialog.reason,
                  waiveComments: waiveDialog.comments,
                });
                setWaiveDialog(null);
              }}
            />
          </HBox>
        }
      >
        <HLabel value="label.docupload.dialog.waiveHint" align="left" colon={false} />
        <HLabel value="label.docupload.field.reason" required align="left" colon={false} />
        <HDropdown
          name="waiveReason"
          options={waiveReasonOptions}
          value={waiveDialog?.reason || ""}
          onChange={(e) => setWaiveDialog((prev) => ({ ...prev, reason: e.target.value }))}
          width="100%"
        />
        <HLabel value="label.docupload.field.comments" align="left" colon={false} />
        <HTextarea
          value={waiveDialog?.comments || ""}
          onChange={(e) => setWaiveDialog((prev) => ({ ...prev, comments: e.target.value }))}
          maxLength={500}
          maxLines={3}
          width="100%"
          placeholder="label.docupload.field.comments"
        />
      </HDialog>

      <HDialog
        open={Boolean(deferDialog)}
        onClose={() => setDeferDialog(null)}
        title={t("label.docupload.dialog.deferTitle", "Defer document")}
        maxWidth="sm"
        fullWidth
        actions={
          <HBox>
            <HButton label="label.docupload.button.cancel" variant="outlined" inline onClick={() => setDeferDialog(null)} />
            <HButton
              label="label.docupload.button.confirmDefer"
              variant="contained"
              inline
              disabled={!deferDialog?.stage || !deferDialog?.date}
              onClick={() => {
                updateItem(deferDialog.itemId, {
                  status: STATUS.DEFERRED,
                  deferralStage: deferDialog.stage,
                  deferralDate: deferDialog.date,
                });
                setDeferDialog(null);
              }}
            />
          </HBox>
        }
      >
        <HLabel value="label.docupload.dialog.deferHint" align="left" colon={false} />
        <HLabel value="label.docupload.field.deferralStage" required align="left" colon={false} />
        <HDropdown
          name="deferralStage"
          options={stageOptions}
          value={deferDialog?.stage || ""}
          onChange={(e) => setDeferDialog((prev) => ({ ...prev, stage: e.target.value }))}
          width="100%"
        />
        <HLabel value="label.docupload.field.deferralDate" required align="left" colon={false} />
        <HDatePicker
          value={deferDialog?.date ? dayjs(deferDialog.date) : null}
          onChange={(value) =>
            setDeferDialog((prev) => ({
              ...prev,
              date: value ? value.format("YYYY-MM-DD") : "",
            }))
          }
          width="100%"
        />
      </HDialog>
    </HBox>
  );
};

export default ApplicationDocumentUpload;
