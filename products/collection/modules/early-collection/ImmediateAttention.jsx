import { useState } from "react";
import { Box } from "@mui/material";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { useToast, HAxiosService, HButtonBar, HLabel, HTextarea } from "@helix/component-library";
import { ImmediateAttentionAPI } from "./apiEndpoints.jsx";

import FunctionLayout from "./FunctionLayout";
import { useSelector } from "react-redux";
import { handleValidationErrors } from "../early-collection/ValidationUtils.jsx";

const ImmediateAttention = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((state) => state.account);
  const [notes, setNotes] = useState("");
  const [objErrors, setObjErrors] = useState({    notes: false,
  });

  const resetForm = () => {
    setNotes("");
  };

  const validateForm = () => {
    const errors = {};
    if (!notes) errors.notes = true;
    setObjErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error(
        intl.formatMessage({ id: "label.immediateAttention.validation.error" }),
      );
      return;
    }

    const requestData = {
      immediateAttentionDto: {
        szNotes: notes || "",
      },
    };

      HAxiosService.POST(
        ImmediateAttentionAPI.updateImmediateAttentionDetails,
        requestData,
        {},
        false,
        {
          "Content-Type": "application/json",
        })
      .then((res) => {
        if (res.data.status?.toLowerCase() === "success") {
          toast.success(
            res.data.msg ||
              intl.formatMessage({ id: "label.immediateAttention.success" }),
          );
          resetForm();
        } else {
          if (res.data?.responseJson) {
            handleValidationErrors(intl, toast, res.data.responseJson);
          } else {
            toast.error(
              res.data.msg ||
                intl.formatMessage({ id: "label.immediateAttention.error" }),
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
              intl.formatMessage({ id: "label.immediateAttention.error" }),
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
    <FunctionLayout title={intl.formatMessage({ id: "label.immediateAttention.title" })}>

        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 , gap: 2}}>
          <Box sx={{ ...labelStyles, pt: "6px" }}>
            <HLabel value={intl.formatMessage({ id: "label.notes" })} />
          </Box>

          <Box>
            <HTextarea
              value={notes}
              width="300px"
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </Box>
        </Box>

        <HButtonBar
          onSave={handleSave}
          onReset={resetForm}
          onClose={() => navigate("/homelayout/welcomepage")}
        />
    </FunctionLayout>
  );
};

export default ImmediateAttention;
