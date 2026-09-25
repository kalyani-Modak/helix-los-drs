import React, { useEffect, useState } from "react";
import { LinearProgress } from "@mui/material";
import { HBox, HLabel } from "@helix/component-library";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";

const INDIVIDUAL_STEPS = [
    {
        key: "application",
        label: "Application",
        sectionId: "qde-application",
        icon: DescriptionOutlinedIcon,
    },
    {
        key: "kyc",
        label: "KYC",
        sectionId: "qde-kyc",
        icon: LockOutlinedIcon,
    },
    {
        key: "applicant",
        label: "Applicant",
        sectionId: "qde-applicant",
        icon: PersonOutlineIcon,
    },
    {
        key: "address",
        label: "Address",
        sectionId: "qde-address",
        icon: HomeOutlinedIcon,
    },
    {
        key: "loan",
        label: "Loan",
        sectionId: "qde-loan",
        icon: AccountBalanceOutlinedIcon,
    },
    {
        key: "sourcing",
        label: "Sourcing",
        sectionId: "qde-sourcing",
        icon: StorefrontOutlinedIcon,
    },
];

const NON_INDIVIDUAL_STEPS = [
    {
        key: "application",
        label: "Application",
        sectionId: "qde-application",
        icon: DescriptionOutlinedIcon,
    },
    {
        key: "kyc",
        label: "KYC",
        sectionId: "qde-kyc",
        icon: LockOutlinedIcon,
    },
    {
        key: "applicant",
        label: "Applicant",
        sectionId: "qde-applicant",
        icon: PersonOutlineIcon,
    },
    {
        key: "authSignatoryKyc",
        label: "AS KYC",
        sectionId: "qde-auth-signatory-kyc",
        icon: BadgeOutlinedIcon,
    },
    {
        key: "address",
        label: "Address",
        sectionId: "qde-address",
        icon: HomeOutlinedIcon,
    },
    {
        key: "loan",
        label: "Loan",
        sectionId: "qde-loan",
        icon: AccountBalanceOutlinedIcon,
    },
    {
        key: "sourcing",
        label: "Sourcing",
        sectionId: "qde-sourcing",
        icon: StorefrontOutlinedIcon,
    },
];
const QdeProgressBar = ({ isNonIndividual }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [, setProgressRefresh] = useState(0);

   
    useEffect(() => {
    const handleFieldChange = () => {
        setProgressRefresh((prev) => prev + 1);
    };

    document.addEventListener("input", handleFieldChange, true);
    document.addEventListener("change", handleFieldChange, true);
    document.addEventListener("click", handleFieldChange, true); 
    return () => {
        document.removeEventListener("input", handleFieldChange, true);
        document.removeEventListener("change", handleFieldChange, true);
        document.removeEventListener("click", handleFieldChange, true);
    };
}, []);

    const steps = isNonIndividual
        ? NON_INDIVIDUAL_STEPS
        : INDIVIDUAL_STEPS;



    const getSectionStatus = (sectionId) => {
        const section = document.getElementById(sectionId);

        if (!section) {
            return "empty";
        }

        const fields = Array.from(
            section.querySelectorAll("input, textarea, select")
        ).filter((field) => {
            if (field.type === "hidden") return false;
            if (field.disabled) return false;
            return true;
        });

        if (!fields.length) {
            return "empty";
        }

        let filledCount = 0;
        let requiredCount = 0;
        const countedRadioGroups = new Set();

        fields.forEach((field) => {
            const isRequired =
                field.required ||
                field.getAttribute("aria-required") === "true";

            // ---- RADIO: treat each group as ONE field ----
            if (field.type === "radio") {
                // Skip if we already counted this group
                if (!field.name || countedRadioGroups.has(field.name)) {
                    return;
                }
                countedRadioGroups.add(field.name);

                // A radio group is required if ANY radio in it is required.
                // (Different browsers/React libs put `required` on the first
                // radio of the group, so checking any is safest.)
                const groupRadios = Array.from(
                    section.querySelectorAll(
                        `input[type="radio"][name="${CSS.escape(field.name)}"]`
                    )
                );

                const groupRequired = groupRadios.some(
                    (r) =>
                        r.required ||
                        r.getAttribute("aria-required") === "true"
                );

                if (!groupRequired) return;

                requiredCount++;

                const groupAnswered = groupRadios.some((r) => r.checked);
                if (groupAnswered) {
                    filledCount++;
                }
                return;
            }

            // ---- NON-RADIO fields ----
            if (!isRequired) return;

            requiredCount++;

            if (field.type === "checkbox") {
                if (field.checked) filledCount++;
            } else if (String(field.value || "").trim() !== "") {
                filledCount++;
            }
        });

        // If there are required fields, use them to determine completion.
        if (requiredCount > 0) {
            if (filledCount === 0) return "empty";
            if (filledCount === requiredCount) return "complete";
            return "partial";
        }

        // ---- Fallback for sections with NO required attributes ----
        // Same radio-group dedup logic for "filled" counting.
        let totalCount = 0;
        let filledNonRequired = 0;
        const countedFallbackRadioGroups = new Set();

        fields.forEach((field) => {
            if (field.type === "radio") {
                if (!field.name || countedFallbackRadioGroups.has(field.name)) {
                    return;
                }
                countedFallbackRadioGroups.add(field.name);

                const groupRadios = Array.from(
                    section.querySelectorAll(
                        `input[type="radio"][name="${CSS.escape(field.name)}"]`
                    )
                );

                totalCount++;
                if (groupRadios.some((r) => r.checked)) {
                    filledNonRequired++;
                }
                return;
            }

            totalCount++;

            if (field.type === "checkbox") {
                if (field.checked) filledNonRequired++;
            } else if (String(field.value || "").trim() !== "") {
                filledNonRequired++;
            }
        });
        if (filledNonRequired === 0) return "empty";
        if (filledNonRequired === totalCount) return "complete";
        return "partial";
    };
    /*
    * Reset to Application whenever
    * Individual <-> Non-Individual changes.
    */
    useEffect(() => {
        setCurrentStep(0);
    }, [isNonIndividual]);

    /*
    * Scroll to a QDE section.
    */
    const scrollToSection = (index) => {
        const step = steps[index];

        if (!step?.sectionId) return;

        const element = document.getElementById(step.sectionId);

        if (!element) return;

        setCurrentStep(index);

        element.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    /*
    * Automatically detect which section
    * is currently visible while scrolling.
    */
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntries = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            b.intersectionRatio - a.intersectionRatio
                    );

                if (!visibleEntries.length) return;

                const visibleId = visibleEntries[0].target.id;

                const index = steps.findIndex(
                    (step) => step.sectionId === visibleId
                );

                if (index !== -1) {
                    setCurrentStep(index);
                }
            },
            {
                threshold: [0.2, 0.4, 0.6],
                rootMargin: "-100px 0px -50% 0px",
            }
        );

        steps.forEach((step) => {
            const element = document.getElementById(
                step.sectionId
            );

            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [steps]);

    const totalSteps = steps.length;

    const completedSteps = steps.filter(
        (step) => getSectionStatus(step.sectionId) === "complete"
    ).length;

    const percentage = Math.round(
        (completedSteps / totalSteps) * 100
    );

    return (
        <HBox
            sx={{
                width: "100%",
                border: "1px solid #c7d6f7",
                borderRadius: "10px",
                backgroundColor: "#fff",
                padding: "12px",
                boxSizing: "border-box",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
        >
            <HBox
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    width: "100%",
                }}
            >

                {/* PROGRESS LABEL */}
                <HBox
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        minWidth: "125px",
                    }}
                >
                    <HLabel
                        value="Progress"
                        colon={false}
                        sx={{
                            fontSize: "11px",
                            fontWeight: 500,
                            color: "#756675",
                            textTransform: "uppercase",
                        }}
                    />

                    <HBox
                        sx={{
                            backgroundColor: "#d6e2ec",
                            color: "#136fd8",
                            borderRadius: "5px",
                            padding: "5px 9px",
                            fontSize: "10px",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                        }}
                    >
                        {currentStep + 1}/{totalSteps} • {percentage}%
                    </HBox>
                </HBox>

                {/* PROGRESS LINE */}
                <HBox
                    sx={{
                        width: "290px",
                        flexShrink: 0,
                    }}
                >
                    <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                            height: "6px",
                            borderRadius: "5px",
                            backgroundColor: "#d6e2ec",
                            "& .MuiLinearProgress-bar": {
                                backgroundColor: "#00b887",
                                borderRadius: "5px",
                            },
                        }}
                    />
                </HBox>

                {/* STEPS */}
                <HBox sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0, overflowX: "auto", }}>
                    {steps.map((step, index) => {
                        const sectionStatus = getSectionStatus(step.sectionId);

                        const isPartial = sectionStatus === "partial";
                        const isComplete = sectionStatus === "complete";

                        return (
                            <React.Fragment key={step.key}>

                                <HBox
                                    onClick={() => scrollToSection(index)}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        height: "30px",
                                        padding: "0 10px",
                                        borderRadius: "6px",
                                        border: "1px solid",
                                        borderColor:
                                            isComplete
                                                ? "#00a87f"
                                                : isPartial
                                                    ? "#f0a000"
                                                    : "#eadce4",
                                        backgroundColor:
                                            isComplete
                                                ? "#effcf8"
                                                : isPartial
                                                    ? "#fff8e8"
                                                    : "#fff",

                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                    }}
                                >

                                    <step.icon
                                        sx={{
                                            fontSize: "14px",
                                            color: isComplete
                                                ? "#008c6c"
                                                : isPartial
                                                    ? "#d47d00"
                                                    : "#8a7a86",
                                        }}
                                    />

                                    <HLabel
                                        value={step.label}
                                        colon={false}
                                        sx={{
                                            fontSize: "11px",
                                            fontWeight:
                                                isComplete || isPartial
                                                    ? 600
                                                    : 500,
                                            color:
                                                isComplete
                                                    ? "#008c6c"
                                                    : isPartial
                                                        ? "#d47d00"
                                                        : "#766572",
                                        }}
                                    />



                                    <HBox
                                        sx={{
                                            width: "9px",
                                            height: "9px",
                                            borderRadius: "50%",
                                            border: "1.5px solid",
                                            borderColor:
                                                isComplete
                                                    ? "#00a87f"
                                                    : isPartial
                                                        ? "#f0a000"
                                                        : "#cbbcc5",
                                            backgroundColor:
                                                isComplete
                                                    ? "#00a87f"
                                                    : "transparent",
                                            overflow: "hidden",
                                            background: isPartial
                                                ? "linear-gradient(90deg, #f0a000 50%, transparent 50%)"
                                                : isComplete
                                                    ? "#00a87f"
                                                    : "transparent",
                                        }}
                                    >

                                    </HBox>
                                </HBox>

                                {index < steps.length - 1 && (
                                    <HLabel
                                        value="›"
                                        colon={false}
                                        sx={{
                                            color: "#cbbbc5",
                                            fontSize: "15px",
                                            margin: "0 4px",
                                        }}
                                    />


                                )}

                            </React.Fragment>
                        );
                    })}
                </HBox>
            </HBox>
        </HBox>
    );
};

export default QdeProgressBar;