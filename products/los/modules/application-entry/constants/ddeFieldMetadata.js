export const DDE_FIELDS = [
  {
    "name": "customerType",
    "type": "select",
    "label": "Borrower Category",
    "required": true,
    "options": [
      "Salaried",
      "Self Employed Professional (SEP)",
      "Self Employed Non-Professional (SENP)",
      "Pensioner"
    ],
    "help": "Auto-populated from QDE — drives which income sections appear below"
  },
  {
    "name": "title",
    "type": "select",
    "label": "Title",
    "section": "Personal Details",
    "required": true,
    "optionsMaster": "title"
  },
  {
    "name": "firstName",
    "type": "text",
    "label": "First Name",
    "section": "Personal Details",
    "required": true,
    "maxLength": 80
  },
  {
    "name": "middleName",
    "type": "text",
    "label": "Middle Name",
    "section": "Personal Details",
    "maxLength": 80
  },
  {
    "name": "lastName",
    "type": "text",
    "label": "Last Name",
    "section": "Personal Details",
    "required": true,
    "maxLength": 80
  },
  {
    "name": "aadhaar",
    "type": "text",
    "label": "Aadhaar (UIDAI)",
    "section": "Personal Details",
    "maxLength": 12,
    "pattern": "^[0-9]{12}$",
    "placeholder": "12-digit Aadhaar",
    "help": "Auto-populated from Quick Data Entry KYC Check Grid — Individual"
  },
  {
    "name": "pan",
    "type": "text",
    "label": "PAN",
    "section": "Personal Details",
    "maxLength": 10,
    "pattern": "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
    "placeholder": "AAAAA9999A",
    "help": "Auto-populated from Quick Data Entry KYC Check Grid — Individual"
  },
  {
    "name": "passport",
    "type": "text",
    "label": "Passport No",
    "section": "Personal Details",
    "maxLength": 9,
    "pattern": "^[A-Za-z0-9]{6,9}$",
    "placeholder": "N1234567"
  },
  {
    "name": "dob",
    "type": "date",
    "label": "Date of Birth",
    "section": "Personal Details",
    "required": true
  },
  {
    "name": "age",
    "type": "number",
    "label": "Age",
    "section": "Personal Details",
    "min": 18,
    "max": 100
  },
  {
    "name": "gender",
    "type": "select",
    "label": "Gender",
    "section": "Personal Details",
    "required": true,
    "optionsMaster": "gender"
  },
  {
    "name": "maritalStatus",
    "type": "select",
    "label": "Marital Status",
    "section": "Personal Details",
    "required": true,
    "optionsMaster": "maritalStatus"
  },
  {
    "name": "spouseName",
    "type": "text",
    "label": "Spouse Name",
    "section": "Personal Details",
    "maxLength": 120
  },
  {
    "name": "dependents",
    "type": "number",
    "label": "No. of Dependents",
    "section": "Personal Details",
    "min": 0,
    "max": 20
  },
  {
    "name": "nationality",
    "type": "select",
    "label": "Nationality",
    "section": "Personal Details",
    "required": true,
    "optionsMaster": "nationality"
  },
  {
    "name": "countryOfBirth",
    "type": "text",
    "label": "Country of Birth",
    "section": "Personal Details",
    "maxLength": 80
  },
  {
    "name": "religion",
    "type": "select",
    "label": "Religion",
    "section": "Personal Details",
    "optionsMaster": "religion"
  },
  {
    "name": "education",
    "type": "select",
    "label": "Education Level",
    "section": "Personal Details",
    "required": true,
    "optionsMaster": "education"
  },
  {
    "name": "residenceStatus",
    "type": "select",
    "label": "Residence Status",
    "section": "Personal Details",
    "required": true,
    "optionsMaster": "residenceStatus"
  },
  {
    "name": "mobile",
    "type": "tel",
    "label": "Mobile Number",
    "section": "Personal Details",
    "required": true,
    "maxLength": 10,
    "pattern": "^[0-9]{10}$",
    "placeholder": "07XXXXXXXX"
  },
  {
    "name": "email",
    "type": "email",
    "label": "Email",
    "section": "Personal Details",
    "required": true,
    "maxLength": 120
  },
  {
    "name": "currentAddressLine1",
    "type": "text",
    "label": "Address Line 1",
    "section": "Current Address",
    "required": true,
    "maxLength": 120
  },
  {
    "name": "currentAddressLine2",
    "type": "text",
    "label": "Address Line 2",
    "section": "Current Address",
    "maxLength": 120
  },
  {
    "name": "currentCity",
    "type": "text",
    "label": "City",
    "section": "Current Address",
    "required": true,
    "maxLength": 80
  },
  {
    "name": "currentDistrict",
    "type": "text",
    "label": "District",
    "section": "Current Address",
    "required": true,
    "maxLength": 80,
    "placeholder": "Select district"
  },
  {
    "name": "currentProvince",
    "type": "select",
    "label": "State",
    "section": "Current Address",
    "required": true,
    "optionsMaster": "state"
  },
  {
    "name": "currentPostalCode",
    "type": "text",
    "label": "Postal Code",
    "section": "Current Address",
    "required": true,
    "maxLength": 10,
    "pattern": "^[0-9]{4,10}$"
  },
  {
    "name": "currentCountry",
    "type": "text",
    "label": "Country",
    "section": "Current Address",
    "required": true,
    "maxLength": 60
  },
  {
    "name": "sameAsCurrent",
    "type": "checkbox",
    "label": "Permanent address same as current address",
    "section": "Permanent Address"
  },
  {
    "name": "permanentAddressLine1",
    "type": "text",
    "label": "Address Line 1",
    "section": "Permanent Address",
    "required": true,
    "maxLength": 120
  },
  {
    "name": "permanentAddressLine2",
    "type": "text",
    "label": "Address Line 2",
    "section": "Permanent Address",
    "maxLength": 120
  },
  {
    "name": "permanentCity",
    "type": "text",
    "label": "City",
    "section": "Permanent Address",
    "required": true,
    "maxLength": 80
  },
  {
    "name": "permanentDistrict",
    "type": "text",
    "label": "District",
    "section": "Permanent Address",
    "required": true,
    "maxLength": 80,
    "placeholder": "Select district"
  },
  {
    "name": "permanentProvince",
    "type": "select",
    "label": "State",
    "section": "Permanent Address",
    "required": true,
    "optionsMaster": "state"
  },
  {
    "name": "permanentPostalCode",
    "type": "text",
    "label": "Postal Code",
    "section": "Permanent Address",
    "required": true,
    "maxLength": 10,
    "pattern": "^[0-9]{4,10}$"
  },
  {
    "name": "permanentCountry",
    "type": "text",
    "label": "Country",
    "section": "Permanent Address",
    "required": true,
    "maxLength": 60
  },
  {
    "name": "homePhone",
    "type": "tel",
    "label": "Home Phone",
    "section": "Contact & Correspondence",
    "maxLength": 10,
    "pattern": "^[0-9]{10}$",
    "placeholder": "0112345678"
  },
  {
    "name": "officePhone",
    "type": "tel",
    "label": "Office Phone",
    "section": "Contact & Correspondence",
    "maxLength": 10,
    "pattern": "^[0-9]{10}$",
    "placeholder": "0112345678"
  },
  {
    "name": "alternateMobile",
    "type": "tel",
    "label": "Alternate Mobile",
    "section": "Contact & Correspondence",
    "maxLength": 10,
    "pattern": "^[0-9]{10}$",
    "placeholder": "07XXXXXXXX"
  },
  {
    "name": "officeEmail",
    "type": "email",
    "label": "Office Email",
    "section": "Contact & Correspondence",
    "maxLength": 120
  },
  {
    "name": "personalEmail",
    "type": "email",
    "label": "Personal Email",
    "section": "Contact & Correspondence",
    "maxLength": 120
  },
  {
    "name": "employmentType",
    "type": "select",
    "label": "Employment Type",
    "section": "Employment & Income",
    "required": true,
    "optionsMaster": "employmentType",
    "showIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "employer",
    "type": "text",
    "label": "Employer Name",
    "section": "Employment & Income",
    "required": true,
    "maxLength": 120,
    "placeholder": "Search employer",
    "showIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "employerCategory",
    "type": "select",
    "label": "Employer Category",
    "section": "Employment & Income",
    "optionsMaster": "employerCategory",
    "showIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "industry",
    "type": "select",
    "label": "Industry / Sector",
    "section": "Employment & Income",
    "optionsMaster": "industry",
    "showIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "designation",
    "type": "text",
    "label": "Designation",
    "section": "Employment & Income",
    "required": true,
    "maxLength": 120,
    "showIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "department",
    "type": "text",
    "label": "Department",
    "section": "Employment & Income",
    "maxLength": 80,
    "showIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "employeeId",
    "type": "text",
    "label": "Employee ID / Number",
    "section": "Employment & Income",
    "maxLength": 40,
    "showIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "employmentStatus",
    "type": "select",
    "label": "Employment Status",
    "section": "Employment & Income",
    "required": true,
    "options": [
      "Permanent",
      "Contract",
      "Probation",
      "Temporary"
    ],
    "showIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "dateOfJoining",
    "type": "date",
    "label": "Date of Joining",
    "section": "Employment & Income",
    "required": true,
    "showIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "lengthOfServiceYears",
    "type": "number",
    "label": "Length of Service (Years)",
    "section": "Employment & Income",
    "required": true,
    "min": 0,
    "max": 60,
    "showIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "lengthOfServiceMonths",
    "type": "number",
    "label": "Length of Service (Months)",
    "section": "Employment & Income",
    "min": 0,
    "max": 11,
    "showIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "incIncludeBasic",
    "type": "checkbox",
    "label": "Basic Salary",
    "section": "Income Details",
    "showIf": {
      "field": "customerType",
      "equals": "Salaried"
    },
    "help": "Tick to include Basic Salary"
  },
  {
    "name": "incIncludeAllowance",
    "type": "checkbox",
    "label": "Fixed Allowance",
    "section": "Income Details",
    "showIf": {
      "field": "customerType",
      "equals": "Salaried"
    },
    "help": "Tick to include Fixed Allowance"
  },
  {
    "name": "incIncludeBonus",
    "type": "checkbox",
    "label": "Bonus",
    "section": "Income Details",
    "showIf": {
      "field": "customerType",
      "equals": "Salaried"
    },
    "help": "Tick to include Bonus"
  },
  {
    "name": "incIncludeVariable",
    "type": "checkbox",
    "label": "Variable",
    "section": "Income Details",
    "showIf": {
      "field": "customerType",
      "equals": "Salaried"
    },
    "help": "Tick to include Variable Income / Commissions"
  },
  {
    "name": "incIncludeIncentive",
    "type": "checkbox",
    "label": "Incentive",
    "section": "Income Details",
    "showIf": {
      "field": "customerType",
      "equals": "Salaried"
    },
    "help": "Tick to include Incentives"
  },
  {
    "name": "basicSalary",
    "type": "number",
    "label": "Basic Salary (₹)",
    "section": "Income Details",
    "required": true,
    "min": 0,
    "max": 5000000,
    "showIf": {
      "field": "incIncludeBasic",
      "equals": true
    },
    "alsoShowIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "basicSalaryConsideration",
    "type": "number",
    "label": "Basic Salary Consideration (%)",
    "section": "Income Details",
    "min": 0,
    "max": 100,
    "showIf": {
      "field": "incIncludeBasic",
      "equals": true
    },
    "alsoShowIf": {
      "field": "customerType",
      "equals": "Salaried"
    },
    "help": "% of basic salary considered for income calculation"
  },
  {
    "name": "allowances",
    "type": "number",
    "label": "Fixed Allowances (₹)",
    "section": "Income Details",
    "min": 0,
    "max": 5000000,
    "showIf": {
      "field": "incIncludeAllowance",
      "equals": true
    },
    "alsoShowIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "fixedAllowanceConsideration",
    "type": "number",
    "label": "Fixed Allowance Consideration (%)",
    "section": "Income Details",
    "min": 0,
    "max": 100,
    "showIf": {
      "field": "incIncludeAllowance",
      "equals": true
    },
    "alsoShowIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "bonusAmount",
    "type": "number",
    "label": "Bonus (Monthly Average, ₹)",
    "section": "Income Details",
    "min": 0,
    "max": 5000000,
    "showIf": {
      "field": "incIncludeBonus",
      "equals": true
    },
    "alsoShowIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "bonusConsideration",
    "type": "number",
    "label": "Bonus Consideration (%)",
    "section": "Income Details",
    "min": 0,
    "max": 100,
    "showIf": {
      "field": "incIncludeBonus",
      "equals": true
    },
    "alsoShowIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "variableIncome",
    "type": "number",
    "label": "Variable Income / Commissions (₹)",
    "section": "Income Details",
    "min": 0,
    "max": 5000000,
    "showIf": {
      "field": "incIncludeVariable",
      "equals": true
    },
    "alsoShowIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "variableConsideration",
    "type": "number",
    "label": "Variable Consideration (%)",
    "section": "Income Details",
    "min": 0,
    "max": 100,
    "showIf": {
      "field": "incIncludeVariable",
      "equals": true
    },
    "alsoShowIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "incentiveAmount",
    "type": "number",
    "label": "Incentives (₹)",
    "section": "Income Details",
    "min": 0,
    "max": 5000000,
    "showIf": {
      "field": "incIncludeIncentive",
      "equals": true
    },
    "alsoShowIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "incentiveConsideration",
    "type": "number",
    "label": "Incentive Consideration (%)",
    "section": "Income Details",
    "min": 0,
    "max": 100,
    "showIf": {
      "field": "incIncludeIncentive",
      "equals": true
    },
    "alsoShowIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "otherIncome",
    "type": "number",
    "label": "Other Income (₹)",
    "section": "Income Details",
    "min": 0,
    "max": 5000000,
    "showIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "grossMonthlyIncome",
    "type": "number",
    "label": "Gross Monthly Income (₹)",
    "section": "Income Details",
    "required": true,
    "min": 0,
    "max": 5000000,
    "disabled": true,
    "showIf": {
      "field": "customerType",
      "equals": "Salaried"
    },
    "help": "Auto-calculated: Basic + Fixed Allowances + Bonus + Variable + Incentive + Other Income"
  },
  {
    "name": "netMonthlyIncome",
    "type": "number",
    "label": "Net Monthly Income (₹)",
    "section": "Income Details",
    "required": true,
    "min": 0,
    "max": 5000000,
    "disabled": true,
    "showIf": {
      "field": "customerType",
      "equals": "Salaried"
    },
    "help": "Auto-calculated: Sum of the average income for each selected source + Other Income"
  },
  {
    "name": "finalConsideredIncome",
    "type": "number",
    "label": "Final Considered Income (₹)",
    "section": "Income Details",
    "required": true,
    "min": 0,
    "max": 5000000,
    "disabled": true,
    "showIf": {
      "field": "customerType",
      "equals": "Salaried"
    },
    "help": "Auto-calculated: same as Net Monthly Income"
  },
  {
    "name": "salaryCreditMode",
    "type": "select",
    "label": "Salary Credit Mode",
    "section": "Income Details",
    "required": true,
    "optionsMaster": "creditMode",
    "showIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "salaryBank",
    "type": "text",
    "label": "Salary Credited Bank",
    "section": "Income Details",
    "maxLength": 80,
    "showIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "salaryDate",
    "type": "number",
    "label": "Typical Salary Credit Day",
    "section": "Income Details",
    "min": 1,
    "max": 31,
    "showIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "epfEtfApplicable",
    "type": "checkbox",
    "label": "EPF / ETF Contributions Applicable",
    "section": "Income Details",
    "showIf": {
      "field": "customerType",
      "equals": "Salaried"
    }
  },
  {
    "name": "professionType",
    "type": "select",
    "label": "Profession",
    "section": "Self-Employed Professional",
    "options": [
      "Doctor",
      "Chartered Accountant",
      "Lawyer",
      "Engineer",
      "Architect",
      "Consultant",
      "Dentist",
      "Auditor",
      "Other"
    ],
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Professional (SEP)"
    }
  },
  {
    "name": "professionalBody",
    "type": "text",
    "label": "Professional Body / Institute",
    "section": "Self-Employed Professional",
    "maxLength": 120,
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Professional (SEP)"
    }
  },
  {
    "name": "membershipNumber",
    "type": "text",
    "label": "Membership / Registration Number",
    "section": "Self-Employed Professional",
    "maxLength": 60,
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Professional (SEP)"
    }
  },
  {
    "name": "membershipType",
    "type": "select",
    "label": "Membership Type",
    "section": "Self-Employed Professional",
    "options": [
      "Associate",
      "Fellow",
      "Member",
      "Licentiate",
      "Other"
    ],
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Professional (SEP)"
    }
  },
  {
    "name": "membershipDate",
    "type": "date",
    "label": "Date of Membership",
    "section": "Self-Employed Professional",
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Professional (SEP)"
    }
  },
  {
    "name": "yearsInPractice",
    "type": "number",
    "label": "Years in Practice",
    "section": "Self-Employed Professional",
    "min": 0,
    "max": 60,
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Professional (SEP)"
    }
  },
  {
    "name": "practiceName",
    "type": "text",
    "label": "Practice / Firm Name",
    "section": "Self-Employed Professional",
    "maxLength": 120,
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Professional (SEP)"
    }
  },
  {
    "name": "practiceAddress",
    "type": "textarea",
    "label": "Practice Address",
    "section": "Self-Employed Professional",
    "maxLength": 300,
    "fullWidth": true,
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Professional (SEP)"
    }
  },
  {
    "name": "professionalAvgMonthlyIncome",
    "type": "number",
    "label": "Average Monthly Professional Income (₹)",
    "section": "Self-Employed Professional",
    "min": 0,
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Professional (SEP)"
    }
  },
  {
    "name": "professionalAnnualIncome",
    "type": "number",
    "label": "Annual Professional Income (₹)",
    "section": "Self-Employed Professional",
    "min": 0,
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Professional (SEP)"
    }
  },
  {
    "name": "professionalIncomeProof",
    "type": "select",
    "label": "Income Proof Type",
    "section": "Self-Employed Professional",
    "optionsMaster": "document",
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Professional (SEP)"
    }
  },
  {
    "name": "businessName",
    "type": "text",
    "label": "Business / Trade Name",
    "section": "Self-Employed Business",
    "maxLength": 120,
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Non-Professional (SENP)"
    }
  },
  {
    "name": "businessNature",
    "type": "select",
    "label": "Nature of Business",
    "section": "Self-Employed Business",
    "options": [
      "Trading",
      "Manufacturing",
      "Service",
      "Retail",
      "Wholesale",
      "Import/Export",
      "Construction",
      "Agriculture",
      "Hospitality",
      "Transportation",
      "Other"
    ],
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Non-Professional (SENP)"
    }
  },
  {
    "name": "businessConstitution",
    "type": "select",
    "label": "Business Constitution",
    "section": "Self-Employed Business",
    "options": [
      "Sole Proprietorship",
      "Partnership",
      "Private Limited",
      "Public Limited",
      "LLP",
      "Other"
    ],
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Non-Professional (SENP)"
    }
  },
  {
    "name": "businessRegistrationNumber",
    "type": "text",
    "label": "Business Registration Number",
    "section": "Self-Employed Business",
    "maxLength": 40,
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Non-Professional (SENP)"
    }
  },
  {
    "name": "businessRegistrationDate",
    "type": "date",
    "label": "Date of Registration",
    "section": "Self-Employed Business",
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Non-Professional (SENP)"
    }
  },
  {
    "name": "yearsInBusiness",
    "type": "number",
    "label": "Years in Business",
    "section": "Self-Employed Business",
    "min": 0,
    "max": 100,
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Non-Professional (SENP)"
    }
  },
  {
    "name": "ownershipPercentage",
    "type": "number",
    "label": "Ownership / Stake (%)",
    "section": "Self-Employed Business",
    "min": 0,
    "max": 100,
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Non-Professional (SENP)"
    }
  },
  {
    "name": "vatRegistered",
    "type": "checkbox",
    "label": "VAT Registered",
    "section": "Self-Employed Business",
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Non-Professional (SENP)"
    }
  },
  {
    "name": "vatNumber",
    "type": "text",
    "label": "VAT Registration Number",
    "section": "Self-Employed Business",
    "maxLength": 40,
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Non-Professional (SENP)"
    }
  },
  {
    "name": "numberOfEmployees",
    "type": "number",
    "label": "No. of Employees",
    "section": "Self-Employed Business",
    "min": 0,
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Non-Professional (SENP)"
    }
  },
  {
    "name": "businessAddressLine1",
    "type": "text",
    "label": "Business Address Line 1",
    "section": "Self-Employed Business",
    "maxLength": 120,
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Non-Professional (SENP)"
    }
  },
  {
    "name": "businessAddressLine2",
    "type": "text",
    "label": "Business Address Line 2",
    "section": "Self-Employed Business",
    "maxLength": 120,
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Non-Professional (SENP)"
    }
  },
  {
    "name": "businessCity",
    "type": "text",
    "label": "Business City",
    "section": "Self-Employed Business",
    "maxLength": 80,
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Non-Professional (SENP)"
    }
  },
  {
    "name": "businessPhone",
    "type": "tel",
    "label": "Business Phone",
    "section": "Self-Employed Business",
    "maxLength": 15,
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Non-Professional (SENP)"
    }
  },
  {
    "name": "annualTurnover",
    "type": "number",
    "label": "Annual Turnover (₹)",
    "section": "Self-Employed Business",
    "min": 0,
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Non-Professional (SENP)"
    }
  },
  {
    "name": "monthlyBusinessIncome",
    "type": "number",
    "label": "Monthly Business Income / Gross Revenue (₹)",
    "section": "Self-Employed Business",
    "min": 0,
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Non-Professional (SENP)"
    }
  },
  {
    "name": "monthlyBusinessExpenses",
    "type": "number",
    "label": "Monthly Business Expenses (₹)",
    "section": "Self-Employed Business",
    "min": 0,
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Non-Professional (SENP)"
    }
  },
  {
    "name": "monthlyNetBusinessProfit",
    "type": "number",
    "label": "Monthly Net Profit (₹)",
    "section": "Self-Employed Business",
    "min": 0,
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Non-Professional (SENP)"
    }
  },
  {
    "name": "annualNetProfit",
    "type": "number",
    "label": "Annual Net Profit (₹)",
    "section": "Self-Employed Business",
    "min": 0,
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Non-Professional (SENP)"
    }
  },
  {
    "name": "businessIncomeProof",
    "type": "select",
    "label": "Business Income Proof",
    "section": "Self-Employed Business",
    "optionsMaster": "document",
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Non-Professional (SENP)"
    }
  },
  {
    "name": "businessBanker",
    "type": "text",
    "label": "Primary Business Banker",
    "section": "Self-Employed Business",
    "maxLength": 80,
    "showIf": {
      "field": "customerType",
      "equals": "Self Employed Non-Professional (SENP)"
    }
  },
  {
    "name": "pensionerType",
    "type": "select",
    "label": "Pensioner Type",
    "section": "Pensioner Income",
    "options": [
      "Government Pensioner",
      "Semi-Government Pensioner",
      "Private Sector Pensioner",
      "Armed Forces",
      "EPF / Provident Fund",
      "Widow / Family Pension",
      "Other"
    ],
    "showIf": {
      "field": "customerType",
      "equals": "Pensioner"
    }
  },
  {
    "name": "pensionPayingAuthority",
    "type": "text",
    "label": "Pension Paying Authority",
    "section": "Pensioner Income",
    "maxLength": 120,
    "showIf": {
      "field": "customerType",
      "equals": "Pensioner"
    }
  },
  {
    "name": "previousDesignation",
    "type": "text",
    "label": "Designation Held at Retirement",
    "section": "Pensioner Income",
    "maxLength": 120,
    "showIf": {
      "field": "customerType",
      "equals": "Pensioner"
    }
  },
  {
    "name": "previousServiceLength",
    "type": "number",
    "label": "Length of Service (Years)",
    "section": "Pensioner Income",
    "min": 0,
    "max": 60,
    "showIf": {
      "field": "customerType",
      "equals": "Pensioner"
    }
  },
  {
    "name": "retirementDate",
    "type": "date",
    "label": "Date of Retirement",
    "section": "Pensioner Income",
    "showIf": {
      "field": "customerType",
      "equals": "Pensioner"
    }
  },
  {
    "name": "pensionStartDate",
    "type": "date",
    "label": "Pension Start Date",
    "section": "Pensioner Income",
    "showIf": {
      "field": "customerType",
      "equals": "Pensioner"
    }
  },
  {
    "name": "pensionNumber",
    "type": "text",
    "label": "Pension / PPO Number",
    "section": "Pensioner Income",
    "maxLength": 60,
    "showIf": {
      "field": "customerType",
      "equals": "Pensioner"
    }
  },
  {
    "name": "monthlyPensionAmount",
    "type": "number",
    "label": "Monthly Pension Amount (₹)",
    "section": "Pensioner Income",
    "min": 0,
    "showIf": {
      "field": "customerType",
      "equals": "Pensioner"
    }
  },
  {
    "name": "otherMonthlyBenefits",
    "type": "number",
    "label": "Other Monthly Benefits / Allowances (₹)",
    "section": "Pensioner Income",
    "min": 0,
    "showIf": {
      "field": "customerType",
      "equals": "Pensioner"
    }
  },
  {
    "name": "totalMonthlyPensionIncome",
    "type": "number",
    "label": "Total Monthly Pension Income (₹)",
    "section": "Pensioner Income",
    "min": 0,
    "showIf": {
      "field": "customerType",
      "equals": "Pensioner"
    }
  },
  {
    "name": "pensionCreditMode",
    "type": "select",
    "label": "Pension Credit Mode",
    "section": "Pensioner Income",
    "optionsMaster": "creditMode",
    "showIf": {
      "field": "customerType",
      "equals": "Pensioner"
    }
  },
  {
    "name": "pensionCreditBank",
    "type": "text",
    "label": "Pension Credited Bank",
    "section": "Pensioner Income",
    "maxLength": 80,
    "showIf": {
      "field": "customerType",
      "equals": "Pensioner"
    }
  },
  {
    "name": "pensionAccountNumber",
    "type": "text",
    "label": "Pension Account Number",
    "section": "Pensioner Income",
    "maxLength": 40,
    "showIf": {
      "field": "customerType",
      "equals": "Pensioner"
    }
  },
  {
    "name": "pensionRevisionApplicable",
    "type": "checkbox",
    "label": "Pension Revision / Indexation Applicable",
    "section": "Pensioner Income",
    "showIf": {
      "field": "customerType",
      "equals": "Pensioner"
    }
  },
  {
    "name": "lifeCertificateDate",
    "type": "date",
    "label": "Last Life Certificate Date",
    "section": "Pensioner Income",
    "showIf": {
      "field": "customerType",
      "equals": "Pensioner"
    }
  },
  {
    "name": "bankDetailsAutoPopulated",
    "type": "checkbox",
    "label": "Pre-populated from existing customer (CBS)",
    "section": "Bank Details",
    "help": "System pre-fills bank accounts for duplicate / existing customers to minimise re-entry"
  },
  {
    "name": "borrowerBank1Holder",
    "type": "select",
    "label": "Account Holder",
    "section": "Bank Details",
    "required": true,
    "options": [
      "Borrower"
    ]
  },
  {
    "name": "borrowerBank1Name",
    "type": "select",
    "label": "Bank Name",
    "section": "Bank Details",
    "required": true,
    "optionsMaster": "bank"
  },
  {
    "name": "borrowerBank1Branch",
    "type": "select",
    "label": "Branch",
    "section": "Bank Details",
    "required": true,
    "optionsMaster": "branch",
    "optionsMasterParentField": "borrowerBank1Name",
    "help": "Filtered by selected Bank"
  },
  {
    "name": "borrowerBank1AccountType",
    "type": "select",
    "label": "Account Type",
    "section": "Bank Details",
    "required": true,
    "optionsMaster": "accountType"
  },
  {
    "name": "borrowerBank1AccountNumber",
    "type": "text",
    "label": "Account Number",
    "section": "Bank Details",
    "required": true,
    "maxLength": 30
  },
  {
    "name": "borrowerBank1IsRecovery",
    "type": "checkbox",
    "label": "Mark as Recovery / Disbursement Account",
    "section": "Bank Details",
    "help": "At least one account across borrower/co-borrowers must be marked as Recovery/Disbursement"
  },
  {
    "name": "repaymentMode",
    "type": "select",
    "label": "Repayment Mode",
    "section": "Bank Details",
    "required": true,
    "options": [
      "SI",
      "CEFTS",
      "Cash deposits",
      "Cheque"
    ]
  },
  {
    "name": "perfiosUploaded",
    "type": "checkbox",
    "label": "Perfios bank statement uploaded",
    "section": "Bank Details",
    "help": "Confirm Perfios bank statement analysis was uploaded above"
  },
  {
    "name": "taxPayerTin",
    "type": "text",
    "label": "Tax Identification Number (TIN)",
    "section": "Tax Details",
    "maxLength": 40,
    "help": "Auto-fetched from QDE KYC Grid"
  },
  {
    "name": "taxFileNumber",
    "type": "text",
    "label": "Tax File Number",
    "section": "Tax Details",
    "maxLength": 40
  },
  {
    "name": "taxAssessedBy",
    "type": "text",
    "label": "Assessing Authority",
    "section": "Tax Details",
    "maxLength": 120,
    "placeholder": "e.g. Inland Revenue Department"
  },
  {
    "name": "taxYear1",
    "type": "text",
    "label": "Current Year — Assessment Year",
    "section": "Tax Details",
    "maxLength": 9,
    "placeholder": "e.g. 2025/2026"
  },
  {
    "name": "taxYear1StatutoryIncome",
    "type": "number",
    "label": "Current Year — Statutory Income (₹)",
    "section": "Tax Details",
    "min": 0,
    "max": 5000000
  },
  {
    "name": "taxYear1AssessableIncome",
    "type": "number",
    "label": "Current Year — Assessable Income (₹)",
    "section": "Tax Details",
    "min": 0,
    "max": 5000000
  },
  {
    "name": "taxYear1TaxPaid",
    "type": "number",
    "label": "Current Year — Tax Paid (₹)",
    "section": "Tax Details",
    "min": 0,
    "max": 5000000
  },
  {
    "name": "taxYear2",
    "type": "text",
    "label": "Previous Year — Assessment Year",
    "section": "Tax Details",
    "maxLength": 9,
    "placeholder": "e.g. 2024/2025"
  },
  {
    "name": "taxYear2StatutoryIncome",
    "type": "number",
    "label": "Previous Year — Statutory Income (₹)",
    "section": "Tax Details",
    "min": 0,
    "max": 5000000
  },
  {
    "name": "taxYear2AssessableIncome",
    "type": "number",
    "label": "Previous Year — Assessable Income (₹)",
    "section": "Tax Details",
    "min": 0,
    "max": 5000000
  },
  {
    "name": "taxYear2TaxPaid",
    "type": "number",
    "label": "Previous Year — Tax Paid (₹)",
    "section": "Tax Details",
    "min": 0,
    "max": 5000000
  },
  {
    "name": "taxYear3",
    "type": "text",
    "label": "Previous to Previous Year — Assessment Year",
    "section": "Tax Details",
    "maxLength": 9,
    "placeholder": "e.g. 2023/2024"
  },
  {
    "name": "taxYear3StatutoryIncome",
    "type": "number",
    "label": "Previous to Previous Year — Statutory Income (₹)",
    "section": "Tax Details",
    "min": 0,
    "max": 5000000
  },
  {
    "name": "taxYear3AssessableIncome",
    "type": "number",
    "label": "Previous to Previous Year — Assessable Income (₹)",
    "section": "Tax Details",
    "min": 0,
    "max": 5000000
  },
  {
    "name": "taxYear3TaxPaid",
    "type": "number",
    "label": "Previous to Previous Year — Tax Paid (₹)",
    "section": "Tax Details",
    "min": 0,
    "max": 5000000
  },
  {
    "name": "taxReturnsFiledOnTime",
    "type": "checkbox",
    "label": "All Tax Returns Filed On Time",
    "section": "Tax Details"
  },
  {
    "name": "taxDuesOutstanding",
    "type": "checkbox",
    "label": "Any Outstanding Tax Dues",
    "section": "Tax Details"
  },
  {
    "name": "taxOutstandingAmount",
    "type": "number",
    "label": "Outstanding Tax Amount (₹)",
    "section": "Tax Details",
    "min": 0,
    "max": 5000000
  },
  {
    "name": "loanPurposePrimary",
    "type": "select",
    "label": "Primary Loan Purpose",
    "section": "Loan Details",
    "required": true,
    "optionsMaster": "loanPurpose",
    "help": "Select from the configured purpose list for the portfolio"
  },
  {
    "name": "loanPurposeOther",
    "type": "text",
    "label": "Other Loan Purpose (specify)",
    "section": "Loan Details",
    "maxLength": 120,
    "showIf": {
      "field": "loanPurposePrimary",
      "equals": "Others"
    }
  },
  {
    "name": "loanAmount",
    "type": "number",
    "label": "Requested Amount (₹)",
    "section": "Loan Details",
    "required": true,
    "min": 50000,
    "max": 5000000,
    "help": "Maximum ₹5,000,000 (50 Lakhs). Review and edit to align with customer requirements."
  },
  {
    "name": "tenureMonths",
    "type": "number",
    "label": "Tenor (months)",
    "section": "Loan Details",
    "required": true,
    "maxLength": 3,
    "min": 10,
    "max": 360,
    "help": "Enter 10 to 360 months."
  },
  {
    "name": "repaymentFrequency",
    "type": "select",
    "label": "Repayment Frequency",
    "section": "Loan Details",
    "required": true,
    "options": [
      "Monthly",
      "Bi-Monthly",
      "Quarterly",
      "Semi-Annually",
      "Annually",
      "Bullet"
    ]
  },
  {
    "name": "installmentDueDay",
    "type": "number",
    "label": "Preferred Installment Due Day (1-28)",
    "section": "Loan Details",
    "min": 1,
    "max": 28
  },
  {
    "name": "masterInterestRate",
    "type": "number",
    "label": "Master Applicable Interest Rate (% p.a.)",
    "section": "Loan Details",
    "min": 0,
    "max": 100,
    "help": "System-displayed master rate for the product (reference)"
  },
  {
    "name": "effectiveInterestRate",
    "type": "number",
    "label": "Effective Interest Rate (% p.a.)",
    "section": "Loan Details",
    "min": 0,
    "max": 100,
    "help": "Final rate applied after concessions/premiums"
  },
  {
    "name": "rateType",
    "type": "select",
    "label": "Rate Type",
    "section": "Loan Details",
    "options": [
      "Fixed",
      "Floating"
    ]
  },
  {
    "name": "rateConcession",
    "type": "number",
    "label": "Concession / Premium (%)",
    "section": "Loan Details",
    "min": -10,
    "max": 10
  },
  {
    "name": "gracePeriodEnabled",
    "type": "checkbox",
    "label": "Apply Grace Period (Skip Payments)",
    "section": "Loan Details"
  },
  {
    "name": "gracePeriodMonths",
    "type": "number",
    "label": "Grace Period (months)",
    "section": "Loan Details",
    "min": 0,
    "max": 24,
    "showIf": {
      "field": "gracePeriodEnabled",
      "equals": [
        true
      ]
    }
  },
  {
    "name": "gracePeriodType",
    "type": "select",
    "label": "Grace Period Type",
    "section": "Loan Details",
    "options": [
      "Principal Only",
      "Interest Only",
      "Full Moratorium"
    ],
    "showIf": {
      "field": "gracePeriodEnabled",
      "equals": [
        true
      ]
    }
  },
  {
    "name": "repaymentScheduleType",
    "type": "select",
    "label": "Repayment Schedule Type",
    "section": "Loan Details",
    "required": true,
    "options": [
      "Linear (Equal Installments)",
      "Step-Up",
      "Step-Down",
      "Balloon",
      "Custom"
    ]
  },
  {
    "name": "stepFrequencyMonths",
    "type": "number",
    "label": "Step Frequency (months)",
    "section": "Loan Details",
    "min": 1,
    "max": 60,
    "showIf": {
      "field": "repaymentScheduleType",
      "equals": [
        "Step-Up",
        "Step-Down"
      ]
    }
  },
  {
    "name": "stepPercentage",
    "type": "number",
    "label": "Step % per Period",
    "section": "Loan Details",
    "min": 0,
    "max": 100,
    "showIf": {
      "field": "repaymentScheduleType",
      "equals": [
        "Step-Up",
        "Step-Down"
      ]
    }
  }
];
