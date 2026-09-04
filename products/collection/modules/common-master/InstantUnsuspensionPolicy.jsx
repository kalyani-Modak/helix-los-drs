import DMNDecisionTableBuilder from "../ruleengine/DMNDecisionTableBuilder.jsx";
import React, { useEffect } from "react";
import { InstantUnsuspensionPolicyAPI } from "../common-master/apiEndpoints.jsx";
import { HAxiosService, TitleBar, useToast } from "@helix/component-library";
import { useLocation } from "react-router-dom";
import { useIntl } from "react-intl";

const InstantUnsuspensionPolicy = () => {
  const intl = useIntl();
  const toast = useToast();
  const location = useLocation();
  const screenMenuId  = location.state?.menuId ;

  const Realm = sessionStorage.getItem("SEC_REALM") || "DEFAULT";

  // Output attributes with internationalization
  const outputAttributes = [
    { 
      name: intl.formatMessage({
        id: "InstantUnsuspensionPolicy.output.instantUnsuspensionAllowed",
        defaultMessage: "Instant Unsuspension Allowed"
      }), 
      type: "string" ,
      code: "InstantUnsuspensionAllowed"
    },
    { 
      name: intl.formatMessage({
        id: "InstantUnsuspensionPolicy.output.authorizationRequired",
        defaultMessage: "Authorization Required"
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
        InstantUnsuspensionPolicyAPI.saveInstantUnsuspensionPolicy(screenMenuId),
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
            id: "InstantUnsuspensionPolicy.save.success",
            defaultMessage: "Instant Unsuspension Policy Rule uploaded successfully"
          })
        );
      } else {
        console.log("⚠️ DMN Upload Warning:", res.data);
        toast.error(
          res.data.msg ||
          intl.formatMessage({
            id: "InstantUnsuspensionPolicy.save.failed",
            defaultMessage: "Failed to upload Instant Unsuspension Policy Rule"
          })
        );
      }
    } catch (err) {
      console.error("❌ DMN Upload Failed:", err);
      toast.error(
        err.response?.data?.message ||
        intl.formatMessage({
          id: "InstantUnsuspensionPolicy.save.error",
          defaultMessage: "Error uploading Instant Unsuspension Policy Rule"
        })
      );
    }
  };

  return (
    <div>
      <div style={{ marginTop: "20px", marginBottom: "10px" }}>
        <TitleBar
          title={intl.formatMessage({
            id: "InstantUnsuspensionPolicy.title",
            defaultMessage: "Instant Unsuspension Policy"
          })}
        />
      </div>
      <DMNDecisionTableBuilder
        rulename="PolicyInstantUnsuspension"
        modulename="COL"
        tenantId={Realm}
        dmnType="DECISION_TABLE"
        entityName="InstantUnsuspensionPolicy"
        outputAttributes={outputAttributes}
        onSubmit={handleSave}
        editMode={true}
      />
    </div>
  );
};

export default InstantUnsuspensionPolicy;
