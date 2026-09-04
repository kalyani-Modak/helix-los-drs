import DMNDecisionTableBuilder from "../ruleengine/DMNDecisionTableBuilder.jsx";
import React, { useEffect } from "react";
import { HAxiosService, TitleBar, useToast } from "@helix/component-library";
import { useLocation } from "react-router-dom";
import { ExclusionPolicyAPI } from "./apiEndpoints.jsx";

import { useIntl } from "react-intl";

const ExclusionPolicy = () => {
  const intl = useIntl();
  const toast = useToast();
  const location = useLocation();
  const screenMenuId  = location.state?.menuId ;

  const Realm = sessionStorage.getItem("SEC_REALM") || "DEFAULT";

  const outputAttributes = [
    { name: "Description", type: "string", code: "Description" },
    { name: "Max number of exclusion days", type: "number", code: "MaxNumberOfExclusionDays" },
    { name: "Max number of Exclusion in Cycle", type: "number", code: "MaxNumberOfExclusionInCycle" },
    { name: "Grace Days", type: "number", code: "GraceDays" },
    { name: "Hard Validate", type: "string", code: "HardValidate" },
    { name: "Requires authorization", type: "string", code: "RequiresAuthorization" }
  ];

  useEffect(() => {
    console.log("✅  Exclusion Policy Output Attributes Loaded:", outputAttributes);
  }, []);

  /* ==========================
     SAVE / UPLOAD API CALL
     ========================== */
  const handleSave = async (dmnPayload) => {
    console.log("➡️  Exclusion Policy Save Clicked. Payload:", dmnPayload);

    try {
      const res = await HAxiosService.POST(
        ExclusionPolicyAPI.ExclusionPolicy(screenMenuId),
        dmnPayload,
        {},
        false,
        {
            "X-Tenant-Id": Realm,
        }
      );

      if (res.status === 200) {
        toast.success(
          res.data.msg ||
          intl.formatMessage({
            id: "Exclusionpolicy.save.success",
            defaultMessage: "Exclusion Policy  Rule uploaded successfully"
          })
        );
      } else {
        toast.error(
          res.data.msg ||
          intl.formatMessage({
            id: "Exclusionpolicy.save.failed",
            defaultMessage: "Failed to upload  Exclusion Policy Rule"
          })
        );
      }
    } catch (err) {
      console.error("❌ Exclusion Policy DMN Upload Failed:", err);
      
      toast.error(
        err.response?.data?.message ||
        intl.formatMessage({
          id: "Exclusionpolicy.save.error",
          defaultMessage: "Error uploading Exclusion Policy Rule"
        })
      );
    }
  };

  return (
    <div>
      <div style={{ marginTop: "20px", marginBottom: "10px" }}>
        <TitleBar
          title={intl.formatMessage({
            id: "Exclusionpolicy.title",
            defaultMessage: "Exclusion Policy"
          })}
        />
      </div>
      <DMNDecisionTableBuilder
        rulename="PolicyExclusion"
        modulename="COL"
        tenantId={Realm}
        dmnType="DECISION_TABLE"
        entityName="ExclusionPolicy"
        outputAttributes={outputAttributes}
        onSubmit={handleSave}
        editMode={true}
      />
    </div>
  );
};

export default ExclusionPolicy;
