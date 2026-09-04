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

/* ============================================================
   CONFIGURATION
   ============================================================ */

/*
 * true  -> use hardcoded data
 * false -> use actual backend APIs
 */
const USE_MOCK_DATA = true;

const ALL_BORROWERS = "ALL_BORROWERS";

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

const MOCK_CUSTOMER_TYPE_OPTIONS = [
  {
    label: "Salaried",
    value: "SALARIED",
  },
  {
    label: "Self Employed",
    value: "SELF_EMPLOYED",
  },
  {
    label: "Business",
    value: "BUSINESS",
  },
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

/* ============================================================
   MOCK LS_TRN_DOCUMENTS DATA
   ============================================================ */

const MOCK_DOCUMENT_DATA = {
  applicationNo: "APP20260904001",
  applicableFor: ALL_BORROWERS,

  stage: "PRE_SUBMISSION",

  customerType: "SALARIED",

  families: [
    {
      docFamilyCode: "INCOME",
      docFamilyName: "INCOME & FINANCIAL PROOF (SALARIED) DOCUMENTS",

      items: [
        {
          itemId: "1001",

          idocumentsrno: 1001,
          szapplicationno: "APP20260904001",
          szorgid: "LOS",
          szdoccode: "EMP_LETTER",

          szapplicantid: "PRIMARY",
          szassetsrno: null,

          szstagedue: "PRE_SUBMISSION",

          szdocwaiveallowyn: "Y",
          szreceivedyn: "N",
          szwaivedyn: "N",

          szwaiverdec: null,
          szwaiverreason: null,

          szdifferyn: "N",
          szmandatoryyn: "Y",
          szoriginalreqyn: "Y",

          szverfdecision: null,
          szverifiedby: null,

          szuserspecifiedyn: "N",

          documentid: null,

          szdocfamilycode: "INCOME",
          szdocfamilydesc:
            "Income and Financial Proof Documents",

          cfraudyn: "N",

          szremarks: null,

          iduedays: 7,
          dtduedate: null,

          szdocketlocation: null,

          inoofpages: null,

          clevel: "P",

          dtrecieptdate: null,

          szcreatedby: "SYSTEM",
          dtcreatedon: new Date(),

          szupdatedby: "SYSTEM",
          dtupdatedon: new Date(),

          docCode: "EMP_LETTER",

          docName:
            "Letter from employer confirming your designation, salary breakdown, and service period",

          required: true,

          custom: false,

          status: STATUS.PENDING,

          hasFile: false,
        },

        {
          itemId: "1002",

          idocumentsrno: 1002,
          szapplicationno: "APP20260904001",
          szorgid: "LOS",
          szdoccode: "SALARY_SLIP",

          szapplicantid: "PRIMARY",
          szassetsrno: null,

          szstagedue: "PRE_SUBMISSION",

          szdocwaiveallowyn: "Y",
          szreceivedyn: "N",
          szwaivedyn: "N",

          szwaiverdec: null,
          szwaiverreason: null,

          szdifferyn: "N",
          szmandatoryyn: "Y",
          szoriginalreqyn: "Y",

          szverfdecision: null,
          szverifiedby: null,

          szuserspecifiedyn: "N",

          documentid: null,

          szdocfamilycode: "INCOME",
          szdocfamilydesc:
            "Income and Financial Proof Documents",

          cfraudyn: "N",

          szremarks: null,

          iduedays: 7,
          dtduedate: null,

          szdocketlocation: null,

          inoofpages: null,

          clevel: "P",

          dtrecieptdate: null,

          szcreatedby: "SYSTEM",
          dtcreatedon: new Date(),

          szupdatedby: "SYSTEM",
          dtupdatedon: new Date(),

          docCode: "SALARY_SLIP",

          docName: "Salary slips for the last 3 to 6 months",

          required: true,

          custom: false,

          status: STATUS.PENDING,

          hasFile: false,
        },

        {
          itemId: "1003",

          idocumentsrno: 1003,
          szapplicationno: "APP20260904001",
          szorgid: "LOS",
          szdoccode: "BANK_STATEMENT",

          szapplicantid: "PRIMARY",
          szassetsrno: null,

          szstagedue: "PRE_SUBMISSION",

          szdocwaiveallowyn: "Y",
          szreceivedyn: "N",
          szwaivedyn: "N",

          szwaiverdec: null,
          szwaiverreason: null,

          szdifferyn: "N",
          szmandatoryyn: "Y",
          szoriginalreqyn: "Y",

          szverfdecision: null,
          szverifiedby: null,

          szuserspecifiedyn: "N",

          documentid: null,

          szdocfamilycode: "INCOME",
          szdocfamilydesc:
            "Income and Financial Proof Documents",

          cfraudyn: "N",

          szremarks: null,

          iduedays: 7,
          dtduedate: null,

          szdocketlocation: null,

          inoofpages: null,

          clevel: "P",

          dtrecieptdate: null,

          szcreatedby: "SYSTEM",
          dtcreatedon: new Date(),

          szupdatedby: "SYSTEM",
          dtupdatedon: new Date(),

          docCode: "BANK_STATEMENT",

          docName:
            "Bank statements for the last 6 months showing your monthly salary credits",

          required: true,

          custom: false,

          status: STATUS.PENDING,

          hasFile: false,
        },
      ],
    },

    {
      docFamilyCode: "KYC",
      docFamilyName: "PERSONAL IDENTIFICATION & KYC DOCUMENTS",

      items: [
        {
          itemId: "2001",

          idocumentsrno: 2001,
          szapplicationno: "APP20260904001",
          szorgid: "LOS",
          szdoccode: "KYC_ID",

          szapplicantid: "PRIMARY",
          szassetsrno: null,

          szstagedue: "PRE_SUBMISSION",

          szdocwaiveallowyn: "N",
          szreceivedyn: "N",
          szwaivedyn: "N",

          szwaiverdec: null,
          szwaiverreason: null,

          szdifferyn: "N",
          szmandatoryyn: "Y",
          szoriginalreqyn: "Y",

          szverfdecision: null,
          szverifiedby: null,

          szuserspecifiedyn: "N",

          documentid: null,

          szdocfamilycode: "KYC",
          szdocfamilydesc:
            "Personal Identification and KYC Documents",

          cfraudyn: "N",

          szremarks: null,

          iduedays: 7,
          dtduedate: null,

          szdocketlocation: null,

          inoofpages: null,

          clevel: "P",

          dtrecieptdate: null,

          szcreatedby: "SYSTEM",
          dtcreatedon: new Date(),

          szupdatedby: "SYSTEM",
          dtupdatedon: new Date(),

          docCode: "KYC_ID",

          docName:
            "Aadhaar, Valid Passport, Driving License or Voter's Id",

          required: true,

          custom: false,

          status: STATUS.PENDING,

          hasFile: false,
        },

        {
          itemId: "2002",

          idocumentsrno: 2002,
          szapplicationno: "APP20260904001",
          szorgid: "LOS",
          szdoccode: "LOAN_APPLICATION",

          szapplicantid: "PRIMARY",
          szassetsrno: null,

          szstagedue: "PRE_SUBMISSION",

          szdocwaiveallowyn: "N",
          szreceivedyn: "N",
          szwaivedyn: "N",

          szwaiverdec: null,
          szwaiverreason: null,

          szdifferyn: "N",
          szmandatoryyn: "Y",
          szoriginalreqyn: "Y",

          szverfdecision: null,
          szverifiedby: null,

          szuserspecifiedyn: "N",

          documentid: null,

          szdocfamilycode: "KYC",
          szdocfamilydesc:
            "Personal Identification and KYC Documents",

          cfraudyn: "N",

          szremarks: null,

          iduedays: 7,
          dtduedate: null,

          szdocketlocation: null,

          inoofpages: null,

          clevel: "A",

          dtrecieptdate: null,

          szcreatedby: "SYSTEM",
          dtcreatedon: new Date(),

          szupdatedby: "SYSTEM",
          dtupdatedon: new Date(),

          docCode: "LOAN_APPLICATION",

          docName:
            "Completed loan application form provided by the bank",

          required: true,

          custom: false,

          status: STATUS.PENDING,

          hasFile: false,
        },

        {
          itemId: "2003",

          idocumentsrno: 2003,
          szapplicationno: "APP20260904001",
          szorgid: "LOS",
          szdoccode: "PHOTOGRAPH",

          szapplicantid: "PRIMARY",
          szassetsrno: null,

          szstagedue: "PRE_SUBMISSION",

          szdocwaiveallowyn: "N",
          szreceivedyn: "N",
          szwaivedyn: "N",

          szwaiverdec: null,
          szwaiverreason: null,

          szdifferyn: "N",
          szmandatoryyn: "Y",
          szoriginalreqyn: "Y",

          szverfdecision: null,
          szverifiedby: null,

          szuserspecifiedyn: "N",

          documentid: null,

          szdocfamilycode: "KYC",
          szdocfamilydesc:
            "Personal Identification and KYC Documents",

          cfraudyn: "N",

          szremarks: null,

          iduedays: 7,
          dtduedate: null,

          szdocketlocation: null,

          inoofpages: null,

          clevel: "P",

          dtrecieptdate: null,

          szcreatedby: "SYSTEM",
          dtcreatedon: new Date(),

          szupdatedby: "SYSTEM",
          dtupdatedon: new Date(),

          docCode: "PHOTOGRAPH",

          docName: "Recent passport-size photographs",

          required: true,

          custom: false,

          status: STATUS.PENDING,

          hasFile: false,
        },
      ],
    },

    {
      docFamilyCode: "ADDRESS",
      docFamilyName: "ADDRESS PROOF DOCUMENTS",

      items: [
        {
          itemId: "3001",

          idocumentsrno: 3001,
          szapplicationno: "APP20260904001",
          szorgid: "LOS",
          szdoccode: "ADDRESS_PROOF",

          szapplicantid: "PRIMARY",
          szassetsrno: null,

          szstagedue: "PRE_SUBMISSION",

          szdocwaiveallowyn: "Y",
          szreceivedyn: "N",
          szwaivedyn: "N",

          szwaiverdec: null,
          szwaiverreason: null,

          szdifferyn: "N",
          szmandatoryyn: "Y",
          szoriginalreqyn: "Y",

          szverfdecision: null,
          szverifiedby: null,

          szuserspecifiedyn: "N",

          documentid: null,

          szdocfamilycode: "ADDRESS",
          szdocfamilydesc:
            "Address Proof Documents",

          cfraudyn: "N",

          szremarks: null,

          iduedays: 7,
          dtduedate: null,

          szdocketlocation: null,

          inoofpages: null,

          clevel: "P",

          dtrecieptdate: null,

          szcreatedby: "SYSTEM",
          dtcreatedon: new Date(),

          szupdatedby: "SYSTEM",
          dtupdatedon: new Date(),

          docCode: "ADDRESS_PROOF",

          docName:
            "Address proof - Aadhaar, Passport, Utility Bill or Bank Statement",

          required: true,

          custom: false,

          status: STATUS.PENDING,

          hasFile: false,
        },
      ],
    },
  ],
};

/* ============================================================
   HELPERS
   ============================================================ */

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

/* ============================================================
   COMPONENT
   ============================================================ */

const ApplicationDocumentUpload = () => {
  const intl = useIntl();
  const toast = useToast();

  const navigate = useNavigate();
  const location = useLocation();

  const screenMenuId = location.state?.menuId;

  const incomingApplicationNo =
    location.state?.applicationNo;

  const borrowerType =
    location.state?.borrowerType || "Individual";

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

  /* ==========================================================
     APPLICANT OPTIONS
     ========================================================== */

  const applicantOptions = useMemo(() => {
    const fromState = location.state?.applicants;

    if (
      Array.isArray(fromState) &&
      fromState.length > 0
    ) {
      return fromState.map((name) => ({
        label: name,
        value: name,
      }));
    }

    return [
      {
        label: "Primary Applicant",
        value: "PRIMARY",
      },
      {
        label: "Co-Applicant",
        value: "CO_APPLICANT",
      },
      {
        label: "All Borrowers",
        value: ALL_BORROWERS,
      },
    ];
  }, [location.state?.applicants]);

  /* ==========================================================
     STATE
     ========================================================== */

  const [applicationNo, setApplicationNo] =
    useState(
      incomingApplicationNo ||
        MOCK_DOCUMENT_DATA.applicationNo
    );

  const [stageOptions, setStageOptions] =
    useState(
      USE_MOCK_DATA
        ? MOCK_STAGE_OPTIONS
        : []
    );

  const [
    customerTypeOptions,
    setCustomerTypeOptions,
  ] = useState(
    USE_MOCK_DATA
      ? MOCK_CUSTOMER_TYPE_OPTIONS
      : []
  );

  const [
    waiveReasonOptions,
    setWaiveReasonOptions,
  ] = useState(
    USE_MOCK_DATA
      ? MOCK_WAIVE_REASON_OPTIONS
      : []
  );

  const [applicableFor, setApplicableFor] =
    useState(
      location.state?.applicableFor ||
        MOCK_DOCUMENT_DATA.applicableFor ||
        applicantOptions[0]?.value ||
        ALL_BORROWERS
    );

  const [stage, setStage] = useState(
    USE_MOCK_DATA
      ? MOCK_DOCUMENT_DATA.stage
      : ""
  );

  const [customerType, setCustomerType] =
    useState(
      USE_MOCK_DATA
        ? MOCK_DOCUMENT_DATA.customerType
        : ""
    );

  const [families, setFamilies] =
    useState([]);

  const [expanded, setExpanded] =
    useState({});

  const [addingFor, setAddingFor] =
    useState("");

  const [newDocName, setNewDocName] =
    useState("");

  const [pendingFiles, setPendingFiles] =
    useState({});

  const [savedItemIds, setSavedItemIds] =
    useState(() => new Set());

  const [preview, setPreview] =
    useState(null);

  const [waiveDialog, setWaiveDialog] =
    useState(null);

  const [deferDialog, setDeferDialog] =
    useState(null);

  const fileInputs = useRef({});

  /* ==========================================================
     DERIVED DATA
     ========================================================== */

  const items = useMemo(
    () => flattenItems(families),
    [families]
  );

  const receivedCount = items.filter(
    (item) =>
      item.status === STATUS.RECEIVED
  ).length;

  /* ==========================================================
     APPLY DATA
     ========================================================== */

  const applyFamilies = useCallback(
    (payload) => {
      const nextFamilies =
        payload?.families || [];

      setFamilies(nextFamilies);

      setSavedItemIds(
        new Set(
          flattenItems(nextFamilies).map(
            (item) => item.itemId
          )
        )
      );

      setExpanded((prev) => {
        const next = {
          ...prev,
        };

        nextFamilies.forEach(
          (family) => {
            if (
              next[
                family.docFamilyCode
              ] === undefined
            ) {
              next[
                family.docFamilyCode
              ] = true;
            }
          }
        );

        return next;
      });

      if (payload?.applicationNo) {
        setApplicationNo(
          payload.applicationNo
        );
      }

      if (payload?.applicableFor) {
        setApplicableFor(
          payload.applicableFor
        );
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

        setCustomerTypeOptions(
          MOCK_CUSTOMER_TYPE_OPTIONS
        );

        setWaiveReasonOptions(
          MOCK_WAIVE_REASON_OPTIONS
        );

        setStage(
          (current) =>
            current ||
            MOCK_DOCUMENT_DATA.stage
        );

        setCustomerType(
          (current) =>
            current ||
            MOCK_DOCUMENT_DATA.customerType
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

        setCustomerTypeOptions(
          typeOpts
        );

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

        setCustomerType(
          (current) =>
            current ||
            typeOpts[0]?.value ||
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

  const loadChecklist =
    useCallback(async () => {
      if (
        !stage ||
        !customerType
      ) {
        return;
      }

      /* ------------------------------------------
         MOCK DATA
         ------------------------------------------ */

      if (USE_MOCK_DATA) {
        const mockPayload = {
          ...MOCK_DOCUMENT_DATA,

          applicationNo:
            applicationNo ||
            MOCK_DOCUMENT_DATA.applicationNo,

          applicableFor,
          stage,
          customerType,

          /*
           * Deep clone so that changing the UI
           * does not directly mutate mock data.
           */
          families:
            JSON.parse(
              JSON.stringify(
                MOCK_DOCUMENT_DATA.families
              )
            ),
        };

        applyFamilies(
          mockPayload
        );

        setPendingFiles({});
        setAddingFor("");
        setNewDocName("");

        return;
      }

      /* ------------------------------------------
         ACTUAL API
         ------------------------------------------ */

      try {
        const payload =
          incomingApplicationNo
            ? unwrapApiResponse(
                await HAxiosService.GET(
                  LosDocumentAPI.getByAppNo(
                    incomingApplicationNo,
                    stage,
                    customerType,
                    applicableFor
                  )
                )
              )
            : unwrapApiResponse(
                await HAxiosService.GET(
                  LosDocumentAPI.checklist(
                    stage,
                    customerType
                  )
                )
              );

        applyFamilies(payload);

        setPendingFiles({});
        setAddingFor("");
        setNewDocName("");
      } catch (error) {
        toast.error(
          error?.message ||
            t(
              "label.docupload.msg.loadFailed",
              "Unable to load document checklist"
            )
        );
      }
    }, [
      applicableFor,
      applicationNo,
      applyFamilies,
      customerType,
      incomingApplicationNo,
      stage,
      t,
      toast,
    ]);

  /* ==========================================================
     INITIAL LOAD
     ========================================================== */

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
    /* Clicking selected status again
       returns document to Pending */
    if (
      item.status === status
    ) {
      updateItem(
        item.itemId,
        {
          status:
            STATUS.PENDING,

          szreceivedyn:
            "N",

          szwaivedyn:
            "N",

          szdifferyn:
            "N",
        }
      );

      return;
    }

    /* Waived */
    if (
      status === STATUS.WAIVED
    ) {
      setWaiveDialog({
        itemId:
          item.itemId,

        reason:
          item.waiveReason ||
          "",

        comments:
          item.waiveComments ||
          "",
      });

      return;
    }

    /* Deferred */
    if (
      status === STATUS.DEFERRED
    ) {
      setDeferDialog({
        itemId:
          item.itemId,

        stage:
          item.deferralStage ||
          stage,

        date:
          item.deferralDate ||
          "",
      });

      return;
    }

    /* Received */
    updateItem(
      item.itemId,
      {
        status,

        szreceivedyn:
          status ===
          STATUS.RECEIVED
            ? "Y"
            : "N",

        szwaivedyn: "N",
        szdifferyn: "N",
      }
    );
  };

  /* ==========================================================
     ADD CUSTOM DOCUMENT
     ========================================================== */

  const handleAddCustom = (
    family
  ) => {
    if (
      !newDocName.trim()
    ) {
      return;
    }

    const item = {
      itemId:
        newCustomId(),

      idocumentsrno: null,

      szapplicationno:
        applicationNo,

      szorgid:
        "LOS",

      szdoccode: "",

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

      docCode:
        "",

      docName:
        newDocName.trim(),

      required:
        false,

      custom:
        true,

      status:
        STATUS.PENDING,

      hasFile:
        false,
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
        !USE_MOCK_DATA &&
        applicationNo &&
        savedItemIds.has(
          item.itemId
        )
      ) {
        try {
          unwrapApiResponse(
            await HAxiosService.DELETE(
              LosDocumentAPI.deleteItem(
                applicationNo,
                item.itemId
              )
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

      setPendingFiles(
        (prev) => {
          const next = {
            ...prev,
          };

          delete next[
            item.itemId
          ];

          return next;
        }
      );
    };

  /* ==========================================================
     FILE PICKED
     ========================================================== */

  const handleFilePicked =
    (item, file) => {
      if (!file) {
        return;
      }

      const fileUrl =
        URL.createObjectURL(
          file
        );

      setPendingFiles(
        (prev) => ({
          ...prev,

          [item.itemId]:
            file,
        })
      );

      updateItem(
        item.itemId,
        {
          fileName:
            file.name,

          fileSize:
            file.size,

          fileType:
            file.type,

          fileUrl,

          hasFile:
            true,

          /*
           * As soon as a file is uploaded,
           * Pending becomes Received.
           */
          status:
            item.status ===
            STATUS.PENDING
              ? STATUS.RECEIVED
              : item.status,

          szreceivedyn:
            item.status ===
              STATUS.PENDING
              ? "Y"
              : item.szdreceivedyn,

          dtrecieptdate:
            new Date(),
        }
      );
    };

  /* ==========================================================
     REMOVE FILE
     ========================================================== */

  const handleRemoveFile =
    (item) => {
      setPendingFiles(
        (prev) => {
          const next = {
            ...prev,
          };

          delete next[
            item.itemId
          ];

          return next;
        }
      );

      updateItem(
        item.itemId,
        {
          fileName:
            undefined,

          fileSize:
            undefined,

          fileType:
            undefined,

          fileUrl:
            undefined,

          hasFile:
            false,

          status:
            item.status ===
            STATUS.RECEIVED
              ? STATUS.PENDING
              : item.status,

          szreceivedyn:
            "N",

          dtrecieptdate:
            null,
        }
      );
    };

  /* ==========================================================
     PREVIEW
     ========================================================== */

  const handlePreview =
    async (item) => {
      /*
       * Local uploaded file
       */
      if (
        item.fileUrl
      ) {
        setPreview(item);
        return;
      }

      /*
       * Mock data
       */
      if (USE_MOCK_DATA) {
        toast.info(
          "Preview is available after uploading a file."
        );

        return;
      }

      /*
       * Backend file
       */
      if (
        !applicationNo ||
        !item.hasFile
      ) {
        return;
      }

      try {
        const data =
          unwrapApiResponse(
            await HAxiosService.GET(
              LosDocumentAPI.file(
                applicationNo,
                item.itemId
              )
            )
          );

        const binary =
          atob(
            data.contentBase64 ||
              ""
          );

        const bytes =
          new Uint8Array(
            binary.length
          );

        for (
          let i = 0;
          i < binary.length;
          i += 1
        ) {
          bytes[i] =
            binary.charCodeAt(
              i
            );
        }

        const blob =
          new Blob(
            [bytes],
            {
              type:
                data.fileType ||
                item.fileType ||
                "application/octet-stream",
            }
          );

        setPreview({
          ...item,

          fileName:
            data.fileName ||
            item.fileName,

          fileType:
            data.fileType ||
            item.fileType,

          fileUrl:
            URL.createObjectURL(
              blob
            ),
        });
      } catch (error) {
        toast.error(
          error?.message ||
            t(
              "label.docupload.preview.unavailable",
              "No preview available"
            )
        );
      }
    };

  /* ==========================================================
     UPLOAD FILES TO BACKEND
     ========================================================== */

  const persistFiles =
    async (appNo) => {
      /*
       * Mock mode:
       * files are already stored in local state.
       */
      if (USE_MOCK_DATA) {
        return;
      }

      const entries =
        Object.entries(
          pendingFiles
        );

      for (
        const [
          itemId,
          file,
        ] of entries
      ) {
        const form =
          new FormData();

        form.append(
          "file",
          file
        );

        await HAxiosService.POST(
          LosDocumentAPI.upload(
            appNo,
            itemId
          ),
          form,
          {},
          false,
          {
            Accept:
              "application/json",
          }
        );
      }
    };

  /* ==========================================================
     SAVE
     ========================================================== */

  const handleSave =
    useCallback(
      async () => {
        try {
          const appNo =
            applicationNo ||
            incomingApplicationNo ||
            `APP-${Date.now()}`;

          if (!applicationNo) {
            setApplicationNo(
              appNo
            );
          }

          const payload = {
            applicationNo:
              appNo,

            stage,

            customerType,

            applicableFor,

            families,

            items:
              flattenItems(
                families
              ).map(
                (item) => ({
                  /*
                   * UI fields
                   */
                  itemId:
                    item.itemId,

                  docFamilyCode:
                    item.docFamilyCode,

                  docFamilyName:
                    item.docFamilyName,

                  docCode:
                    item.docCode,

                  docName:
                    item.docName,

                  required:
                    item.required,

                  custom:
                    item.custom,

                  status:
                    item.status,

                  fileName:
                    item.fileName,

                  fileSize:
                    item.fileSize,

                  fileType:
                    item.fileType,

                  hasFile:
                    Boolean(
                      item.hasFile
                    ),

                  waiveReason:
                    item.waiveReason,

                  waiveComments:
                    item.waiveComments,

                  deferralStage:
                    item.deferralStage,

                  deferralDate:
                    item.deferralDate,

                  remarks:
                    item.remarks,

                  /*
                   * LS_TRN_DOCUMENTS fields
                   */
                  idocumentsrno:
                    item.idocumentsrno,

                  szapplicationno:
                    appNo,

                  szorgid:
                    item.szorgid ||
                    "LOS",

                  szapplicantid:
                    item.szapplicantid,

                  szassetsrno:
                    item.szassetsrno,

                  szstagedue:
                    item.szstagedue ||
                    stage,

                  szdocwaiveallowyn:
                    item.szdocwaiveallowyn,

                  szreceivedyn:
                    item.status ===
                    STATUS.RECEIVED
                      ? "Y"
                      : "N",

                  szwaivedyn:
                    item.status ===
                    STATUS.WAIVED
                      ? "Y"
                      : "N",

                  szwaiverdec:
                    item.szwaiverdec,

                  szwaiverreason:
                    item.waiveReason ||
                    item.szwaiverreason,

                  szdifferyn:
                    item.status ===
                    STATUS.DEFERRED
                      ? "Y"
                      : "N",

                  szmandatoryyn:
                    item.required
                      ? "Y"
                      : "N",

                  szoriginalreqyn:
                    item.szoriginalreqyn,

                  szverfdecision:
                    item.szverfdecision,

                  szverifiedby:
                    item.szverifiedby,

                  szuserspecifiedyn:
                    item.custom
                      ? "Y"
                      : "N",

                  documentid:
                    item.documentid,

                  cfraudyn:
                    item.cfraudyn ||
                    "N",

                  szremarks:
                    item.remarks ||
                    item.szremarks,

                  iduedays:
                    item.iduedays,

                  dtduedate:
                    item.dtduedate,

                  szdocketlocation:
                    item.szdocketlocation,

                  inoofpages:
                    item.inoofpages,

                  clevel:
                    item.clevel,

                  dtrecieptdate:
                    item.dtrecieptdate,

                  szcreatedby:
                    item.szcreatedby,

                  szupdatedby:
                    item.szupdatedby,
                })
              ),
          };

          /* ==================================================
             MOCK SAVE
             ================================================== */

          if (USE_MOCK_DATA) {
            console.log(
              "MOCK SAVE PAYLOAD",
              payload
            );

            /*
             * Store mock data in local state
             * so UI behaves like a real save.
             */
            setSavedItemIds(
              new Set(
                flattenItems(
                  families
                ).map(
                  (item) =>
                    item.itemId
                )
              )
            );

            toast.success(
              "Documents saved successfully (Mock Mode)"
            );

            return {
              success: true,
            };
          }

          /* ==================================================
             ACTUAL API SAVE
             ================================================== */

          const saved =
            unwrapApiResponse(
              await HAxiosService.PUT(
                LosDocumentAPI.save(
                  appNo
                ),
                payload
              )
            );

          /*
           * Upload physical files after
           * saving document metadata.
           */
          await persistFiles(
            appNo
          );

          /*
           * Reload from backend.
           */
          const refreshed =
            unwrapApiResponse(
              await HAxiosService.GET(
                LosDocumentAPI.getByAppNo(
                  appNo,
                  stage,
                  customerType,
                  applicableFor
                )
              )
            );

          applyFamilies(
            refreshed ||
              saved
          );

          setPendingFiles(
            {}
          );

          toast.success(
            t(
              "label.docupload.msg.saved",
              "Documents saved"
            )
          );

          return {
            success: true,
          };
        } catch (error) {
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
        customerType,
        applicableFor,
        families,
        pendingFiles,
        applyFamilies,
        t,
        toast,
      ]
    );

  /* ==========================================================
     RESET
     ========================================================== */

  const handleReset =
    useCallback(
      async () => {
        if (USE_MOCK_DATA) {
          const mockPayload =
            JSON.parse(
              JSON.stringify(
                MOCK_DOCUMENT_DATA
              )
            );

          mockPayload.stage =
            stage;

          mockPayload.customerType =
            customerType;

          mockPayload.applicableFor =
            applicableFor;

          applyFamilies(
            mockPayload
          );

          setPendingFiles({});
          setAddingFor("");
          setNewDocName("");

          toast.success(
            "Form reset successfully"
          );

          return {
            success: true,
          };
        }

        await loadChecklist();

        toast.success(
          t(
            "label.docupload.msg.reset",
            "Form reset"
          )
        );

        return {
          success: true,
        };
      },
      [
        stage,
        customerType,
        applicableFor,
        applyFamilies,
        loadChecklist,
        t,
        toast,
      ]
    );

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <HBox>

      {/* ======================================================
          BREADCRUMB
          ====================================================== */}

      <HBreadCrumb />


      {/* ======================================================
          PAGE TITLE
          ====================================================== */}

      <TitleBar
        title={t(
          "label.docupload.title",
          "Document Checklist"
        )}
      />


      {/* ======================================================
          MAIN PAPER
          ====================================================== */}

      <HBox>

        <HPaper>

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
  }}
>
  {/* APPLICABLE FOR */}
  <HBox
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "33.33%",
      paddingRight: "12px",
      boxSizing: "border-box",
    }}
  >
    <HLabel
      value="label.docupload.field.applicableFor"
      required
      align="left"
      colon={false}
      style={{
        width: "95px",
        minWidth: "95px",
        whiteSpace: "nowrap",
        marginRight: "10px",
      }}
    />

    <HDropdown
      name="applicableFor"
      options={applicantOptions}
      value={applicableFor}
      onChange={(e) =>
        setApplicableFor(e.target.value)
      }
      width="220px"
    />
  </HBox>


  {/* STAGE */}
  <HBox
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "33.33%",
      paddingRight: "12px",
      boxSizing: "border-box",
    }}
  >
    <HLabel
      value="label.docupload.field.stage"
      required
      align="left"
      colon={false}
      style={{
        width: "55px",
        minWidth: "55px",
        whiteSpace: "nowrap",
        marginRight: "10px",
      }}
    />

    <HDropdown
      name="stage"
      options={stageOptions}
      value={stage}
      onChange={(e) =>
        setStage(e.target.value)
      }
      width="220px"
    />
  </HBox>


  {/* CUSTOMER TYPE */}
  <HBox
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "33.33%",
      boxSizing: "border-box",
    }}
  >
    <HLabel
      value="label.docupload.field.customerType"
      required
      align="left"
      colon={false}
      style={{
        width: "95px",
        minWidth: "95px",
        whiteSpace: "nowrap",
        marginRight: "10px",
      }}
    />

    <HDropdown
      name="customerType"
      options={customerTypeOptions}
      value={customerType}
      onChange={(e) =>
        setCustomerType(e.target.value)
      }
      width="220px"
    />
  </HBox>
</HBox>

          {/* ==================================================
              CHECKLIST HEADER
              ================================================== */}

          <HBox>

            <HBox>

              <HLabel
                value="label.docupload.checklist.title"
                align="left"
                colon={false}
              />

              <HLabel
                value="label.docupload.checklist.hint"
                align="left"
                colon={false}
              />

            </HBox>


            {/* 0/18 received */}

            <HLabel
              value={`${receivedCount}/${items.length} received`}
              translate={false}
              align="left"
              colon={false}
            />

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
        backgroundColor: "#f4f9fa",
        borderBottom: "1px solid #e0c5d3",
      }}
    >

      {/* Section title */}

      <HLabel
        value={family.docFamilyName}
        translate={false}
        align="left"
        colon={false}
        style={{
          fontWeight: 600,
        }}
      />

      {/* Add Document */}

      <HButton
        label="label.docupload.button.addDocument"
        variant="outlined"
        inline
        onClick={() =>
          setAddingFor(
            addingFor === family.docFamilyCode
              ? ""
              : family.docFamilyCode
          )
        }
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
          onChange={(e) =>
            setNewDocName(e.target.value)
          }
          editable
          placeholder="label.docupload.placeholder.docName"
          width="100%"
        />

        <HButton
          label="label.docupload.button.add"
          variant="contained"
          inline
          onClick={() =>
            handleAddCustom(family)
          }
        />

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


    {/* ==================================================
        DOCUMENT LIST
        ================================================== */}

    <HBox
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >

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

            <HBox
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                width: "35%",
                minWidth: "35%",
              }}
            >

              {/* Document icon */}

              <HLabel
                value="▤"
                translate={false}
                align="left"
                colon={false}
              />

              {/* Document information */}

              <HBox
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "8px",
                }}
              >

                <HLabel
                  value={item.docName}
                  translate={false}
                  align="left"
                  colon={false}
                />

                <HLabel
                  value={
                    item.custom
                      ? "Custom"
                      : "System generated"
                  }
                  translate={false}
                  align="left"
                  colon={false}
                />

              </HBox>

            </HBox>


            {/* ========================================
                FILE INPUT
                ======================================== */}

            <input
              ref={(element) => {
                fileInputs.current[item.itemId] =
                  element;
              }}
              type="file"
              hidden
              onChange={(e) => {
                handleFilePicked(
                  item,
                  e.target.files?.[0]
                );

                /*
                 * Allow selecting
                 * the same file again.
                 */
                e.target.value = "";
              }}
            />


            {/* ========================================
                UPLOAD
                ======================================== */}

            <HBox
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "8px",
                width: "65%",
              }}
            >

              <HButton
                label={
                  item.fileName
                    ? "Replace"
                    : "Upload"
                }
                translate={false}
                variant="outlined"
                inline
                onClick={() =>
                  fileInputs.current[
                    item.itemId
                  ]?.click()
                }
              />


              {/* ====================================
                  RECEIVED
                  ==================================== */}

              <HButton
                label="Received"
                translate={false}
                variant={
                  item.status ===
                  STATUS.RECEIVED
                    ? "contained"
                    : "outlined"
                }
                inline
                onClick={() =>
                  handleStatusClick(
                    item,
                    STATUS.RECEIVED
                  )
                }
              />


              {/* ====================================
                  DEFERRED
                  ==================================== */}

              <HButton
                label="Deferred"
                translate={false}
                variant={
                  item.status ===
                  STATUS.DEFERRED
                    ? "contained"
                    : "outlined"
                }
                inline
                onClick={() =>
                  handleStatusClick(
                    item,
                    STATUS.DEFERRED
                  )
                }
              />


              {/* ====================================
                  WAIVED
                  ==================================== */}

              <HButton
                label="Waived"
                translate={false}
                variant={
                  item.status ===
                  STATUS.WAIVED
                    ? "contained"
                    : "outlined"
                }
                inline
                onClick={() =>
                  handleStatusClick(
                    item,
                    STATUS.WAIVED
                  )
                }
              />


              {/* ====================================
                  STATUS
                  ==================================== */}

              <HLabel
                value={item.status}
                translate={false}
                align="left"
                colon={false}
              />


              {/* ====================================
                  FILE NAME
                  ==================================== */}

              {item.fileName ? (
                <HLabel
                  value={`${item.fileName} ${
                    item.fileSize
                      ? `(${formatFileSize(
                          item.fileSize
                        )})`
                      : ""
                  }`}
                  translate={false}
                  align="left"
                  colon={false}
                />
              ) : null}


              {/* ====================================
                  PREVIEW
                  ==================================== */}

              {item.hasFile ||
              item.fileUrl ? (
                <HButton
                  label="Preview"
                  translate={false}
                  variant="outlined"
                  inline
                  onClick={() =>
                    handlePreview(item)
                  }
                />
              ) : null}


              {/* ====================================
                  REMOVE FILE
                  ==================================== */}

              {item.fileName ? (
                <HButton
                  label="Remove"
                  translate={false}
                  variant="outlined"
                  inline
                  onClick={() =>
                    handleRemoveFile(item)
                  }
                />
              ) : null}


              {/* ====================================
                  DELETE CUSTOM DOCUMENT
                  ==================================== */}

              {item.custom ? (
                <HButton
                  label="Delete"
                  translate={false}
                  variant="outlined"
                  inline
                  onClick={() =>
                    handleDeleteCustom(item)
                  }
                />
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


      {/* ======================================================
          BOTTOM BUTTON BAR
          ====================================================== */}

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


      {/* ======================================================
          PREVIEW DIALOG
          ====================================================== */}

      <HDialog
        open={Boolean(
          preview
        )}
        onClose={() =>
          setPreview(null)
        }
        title={
          preview?.docName ||
          "Document preview"
        }
        maxWidth="md"
        fullWidth
        actions={
          <HButton
            label="Cancel"
            translate={
              false
            }
            variant="outlined"
            inline
            onClick={() =>
              setPreview(null)
            }
          />
        }
      >

        {preview?.fileUrl &&
        (
          preview.fileType ||
          ""
        ).startsWith(
          "image/"
        ) ? (
          <img
            src={
              preview.fileUrl
            }
            alt={
              preview.docName
            }
            width="100%"
          />
        ) : preview?.fileUrl &&
          (
            preview.fileType ||
            ""
          ).includes("pdf") ? (
          <iframe
            title={
              preview.docName
            }
            src={
              preview.fileUrl
            }
            width="100%"
            height="480"
          />
        ) : (
          <HLabel
            value="No preview available"
            translate={
              false
            }
            align="left"
            colon={false}
          />
        )}

      </HDialog>


      {/* ======================================================
          WAIVE DOCUMENT DIALOG
          ====================================================== */}

      <HDialog
        open={Boolean(
          waiveDialog
        )}
        onClose={() =>
          setWaiveDialog(
            null
          )
        }
        title="Waive document"
        maxWidth="sm"
        fullWidth
        actions={
          <HBox>

            <HButton
              label="Cancel"
              translate={
                false
              }
              variant="outlined"
              inline
              onClick={() =>
                setWaiveDialog(
                  null
                )
              }
            />

            <HButton
              label="Confirm Waive"
              translate={
                false
              }
              variant="contained"
              inline
              disabled={
                !waiveDialog?.reason
              }
              onClick={() => {
                updateItem(
                  waiveDialog.itemId,
                  {
                    status:
                      STATUS.WAIVED,

                    waiveReason:
                      waiveDialog.reason,

                    waiveComments:
                      waiveDialog.comments,

                    szreceivedyn:
                      "N",

                    szwaivedyn:
                      "Y",

                    szdifferyn:
                      "N",

                    szwaiverreason:
                      waiveDialog.reason,
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
          value="Select a reason for waiving this document."
          translate={
            false
          }
          align="left"
          colon={false}
        />

        <HLabel
          value="Reason"
          translate={
            false
          }
          required
          align="left"
          colon={false}
        />

        <HDropdown
          name="waiveReason"
          options={
            waiveReasonOptions
          }
          value={
            waiveDialog?.reason ||
            ""
          }
          onChange={(e) =>
            setWaiveDialog(
              (prev) => ({
                ...prev,
                reason:
                  e.target.value,
              })
            )
          }
          width="100%"
        />

        <HLabel
          value="Comments"
          translate={
            false
          }
          align="left"
          colon={false}
        />

        <HTextarea
          value={
            waiveDialog?.comments ||
            ""
          }
          onChange={(e) =>
            setWaiveDialog(
              (prev) => ({
                ...prev,
                comments:
                  e.target.value,
              })
            )
          }
          maxLength={500}
          maxLines={3}
          width="100%"
          placeholder="Enter comments"
        />

      </HDialog>


      {/* ======================================================
          DEFER DOCUMENT DIALOG
          ====================================================== */}

      <HDialog
        open={Boolean(
          deferDialog
        )}
        onClose={() =>
          setDeferDialog(
            null
          )
        }
        title="Defer document"
        maxWidth="sm"
        fullWidth
        actions={
          <HBox>

            <HButton
              label="Cancel"
              translate={
                false
              }
              variant="outlined"
              inline
              onClick={() =>
                setDeferDialog(
                  null
                )
              }
            />

            <HButton
              label="Confirm Defer"
              translate={
                false
              }
              variant="contained"
              inline
              disabled={
                !deferDialog?.stage ||
                !deferDialog?.date
              }
              onClick={() => {
                updateItem(
                  deferDialog.itemId,
                  {
                    status:
                      STATUS.DEFERRED,

                    deferralStage:
                      deferDialog.stage,

                    deferralDate:
                      deferDialog.date,

                    szreceivedyn:
                      "N",

                    szwaivedyn:
                      "N",

                    szdifferyn:
                      "Y",
                  }
                );

                setDeferDialog(
                  null
                );
              }}
            />

          </HBox>
        }
      >

        <HLabel
          value="Select the stage and date until which this document is deferred."
          translate={
            false
          }
          align="left"
          colon={false}
        />

        <HLabel
          value="Deferral Stage"
          translate={
            false
          }
          required
          align="left"
          colon={false}
        />

        <HDropdown
          name="deferralStage"
          options={
            stageOptions
          }
          value={
            deferDialog?.stage ||
            ""
          }
          onChange={(e) =>
            setDeferDialog(
              (prev) => ({
                ...prev,
                stage:
                  e.target.value,
              })
            )
          }
          width="100%"
        />

        <HLabel
          value="Deferral Date"
          translate={
            false
          }
          required
          align="left"
          colon={false}
        />

        <HDatePicker
          value={
            deferDialog?.date
              ? dayjs(
                  deferDialog.date
                )
              : null
          }
          onChange={(value) =>
            setDeferDialog(
              (prev) => ({
                ...prev,

                date: value
                  ? value.format(
                      "YYYY-MM-DD"
                    )
                  : "",
              })
            )
          }
          width="100%"
        />

      </HDialog>

    </HBox>
  );
};

export default ApplicationDocumentUpload;