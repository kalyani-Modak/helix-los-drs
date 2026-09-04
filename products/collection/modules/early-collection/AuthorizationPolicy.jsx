import DMNDecisionTableBuilder from "../ruleengine/DMNDecisionTableBuilder";
import React, { useState, useEffect } from "react";
import { AuthorizationPolicyRuleMasterAPI } from "./apiEndpoints";
import { HAxiosService } from "@helix/component-library";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";

const AuthorizationPolicyRuleMaster = () => {
  
  const [loading, setLoading] = useState(false);
  const intl = useIntl();
  const location = useLocation();
  const screenMenuId  = location.state?.menuId ;

  const Realm = sessionStorage.getItem("SEC_REALM") || "DEFAULT";
 
  const outputAttributes = [
  { 
    name: intl.formatMessage({ 
      id: "label.authorizationPolicy.output.multiAuthType", 
      defaultMessage: "Multi-Auth Type" 
    }), 
    type: "string", 
    code: "MultiAuthType" 
  },
  { 
     name: intl.formatMessage({ 
      id: "label.authorizationPolicy.output.numberOfAuthorizations", 
      defaultMessage: "Number of Authorizations"
     }), 
     type: "number", 
     code: "NumberOfAuthorizations" 
  },
  { 
    name: intl.formatMessage({ 
      id: "label.authorizationPolicy.output.profileCodes", 
      defaultMessage: "Profile Codes" 
    }), 
    type: "string", 
    code: "ProfileCodes" 
  }
  ];

  useEffect(() => {
  }, []);

  const handleSave = async (dmnPayload) => {
    console.log("➡️ Save Clicked. Payload:", dmnPayload);

    try {
      setLoading(true);
      const res = await HAxiosService.POST(
        AuthorizationPolicyRuleMasterAPI.saveAuthorizationPolicyRuleMaster(screenMenuId),
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
            id: "save.success",
            defaultMessage: "Authorization Policy Rule uploaded successfully"
          })
        );
      } else {
        toast.error(
          res.data.msg ||
          intl.formatMessage({
            id: "save.failed",
            defaultMessage: "Failed to upload Authorization Policy Rule"
          })
        );
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        intl.formatMessage({
          id: "save.error",
          defaultMessage: "Error uploading Authorization Policy Rule"
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <DMNDecisionTableBuilder
        rulename="PolicyAuthorization"
        modulename="COL"
        tenantId={Realm}
        dmnType="DECISION_TABLE"
        entityName="AuthorizationPolicy"
        outputAttributes={outputAttributes}
        onSubmit={handleSave}
        editMode={true}
      />
    </div>
  );
};

export default AuthorizationPolicyRuleMaster;
