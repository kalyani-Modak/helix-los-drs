import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import IconButton from "@mui/material/IconButton";
import { IntlProvider, useIntl } from "react-intl";
import { HAxiosService, HBox, HBreadCrumb, HButton, useDrsTheme, HButtonBar, HDatePicker, HDialog, HDropdown, HLabel, HPaper, HTextField, HTextarea, TitleBar, useToast, } from "@helix/component-library";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";

import { LosDocumentAPI, LosQdeAPI } from "./apiEndpoints";
import { unwrapApiResponse } from "./unwrapApiResponse";

/* ============================================================
   CONFIGURATION
   ============================================================ */

/*
 * true  -> use hardcoded data
 * false -> use actual backend APIs
 */
const USE_MOCK_DATA = true;


const STATUS = {
  PENDING: "Pending",
  RECEIVED: "Received",
  DEFERRED: "Deferred",
  WAIVED: "Waived",
};

/* ============================================================
   MOCK MASTER DATA
   ============================================================ */

const MOCK_STAGE_OPTIONS = [
  {
    label: "Pre-Submission",
    value: "PRE_SUBMISSION",
  },
  {
    label: "Underwriting",
    value: "UNDERWRITING",
  },
  {
    label: "Pre-Approval",
    value: "PRE_APPROVAL",
  },
  {
    label: "Post-Approval",
    value: "POST_APPROVAL",
  },
];

const MOCK_CATEGORY_OPTIONS = [
  {
    label: "Salaried",
    value: "Salaried",
  },
  {
    label: "Self Employed Professional",
    value: "Self Employed Professional",
  },
  {
    label: "General",
    value: "General",
  }
];


const MOCK_WAIVE_REASON_OPTIONS = [
  {
    label: "Not Applicable",
    value: "NOT_APPLICABLE",
  },
  {
    label: "Already Available",
    value: "ALREADY_AVAILABLE",
  },
  {
    label: "Customer Request",
    value: "CUSTOMER_REQUEST",
  },
  {
    label: "Exception Approved",
    value: "EXCEPTION_APPROVED",
  },
];


const MOCK_DOCUMENT_DATA = {}

const documentButtonStyle = {
  height: "30px",
  minHeight: "30px",
  padding: "0px 14px",
  fontSize: "12px",
  minWidth: "90px",
  borderRadius: "6px",
  boxSizing: "border-box",
};

const toDropdownOptions = (rows = []) =>
  (Array.isArray(rows) ? rows : []).map((row) => ({
    label: row.label || row.value,
    value: row.value,
  }));

const newCustomId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `custom-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}`;

const flattenItems = (families = []) =>
  families.flatMap((family) => family.items || []);

const formatFileSize = (bytes) => {
  if (!bytes) return "";

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const isDocumentChanged = (item, originalItem) => {
  // New/custom document
  if (!originalItem) {
    return true;
  }

  // Uploaded/removed file
  if (
    item.fileName !== originalItem.fileName ||
    item.fileSize !== originalItem.fileSize ||
    item.fileType !== originalItem.fileType ||
    item.hasFile !== originalItem.hasFile
  ) {
    return true;
  }

  // Status
  if (item.status !== originalItem.status) {
    return true;
  }

  // LS_TRN_DOCUMENTS status flags
  if (
    item.szreceivedyn !== originalItem.szreceivedyn ||
    item.szwaivedyn !== originalItem.szwaivedyn ||
    item.szdifferyn !== originalItem.szdifferyn
  ) {
    return true;
  }

  // Waiver details
  if (
    item.waiveReason !== originalItem.waiveReason ||
    item.waiveComments !== originalItem.waiveComments ||
    item.szwaiverreason !== originalItem.szwaiverreason ||
    item.szwaiverdec !== originalItem.szwaiverdec
  ) {
    return true;
  }

  // Deferral details
  if (
    item.deferralStage !== originalItem.deferralStage ||
    item.deferralDate !== originalItem.deferralDate
  ) {
    return true;
  }

  // Remarks / other editable fields
  if (
    item.szremarks !== originalItem.szremarks ||
    item.remarks !== originalItem.remarks
  ) {
    return true;
  }

  return false;
};

/* ============================================================
   COMPONENT
   ============================================================ */

const ApplicationDocumentUpload = () => {
  const intl = useIntl();
  const toast = useToast();
  const { colors, surfaces, text, border, action, isDark } = useDrsTheme();



  const navigate = useNavigate();
  const location = useLocation();

  const screenMenuId = location.state?.menuId;

  const incomingApplicationNo = location.state?.applicationNo;
  const orgId = location.state?.orgId || "001";

  const borrowerType = location.state?.borrowerType || "Individual";

  /* ==========================================================
     TRANSLATION HELPER
     ========================================================== */

  const t = useCallback(
    (id, defaultMessage, values) =>
      intl.formatMessage(
        {
          id,
          defaultMessage,
        },
        values
      ),
    [intl]
  );


  const getDocumentStatusLabel = useCallback(
    (status) => {
      const statusMessages = {
        [STATUS.PENDING]: [
          "label.docupload.status.pending",
          "Pending",
        ],
        [STATUS.RECEIVED]: [
          "label.docupload.status.received",
          "Received",
        ],
        [STATUS.DEFERRED]: [
          "label.docupload.status.deferred",
          "Deferred",
        ],
        [STATUS.WAIVED]: [
          "label.docupload.status.waived",
          "Waived",
        ],
      };

      const [id, defaultMessage] =
        statusMessages[status] || [
          "label.docupload.status.pending",
          "Pending",
        ];

      return t(id, defaultMessage);
    },
    [t]
  );

  const localeOverrides = useMemo(
    () => ({
      ...intl.messages,
      "label.button.refresh": "Re-Generate Documents",
    }),
    [intl.messages]
  );


  /* ==========================================================
     STATE
     ========================================================== */

  const [applicationNo, setApplicationNo] = useState(incomingApplicationNo || "");
  const [applicationOptions, setApplicationOptions] = useState([]);

  const [applicantOptions, setApplicantOptions] = useState([]);

  const [applicantsLoaded, setApplicantsLoaded] = useState(false);

  const [stageOptions, setStageOptions] = useState(USE_MOCK_DATA ? MOCK_STAGE_OPTIONS : []);

  const [waiveReasonOptions, setWaiveReasonOptions,] = useState(USE_MOCK_DATA ? MOCK_WAIVE_REASON_OPTIONS : []);

  const [applicableFor, setApplicableFor] = useState("");
  const [applicantCategory, setApplicantCategory] = useState("");
  const [applicantCategoryOptions, setApplicantCategoryOptions] = useState(USE_MOCK_DATA ? MOCK_CATEGORY_OPTIONS : []);

  const [stage, setStage] = useState(USE_MOCK_DATA ? MOCK_DOCUMENT_DATA.stage : "");

  const [families, setFamilies] = useState([]);

  const [expanded, setExpanded] = useState({});

  const [addingFor, setAddingFor] = useState("");

  const [newDocName, setNewDocName] = useState("");


  const [savedItemIds, setSavedItemIds] = useState(() => new Set());

  const originalItemsRef = useRef([]);

  const [preview, setPreview] = useState(null);

  const [waiveDialog, setWaiveDialog] = useState(null);

  const [deferDialog, setDeferDialog] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const fileInputs = useRef({});

  const loadApplicationOptions = useCallback(async () => {
    try {
      const response = await HAxiosService.GET(
        LosQdeAPI.listApplications(orgId)
      ).then(unwrapApiResponse);

      const rows = Array.isArray(response)
        ? response
        : response?.content || response?.applications || response?.data || [];

      const options = rows
        .map((row) => {
          const value =
            row.applicationNo ||
            row.applicationNumber ||
            row.szApplicationNo ||
            row.szapplicationno;

          return value
            ? {
              label: String(value),
              value: String(value),
            }
            : null;
        })
        .filter(Boolean);

      if (
        incomingApplicationNo &&
        !options.some((option) => option.value === String(incomingApplicationNo))
      ) {
        options.unshift({
          label: String(incomingApplicationNo),
          value: String(incomingApplicationNo),
        });
      }

      setApplicationOptions(options);

      if (incomingApplicationNo) {
        setApplicationNo(String(incomingApplicationNo));
      } else if (options.length > 0) {
        setApplicationNo(options[0].value);
      }
    } catch (error) {
      toast.error(
        error?.message ||
        t(
          "label.docupload.msg.loadApplicationsFailed",
          "Unable to load applications"
        )
      );
      setApplicationOptions([]);
    }
  }, [incomingApplicationNo, orgId, t, toast]);



  /* ==========================================================
     DERIVED DATA
     ========================================================== */

  const items = useMemo(
    () => flattenItems(families),
    [families]
  );

  const getDocumentStatus = (item) => {
    if (item.status) {
      return item.status;
    }

    if (item.szwaivedyn === "Y") {
      return STATUS.WAIVED;
    }

    if (item.szdifferyn === "Y") {
      return STATUS.DEFERRED;
    }

    if (item.szreceivedyn === "Y") {
      return STATUS.RECEIVED;
    }

    return STATUS.PENDING;
  };

  const getStatusPillStyle = (status) => {
    switch (status) {
      case STATUS.RECEIVED:
        return {
          backgroundColor: isDark
            ? "rgba(76, 175, 80, 0.18)"
            : "#e6f4ea",
          color: isDark ? "#81c784" : "#1e7e34",
          border: `1px solid ${isDark ? "#3f7a44" : "#b7e1c1"}`,
        };

      case STATUS.DEFERRED:
        return {
          backgroundColor: isDark
            ? "rgba(255, 193, 7, 0.18)"
            : "#fff4e5",
          color: isDark ? "#ffd166" : "#b26a00",
          border: `1px solid ${isDark ? "#8a5a00" : "#ffd8a8"}`,
        };

      case STATUS.WAIVED:
        return {
          backgroundColor: isDark
            ? "rgba(33, 150, 243, 0.18)"
            : "#e7f1ff",
          color: isDark ? "#7fb8ff" : "#0b4f9e",
          border: `1px solid ${isDark ? "#2f6fbf" : "#bcd6ff"}`,
        };

      case STATUS.PENDING:
      default:
        return {
          backgroundColor: surfaces.panel,
          color: text.secondary,
          border: `1px solid ${border.divider}`,
        };
    }
  };

  const getStatusButtonSx = (status, isActive) => {
    const pill = getStatusPillStyle(status);

    if (!isActive) {
      // Inactive = outlined neutral
      return {
        ...documentButtonStyle,
        backgroundColor: "transparent",
        color: text.secondary,
        borderColor: border.control,
        "&:hover": {
          borderColor: border.hover,
          color: colors.primary,
          backgroundColor: action.hover,
        },
      };
    }

    // Active = filled with the same palette as the pill
    return {
      ...documentButtonStyle,
      backgroundColor: pill.backgroundColor,
      color: pill.color,
      borderColor: pill.border.replace("1px solid ", ""),
      "&:hover": {
        backgroundColor: pill.backgroundColor,
        color: pill.color,
        borderColor: pill.border.replace("1px solid ", ""),
      },
    };
  };

  const receivedCount = items.filter(
    (item) =>
      item.status === STATUS.RECEIVED
  ).length;

  /* ==========================================================
     APPLY DATA
     ========================================================== */

  const applyFamilies = useCallback(
    (payload) => {
      const responseFamilies = Array.isArray(payload)
        ? payload
        : payload?.families || [];

      if (responseFamilies.length === 0) {
        setFamilies([]);
        toast.error("System failure — document checklist master not configured");
        return;
      }

      const nextFamilies = responseFamilies.map(
        (family) => {
          const normalizedItems = (family.items || []).map(
            (item) => {
              let itemId = item.itemId;
              const documentSrNo =
                item.iDocumentsSrNo ??
                item.idocumentsSrNo ??
                item.idocumentsrno ??
                null;
              if (
                !itemId &&
                documentSrNo !== null
              ) {
                itemId = String(documentSrNo);
              }

              /*
               * New/custom document:
               * Generate frontend ID.
               */
              if (!itemId) {
                itemId = newCustomId();
              }

              /*
               * Derive UI status from backend flags.
               */
              const status =
                (item.szWaivedYn || item.szwaivedyn) === "Y"
                  ? STATUS.WAIVED
                  : (item.szDifferYn || item.szdifferyn) === "Y"
                    ? STATUS.DEFERRED
                    : (item.szReceivedYn || item.szreceivedyn) === "Y"
                      ? STATUS.RECEIVED
                      : STATUS.PENDING;

              return {
                ...item,

                itemId,
                iDocumentsSrNo: documentSrNo,

                status,

                custom: Boolean(
                  item.custom ||
                  item.szUserSpecifiedYn === "Y" ||
                  item.szuserspecifiedyn === "Y"
                ),

                /*
                 * UI file information.
                 * These do not come from LS_TRN_DOCUMENTS.
                 */
                selectedFile: item.selectedFile,
                fileName: item.fileName,
                fileSize: item.fileSize,
                fileType: item.fileType,
                fileUrl: item.fileUrl,
                hasFile: Boolean(
                  item.hasFile ||
                  item.documentId ||
                  item.documentid ||
                  item.szReceivedYn === "Y" ||
                  item.szreceivedyn === "Y"
                ),

                /*
                 * UI waiver information
                 */
                waiveReason:
                  item.waiveReason ||
                  item.szWaiverReason ||
                  item.szwaiverreason ||
                  "",

                waiveComments:
                  item.waiveComments ||
                  item.szWaiverDec ||
                  item.szwaiverdec ||
                  "",

                /*
                 * UI deferral information
                 */
                deferralStage:
                  item.deferralStage ||
                  item.szStageDue ||
                  item.szstagedue ||
                  "",

                deferralDate:
                  item.deferralDate ||
                  item.dtDeferralDate ||
                  item.dtdeferraldate ||
                  "",
              };
            }
          );

          return {
            ...family,
            items: normalizedItems,
          };
        }
      );

      /*
       * Keep original backend data for change detection.
       */
      originalItemsRef.current = JSON.parse(
        JSON.stringify(
          flattenItems(nextFamilies)
        )
      );

      setFamilies(nextFamilies);

      /*
       * Existing saved rows.
       */
      setSavedItemIds(
        new Set(
          flattenItems(nextFamilies).map(
            (item) => item.itemId
          )
        )
      );

      /*
       * Expand each family.
       */
      setExpanded((prev) => {
        const next = {
          ...prev,
        };

        nextFamilies.forEach((family) => {
          if (
            next[family.docFamilyCode] === undefined
          ) {
            next[family.docFamilyCode] = true;
          }
        });

        return next;
      });

      /*
       * Application number.
       */
      if (payload?.applicationNo) {
        setApplicationNo(payload.applicationNo);
      }

      /*
       * Applicable applicant.
       */
      if (payload?.applicableFor) {
        setApplicableFor(payload.applicableFor);
      }
    },
    []
  );
  /* ==========================================================
     LOAD MASTER DATA
     ========================================================== */

  const loadMasters = useCallback(
    async () => {
      /* ------------------------------------------
         MOCK
         ------------------------------------------ */

      if (USE_MOCK_DATA) {
        setStageOptions(
          MOCK_STAGE_OPTIONS
        );

        setWaiveReasonOptions(
          MOCK_WAIVE_REASON_OPTIONS
        );

        return;
      }

      /* ------------------------------------------
         ACTUAL API
         ------------------------------------------ */

      try {
        const [
          stages,
          types,
          reasons,
        ] = await Promise.all([
          HAxiosService.GET(
            LosDocumentAPI.stages()
          ).then(unwrapApiResponse),

          HAxiosService.GET(
            LosDocumentAPI.customerTypes(
              borrowerType
            )
          ).then(unwrapApiResponse),

          HAxiosService.GET(
            LosDocumentAPI.waiveReasons()
          ).then(unwrapApiResponse),
        ]);

        const stageOpts =
          toDropdownOptions(stages);

        const typeOpts =
          toDropdownOptions(types);

        const reasonOpts =
          toDropdownOptions(reasons);

        setStageOptions(stageOpts);


        setWaiveReasonOptions(
          reasonOpts
        );

        setStage(
          (current) =>
            current ||
            stageOpts.find(
              (option) =>
                option.value ===
                "PRE_SUBMISSION"
            )?.value ||
            stageOpts[0]?.value ||
            ""
        );

      } catch (error) {
        toast.error(
          error?.message ||
          t(
            "label.docupload.msg.loadFailed",
            "Unable to load document masters"
          )
        );
      }
    },
    [
      borrowerType,
      t,
      toast,
    ]
  );

  /* ==========================================================
     LOAD CHECKLIST
     ========================================================== */

  const loadChecklist = useCallback(async () => {
    try {
      if (!applicationNo || !applicantsLoaded || !applicableFor || !stage || !applicantCategory) {
        setFamilies([]);
        return;
      }

      const payload = await HAxiosService.GET(LosDocumentAPI.LosDocumentAPI("ECF-DocumentUpload") + "/documents" + `?szApplicantId=${applicableFor}&szStageDue=${stage}&szApplicantCategory=${applicantCategory}`).then(unwrapApiResponse);

      console.log("Incomming payload = ", payload);
      applyFamilies(payload);

      setAddingFor("");
      setNewDocName("");
    } catch (error) {
      console.error("Failed to load document checklist", error);
      setFamilies([]);
    }
  }, [applicationNo, applicantsLoaded, applicableFor, applicantCategory, stage, applyFamilies]);

  const loadApplicantOptions = useCallback(async () => {
    setApplicantsLoaded(false);

    if (!applicationNo || !orgId) {
      setApplicantOptions([]);
      setApplicableFor("");
      return;
    }

    try {
      const applicants = await HAxiosService.GET(LosDocumentAPI.LosDocumentAPI("ECF-DocumentUpload") + `?applicationNo=${applicationNo}&orgId=${orgId}`).then(unwrapApiResponse);

      const options = toDropdownOptions(applicants);

      setApplicantOptions(options);

      // Set first applicant as default
      setApplicableFor((current) => {
        const selectedValue = options[0]?.value || "";
        const selectedApplicant = options.find(
          (option) => option.value === selectedValue
        );

        return selectedValue;
      });
      setApplicantsLoaded(true);
    } catch (error) {
      toast.error(error?.message || t("label.docupload.msg.loadApplicantFailed", "Unable to load applicants")
      );

      setApplicantOptions([]);
      setApplicableFor("");
      setApplicantsLoaded(false);
    }
  },
    [applicationNo, orgId, t, toast,]
  );
  /* ==========================================================
     INITIAL LOAD
     ========================================================== */

  useEffect(() => {
    loadApplicationOptions();
  }, [loadApplicationOptions]);

  useEffect(() => {
    loadApplicantOptions();
  }, [loadApplicantOptions]);


  useEffect(() => {
    loadMasters();
  }, [loadMasters]);

  useEffect(() => {
    loadChecklist();
  }, [loadChecklist]);

  /* ==========================================================
     UPDATE ITEM
     ========================================================== */

  const updateItem = useCallback(
    (itemId, patch) => {
      setFamilies((prev) =>
        prev.map((family) => ({
          ...family,

          items: (
            family.items || []
          ).map((item) =>
            item.itemId === itemId
              ? {
                ...item,
                ...patch,

                // Mark existing document as changed
                _dirty: true,
              }
              : item
          ),
        }))
      );
    },
    []
  );
  /* ==========================================================
     STATUS CLICK
     ========================================================== */

  const handleStatusClick = (
    item,
    status
  ) => {

    /* =========================================================
       Clicking the currently selected status again
       returns the document to Pending
       ========================================================= */
    if (item.status === status) {

      updateItem(
        item.itemId,
        {
          status: STATUS.PENDING,

          szreceivedyn: "N",
          szwaivedyn: "N",
          szdifferyn: "N",
        }
      );

      return;
    }

    /* =========================================================
       WAIVED
       ========================================================= */
    if (status === STATUS.WAIVED) {

      setWaiveDialog({
        itemId: item.itemId,

        reason:
          item.waiveReason ||
          "",

        comments:
          item.waiveComments ||
          "",
      });

      return;
    }

    /* =========================================================
       DEFERRED
       ========================================================= */
    if (status === STATUS.DEFERRED) {

      setDeferDialog({
        itemId: item.itemId,

        stage:
          item.deferralStage ||
          stage,

        date:
          item.deferralDate ||
          "",
      });

      return;
    }

    /* =========================================================
       RECEIVED
       
       File is OPTIONAL.
       
       Clicking Received only changes the status.
       If a file exists, it will be uploaded during Save.
       If no file exists, backend only saves
       szReceivedYn = Y.
       ========================================================= */
    if (status === STATUS.RECEIVED) {

      updateItem(
        item.itemId,
        {
          status: STATUS.RECEIVED,

          szreceivedyn: "Y",

          szwaivedyn: "N",
          szdifferyn: "N",
        }
      );

      return;
    }
  };

  /* ==========================================================
     ADD CUSTOM DOCUMENT
     ========================================================== */

  const handleAddCustom = (family) => {
    if (!newDocName.trim()) {
      toast.error(t(
        "label.docupload.msg.invalidDocumentName",
        "Please enter a valid, unique document name"
      ));
      return;
    }

    const item = {

      itemId: newCustomId(),

      _isNew: true,

      custom: true,


      idocumentsrno: null,

      szapplicationno:
        applicationNo,

      szorgid:
        "001",

      szdoccode: newDocName.trim(),

      szapplicantid:
        applicableFor,

      szassetsrno: null,

      szstagedue:
        stage,

      szdocwaiveallowyn:
        "Y",

      szreceivedyn:
        "N",

      szwaivedyn:
        "N",

      szwaiverdec:
        null,

      szwaiverreason:
        null,

      szdifferyn:
        "N",

      szmandatoryyn:
        "N",

      szoriginalreqyn:
        "N",

      szverfdecision:
        null,

      szverifiedby:
        null,

      szuserspecifiedyn:
        "Y",

      documentid:
        null,

      szdocfamilycode:
        family.docFamilyCode,

      szdocfamilydesc:
        family.docFamilyName,

      cfraudyn:
        "N",

      szremarks:
        null,

      iduedays:
        null,

      dtduedate:
        null,

      szdocketlocation:
        null,

      inoofpages:
        null,

      clevel:
        "P",

      dtrecieptdate:
        null,

      szcreatedby:
        "USER",

      dtcreatedon:
        new Date(),

      szupdatedby:
        "USER",

      dtupdatedon:
        new Date(),
    };

    setFamilies(
      (prev) =>
        prev.map(
          (row) =>
            row.docFamilyCode ===
              family.docFamilyCode
              ? {
                ...row,

                items: [
                  ...(row.items ||
                    []),

                  item,
                ],
              }
              : row
        )
    );

    setNewDocName("");
    setAddingFor("");
  };

  /* ==========================================================
     DELETE CUSTOM DOCUMENT
     ========================================================== */

  const handleDeleteCustom =
    async (item) => {
      const docSrNo =
        item.iDocumentsSrNo ??
        item.idocumentsSrNo ??
        item.idocumentsrno ??
        null;
      if (!item.custom) {
        toast.error(
          t(
            "label.docupload.msg.masterDeleteDenied",
            "Master checklist documents cannot be deleted"
          )
        );

        return;
      }

      /*
       * Actual API delete
       */


      if (
        applicationNo &&
        savedItemIds.has(
          String(docSrNo)
        )
      ) {
        try {
          unwrapApiResponse(
            await HAxiosService.DELETE(
              LosDocumentAPI.LosDocumentAPI("ECF-DocumentUpload") +
              `/${encodeURIComponent(docSrNo)}` +
              `?applicationNo=${encodeURIComponent(applicationNo)}` +
              `&orgId=${encodeURIComponent(orgId)}`
            )
          );


        } catch (error) {
          toast.error(
            error?.message ||
            t(
              "label.docupload.msg.deleteFailed",
              "Unable to delete document"
            )
          );

          return;
        }
      }

      /*
       * Remove from UI
       */
      setFamilies(
        (prev) =>
          prev.map(
            (family) => ({
              ...family,

              items: (
                family.items || []
              ).filter(
                (row) =>
                  row.itemId !==
                  item.itemId
              ),
            })
          )
      );

      toast.success(
        t("label.docupload.msg.deleteSuccess", "Document deleted successfully")
      );

    };

  /* ==========================================================
 DELETE UPLOADED FILE (row stays, resets to default state)
 ========================================================== */

  const handleDeleteFile = async (item) => {
    const docSrNo =
      item.iDocumentsSrNo ??
      item.idocumentsSrNo ??
      item.idocumentsrno ??
      null;

    if (docSrNo == null) {
      toast.error(
        t(
          "label.docupload.msg.noFileToDelete",
          "This document has no uploaded file yet"
        )
      );
      return;
    }

    try {
      await unwrapApiResponse(
        await HAxiosService.DELETE(
          LosDocumentAPI.LosDocumentAPI("ECF-DocumentUpload") +
          `/documents/${encodeURIComponent(docSrNo)}/file` +
          `?applicationNo=${encodeURIComponent(applicationNo)}` +
          `&orgId=${encodeURIComponent(orgId)}`
        )
      );
    } catch (error) {
      toast.error(
        error?.message ||
        t("label.docupload.msg.fileDeleteFailed", "Unable to delete the uploaded file")
      );
      return;
    }

    updateItem(item.itemId, {
      selectedFile: undefined,
      fileName: undefined,
      fileSize: undefined,
      fileType: undefined,
      fileUrl: undefined,
      hasFile: false,

      status: STATUS.PENDING,
      szreceivedyn: "N",
      szwaivedyn: "N",
      szdifferyn: "N",

      documentid: null,
      dtrecieptdate: null,
    });

    toast.success(
      t("label.docupload.msg.fileDeleteSuccess", "Document file deleted successfully")
    );
  };

  /* ==========================================================
     FILE PICKED
     ========================================================== */

  const handleFilePicked = (item, file) => {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    const maxFileSize = 10 * 1024 * 1024; // 10 MB

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        t(
          "label.docupload.msg.fileValidation",
          "Please upload a supported file within the permitted size limit: {size} MB",
          { size: 10 }
        )
      );
      return;
    }

    if (file.size > maxFileSize) {
      toast.error(
        t(
          "label.docupload.msg.fileValidation",
          "Please upload a supported file within the permitted size limit: {size} MB",
          { size: 10 }
        )
      );
      return;
    }

    updateItem(item.itemId, {
      selectedFile: file,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      hasFile: true,

      status: STATUS.RECEIVED,

      szreceivedyn: "Y",
      szwaivedyn: "N",
      szdifferyn: "N",

      dtrecieptdate: new Date(),
    });
  };
  /* ==========================================================
     REMOVE FILE
     ========================================================== */

  const handleRemoveFile = (item) => {
    updateItem(item.itemId, {
      selectedFile: undefined,
      fileName: undefined,
      fileSize: undefined,
      fileType: undefined,
      fileUrl: undefined,
      hasFile: false,

      status:
        item.status === STATUS.RECEIVED
          ? STATUS.PENDING
          : item.status,

      szreceivedyn: "N",

      dtrecieptdate: null,
    });
  };
  /* ==========================================================
     PREVIEW
     ========================================================== */


  const handlePreview = async (item) => {
    setPreview((current) => {
      if (current?.fileUrl) {
        URL.revokeObjectURL(current.fileUrl);
      }
      return current;
    });
    if (item.selectedFile) {
      const fileUrl = URL.createObjectURL(item.selectedFile);

      setPreview({
        ...item,
        fileUrl,
        fileName: item.selectedFile.name,
        fileType: item.selectedFile.type,
      });

      return;
    }

    const docSrNo =
      item.iDocumentsSrNo ??
      item.idocumentsSrNo ??
      item.idocumentsrno ??
      null;

    if (!docSrNo) {
      toast.error(
        t(
          "label.docupload.msg.noPreview",
          "No uploaded file available to preview"
        )
      );
      return;
    }

    try {
      const response = await HAxiosService.GET(
        LosDocumentAPI.LosDocumentAPI("ECF-DocumentUpload") +
        `/documents/${docSrNo}/preview` +
        `?applicationNo=${encodeURIComponent(applicationNo)}` +
        `&orgId=${encodeURIComponent(orgId)}`,
        { responseType: "blob" }
      );

      const blob = response.data ?? response;
      const fileUrl = URL.createObjectURL(blob);

      setPreview({
        ...item,
        fileUrl,
        fileName: item.fileName || item.szDocCode || item.szdoccode,
        fileType: blob.type,
      });
    } catch (error) {
      toast.error(
        error?.message ||
        t(
          "label.docupload.msg.previewFailed",
          "Unable to load preview"
        )
      );
    }
  };

  const validateHeaderFields = useCallback(() => {
    const errors = {};

    if (!applicableFor?.trim()) {
      errors.applicableFor = t(
        "label.docupload.validation.applicableFor",
        "Please select the applicable party for this checklist"
      );
    }

    if (!stage?.trim()) {
      errors.stage = t(
        "label.docupload.validation.stage",
        "Please select a Stage"
      );
    }

    if (!applicantCategory?.trim()) {
      errors.customerType = t(
        "label.docupload.validation.customerType",
        "Please select a Customer Type"
      );
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error(Object.values(errors)[0]);
      return false;
    }

    return true;
  }, [applicableFor, stage, applicantCategory, t, toast]);

  const validateMandatoryDocuments = () => {
    const allItems = flattenItems(families);

    const mandatoryItems = allItems.filter(
      (item) =>
        (item.szmandatoryyn || item.szMandatoryYn) === "Y"
    );

    const invalidItems = mandatoryItems.filter((item) => {
      const status = getDocumentStatus(item);

      return ![
        STATUS.RECEIVED,
        STATUS.DEFERRED,
        STATUS.WAIVED,
      ].includes(status);
    });

    if (invalidItems.length > 0) {
      toast.error(
        t(
          "label.docupload.validation.mandatoryDocuments",
          "Please receive and upload all mandatory documents before submitting"
        )
      );

      return false;
    }

    return true;
  };
  /* ==========================================================
     SAVE
     ========================================================== */

  const handleSave = useCallback(
    async () => {
      try {
        if (!validateHeaderFields()) {
          return {
            success: false,
          };
        }

        if (!validateMandatoryDocuments()) {
          return {
            success: false,
          };
        }

        const appNo = applicationNo || incomingApplicationNo;

        if (!applicationNo) {
          setApplicationNo(appNo);
        }

        const allItems = flattenItems(families);

        const originalById = new Map(
          originalItemsRef.current.map((o) => [o.itemId, o])
        );

        const currentItems = allItems.filter((item) =>
          isDocumentChanged(item, originalById.get(item.itemId))
        );

        if (currentItems.length === 0) {

          toast.error(t("label.docupload.msg.notchanged", "No data changed to save"));
          return { success: true };
        }

        const requestPayload = currentItems.map((item) => ({
          /*
           * Primary Key
           */
          iDocumentsSrNo: item.iDocumentsSrNo ??
            item.idocumentsSrNo ??
            item.idocumentsrno ??
            null,

          /*
           * Application
           */
          szApplicationNo:
            item.szapplicationno ||
            item.szApplicationNo ||
            appNo,

          szOrgId:
            item.szorgid ||
            item.szOrgId ||
            orgId ||
            "001",

          /*
           * Document
           */
          szDocCode:
            item.szdoccode ||
            item.szDocCode ||
            item.docCode ||
            item.docName ||
            null,

          szApplicantId:
            item.szapplicantid ||
            item.szApplicantId ||
            applicableFor ||
            null,

          szAssetSrNo:
            item.szassetsrno ??
            item.szAssetSrNo ??
            null,

          /*
           * Stage
           */
          szStageDue:
            item.szstagedue ||
            item.szStageDue ||
            stage ||
            null,

          /*
           * Waive allowed
           */
          szDocWaiveAllowYn:
            item.szdocwaiveallowyn ||
            item.szDocWaiveAllowYn ||
            "N",

          /*
           * Status
           */
          szReceivedYn:
            item.status === STATUS.RECEIVED
              ? "Y"
              : "N",

          szWaivedYn:
            item.status === STATUS.WAIVED
              ? "Y"
              : "N",

          szDifferYn:
            item.status === STATUS.DEFERRED
              ? "Y"
              : "N",

          /*
           * Waiver
           */
          szWaiverDec:
            item.waiveComments ||
            item.szwaiverdec ||
            item.szWaiverDec ||
            null,

          szWaiverReason:
            item.waiveReason ||
            item.szwaiverreason ||
            item.szWaiverReason ||
            null,

          /*
           * Mandatory / Original
           */
          szMandatoryYn:
            item.szmandatoryyn ||
            item.szMandatoryYn ||
            "N",

          szOriginalReqYn:
            item.szoriginalreqyn ||
            item.szOriginalReqYn ||
            "N",

          /*
           * Verification
           */
          szVerfDecision:
            item.szverfdecision ||
            item.szVerfDecision ||
            null,

          szVerifiedBy:
            item.szverifiedby ||
            item.szVerifiedBy ||
            null,

          /*
           * User specified
           */
          szUserSpecifiedYn:
            item.custom || item._isNew
              ? "Y"
              : item.szuserspecifiedyn ||
              item.szUserSpecifiedYn ||
              "N",

          /*
           * Existing DMS document ID
           */
          documentId:
            item.documentid ??
            item.documentId ??
            null,

          /*
           * Document family
           */
          szDocFamilyCode:
            item.szdocfamilycode ||
            item.szDocFamilyCode ||
            item.docFamilyCode ||
            null,

          szDocFamilyDesc:
            item.szdocfamilydesc ||
            item.szDocFamilyDesc ||
            item.docFamilyName ||
            null,

          /*
           * Fraud
           */
          cFraudYn:
            item.cfraudyn ||
            item.cFraudYn ||
            "N",

          /*
           * Remarks
           */
          szRemarks:
            item.remarks ||
            item.szremarks ||
            item.szRemarks ||
            null,

          /*
           * Due information
           */
          iDueDays:
            item.iduedays ??
            item.idueDays ??
            null,

          dtDueDate:
            item.dtduedate ||
            item.dtDueDate ||
            null,

          /*
           * Docket
           */
          szDocketLocation:
            item.szdocketlocation ||
            item.szDocketLocation ||
            null,

          /*
           * Pages
           */
          iNoOfPages:
            item.inoofpages ??
            item.inoOfPages ??
            null,

          /*
           * Level
           */
          cLevel:
            item.clevel ||
            item.cLevel ||
            "P",

          /*
           * Receipt
           */
          dtRecieptDate:
            item.dtrecieptdate ||
            item.dtRecieptDate ||
            null,

          dtDeferralDate:
            item.deferralDate ||
            item.dtdeferraldate ||
            item.dtDeferralDate ||
            null,

          /*
           * Audit
           */
          szCreatedBy:
            item.szcreatedby ||
            item.szCreatedBy ||
            null,

          szUpdatedBy:
            item.szupdatedby ||
            item.szUpdatedBy ||
            null,

          dtCreatedOn:
            item.dtcreatedon ||
            item.dtCreatedOn ||
            null,

          dtUpdatedOn:
            item.dtupdatedon ||
            item.dtUpdatedOn ||
            null,

          /*
           * ==================================================
           * IMPORTANT
           *
           * This tells backend which multipart file belongs
           * to this particular DTO.
           *
           * Example:
           * filePartName = file_1001
           *             ↓
           * multipart file_1001
           * ==================================================
           */
          filePartName: item.selectedFile
            ? `file_${item.itemId}`
            : null,
        }));

        console.log(
          "Document upload request:",
          requestPayload
        );

        /*
         * ==================================================
         * CREATE MULTIPART REQUEST
         * ==================================================
         */
        const formData = new FormData();

        formData.append(
          "request",
          new Blob(
            [JSON.stringify(requestPayload)],
            {
              type: "application/json",
            }
          )
        );

        currentItems.forEach((item) => {
          if (item.selectedFile) {
            formData.append(
              `file_${item.itemId}`,
              item.selectedFile,
              item.selectedFile.name
            );
          }
        });


        const saved = unwrapApiResponse(
          await HAxiosService.POST(
            LosDocumentAPI.LosDocumentAPI(
              "ECF-DocumentUpload"
            ) + "/documents/upload" +
            `?applicationNo=${encodeURIComponent(appNo)}` +
            `&orgId=${encodeURIComponent(orgId || "001")}`,
            formData
          )
        );

        console.log(
          "Documents uploaded successfully:",
          saved
        );

        /*
         * ==================================================
         * RELOAD FROM BACKEND
         * ==================================================
         */
        const refreshed = unwrapApiResponse(
          await HAxiosService.GET(
            LosDocumentAPI.LosDocumentAPI(
              "ECF-DocumentUpload"
            ) +
            "/documents" +
            `?szApplicantId=${encodeURIComponent(applicableFor)}` +
            `&szStageDue=${encodeURIComponent(stage)}`
          )
        );

        applyFamilies(
          refreshed || saved
        );

        /*
         * ==================================================
         * SUCCESS
         * ==================================================
         */
        toast.success(
          t(
            "label.docupload.msg.saved",
            "Documents saved successfully"
          )
        );

        return {
          success: true,
        };

      } catch (error) {
        console.error(
          "Failed to upload documents",
          error
        );

        toast.error(
          error?.message ||
          t(
            "label.docupload.msg.saveFailed",
            "Save failed"
          )
        );

        return {
          success: false,
        };
      }
    },
    [
      applicationNo,
      incomingApplicationNo,
      stage,
      applicableFor,
      families,
      savedItemIds,
      orgId,
      applyFamilies,
      t,
      toast,
    ]
  );
  /* ==========================================================
     RESET
     ========================================================== */

  const handleReset = useCallback(
    async () => {
      setFamilies((prev) =>
        prev.map((family) => ({
          ...family,

          items: (family.items || []).map((item) => ({
            ...item,

            // Remove uploaded file
            selectedFile: undefined,
            fileName: undefined,
            fileSize: undefined,
            fileType: undefined,
            fileUrl: undefined,
            hasFile: false,

            // Reset upload status
            status: STATUS.PENDING,
            szreceivedyn: "N",
            szwaivedyn: "N",
            szdifferyn: "N",
            dtrecieptdate: null,

          })),
        }))
      );

      // Clear any open preview
      setPreview(null);

      // Clear custom-document input
      setAddingFor("");
      setNewDocName("");

      toast.success(t(
        "label.docupload.msg.resetSuccess",
        "Documents re-generated successfully"
      ));

      return {
        success: true,
      };
    },
    [toast, t]
  );
  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <IntlProvider locale={intl.locale} messages={localeOverrides}>
      <HBox>
        <HBox sx={{ width: "100%", padding: "0.5rem 1rem 0 1rem", flexDirection: "column", borderBottom: "1px solid var(--drs-border-divider, hsl(215 14% 90%))", }}>
          <HBreadCrumb />

          <TitleBar
            title={t(
              "label.docupload.title",
              "Document Upload"
            )}
          />
          <HLabel
            value="Upload supporting documents required for the application."
            align="left"
            colon={false}

          />
        </HBox>


        {/* ======================================================
          MAIN PAPER
          ====================================================== */}

        <HBox sx={{ width: "100%", padding: "0.5rem 1rem 0 1rem" }}>

          <HPaper>
            <HBox
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                marginBottom: "12px",
                gap: "5px"
              }}
            >
              <HLabel
                value={t(
                  "label.docupload.field.applicationNo",
                  "Application No"
                )}
                translate={false}
                align="left"
                colon={false}
                sx={{ fontWeight: "bold" }}
              />

              <HDropdown
                name="applicationNo"
                options={applicationOptions}
                value={applicationNo}
                onChange={(e) => {
                  const nextApplicationNo = e.target.value;
                  setFamilies([]);
                  setApplicantOptions([]);
                  setApplicableFor("");
                  setApplicationNo(nextApplicationNo);
                }}
                width="51%"
              />
            </HBox>

            {/* ==================================================
              TOP FILTER BAR

              Lovable layout:

              Applicable for | Stage | Customer Type
              ================================================== */}

            <HBox
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                marginBottom: "8px",
                gap: "16px",
              }}
            >
              {/* APPLICABLE FOR */}
              <HBox
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  flex: "1",
                  minWidth: 0,
                }}
              >
                <HLabel
                  value="label.docupload.field.applicableFor"
                  required
                  align="left"
                  colon={false}
                  sx={{ fontWeight: "bold", mr: "8px" }}
                />

                <HDropdown
                  name="applicableFor"
                  options={applicantOptions}
                  value={applicableFor}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    setApplicableFor(e.target.value);
                    const selectedApplicant = applicantOptions.find(
                      (option) => option.value === selectedValue
                    );
                  }}
                  width="100%"
                  sx={{ flex: 1, minWidth: 0 }}
                />
              </HBox>


              {/* STAGE */}
              <HBox
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  flex: "1",
                  minWidth: 0,
                }}
              >
                <HLabel
                  value="label.docupload.field.stage"
                  required
                  align="left"
                  colon={false}
                  sx={{ fontWeight: "bold", mr: "8px" }}
                />

                <HDropdown
                  name="stage"
                  options={stageOptions}
                  value={stage}
                  onChange={(e) =>
                    setStage(e.target.value)
                  }
                  width="100%"
                  sx={{ flex: 1, minWidth: 0 }}
                />
              </HBox>


              {/* CUSTOMER TYPE */}
              <HBox
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  flex: "1", minWidth: 0,

                }}
              >
                <HLabel
                  value="label.docupload.field.customerType"
                  required
                  align="left"
                  colon={false}
                  sx={{ fontWeight: "bold", mr: "8px" }}
                />
                <HDropdown
                  name="customerType"
                  options={applicantCategoryOptions}
                  value={applicantCategory}
                  onChange={(e) =>
                    setApplicantCategory(e.target.value)
                  }
                  width="100%"
                  sx={{ flex: 1, minWidth: 0 }}
                />
              </HBox>
            </HBox>

            {/* ==================================================
              CHECKLIST HEADER
              ================================================== */}

            <HBox
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                marginBottom: "16px"
              }}
            >

              {/* Title on its own line */}

              <HLabel
                value="label.docupload.checklist.title"
                align="left"
                colon={false}
                sx={{ fontWeight: "bold", fontSize: "14px" }}
              />

              {/* Hint (left) + received count (right) on the same line */}

              <HBox
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >

                <HLabel
                  value="label.docupload.checklist.hint"
                  align="left"
                  colon={false}
                />

                <HLabel
                  value={t(
                    "label.docupload.checklist.receivedCount",
                    "{received}/{total} received",
                    {
                      received: receivedCount,
                      total: items.length,
                    }
                  )}
                  translate={false}
                  align="left"
                  colon={false}
                />

              </HBox>

            </HBox>


            {/* ==================================================
              DOCUMENT FAMILIES
              ================================================== */}

            {families.map((family) => (
              <HBox
                key={family.docFamilyCode}
                style={{
                  border: "1px solid #e0c5d3",
                  borderRadius: "6px",
                  marginBottom: "12px",
                  overflow: "hidden",
                  width: "100%",
                }}
              >

                {/* ==================================================
        FAMILY HEADER
        ================================================== */}

                <HBox
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "8px 12px",
                    boxSizing: "border-box",
                    backgroundColor: "transparent",
                    borderBottom: "1px solid #e0c5d3",
                  }}
                >

                  {/* Section title */}

                  <HLabel
                    value={family.docFamilyName}
                    translate={false}
                    align="left"
                    colon={false}
                    sx={{
                      fontWeight: "bold", fontSize: "14px"
                    }}
                  />

                  {/* Add Document */}

                  <HButton
                    label="label.docupload.button.addDocument"
                    variant="outlined"
                    startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                    onClick={() =>
                      setAddingFor(
                        addingFor === family.docFamilyCode
                          ? ""
                          : family.docFamilyCode
                      )
                    }
                    sx={{ ...documentButtonStyle }}
                  />

                </HBox>


                {/* ==================================================
        ADD DOCUMENT AREA
        ================================================== */}

                {addingFor === family.docFamilyCode ? (
                  <HBox
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 12px",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >

                    <HTextField
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      editable
                      placeholder="label.docupload.placeholder.docName"
                      width="100%"
                    />

                    <HButton
                      label="label.docupload.button.add"
                      variant="outlined"
                      inline
                      onClick={() => handleAddCustom(family)}
                      sx={{ mt: 1, ...documentButtonStyle }}
                    />

                    <HButton
                      label="label.docupload.button.cancel"
                      variant="outlined"
                      inline
                      onClick={() => { setAddingFor(""); setNewDocName(""); }}
                      sx={{ mt: 1, ...documentButtonStyle }}
                    />

                  </HBox>
                ) : null}


                {/* ==================================================
        DOCUMENT LIST
        ================================================== */}

                <HBox style={{ display: "flex", flexDirection: "column", width: "100%", }}>

                  {(family.items || []).length === 0 ? (
                    <HLabel
                      value="label.docupload.empty.section"
                      align="left"
                      colon={false}
                    />
                  ) : (
                    (family.items || []).map((item) => (
                      <HBox
                        key={item.itemId}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          width: "100%",
                          padding: "10px 12px",
                          boxSizing: "border-box",
                          borderBottom: "1px solid #eeeeee",
                        }}
                      >

                        {/* ========================================
                DOCUMENT NAME
                ======================================== */}

                        <HBox style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", width: "35%", minWidth: "35%", }}>

                          {/* Document icon */}

                          <DescriptionOutlinedIcon sx={{ fontSize: 20, marginTop: "2px", }} />

                          {/* Document information */}

                          <HBox style={{ display: "flex", flexDirection: "column", marginLeft: "8px", }}>

                            <HLabel
                              value={item.szDocCode || item.szdoccode}
                              translate={false}
                              align="left"
                              required={(item.szmandatoryyn || item.szMandatoryYn) === "Y"}
                              colon={false}
                              sx={{ fontWeight: "bold", fontSize: "12px" }}
                            />
                            <HBox style={{ display: "flex", flexDirection: "row", gap: "8px", }}>
                              <HLabel
                                value={t(item.custom ? "label.docupload.flag.custom" : "label.docupload.flag.system",
                                  item.custom ? "Custom" : "System generated")}
                                translate={false}
                                align="left"
                                colon={false}
                              />
                              {item.fileName ? (
                                <HLabel
                                  value={`${item.fileName} ${item.fileSize ? `(${formatFileSize(item.fileSize)})` : ""}`}
                                  translate={false}
                                  align="left"
                                  colon={false}
                                />
                              ) : null}
                            </HBox>
                          </HBox>

                        </HBox>


                        {/* ========================================FILE INPUT======================================== */}

                        <input
                          ref={(element) => { fileInputs.current[item.itemId] = element; }}
                          type="file"
                          hidden
                          onChange={(e) => { handleFilePicked(item, e.target.files?.[0]); e.target.value = ""; }}
                        />


                        {/* ================  UPLOAD========================*/}

                        <HBox style={{ display: "flex", flexDirection: "row", flex: "1 1 0", alignItems: "center", gap: "8px", width: "65%", minWidth: 0, }}>

                          <HButton
                            label={t(
                              item.fileName || item.hasFile
                                ? "label.docupload.button.replace"
                                : "label.docupload.button.upload",
                              item.fileName || item.hasFile ? "Replace" : "Upload"
                            )}
                            translate={false}
                            variant="outlined"
                            startIcon={<FileUploadOutlinedIcon sx={{ fontSize: 16 }} />}
                            onClick={() => fileInputs.current[item.itemId]?.click()}
                            sx={{ ...documentButtonStyle, width: "280px" }}
                          />

                          {/* ====================================RECEIVED==================================== */}

                          <HButton
                            label={t("label.docupload.button.received", "Received")}
                            translate={false}
                            variant="outlined"
                            inline
                            onClick={() => handleStatusClick(item, STATUS.RECEIVED)}
                            sx={getStatusButtonSx(STATUS.RECEIVED, item.status === STATUS.RECEIVED)}
                          />

                          {/* ====================================DEFERRED==================================== */}

                          <HButton
                            label={t(
                              "label.docupload.button.deferred",
                              "Deferred"
                            )}
                            translate={false}
                            variant="outlined"
                            inline
                            onClick={() => handleStatusClick(item, STATUS.DEFERRED)}
                            sx={getStatusButtonSx(STATUS.DEFERRED, item.status === STATUS.DEFERRED)}
                          />

                          {/* ====================================WAIVED==================================== */}

                          <HButton
                            label={t(
                              "label.docupload.button.waived",
                              "Waived"
                            )}
                            translate={false}
                            variant="outlined"
                            inline
                            onClick={() => handleStatusClick(item, STATUS.WAIVED)}
                            sx={getStatusButtonSx(STATUS.WAIVED, item.status === STATUS.WAIVED)}
                          />


                          {/* ====================================STATUS==================================== */}

                          {(() => {
                            const status = getDocumentStatus(item);
                            const pillStyle = getStatusPillStyle(status);

                            return (
                              <span
                                style={{
                                  marginLeft: "auto",
                                  flexShrink: 0,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: "2px 12px",
                                  borderRadius: "999px",
                                  fontSize: "10px",
                                  fontWeight: 600,
                                  lineHeight: 1.4,
                                  whiteSpace: "nowrap",
                                  ...pillStyle,
                                }}
                              >
                                {getDocumentStatusLabel(status)}
                              </span>
                            );
                          })()}


                          {/* ====================================PREVIEW==================================== */}

                          {item.hasFile ||
                            item.fileUrl ? (
                            <IconButton
                              onClick={() => handlePreview(item)}
                              size="small"
                              sx={{
                                padding: "4px",
                                color: "#1976d2",
                              }}
                            >
                              <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                          ) : null}

                          {/* ====================================
                  REMOVE FILE OR DELETE FILE (keep row, remove file)
                  ==================================== */}

                          {item.fileName || item.hasFile ? (
                            <IconButton
                              onClick={() =>
                                item.selectedFile
                                  ? handleRemoveFile(item)
                                  : handleDeleteFile(item)
                              }
                              size="small"
                              aria-label={t(
                                "label.docupload.accessibility.removeFile",
                                "Remove file"
                              )}
                              sx={{
                                padding: "2px",
                                color: "#d32f2f",
                                "&:hover": {
                                  backgroundColor: "transparent",
                                  color: "#b71c1c",
                                },
                              }}
                            >
                              <CloseIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          ) : null}


                          {/* ====================================DELETE CUSTOM DOCUMENT==================================== */}

                          {item.custom ? (
                            <IconButton
                              onClick={() => handleDeleteCustom(item)}
                              size="small"
                              aria-label={t(
                                "label.docupload.accessibility.deleteCustomDocument",
                                "Delete custom document"
                              )}
                              sx={{ padding: "2px", color: "error.main", }}
                            >
                              <DeleteOutline sx={{ fontSize: 18 }} />
                            </IconButton>
                          ) : null}

                        </HBox>

                      </HBox>
                    ))
                  )}

                </HBox>

              </HBox>
            ))}

          </HPaper>

        </HBox>


        {/* ======================================================BOTTOM BUTTON BAR====================================================== */}

        <HButtonBar
          onSave={
            handleSave
          }
          onReset={
            handleReset
          }
          onClose={() =>
            navigate(
              "/homelayout/welcomepage"
            )
          }
          disableToast={{
            save: true,
            reset: true,
            close: true,
          }}
        />


        {/* ======================================================PREVIEW DIALOG====================================================== */}

        <HDialog
          open={Boolean(
            preview
          )}
          onClose={() => {
            if (preview?.fileUrl) {
              URL.revokeObjectURL(preview.fileUrl);
            }
            setPreview(null);
          }}
          title={
            preview?.docName ||
            t(
              "label.docupload.dialog.previewTitle",
              "Document preview"
            )
          }
          maxWidth="md"
          fullWidth
          actions={
            <HButton
              label={t(
                "label.docupload.button.cancel",
                "Cancel"
              )}
              translate={false}
              variant="outlined"
              inline
              onClick={() => setPreview(null)}
            />
          }
        >

          {preview?.fileUrl &&
            (
              preview.fileType || ""
            ).startsWith(
              "image/"
            ) ? (
            <img
              src={preview.fileUrl}
              alt={preview.docName}
              width="100%"
            />
          ) : preview?.fileUrl &&
            (
              preview.fileType || ""
            ).includes("pdf") ? (
            <iframe
              title={preview.docName}
              src={preview.fileUrl}
              width="100%"
              height="480"
            />
          ) : (
            <HLabel
              value={t(
                "label.docupload.msg.noPreview",
                "No preview available"
              )}
              translate={false}
              align="left"
              colon={false}
            />
          )}

        </HDialog>


        {/* ======================================================WAIVE DOCUMENT DIALOG====================================================== */}

        <HDialog
          open={Boolean(waiveDialog)}
          onClose={() => setWaiveDialog(null)}
          title={t(
            "label.docupload.dialog.waive",
            "Waive document"
          )}
          maxWidth="sm"
          fullWidth
          actions={
            <HBox>

              <HButton
                label={t(
                  "label.docupload.button.cancel",
                  "Cancel"
                )}
                translate={false}
                variant="outlined"
                inline
                onClick={() => setWaiveDialog(null)}
                sx={{ mr: 1 }}
              />

              <HButton
                label={t(
                  "label.docupload.button.confirmWaive",
                  "Confirm Waive"
                )}
                translate={false}
                variant="contained"
                inline
                onClick={() => {
                  if (!waiveDialog?.reason || !waiveDialog?.comments) {
                    toast.error(t(
                      "label.docupload.msg.waiveValidation",
                      "Please provide a reason and comments for waiving this document"
                    ));
                    return;
                  }

                  updateItem(
                    waiveDialog.itemId,
                    {
                      status: STATUS.WAIVED,

                      waiveReason: waiveDialog.reason,

                      waiveComments: waiveDialog.comments,

                      szreceivedyn: "N",

                      szwaivedyn: "Y",

                      szdifferyn: "N",

                      szwaiverreason: waiveDialog.reason,
                    }
                  );

                  setWaiveDialog(
                    null
                  );
                }}
              />

            </HBox>
          }
        >

          <HLabel
            value={t(
              "label.docupload.dialog.waiveHint",
              "Select a reason for waiving this document."
            )}
            translate={false}
            align="left"
            colon={false}
          />

          <HLabel
            value={t(
              "label.docupload.field.reason",
              "Reason"
            )}
            translate={false}
            required
            align="left"
            colon={false}
          />

          <HDropdown
            name="waiveReason"
            options={waiveReasonOptions}
            value={waiveDialog?.reason || ""}
            onChange={(e) =>
              setWaiveDialog(
                (prev) => ({ ...prev, reason: e.target.value, })
              )
            }
            width="100%"
          />

          <HLabel
            value={t(
              "label.docupload.field.comments",
              "Comments"
            )}
            translate={false}
            align="left"
            colon={false}
          />

          <HTextarea
            value={waiveDialog?.comments || ""}
            onChange={(e) =>
              setWaiveDialog(
                (prev) => ({ ...prev, comments: e.target.value, })
              )
            }
            maxLength={500}
            maxLines={3}
            width="100%"
            placeholder={t(
              "label.docupload.placeholder.comments",
              "Enter comments"
            )}
            required={true}
          />
        </HDialog>


        {/* ======================================================DEFER DOCUMENT DIALOG====================================================== */}

        <HDialog
          open={Boolean(deferDialog)}
          onClose={() => setDeferDialog(null)}
          title={t(
            "label.docupload.dialog.deferTitle",
            "Defer document"
          )}
          maxWidth="sm"
          fullWidth
          actions={
            <HBox>

              <HButton
                label={t(
                  "label.docupload.button.cancel",
                  "Cancel"
                )}
                translate={false}
                variant="outlined"
                inline
                onClick={() => setDeferDialog(null)}
                sx={{ mr: 1 }}
              />

              <HButton
                label={t(
                  "label.docupload.button.confirmDefer",
                  "Confirm Defer"
                )}
                translate={false}
                variant="contained"
                inline
                onClick={() => {
                  if (!deferDialog?.stage || !deferDialog?.date) {
                    toast.error(t(
                      "label.docupload.msg.deferValidation",
                      "Please specify the deferred stage and date"
                    ));
                    return;
                  }

                  updateItem(
                    deferDialog.itemId,
                    {
                      status: STATUS.DEFERRED,

                      szstagedue: deferDialog.stage,
                      deferralStage: deferDialog.stage,

                      deferralDate: deferDialog.date,

                      szreceivedyn: "N",

                      szwaivedyn: "N",

                      szdifferyn: "Y",
                    }
                  );

                  setDeferDialog(null);
                }}
              />

            </HBox>
          }
        >

          <HLabel
            value={t(
              "label.docupload.dialog.deferHint",
              "Select the stage and date until which this document is deferred."
            )}
            translate={false}
            align="left"
            colon={false}
          />

          <HLabel
            value={t(
              "label.docupload.field.deferralStage",
              "Deferral Stage"
            )}
            translate={false}
            required
            align="left"
            colon={false}
          />

          <HDropdown
            name="deferralStage"
            options={stageOptions}
            value={deferDialog?.stage || ""}
            onChange={(e) =>
              setDeferDialog((prev) => ({ ...prev, stage: e.target.value, })
              )
            }
            width="100%"
          />

          <HLabel
            value={t(
              "label.docupload.field.deferralDate",
              "Deferral Date"
            )}
            translate={false}
            required
            align="left"
            colon={false}
          />

          <HDatePicker
            value={deferDialog?.date ? dayjs(deferDialog.date) : null}
            onChange={(value) =>
              setDeferDialog(
                (prev) => ({ ...prev, date: value ? value.format("YYYY-MM-DD") : "", })
              )
            }
            width="100%"
          />

        </HDialog>

      </HBox>
    </IntlProvider>
  );
};

export default ApplicationDocumentUpload;