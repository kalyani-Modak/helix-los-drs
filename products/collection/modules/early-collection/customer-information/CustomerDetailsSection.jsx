import React, { useState, useEffect } from "react";
import { Grid, Typography, useTheme } from "@mui/material";
import { HBox, HPaper, HLabel, HAxiosService, useToast } from "@helix/component-library";
import Person from "@mui/icons-material/Person";
import Work from "@mui/icons-material/Work";
import AccountBalance from "@mui/icons-material/AccountBalance";
import Public from "@mui/icons-material/Public";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Favorite from "@mui/icons-material/Favorite";
import ChildCare from "@mui/icons-material/ChildCare";
import Phone from "@mui/icons-material/Phone";
import Email from "@mui/icons-material/Email";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { EmploymentDetailsAPI } from "../apiEndpoints";

import { handleValidationErrors } from "../ValidationUtils.jsx";
import { useLocation } from "react-router-dom";

function SubsectionTitle({ icon, titleId }) {
  const intl = useIntl();
  return (
    <HBox sx={{ display: "flex", alignItems: "center", gap: 0.75, pt: 2, pb: 1, "&:first-of-type": { pt: 0 } }}>
      <HBox sx={{ color: "primary.main", display: "flex" }}>{icon}</HBox>
      <Typography variant="subtitle2" sx={{ fontSize: 12, fontWeight: 600 }}>
        {intl.formatMessage({ id: titleId })}
      </Typography>
    </HBox>
  );
}

/**
 * Read-only field: label (translated i18n id) + value text, aligned with Interface Delight FieldRow (stacked, no input chrome).
 */
function DelightFieldRow({ labelId, value, theme, icon }) {
  const display =
    value != null && value !== ""
      ? String(value)
      : "—";


  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <HBox sx={{ py: 0.75, minWidth: 0 }}>
        <HBox sx={{ display: "flex", alignItems: "center", gap: 0.5, color: theme.palette.text.secondary, mb: 0.25 }}>
          {icon ? <HBox sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>{icon}</HBox> : null}
          <HLabel value={labelId} translate colon={false} align="left" color={theme.palette.text.secondary} />
        </HBox>
        <HBox sx={{ mt: 0.25 }}>
          <HLabel value={display} translate={false} colon={false} align="left" color={theme.palette.text.primary} />
        </HBox>
      </HBox>
    </Grid>
  );
}

export default function CustomerDetailsSection({ customer }) {
  const theme = useTheme();
  const intl = useIntl();
  const toast = useToast();
  const { selectedRow } = useSelector((state) => state.account);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const [customerData, setCustomerData] = useState({
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
    branchName: "",
  });

  const fetchCustomerDetails = React.useCallback(() => {
    if (!selectedRow || !customer) return;
    console.log(">>>>>>Screen Menu ID:", screenMenuId);
    HAxiosService.GET(EmploymentDetailsAPI.fetchCustomerDetails(screenMenuId))
      .then((res) => {
        if (res.data.status === "Success" && res.data.responseJson?.length > 0) {
          const data = res.data.responseJson[0];
          const cust = data.customerDetails || {};
          const emp = data.employmentDetails || {};
          const fin = data.financialStatus || {};

          setCustomerData({
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
            designation: emp.szDesignation || "",
            annualSalary: emp.flNetAnnualSalary || "",
            bankAccountNo: fin.szBankACNo || "",
            bankName: fin.szBankName || "",
            branchName: fin.szBranchName || "",
          });
        } else if (res.data.status === "Failure" && res.data.message === "Validation Failed") {
          handleValidationErrors(intl, toast, res.data.responseJson);
        } else {
          toast.error(res.data.message || "Failed to fetch customer details");
        }
      })
      .catch((err) => {
        console.error("Fetch API Error:", err);
        toast.error("Something went wrong while fetching customer details");
      });
  }, [customer, intl, selectedRow, toast]);

  useEffect(() => {
    if (selectedRow && customer) {
      fetchCustomerDetails();
    }
  }, [selectedRow, customer, fetchCustomerDetails]);

  if (!selectedRow) return null;

  return (
    <HPaper variant="outlined" elevation={0} sx={{ borderRadius: 2, borderColor: "divider", p: 2 }}>
      <SubsectionTitle icon={<Person sx={{ fontSize: 18 }} />} titleId="label.customerInformation.section.customerDetails" />
      <Grid container spacing={1.5}>
        <DelightFieldRow theme={theme} labelId="label.customerInformation.field.customerNo" value={customerData.customerNo} />
        <DelightFieldRow theme={theme} labelId="label.customerInformation.field.customerName" value={customerData.customerName} />
        <DelightFieldRow theme={theme} labelId="label.customerInformation.field.dob" value={customerData.dob} icon={<CalendarToday sx={{ fontSize: 14 }} />} />
        <DelightFieldRow theme={theme} labelId="label.customerInformation.field.pob" value={customerData.pob} />
        <DelightFieldRow theme={theme} labelId="label.customerInformation.field.regionalName" value={customerData.regionalName || "—"} />
        <DelightFieldRow theme={theme} labelId="label.customerInformation.field.alias" value={customerData.aliasName || "—"} />
        <DelightFieldRow theme={theme} labelId="label.customerInformation.field.nationality" value={customerData.nationality} icon={<Public sx={{ fontSize: 14 }} />} />
        <DelightFieldRow theme={theme} labelId="label.customerInformation.field.gender" value={customerData.gender} />
        <DelightFieldRow theme={theme} labelId="label.customerInformation.field.marital" value={customerData.maritalStatus} icon={<Favorite sx={{ fontSize: 14 }} />} />
        <DelightFieldRow theme={theme} labelId="label.customerInformation.field.stayedYears" value={customerData.stayedYears} />
        <DelightFieldRow
          theme={theme}
          labelId="label.customerInformation.field.familyIncome"
          value={customerData.familyIncome != null ? `₹${Number(customerData.familyIncome).toLocaleString()}` : ""}
        />
        <DelightFieldRow theme={theme} labelId="label.customerInformation.field.children" value={customerData.noOfChildren} icon={<ChildCare sx={{ fontSize: 14 }} />} />
        <DelightFieldRow theme={theme} labelId="label.customerInformation.field.dependents" value={customerData.noOfDependants} />
        <DelightFieldRow theme={theme} labelId="label.customerInformation.field.mobile" value={customerData.mobileNo} icon={<Phone sx={{ fontSize: 14 }} />} />
        <DelightFieldRow theme={theme} labelId="label.customerInformation.field.email" value={customerData.email} icon={<Email sx={{ fontSize: 14 }} />} />
      </Grid>

      <SubsectionTitle icon={<Work sx={{ fontSize: 18 }} />} titleId="label.customerInformation.section.employment" />
      <Grid container spacing={1.5}>
        <DelightFieldRow theme={theme} labelId="label.customerInformation.field.occupation" value={customerData.occupation} />
        <DelightFieldRow theme={theme} labelId="label.customerInformation.field.employer" value={customerData.employerName} icon={<Work sx={{ fontSize: 14 }} />} />
        <DelightFieldRow theme={theme} labelId="label.customerInformation.field.designation" value={customerData.designation} />
        <DelightFieldRow
          theme={theme}
          labelId="label.customerInformation.field.annualSalary"
          value={customerData.annualSalary != null ? `₹${Number(customerData.annualSalary).toLocaleString()}` : ""}
        />
      </Grid>

      <SubsectionTitle icon={<AccountBalance sx={{ fontSize: 18 }} />} titleId="label.customerInformation.section.financial" />
      <Grid container spacing={1.5}>
        <DelightFieldRow theme={theme} labelId="label.customerInformation.field.bankAccount" value={customerData.bankAccountNo} icon={<AccountBalance sx={{ fontSize: 14 }} />} />
        <DelightFieldRow theme={theme} labelId="label.customerInformation.field.bank" value={customerData.bankName} />
        <DelightFieldRow theme={theme} labelId="label.customerInformation.field.branch" value={customerData.branchName} />
      </Grid>
    </HPaper>
  );
}
