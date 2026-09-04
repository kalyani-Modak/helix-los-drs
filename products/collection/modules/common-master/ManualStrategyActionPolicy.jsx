import DMNDecisionTableBuilder from "../ruleengine/DMNDecisionTableBuilder.jsx";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ManualStrategyActionPolicyAPI } from "../common-master/apiEndpoints.jsx";
import { HAxiosService, HBreadCrumb, TitleBar, useToast } from "@helix/component-library";

import { useIntl } from "react-intl";


const ManualStrategyActionPolicy = () => {
  const intl = useIntl();
  const toast = useToast();
  const location = useLocation();
  const screenMenuId  = location.state?.menuId ;

  const Realm = sessionStorage.getItem("SEC_REALM") || "DEFAULT";

  const outputAttributes = [
    { 
      name: intl.formatMessage({
        id: "ManualStrategyActionPolicy.output.notAllowed",
        defaultMessage: "Not Allowed"
      }), 
      type: "string",
      code: "NotAllowed"
    },
    { 
      name: intl.formatMessage({
        id: "ManualStrategyActionPolicy.output.authorizationRequired",
        defaultMessage: "Authorization required"
      }), 
      type: "string",
      code: "AuthorizationRequired"
    }
  ];

  useEffect(() => {
    console.log("✅ Output Attributes Loaded:", outputAttributes);
  }, []);

  /* ==========================
     SAVE / UPLOAD API CALL
     ========================== */
  const handleSave = async (dmnPayload) => {
    console.log("➡️ Save Clicked. Payload:", dmnPayload);

    try {
      const res = await HAxiosService.POST(
        ManualStrategyActionPolicyAPI.saveManualStrategyActionPolicy(screenMenuId),
        dmnPayload,
        {},
        false,
         {
            "X-Tenant-Id": Realm,
          }
      );

      if (res.status === 200) {
        console.log("✅ DMN Upload Success:", res.data);
        toast.success(
          res.data.msg ||
          intl.formatMessage({
            id: "ManualStrategyActionPolicy.save.success",
            defaultMessage: "Manual Strategy Action Policy Rule uploaded successfully"
          })
        );
      } else {
        console.log("⚠️ DMN Upload Warning:", res.data);
        toast.error(
          res.data.msg ||
          intl.formatMessage({
            id: "ManualStrategyActionPolicy.save.failed",
            defaultMessage: "Failed to upload Manual Strategy Action Policy Rule"
          })
        );
      }
    } catch (err) {
      console.error("❌ DMN Upload Failed:", err);
      toast.error(
        err.response?.data?.message ||
        intl.formatMessage({
          id: "ManualStrategyActionPolicy.save.error",
          defaultMessage: "Error uploading Manual Strategy Action Policy Rule"
        })
      );
    }
  };

  return (
    <div>
      <HBreadCrumb />
      <div style={{ marginTop: "20px", marginBottom: "10px" }}>
        <TitleBar
          title={intl.formatMessage({
            id: "ManualStrategyActionPolicy.title",
            defaultMessage: "Manual Strategy Action Policy"
          })}
        />
      </div>
      <DMNDecisionTableBuilder
        rulename="PolicyManualStrategyAction"
        modulename="COL"
        tenantId={Realm}
        dmnType="DECISION_TABLE"
        entityName="ManualStrategyActionPolicy"
        outputAttributes={outputAttributes}
        onSubmit={handleSave}
        editMode={true}
      />
    </div>
  );
};

export default ManualStrategyActionPolicy;
