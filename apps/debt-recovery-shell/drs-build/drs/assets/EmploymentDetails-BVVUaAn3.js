import { dN as reactExports, ed as useIntl, ct as ar, el as useSelector, dB as jsxRuntimeExports, v as Box, C as CE, aM as Grid, dK as ps, aX as Kr, ae as EmploymentDetailsAPI } from "./index-BhdgJqva.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
function EmploymentDetails() {
  const [details, setDetails] = reactExports.useState({
    customerNo: "",
    customerName: "",
    dob: "",
    pob: "",
    regionalName: "",
    aliasName: "",
    nationality: "",
    gender: "",
    maritalStatus: "",
    stayedYears: "",
    familyIncome: "",
    noOfChildren: "",
    noOfDependants: "",
    mobileNo: "",
    email: "",
    occupation: "",
    employerName: "",
    designation: "",
    annualSalary: "",
    bankAccountNo: "",
    bankName: "",
    branchName: ""
  });
  const intl = useIntl();
  const toast = ar();
  const { selectedRow } = useSelector((state) => state.account);
  const fetchCustomerDetails = () => {
    Kr.POST(EmploymentDetailsAPI.fetchCustomerDetails()).then((res) => {
      var _a;
      if (res.data.status === "Success" && ((_a = res.data.responseJson) == null ? void 0 : _a.length) > 0) {
        const data = res.data.responseJson[0];
        const cust = data.customerDetails || {};
        const emp = data.employmentDetails || {};
        const fin = data.financialStatus || {};
        setDetails((prev) => ({
          ...prev,
          customerNo: cust.szLegacyCustomerNo || "",
          customerName: cust.szName || "",
          dob: cust.dtDateOfBirth || "",
          pob: cust.szPlaceOfBirth || "",
          regionalName: cust.szRegionalName || "",
          aliasName: cust.szAliasName || "",
          nationality: cust.szNationality || "",
          gender: cust.szGender || "",
          maritalStatus: cust.chMaritalStatus || "",
          stayedYears: cust.flStayedYears || "",
          familyIncome: cust.flFamilyIncome || "",
          noOfChildren: cust.inNoOfChildren || "",
          noOfDependants: cust.inNoOfDependents || "",
          mobileNo: cust.szMobileNo || "",
          email: cust.szMailId || "",
          occupation: emp.szOccupation || "",
          employerName: emp.szEmployerCode || "",
          // you may want to map employerCode -> employerName
          designation: emp.szDesignation || "",
          annualSalary: emp.flNetAnnualSalary || "",
          bankAccountNo: fin.szBankACNo || "",
          bankName: fin.szBankName || "",
          branchName: fin.szBranchName || ""
        }));
      } else if (res.data.status === "Failure" && res.data.message === "Validation Failed") {
        handleValidationErrors(intl, toast, res.data.responseJson);
      } else {
        toast.error(res.data.message || "Failed to fetch details");
      }
    }).catch((err) => {
      console.error("Fetch API Error:", err);
      toast.error("Something went wrong while fetching details");
    });
  };
  reactExports.useEffect(() => {
    fetchCustomerDetails();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FunctionLayout, { title: intl.formatMessage({ id: "label.EmploymentDetails.title", defaultMessage: "Employment Details" }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CE, { title: intl.formatMessage({ id: "label.EmploymentDetails.customerDetails", defaultMessage: "Customer Details" }), headerFontSize: 14, collapse: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { p: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 2, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { size: { xs: 12, md: 6 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.EmploymentDetails.Customer No", defaultMessage: "Customer No" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: details.customerNo,
              disabled: true,
              width: 150,
              colon: false,
              align: "left",
              translate: false,
              tooltip: details.customerNo
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.EmploymentDetails.Date of Birth", defaultMessage: "Date of Birth" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: details.dob,
              disabled: true,
              width: 150,
              colon: false,
              align: "left",
              translate: false,
              tooltip: details.dob
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.EmploymentDetails.Regional Name", defaultMessage: "Regional Name" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: details.regionalName,
              disabled: true,
              width: 150,
              colon: false,
              align: "left"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.EmploymentDetails.Nationality", defaultMessage: "Nationality" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: details.nationality,
              disabled: true,
              width: 150,
              colon: false,
              align: "left",
              translate: false,
              tooltip: details.nationality
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.EmploymentDetails.Marital Status", defaultMessage: "Marital Status" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: details.maritalStatus,
              disabled: true,
              width: 150,
              colon: false,
              align: "left",
              translate: false,
              tooltip: details.maritalStatus
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.EmploymentDetails.Family Income", defaultMessage: "Family Income" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: details.familyIncome,
              disabled: true,
              width: 150,
              colon: false,
              align: "left",
              translate: false,
              tooltip: details.familyIncome
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.EmploymentDetails.No Of Dependants", defaultMessage: "No Of Dependants" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: details.noOfDependants,
              disabled: true,
              width: 150,
              colon: false,
              align: "left",
              translate: false,
              tooltip: details.noOfDependants
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.EmploymentDetails.Email", defaultMessage: "Email" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: details.email,
              disabled: true,
              width: 150,
              colon: false,
              align: "left",
              translate: false,
              tooltip: details.email
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { size: { xs: 12, md: 6 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.EmploymentDetails.Customer Name", defaultMessage: "Customer Name" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: details.customerName,
              disabled: true,
              width: 150,
              colon: false,
              align: "left",
              translate: false,
              tooltip: details.customerName
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.EmploymentDetails.Place of Birth", defaultMessage: "Place of Birth" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: details.pob,
              disabled: true,
              width: 150,
              colon: false,
              align: "left",
              translate: false,
              tooltip: details.pob
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.EmploymentDetails.Alias Name", defaultMessage: "Alias Name" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: details.aliasName,
              disabled: true,
              width: 150,
              colon: false,
              align: "left",
              translate: false,
              tooltip: details.aliasName
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.EmploymentDetails.Gender", defaultMessage: "Gender" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: details.gender,
              disabled: true,
              width: 150,
              colon: false,
              align: "left",
              translate: false,
              tooltip: details.gender
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.EmploymentDetails.Stayed Years", defaultMessage: "Stayed Years" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: details.stayedYears,
              disabled: true,
              width: 150,
              colon: false,
              align: "left",
              translate: false,
              tooltip: details.stayedYears
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.EmploymentDetails.No Of Children", defaultMessage: "No Of Children" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: details.noOfChildren,
              disabled: true,
              width: 150,
              colon: false,
              align: "left",
              translate: false,
              tooltip: details.noOfChildren
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.EmploymentDetails.Mobile No", defaultMessage: "Mobile No" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: details.mobileNo,
              disabled: true,
              width: 150,
              colon: false,
              align: "left",
              translate: false,
              tooltip: details.mobileNo
            }
          )
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CE, { title: intl.formatMessage({ id: "label.EmploymentDetails.employmentDetails", defaultMessage: "Employment Details" }), headerFontSize: 14, collapse: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { p: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 2, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { size: { xs: 12, md: 6 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.EmploymentDetails.Occupation", defaultMessage: "Occupation" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: details.occupation,
              disabled: true,
              width: 150,
              colon: false,
              align: "left",
              translate: false,
              tooltip: details.occupation
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.EmploymentDetails.Designation", defaultMessage: "Designation" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: details.designation,
              disabled: true,
              width: 150,
              colon: false,
              align: "left",
              translate: false,
              tooltip: details.designation
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { size: { xs: 12, md: 6 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.EmploymentDetails.Employer Name", defaultMessage: "Employer Name" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: details.employerName,
              disabled: true,
              width: 150,
              colon: false,
              align: "left",
              translate: false,
              tooltip: details.employerName
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.EmploymentDetails.Annual Salary", defaultMessage: "Annual Salary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: details.annualSalary,
              disabled: true,
              width: 150,
              colon: false,
              align: "left",
              translate: false,
              tooltip: details.annualSalary
            }
          )
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CE, { title: intl.formatMessage({ id: "label.EmploymentDetails.financialStatus", defaultMessage: "Financial Status" }), headerFontSize: 14, collapse: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { p: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 2, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.EmploymentDetails.Bank Account No", defaultMessage: "Bank Account No" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ps,
          {
            value: details.bankAccountNo,
            disabled: true,
            width: 150,
            colon: false,
            align: "left",
            translate: false,
            tooltip: details.bankAccountNo
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.EmploymentDetails.Bank Name", defaultMessage: "Bank Name" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ps,
          {
            value: details.bankName,
            disabled: true,
            width: 150,
            colon: false,
            align: "left",
            translate: false,
            tooltip: details.bankName
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.EmploymentDetails.Branch Name", defaultMessage: "Branch Name" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ps,
          {
            value: details.branchName,
            disabled: true,
            width: 150,
            colon: false,
            align: "left",
            translate: false,
            tooltip: details.branchName
          }
        )
      ] }) })
    ] }) }) })
  ] }) });
}
export {
  EmploymentDetails as default
};
