import { useState } from "react";
import { ALIGNMENT, HDropdown, HTextField, HBox, HLabel } from "@helix/component-library";
import SectionBlock from "../components/SectionBlock";
import { LOAN_TYPES, PRODUCTS, SCHEMES } from "../constants/qdeOptions";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

const LoanDetailsSection = ({ form, setField, errors = {} }) => {
  const err = (name) => errors[name];
  const [showSimulator, setShowSimulator] = useState(false);

  const [simulator, setSimulator] = useState({
    amount: form.loanAmount || "",
    rate: form.rate || "",
    months: form.tenure || "",
  });

  const handleSimulatorChange = (field, value) => {
    setSimulator((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateEmi = () => {
    const amount = Number(simulator.amount);
    const rate = Number(simulator.rate);
    const months = Number(simulator.months);

    if (!amount || !months) return 0;

    if (!rate) {
      return amount / months;
    }

    const monthlyRate = rate / 12 / 100;

    return (
      (amount *
        monthlyRate *
        Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
    );
  };

  const emi = calculateEmi();
  const totalPayable = emi * Number(simulator.months || 0);
  const totalInterest =
    totalPayable - Number(simulator.amount || 0);

  const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });

  const handleApplySimulator = () => {
    setField("loanAmount", simulator.amount);
    setField("rate", simulator.rate);
    setField("tenure", simulator.months);
    setShowSimulator(false);
  };

  const handleDownload = () => {
    const data = [
      ["Loan Amount", simulator.amount || ""],
      ["Interest Rate", simulator.rate || ""],
      ["Tenure", simulator.months || ""],
      ["EMI", emi ? emi.toFixed(2) : ""],
      ["Total Interest", totalInterest ? totalInterest.toFixed(2) : ""],
      ["Total Payable", totalPayable ? totalPayable.toFixed(2) : ""],
    ];

    const csv = data.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "loan-details.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <SectionBlock sectionKey="loan" titleKey="label.qde.section.loan" subTitleKey="label.qde.section.loan.subtitle" icon={<ReceiptLongOutlinedIcon fontSize="small" />}>
      <HBox sx={{ width: "100%", display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 2 }} >
        {/* Loan Type */}
        <HBox
          sx={{ width: {
              xs: "100%",
              sm: "calc(50% - 8px)",
              md: "calc(33.333% - 10.67px)",
            }, flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0
          }}>
          <HLabel
            value="label.qde.field.loanType"
            required
            align="left"
            colon={false}
          />

          <HDropdown
            name="loanType"
            options={LOAN_TYPES}
            value={form.loanType}
            onChange={(e) => setField("loanType", e.target.value)}
            required
            error={Boolean(err("loanType"))}
            width="100%"
          />
        </HBox>

        {/* Product */}
        <HBox
          sx={{ width: {
              xs: "100%",
              sm: "calc(50% - 8px)",
              md: "calc(33.333% - 10.67px)",
            }, flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0
          }}>
          <HLabel
            value="label.qde.field.product"
            required
            align="left"
            colon={false}
          />

          <HDropdown
            name="product"
            options={PRODUCTS}
            value={form.product}
            onChange={(e) => setField("product", e.target.value)}
            required
            error={Boolean(err("product"))}
            width="100%"
          />
        </HBox>

        {/* Scheme */}
        <HBox
          sx={{
            width: {
              xs: "100%",
              sm: "calc(50% - 8px)",
              md: "calc(33.333% - 10.67px)",
            },flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0
          }}>
          <HLabel
            value="label.qde.field.scheme"
            align="left"
            colon={false}
            required
          />

          <HDropdown
            name="scheme"
            options={SCHEMES}
            value={form.scheme}
            onChange={(e) => setField("scheme", e.target.value)}
            width="100%"
            required
            placeholder="Select scheme"
          />
          <HLabel value="label.qde.field.schemeSubtitle" align="left" colon={false} />
        </HBox>

        {/* Loan Amount */}
        <HBox
          sx={{
            width: {
              xs: "100%",
              sm: "calc(50% - 8px)",
              md: "calc(33.333% - 10.67px)",
            },flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0
          }}>
          <HLabel
            value="label.qde.field.loanAmount"
            required
            align="left"
            colon={false}
          />

          <HTextField
            value={form.loanAmount}
            onChange={(e) => {
              setField("loanAmount", e.target.value);
              handleSimulatorChange("amount", e.target.value);
            }}
            editable
            required
            type="currency"
            align={ALIGNMENT.NUMBER}
            error={Boolean(err("loanAmount"))}
            width="100%"
          />
        </HBox>

        {/* Tenure */}
        <HBox
          sx={{
            width: {
              xs: "100%",
              sm: "calc(50% - 8px)",
              md: "calc(33.333% - 10.67px)",
            },flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, position: "relative"
          }}>
          <HLabel
            value="label.qde.field.tenure"
            required
            align="left"
            colon={false}
          />

          <HTextField
            value={form.tenure}
            onChange={(e) => {
              setField("tenure", e.target.value);
              handleSimulatorChange("months", e.target.value);
            }}
            editable
            required
            type="number"
            length={3}
            align={ALIGNMENT.NUMBER}
            error={Boolean(err("tenure"))}
            width="100%"
          />
          <HLabel value="label.qde.field.tenureSubtitle" align="left" colon={false} sx={{mt: 1}} />
        </HBox>

        {/* Interest Rate */}
        <HBox
          sx={{ width: {
              xs: "100%",
              sm: "calc(50% - 8px)",
              md: "calc(33.333% - 10.67px)",
            }, flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, position: "relative",
          }}>
          <HLabel
            value="label.qde.field.rate"
            align="left"
            colon={false}
          />

          <HBox sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1 }} >
            <HTextField
              value={form.rate}
              onChange={(e) => {
                setField("rate", e.target.value);
                handleSimulatorChange("rate", e.target.value);
              }}
              editable
              type="number"
              length={5}
              align={ALIGNMENT.NUMBER}
              width="80%"
            />

            {/* Download */}
            <HBox
              sx={{
                width: 36,
                height: 36,
                flexShrink: 0,
                border: "1px solid #ead5df",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={handleDownload}
              title="Download Loan Details"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v12" />
                <path d="m7 10 5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
            </HBox>

            {/* Simulator */}
            <HBox
              sx={{ width: 36, height: 36, flexShrink: 0, position: "relative" }}
              onMouseEnter={() => {
                setSimulator({
                  amount: form.loanAmount || "",
                  rate: form.rate || "",
                  months: form.tenure || "",
                });
                setShowSimulator(true);
              }}
              onMouseLeave={() => setShowSimulator(false)}
            >
              <HBox
                sx={{
                  width: 36,
                  height: 36,
                  border: "1px solid #ead5df",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  // backgroundColor: "#fff",
                }}
                title="Loan Simulator"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <line x1="8" y1="6" x2="16" y2="6" />
                  <line x1="8" y1="10" x2="8" y2="10" />
                  <line x1="12" y1="10" x2="12" y2="10" />
                  <line x1="16" y1="10" x2="16" y2="10" />
                  <line x1="8" y1="14" x2="8" y2="14" />
                  <line x1="12" y1="14" x2="12" y2="14" />
                  <line x1="16" y1="14" x2="16" y2="14" />
                  <line x1="8" y1="18" x2="8" y2="18" />
                  <line x1="12" y1="18" x2="12" y2="18" />
                  <line x1="16" y1="18" x2="16" y2="18" />
                </svg>
              </HBox>

              {showSimulator && (
                <HBox
                  sx={{
                    position: "absolute",
                    top: 42,
                    right: 0,
                    width: 320,
                    // backgroundColor: "#fff",
                    border: "1px solid #ead5df",
                    borderRadius: "8px",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                    padding: 1.5,
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 1000,
                  }}
                  onMouseEnter={() => setShowSimulator(true)}
                  onMouseLeave={() => setShowSimulator(false)}
                >
                  {/* Header */}
                  <HBox
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontWeight: 600,
                      fontSize: "14px",
                      mb: 1,
                    }}
                  >
                    <span>▣</span>
                    <span>Loan Simulator</span>
                  </HBox>

                  {/* Simulator Inputs */}
                  <HBox
                    sx={{
                      display: "flex",
                      gap: 1,
                      width: "100%",
                    }}
                  >
                    <HBox
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}
                    >
                      <HLabel
                        value="Amount (₹)"
                        align="left"
                        colon={false}
                      />

                      <HTextField
                        value={simulator.amount}
                        onChange={(e) =>
                          handleSimulatorChange(
                            "amount",
                            e.target.value
                          )
                        }
                        editable
                        type="number"
                        align={ALIGNMENT.NUMBER}
                        width="100%"
                      />
                    </HBox>

                    <HBox
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}
                    >
                      <HLabel
                        value="Rate %"
                        align="left"
                        colon={false}
                      />

                      <HTextField
                        value={simulator.rate}
                        onChange={(e) =>
                          handleSimulatorChange(
                            "rate",
                            e.target.value
                          )
                        }
                        editable
                        type="number"
                        align={ALIGNMENT.NUMBER}
                        width="100%"
                      />
                    </HBox>

                    <HBox
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}
                    >
                      <HLabel
                        value="Months"
                        align="left"
                        colon={false}
                      />

                      <HTextField
                        value={simulator.months}
                        onChange={(e) =>
                          handleSimulatorChange(
                            "months",
                            e.target.value
                          )
                        }
                        editable
                        type="number"
                        align={ALIGNMENT.NUMBER}
                        width="100%"
                      />
                    </HBox>
                  </HBox>

                  {/* Result */}
                  <HBox
                    sx={{
                      backgroundColor: "#faf5f8",
                      borderRadius: "6px",
                      padding: 1,
                      mt: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                      fontSize: "12px",
                    }}
                  >
                    <HBox
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>EMI</span>
                      <strong>
                        ₹{formatAmount(emi)}/mo
                      </strong>
                    </HBox>

                    <HBox
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Total Interest</span>
                      <span>
                        ₹{formatAmount(totalInterest)}
                      </span>
                    </HBox>

                    <HBox
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Total Payable</span>
                      <span>
                        ₹{formatAmount(totalPayable)}
                      </span>
                    </HBox>
                  </HBox>

                  {/* Apply */}
                  <HBox
                    sx={{
                      width: "100%",
                      height: 36,
                      mt: 1,
                      borderRadius: "6px",
                      // backgroundColor: "#397add",
                      // color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    onClick={handleApplySimulator}
                  >
                    Apply to Loan Details
                  </HBox>
                </HBox>
              )}
            </HBox>
          </HBox>
          <HLabel value="label.qde.field.intSubtitle" align="left" colon={false} />
        </HBox>
      </HBox>
    </SectionBlock>
  );
};

export default LoanDetailsSection;


// import { ALIGNMENT, HDropdown, HTextField, HBox, HLabel } from "@helix/component-library";
// import SectionBlock from "../components/SectionBlock";
// import { LOAN_TYPES, PRODUCTS, SCHEMES } from "../constants/qdeOptions";

// const LoanDetailsSection = ({ form, setField, errors = {} }) => {
//   const err = (name) => errors[name];

//   return (
//     <SectionBlock sectionKey="loan" titleKey="label.qde.section.loan" >
//       <HBox
//         sx={{ width: "100%", display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb:2 }} >
//         {/* Loan Type */}
//         <HBox
//           sx={{
//             width: {
//               xs: "100%",
//               sm: "calc(50% - 8px)",
//               md: "calc(33.333% - 10.67px)",
//             }, flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }} >
//           <HLabel
//             value="label.qde.field.loanType"
//             required
//             align="left"
//             colon={false}
//           />

//           <HDropdown
//             name="loanType"
//             options={LOAN_TYPES}
//             value={form.loanType}
//             onChange={(e) => setField("loanType", e.target.value)}
//             required
//             error={Boolean(err("loanType"))}
//             width="100%"
//           />
//         </HBox>

//         {/* Product */}
//         <HBox
//           sx={{
//             width: {
//               xs: "100%",
//               sm: "calc(50% - 8px)",
//               md: "calc(33.333% - 10.67px)",
//             }, flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }} >
//           <HLabel
//             value="label.qde.field.product"
//             required
//             align="left"
//             colon={false}
//           />

//           <HDropdown
//             name="product"
//             options={PRODUCTS}
//             value={form.product}
//             onChange={(e) => setField("product", e.target.value)}
//             required
//             error={Boolean(err("product"))}
//             width="100%"
//           />
//         </HBox>

//         {/* Scheme */}
//         <HBox
//           sx={{
//             width: {
//               xs: "100%",
//               sm: "calc(50% - 8px)",
//               md: "calc(33.333% - 10.67px)",
//             }, flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }} >
//           <HLabel
//             value="label.qde.field.scheme"
//             align="left"
//             colon={false}
//             required
//           />

//           <HDropdown
//             name="scheme"
//             options={SCHEMES}
//             value={form.scheme}
//             onChange={(e) => setField("scheme", e.target.value)}
//             width="100%"
//             required
//           />
//         </HBox>

//         {/* Loan Amount */}
//         <HBox
//           sx={{
//             width: {
//               xs: "100%",
//               sm: "calc(50% - 8px)",
//               md: "calc(33.333% - 10.67px)",
//             }, flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }} >
//           <HLabel
//             value="label.qde.field.loanAmount"
//             required
//             align="left"
//             colon={false}
//           />

//           <HTextField
//             value={form.loanAmount}
//             onChange={(e) => setField("loanAmount", e.target.value)}
//             editable
//             required
//             type="currency"
//             align={ALIGNMENT.NUMBER}
//             error={Boolean(err("loanAmount"))}
//             width="100%"
//           />
//         </HBox>

//         {/* Tenure */}
//         <HBox
//           sx={{
//             width: {
//               xs: "100%",
//               sm: "calc(50% - 8px)",
//               md: "calc(33.333% - 10.67px)",
//             }, flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }}>
//           <HLabel
//             value="label.qde.field.tenure"
//             required
//             align="left"
//             colon={false}
//           />

//           <HTextField
//             value={form.tenure}
//             onChange={(e) => setField("tenure", e.target.value)}
//             editable
//             required
//             type="number"
//             length={3}
//             align={ALIGNMENT.NUMBER}
//             error={Boolean(err("tenure"))}
//             width="100%"
//           />
//         </HBox>

//         {/* Rate */}
//         <HBox
//           sx={{
//             width: {
//               xs: "100%",
//               sm: "calc(50% - 8px)",
//               md: "calc(33.333% - 10.67px)",
//             }, flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }} >
//           <HLabel
//             value="label.qde.field.rate"
//             align="left"
//             colon={false}
//           />

//           <HTextField
//             value={form.rate}
//             onChange={(e) => setField("rate", e.target.value)}
//             editable
//             type="number"
//             length={5}
//             align={ALIGNMENT.NUMBER}
//             width="80%"
//           />
//         </HBox>
//       </HBox>
//     </SectionBlock>
//   );
// };

// export default LoanDetailsSection;