import DMNDecisionTableBuilder from "../ruleengine/DMNDecisionTableBuilder";
import React, { useEffect } from "react";
import { PromisePolicyRuleMasterAPI } from "./apiEndpoints";
import { HAxiosService, useToast } from "@helix/component-library";

import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";


const PromisePolicyRuleMaster = () => {
  const intl = useIntl();
  const toast = useToast();
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const Realm=sessionStorage.getItem("SEC_REALM") ||"DEFAULT";

  // Output attributes
   const outputAttributes = [
     {
       name: intl.formatMessage({
         id: "label.promisePolicy.output.hardValidate",
         defaultMessage: "Hard Validate",
       }),
       type: "string",
       code: "HardValidate",
     },
     {
       name: intl.formatMessage({
         id: "label.promisePolicy.output.requiresAuthorization",
         defaultMessage: "Requires Authorization",
       }),
       type: "string",
       code: "RequiresAuthorization",
     },
     {
       name: intl.formatMessage({
         id: "label.promisePolicy.output.gracePeriod",
         defaultMessage: "Grace Period",
       }),
       type: "number",
       code: "GracePeriod",
     },
     {
       name: intl.formatMessage({
         id: "label.promisePolicy.output.minPayment1",
         defaultMessage: "Min Payment1",
       }),
       type: "number",
       code: "MinPayment1",
     },
     {
       name: intl.formatMessage({
         id: "label.promisePolicy.output.minPayment2",
         defaultMessage: "Min Payment2",
       }),
       type: "number",
       code: "MinPayment2",
     },
     {
       name: intl.formatMessage({
         id: "label.promisePolicy.output.overrideBehavior",
         defaultMessage: "Override Behavior",
       }),
       type: "string",
       code: "OverrideBehavior",
     },
   ];

  useEffect(() => {
  }, []);

  const handleSave = async (dmnPayload) => {
    console.log("➡️ Save Clicked. Payload:", dmnPayload);

    try {
      const res = await HAxiosService.POST(
        PromisePolicyRuleMasterAPI.savePromisePolicyRuleMaster(screenMenuId),
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
            id: "save.success",
            defaultMessage: "Promise Policy Rule uploaded successfully"
          })
        );
      } else {
        console.log("⚠️ DMN Upload Warning:", res.data);
        toast.error(
          res.data.msg || 
          intl.formatMessage({
            id: "save.failed",
            defaultMessage: "Failed to upload Promise Policy Rule"
          })
        );
      }
    } catch (err) {
      console.error("❌ DMN Upload Failed:", err);
      toast.error(
        err.response?.data?.message || 
        intl.formatMessage({
          id: "save.error",
          defaultMessage: "Error uploading Promise Policy Rule"
        })
      );
    }
  };

  return (
  <div>
      <DMNDecisionTableBuilder
        rulename="PolicyPromise"                                                                    
        modulename="COL"
        tenantId={Realm}
        dmnType="DECISION_TABLE"
        entityName="PPNT"
        outputAttributes={outputAttributes}
        onSubmit={handleSave}
        editMode={true}
      />
    </div>
  );
};

export default PromisePolicyRuleMaster;
