import { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { EmploymentDetailsAPI } from "./apiEndpoints";
import { HAxiosService, HAccordion, HLabel, HTextField, TitleBar, useToast } from "@helix/component-library";
import FunctionLayout from "./FunctionLayout";

import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { handleValidationErrors } from "../early-collection/ValidationUtils.jsx";

export default function EmploymentDetails() {
  const [details, setDetails] = useState({
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

  const intl = useIntl();
  const toast = useToast(); 
  const { selectedRow } = useSelector((state) => state.account);

  // ----------- API CALL -----------
  
  const fetchCustomerDetails = () => {
    HAxiosService.POST(EmploymentDetailsAPI.fetchCustomerDetails())
      .then((res) => {
        if (res.data.status === "Success" && res.data.responseJson?.length > 0) {
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
            employerName: emp.szEmployerCode || "", // you may want to map employerCode -> employerName
            designation: emp.szDesignation || "",
            annualSalary: emp.flNetAnnualSalary || "",

            bankAccountNo: fin.szBankACNo || "",
            bankName: fin.szBankName || "",
            branchName: fin.szBranchName || "",
          }));
        } else if (res.data.status === "Failure" && res.data.message === "Validation Failed") {
          handleValidationErrors(intl, toast, res.data.responseJson);
        } else {
          toast.error(res.data.message || "Failed to fetch details");
        }
      })

      .catch((err) => {
        console.error("Fetch API Error:", err);
        toast.error("Something went wrong while fetching details");
      });
  };

  useEffect(() => {
    fetchCustomerDetails();
  }, []);

  return (
    <FunctionLayout title={intl.formatMessage({ id: "label.EmploymentDetails.title", defaultMessage: "Employment Details" })}>
      <Box>
        {/* Customer Details */}
        <HAccordion title={intl.formatMessage({ id: "label.EmploymentDetails.customerDetails", defaultMessage: "Customer Details" })} headerFontSize={14} collapse={true}>
          <Box sx={{ p: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box className="label-textfield-row">
                  <HLabel value={intl.formatMessage({ id: "label.EmploymentDetails.Customer No", defaultMessage: "Customer No" })} />
                  <HLabel value={details.customerNo} disabled width={150} 
                    colon={false}
                    align="left"
                    translate={false}
                    tooltip={details.customerNo} />
                </Box>
                <Box className="label-textfield-row">
                  <HLabel value={intl.formatMessage({ id: "label.EmploymentDetails.Date of Birth", defaultMessage: "Date of Birth" })} />
                  <HLabel value={details.dob} disabled 
                  width={150} 
                    colon={false}
                    align="left"
                    translate={false}
                    tooltip={details.dob} />
                </Box>
                <Box className="label-textfield-row">
                  <HLabel value={intl.formatMessage({ id: "label.EmploymentDetails.Regional Name", defaultMessage: "Regional Name" })} />
                  <HLabel value={details.regionalName} disabled  width={150} 
                    colon={false}
                    align="left"/>
                </Box>
                <Box className="label-textfield-row">
                  <HLabel value={intl.formatMessage({ id: "label.EmploymentDetails.Nationality", defaultMessage: "Nationality" })} />
                   <HLabel value={details.nationality} disabled 
                  width={150} 
                    colon={false}
                    align="left"
                    translate={false}
                    tooltip={details.nationality} />
                </Box>
                <Box className="label-textfield-row">
                  <HLabel value={intl.formatMessage({ id: "label.EmploymentDetails.Marital Status", defaultMessage: "Marital Status" })} />
                   <HLabel value={details.maritalStatus} disabled 
                  width={150} 
                    colon={false}
                    align="left"
                    translate={false}
                    tooltip={details.maritalStatus} />
               
                </Box>
                <Box className="label-textfield-row">
                  <HLabel value={intl.formatMessage({ id: "label.EmploymentDetails.Family Income", defaultMessage: "Family Income" })} />
                   <HLabel value={details.familyIncome} disabled 
                  width={150} 
                    colon={false}
                    align="left"
                    translate={false}
                    tooltip={details.familyIncome} />
               
                
                </Box>
                <Box className="label-textfield-row">
                  <HLabel value={intl.formatMessage({ id: "label.EmploymentDetails.No Of Dependants", defaultMessage: "No Of Dependants" })} />
                  <HLabel value={details.noOfDependants} disabled 
                  width={150} 
                    colon={false}
                    align="left"
                    translate={false}
                    tooltip={details.noOfDependants} />
               
                </Box>
                <Box className="label-textfield-row">
                  <HLabel value={intl.formatMessage({ id: "label.EmploymentDetails.Email", defaultMessage: "Email" })} />
                  <HLabel value={details.email} disabled 
                  width={150} 
                    colon={false}
                    align="left"
                    translate={false}
                    tooltip={details.email} />
               
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box className="label-textfield-row">
                  <HLabel value={intl.formatMessage({ id: "label.EmploymentDetails.Customer Name", defaultMessage: "Customer Name" })} />
                  <HLabel value={details.customerName} disabled 
                  width={150} 
                    colon={false}
                    align="left"
                    translate={false}
                    tooltip={details.customerName} />
                </Box>
                <Box className="label-textfield-row">
                  <HLabel value={intl.formatMessage({ id: "label.EmploymentDetails.Place of Birth", defaultMessage: "Place of Birth" })} />
                  <HLabel value={details.pob} disabled 
                  width={150} 
                    colon={false}
                    align="left"
                    translate={false}
                    tooltip={details.pob} />
                </Box>
                <Box className="label-textfield-row">
                  <HLabel value={intl.formatMessage({ id: "label.EmploymentDetails.Alias Name", defaultMessage: "Alias Name" })} />
                  <HLabel value={details.aliasName} disabled 
                  width={150} 
                    colon={false}
                    align="left"
                    translate={false}
                    tooltip={details.aliasName} />
                </Box>
                <Box className="label-textfield-row">
                  <HLabel value={intl.formatMessage({ id: "label.EmploymentDetails.Gender", defaultMessage: "Gender" })} />
                   <HLabel value={details.gender} disabled 
                  width={150} 
                    colon={false}
                    align="left"
                    translate={false}
                    tooltip={details.gender} />
                </Box>
                <Box className="label-textfield-row">
                  <HLabel value={intl.formatMessage({ id: "label.EmploymentDetails.Stayed Years", defaultMessage: "Stayed Years" })} />
                   <HLabel value={details.stayedYears} disabled 
                  width={150} 
                    colon={false}
                    align="left"
                    translate={false}
                    tooltip={details.stayedYears} />
                </Box>
                <Box className="label-textfield-row">
                  <HLabel value={intl.formatMessage({ id: "label.EmploymentDetails.No Of Children", defaultMessage: "No Of Children" })} />
                  <HLabel value={details.noOfChildren} disabled 
                  width={150} 
                    colon={false}
                    align="left"
                    translate={false}
                    tooltip={details.noOfChildren} />
                </Box>
                <Box className="label-textfield-row">
                  <HLabel value={intl.formatMessage({ id: "label.EmploymentDetails.Mobile No", defaultMessage: "Mobile No" })} />
                  <HLabel value={details.mobileNo} disabled 
                  width={150} 
                    colon={false}
                    align="left"
                    translate={false}
                    tooltip={details.mobileNo} />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </HAccordion>

        {/* Employment Details */}
        <HAccordion title={intl.formatMessage({ id: "label.EmploymentDetails.employmentDetails", defaultMessage: "Employment Details" })} headerFontSize={14} collapse={true}>
          <Box sx={{ p: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box className="label-textfield-row">
                  <HLabel value={intl.formatMessage({ id: "label.EmploymentDetails.Occupation", defaultMessage: "Occupation" })} />
                  
                  <HLabel value={details.occupation} disabled 
                  width={150} 
                    colon={false}
                    align="left"
                    translate={false}
                    tooltip={details.occupation} />
                </Box>
                <Box className="label-textfield-row">
                  <HLabel value={intl.formatMessage({ id: "label.EmploymentDetails.Designation", defaultMessage: "Designation" })} />
                 
                   <HLabel value={details.designation} disabled 
                  width={150} 
                    colon={false}
                    align="left"
                    translate={false}
                    tooltip={details.designation} />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box className="label-textfield-row">
                  <HLabel value={intl.formatMessage({ id: "label.EmploymentDetails.Employer Name", defaultMessage: "Employer Name" })} />
                   <HLabel value={details.employerName} disabled 
                  width={150} 
                    colon={false}
                    align="left"
                    translate={false}
                    tooltip={details.employerName} />
                </Box>
                <Box className="label-textfield-row">
                  <HLabel value={intl.formatMessage({ id: "label.EmploymentDetails.Annual Salary", defaultMessage: "Annual Salary" })} />
                  <HLabel value={details.annualSalary} disabled 
                  width={150} 
                    colon={false}
                    align="left"
                    translate={false}
                    tooltip={details.annualSalary} />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </HAccordion>

        {/* Financial Status */}
        <HAccordion title={intl.formatMessage({ id: "label.EmploymentDetails.financialStatus", defaultMessage: "Financial Status" })} headerFontSize={14} collapse={true}>
          <Box sx={{ p: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box className="label-textfield-row">
                  <HLabel value={intl.formatMessage({ id: "label.EmploymentDetails.Bank Account No", defaultMessage: "Bank Account No" })} />
                  <HLabel value={details.bankAccountNo} disabled 
                  width={150} 
                    colon={false}
                    align="left"
                    translate={false}
                    tooltip={details.bankAccountNo} />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box className="label-textfield-row">
                  <HLabel value={intl.formatMessage({ id: "label.EmploymentDetails.Bank Name", defaultMessage: "Bank Name" })} />
                   <HLabel value={details.bankName} disabled 
                  width={150} 
                    colon={false}
                    align="left"
                    translate={false}
                    tooltip={details.bankName} />

                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box className="label-textfield-row">
                  <HLabel value={intl.formatMessage({ id: "label.EmploymentDetails.Branch Name", defaultMessage: "Branch Name" })} />
                   <HLabel value={details.branchName} disabled 
                  width={150} 
                    colon={false}
                    align="left"
                    translate={false}
                    tooltip={details.branchName} />

                </Box>
              </Grid>
            </Grid>
          </Box>
        </HAccordion>
      </Box>
    </FunctionLayout>
  );
}
