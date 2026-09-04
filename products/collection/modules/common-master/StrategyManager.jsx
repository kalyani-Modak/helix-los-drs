import DMNDecisionTableBuilder from "../ruleengine/DMNDecisionTableBuilder.jsx";
import React, { useEffect } from "react";
import { StrategyManagerAPI} from "../common-master/apiEndpoints.jsx";
import { HAxiosService, TitleBar, useToast } from "@helix/component-library";

import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";

const StrategyManager = () => {
  const intl = useIntl();
  const toast = useToast();
  const location = useLocation();
  const screenMenuId  = location.state?.menuId ;

  const Realm = sessionStorage.getItem("SEC_REALM") || "DEFAULT";

  const outputAttributes = [
    { 
      name: intl.formatMessage({
        id: "StrategyManager.output.notAllowed",
        defaultMessage: "Not Allowed"
      }), 
      type: "string",
      code: "NotAllowed"
    },
    { 
      name: intl.formatMessage({
        id: "StrategyManager.output.authorizationRequired",
        defaultMessage: "Authorization required"
      }), 
      type: "string",
      code: "AuthorizationRequired"
    }
  ];

  useEffect(() => {
    console.log("Output Attributes Loaded:", outputAttributes);
  }, []);

  const handleSave = async (dmnPayload) => {
    console.log("Save Clicked. Payload:", dmnPayload);

    try {
      const res = await HAxiosService.POST(
        StrategyManagerAPI.StrategyManager(screenMenuId),
        dmnPayload,
        {},
        false,
        {
          "X-Tenant-Id": Realm
        }
      );

      if (res.status === 200) {
        console.log("MN Upload Success:", res.data);
        toast.success(
          res.data.msg ||
          intl.formatMessage({
            id: "StrategyManager.save.success",
            defaultMessage: "Strategy Manager Rule uploaded successfully"
          })
        );
      } else {
        console.log("DMN Upload Warning:", res.data);
        toast.error(
          res.data.msg ||
          intl.formatMessage({
            id: "StrategyManager.save.failed",
            defaultMessage: "Failed to upload Strategy Manager Rule"
          })
        );
      }
    } catch (err) {
      console.error("❌ DMN Upload Failed:", err);
      toast.error(
        err.response?.data?.message ||
        intl.formatMessage({
          id: "StrategyManager.save.error",
          defaultMessage: "Error uploading Strategy Manager Rule"
        })
      );
    }
  };

  return (
    <div>
      <div style={{ marginTop: "20px", marginBottom: "10px" }}>
        <TitleBar
          title={intl.formatMessage({
            id: "StrategyManagerAPI.title",
            defaultMessage: "Strategy Manager"
          })}
        />
      </div>
      <DMNDecisionTableBuilder
        rulename="StrategyManager"
        modulename="COL"
        tenantId={Realm}
        dmnType="DECISION_TABLE"
        entityName="StrategyManager"
        outputAttributes={outputAttributes}
        onSubmit={handleSave}
        editMode={true}
      />
    </div>
  );
};

export default StrategyManager;
