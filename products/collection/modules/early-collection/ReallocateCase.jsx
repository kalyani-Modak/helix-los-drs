import { useState } from "react";
import { Box } from "@mui/material";  
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { useToast, HAxiosService, HButtonBar, HCheckBox, HLabel } from "@helix/component-library";
import { ReallocateCaseAPI } from "./apiEndpoints.jsx";

import FunctionLayout from "./FunctionLayout";
import { useSelector } from "react-redux";
import { handleValidationErrors } from "../early-collection/ValidationUtils.jsx";

const ReallocateCase = () => {
    const intl = useIntl();
    const toast = useToast();
    const navigate = useNavigate();
    const { selectedRow } = useSelector((state) => state.account);

    const [reallocateCase, setReallocateCase] = useState(false);

    const resetForm = () => {
        setReallocateCase(false);
    };

    const handleSave = () => {
        const requestData = {
            reallocateCaseDto: {
                chReallocCaseFlag: reallocateCase ? "Y" : "N",
            },
        };

        HAxiosService.POST(ReallocateCaseAPI.reallocateCase(), requestData)
            .then((res) => {
                if (res.data.status?.toLowerCase() === "success") {
                    toast.success(
                        res.data.msg ||
                        intl.formatMessage({
                            id: "label.reallocate.success",
                            defaultMessage: "Case reallocated successfully",
                        }),
                    );
                    resetForm();
                } else {
                    if (res.data?.responseJson) {
                        handleValidationErrors(intl, toast, res.data.responseJson);
                    } else {
                        toast.error(
                            res.data.msg ||
                            intl.formatMessage({
                                id: "label.reallocate.error",
                                defaultMessage: "Failed to reallocate case",
                            }),
                        );
                    }
                }
            })
            .catch((err) => {
                if (err.response?.data?.responseJson) {
                    handleValidationErrors(intl, toast, err.response.data.responseJson);
                } else {
                    toast.error(
                        err.response?.data?.message ||
                        intl.formatMessage({
                            id: "label.reallocate.error",
                            defaultMessage: "Failed to reallocate case",
                        }),
                    );
                }
            });
    };

    const labelStyles = {
        width: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
    };

    return (
        <FunctionLayout
            title={intl.formatMessage({
                id: "label.reallocate.case.title",
                defaultMessage: "Reallocate Case",
            })}
        >
            <Box sx={{ p: 2, maxWidth: 900 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
                    <Box sx={labelStyles}>
                        <HLabel
                            value={intl.formatMessage({
                                id: "label.reallocate.case",
                                defaultMessage: "Reallocate Case",
                            })}
                            sx={{ fontSize: "16px", fontWeight: 500 }} l̥
                        />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
                        <HCheckBox
                            label=" "
                            checked={reallocateCase}
                            onChange={(e) => setReallocateCase(e.target.checked)}
                            sx={{ mb: 0 }}
                        />
                    </Box>
                </Box>

                <HButtonBar
                    onSave={handleSave}
                    onReset={resetForm}
                    onClose={() => navigate("/homelayout/welcomepage")}
                />
            </Box>
        </FunctionLayout>
    );
};

export default ReallocateCase;
