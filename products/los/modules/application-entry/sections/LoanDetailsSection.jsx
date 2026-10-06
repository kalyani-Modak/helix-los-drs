import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ALIGNMENT, HDropdown, HTextField, HBox, HLabel, useDrsTheme, useToast } from "@helix/component-library";
import SectionBlock from "../components/SectionBlock";
import FieldError from "../components/FieldError";
import { DEFAULT_LOAN_TYPE, PRODUCTS, SCHEMES } from "../constants/qdeOptions";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

const LoanDetailsSection = ({ form, setField, errors = {}, productOptions = PRODUCTS, schemeOptions = SCHEMES }) => {
  const err = (name) => errors[name];
  const toast = useToast();
  const { colors, text, border, action } = useDrsTheme();
  const [showSimulator, setShowSimulator] = useState(false);
  const [rateFetched, setRateFetched] = useState(false);

  const [simulator, setSimulator] = useState({
    amount: form.loanAmount || "",
    rate: form.rate || "",
    months: form.tenure || "",
  });

  const simulatorAnchorRef = useRef(null);
  const closeTimerRef = useRef(null);
  const [simulatorPosition, setSimulatorPosition] = useState({
    top: 0,
    left: 0,
  });

  const handleSimulatorChange = (field, value) => {
    setSimulator((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateSimulatorPosition = () => {
  if (!simulatorAnchorRef.current) return;

  const rect = simulatorAnchorRef.current.getBoundingClientRect();
  const width = 320;
  const gap = 6;

  setSimulatorPosition({
    top: rect.bottom + gap,
    left: Math.max(
      8,
      Math.min(
        rect.right - width,
        window.innerWidth - width - 8
      )
    ),
  });
};

const openSimulator = () => {
  if (closeTimerRef.current) {
    clearTimeout(closeTimerRef.current);
  }

    setSimulator({
      amount: form.loanAmount || "",
      rate: form.rate || "",
      months: form.tenure || "",
    });

    updateSimulatorPosition();
    setShowSimulator(true);
  };

  const scheduleCloseSimulator = () => {
    closeTimerRef.current = setTimeout(() => {
      setShowSimulator(false);
    }, 150);
  };

  useEffect(() => {
    if (!showSimulator) return undefined;

    updateSimulatorPosition();

    const handleViewportChange = () => updateSimulatorPosition();

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [showSimulator]);

  useEffect(() => () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
  }, []);

  const calculateEmi = (amountValue = simulator.amount, rateValue = simulator.rate, monthsValue = simulator.months) => {
    const amount = Number(amountValue);
    const rate = Number(rateValue);
    const months = Number(monthsValue);

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
  const hasCompleteLoanTerms =
    String(form.loanAmount ?? "").trim() !== "" &&
    String(form.tenure ?? "").trim() !== "" &&
    String(form.rate ?? "").trim() !== "" &&
    Number.isFinite(Number(form.loanAmount)) &&
    Number(form.loanAmount) > 0 &&
    Number.isFinite(Number(form.tenure)) &&
    Number(form.tenure) > 0 &&
    Number.isFinite(Number(form.rate)) &&
    Number(form.rate) >= 0;
  const estimatedEmi = hasCompleteLoanTerms
    ? calculateEmi(form.loanAmount, form.rate, form.tenure)
    : 0;
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
    const fetchedRate = "12.5";

    setField("rate", fetchedRate);
    handleSimulatorChange("rate", fetchedRate);
    setRateFetched(true);
    toast.success("Fetched 12.5% from Pricing Master (Standard · PF 1%).");
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
          <HLabel sx={{color: "text.primary" }}
            value="label.qde.field.loanType"
            required
            align="left"
            colon={false}
          />
          <HTextField
            value={form.loanType || DEFAULT_LOAN_TYPE}
            required
            // align={ALIGNMENT.TEXT}
            error={Boolean(err("loanType"))}
            width="100%"
            disabled
          />
          <FieldError message={err("loanType")} />
        </HBox>

        {/* Product */}
        <HBox
          sx={{ width: {
              xs: "100%",
              sm: "calc(50% - 8px)",
              md: "calc(33.333% - 10.67px)",
            }, flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0
          }}>
          <HLabel sx={{color: "text.primary" }}
            value="label.qde.field.product"
            required
            align="left"
            colon={false}
          />

          <HDropdown
            name="product"
            options={productOptions}
            value={form.product}
            onChange={(e) => setField("product", e.target.value)}
            required
            error={Boolean(err("product"))}
            width="100%"
            placeholder=""
          />
          <FieldError message={err("product")} />
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
          <HLabel sx={{color: "text.primary" }}
            value="label.qde.field.scheme"
            align="left"
            colon={false}
            required
          />

          <HDropdown
            name="scheme"
            options={schemeOptions}
            value={form.scheme}
            onChange={(e) => setField("scheme", e.target.value)}
            width="100%"
            required
            placeholder="Select scheme"
            error={Boolean(err("scheme"))}
          />
          {err("scheme") ? (
            <FieldError message={err("scheme")} />
          ) : (
            <HLabel value="label.qde.field.schemeSubtitle" align="left" colon={false} sx={{ fontSize: "10px"}} />
          )}
        </HBox>

        {/* Loan Amount */}
        <HBox sx={{ width: {
              xs: "100%",
              sm: "calc(50% - 8px)",
              md: "calc(33.333% - 10.67px)",
            },flexShrink: 0, display: "flex", alignItems: "flex-start", flexDirection: "column", gap: 0.5, minWidth: 0
          }}>
          <HLabel sx={{color: "text.primary" }}
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
          <FieldError message={err("loanAmount")} sx={{ mt: 1.5 }}/>
        </HBox>

        {/* Tenure */}
        <HBox sx={{
            width: {
              xs: "100%",
              sm: "calc(50% - 8px)",
              md: "calc(33.333% - 10.67px)",
            },flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, position: "relative"
          }}>
          <HLabel sx={{color: "text.primary" }}
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
          {err("tenure") ? ( <FieldError message={err("tenure")} sx={{ mt: 1.5 }}/>
          ) : (
            <HLabel
              value="label.qde.field.tenureSubtitle"
              align="left"
              colon={false}
              sx={{ mt: 1, fontSize: "10px"}}
            />
          )}
        </HBox>

        {/* Interest Rate */}
        <HBox sx={{
          width: {
            xs: "100%",
            sm: "calc(50% - 8px)",
            md: "calc(33.333% - 10.67px)",
          },
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          minWidth: 0,
        }}>
          <HLabel sx={{color: "text.primary" }}
            value="label.qde.field.rate"
            align="left"
            colon={false}
          />

          <HBox sx={{ width: "100%", display: "flex", alignItems: "flex-start", gap: 1 }} >
            <HTextField
              value={form.rate}
              onChange={(e) => {
                setField("rate", e.target.value);
                handleSimulatorChange("rate", e.target.value);
              }}
              // editable={!rateFetched}
              disable
              type="number"
              length={5}
              align={ALIGNMENT.NUMBER}
              width="100%"
            />

            {/* Download */}
            <HBox
              sx={{
                width: 36,
                height: 28,
                flexShrink: 0,
                border: "1px solid #ead5df",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={handleDownload}
              title="Fetch rate from Pricing Master"
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
              ref={simulatorAnchorRef}
              sx={{
                width: 36,
                height: 28,
                flexShrink: 0,
                position: "relative",
                zIndex: 2,
              }}
              onClick={(event) => {
                event.stopPropagation();

                if (showSimulator) {
                  setShowSimulator(false);
                  return;
                }

                openSimulator();
              }}
              onMouseEnter={openSimulator}
              onMouseLeave={scheduleCloseSimulator}
            >
              <HBox sx={{ width: 36, height: 28, border: "1px solid #ead5df", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backgroundColor: action.hover, color: colors.primary, }}
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

              {showSimulator &&createPortal( (
                <HBox sx={{ position: "fixed", top: simulatorPosition.top, left: simulatorPosition.left, width: 320, backgroundColor: action.hover, border: `1px solid ${border.control}`, borderRadius: "8px", boxShadow: "0 4px 14px rgba(0,0,0,0.15)", padding: 1.5, display: "flex", flexDirection: "column", zIndex: 1000, color: text.primary }}
                  onClick={(event) => event.stopPropagation()}
                  onMouseEnter={() => setShowSimulator(true)}
                  onMouseLeave={() => setShowSimulator(false)}
                >
                  {/* Header */}
                  <HBox sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 600, fontSize: "14px", mb: 1, }}>
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
                    <HBox sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
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

                    <HBox sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
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

                    <HBox sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
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
                      backgroundColor: action.hover,
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
                        {formatAmount(emi)}/mo
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
                        {formatAmount(totalInterest)}
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
                        {formatAmount(totalPayable)}
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
                      backgroundColor: colors.primary,
                      color: "#fff",
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
              ), document.body)}
            </HBox>
          </HBox>
          <HLabel value="label.qde.field.intSubtitle" align="left" colon={false} sx={{ fontSize: "10px"}} />
        </HBox>
        {hasCompleteLoanTerms && (
        <HBox sx={{ width: {
              xs: "100%",
              sm: "calc(50% - 8px)",
              md: "calc(33.333% - 10.67px)",
            },flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, position: "relative"
          }}>
          <HLabel
            value="label.qde.field.EstimatedEmi"
            align="left"
            colon={false}
          />

          <HTextField
            value={`$${formatAmount(estimatedEmi)}/month`}
            type="text"
            length={3}
            align={ALIGNMENT.TEXT}
            error={Boolean(err("tenure"))}
            width="100%"
          />
        </HBox>
      )}
      </HBox>
    </SectionBlock>
  );
};

export default LoanDetailsSection;
