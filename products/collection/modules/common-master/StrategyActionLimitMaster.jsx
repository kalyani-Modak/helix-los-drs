import DMNDecisionTableBuilder from "../ruleengine/DMNDecisionTableBuilder";
import React, { useState, useEffect } from "react";
import { StrategyActionLimitMasterAPI } from "./apiEndpoints";
import { useLocation } from "react-router-dom";
import { HAxiosService, HBreadCrumb, TitleBar, useToast } from "@helix/component-library";
import { useIntl } from "react-intl";



const StrategyActionLimitMaster = () => {
  const location = useLocation();
  const screenMenuId  = location.state?.menuId ;
  const [loading, setLoading] = useState(false);
  const intl = useIntl();
  const toast = useToast();
  const Realm = sessionStorage.getItem("SEC_REALM") || "DEFAULT";
  const outputAttributes = [
    {
      name: intl.formatMessage({
        id: "output.collectionLimit",
        defaultMessage: "Collection Limit"
      }),
      type: "number",
      code: "CollectionLimit"
    },
    {
      name: intl.formatMessage({
        id: "output.exposureLimit",
        defaultMessage: "Exposure Limit"
      }),
      type: "number",
      code: "ExposureLimit"
    },
    {
      name: intl.formatMessage({
        id: "output.manualLimit",
        defaultMessage: "Manual Limit"
      }),
      type: "number",
      code: "ManualLimit"
    },
    {
      name: intl.formatMessage({
        id: "output.othersLimit",
        defaultMessage: "Others Limit"
      }),
      type: "number",
      code: "OthersLimit"
    },
    {
      name: intl.formatMessage({
        id: "output.totalLimit",
        defaultMessage: "Total Limit"
      }),
      type: "number",
      code: "TotalLimit"
    }
  ];
  useEffect(() => {
    console.log("Output Attributes:", outputAttributes);
  }, []);

  const handleSave = async (dmnPayload) => {
    try {
      setLoading(true);
      await HAxiosService.POST(
        StrategyActionLimitMasterAPI.saveStrategyActionLimitMaster(screenMenuId),
        dmnPayload,
        {},
        false,
        {
            "X-Tenant-Id": Realm
        }
      );

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        intl.formatMessage({
          id: "message.StrategyActionLimitMaster.SaveError",
          defaultMessage: "Error while saving Strategy Action Limit"
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <HBreadCrumb />
      <div style={{ marginTop: "20px", marginBottom: "10px" }}>
        <TitleBar
          title={intl.formatMessage({
            id: "label.StrategyActionLimitMaster.title",
            defaultMessage: "Strategy Action Limit Master"
          })}
        />
      </div>
      <DMNDecisionTableBuilder
        rulename="StrategyActionLimit"
        modulename="COL"
        tenantId={Realm}
        dmnType="DECISION_TABLE"
        entityName="StrategyActionLimit"
        outputAttributes={outputAttributes}
        onSubmit={handleSave}
        editMode={true}
      />
    </div>
  );
};

export default StrategyActionLimitMaster;
