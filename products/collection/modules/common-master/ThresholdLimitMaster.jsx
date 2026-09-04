import DMNDecisionTableBuilder from "../ruleengine/DMNDecisionTableBuilder";
import  { useState } from "react";
import { ThresholdLimitMasterAPI } from "./apiEndpoints";
import { HAxiosService, TitleBar, HBreadCrumb, useToast } from "@helix/component-library";
import { useIntl } from "react-intl";


const ThresholdLimitMaster = () => {
  const [loading, setLoading] = useState(false);
  const intl = useIntl();
  const toast = useToast();
  const realm = sessionStorage.getItem("SEC_REALM") || "DEFAULT";

  const outputAttributes = [
    {
      name: intl.formatMessage({
        id: "label.ThresholdLimitMaster.output.limits",
        defaultMessage: "Limits"
      }),
      type: "number",
      code: "Limits"
    }
  ];

  const handleSave = async (dmnPayload) => {
    try {
      setLoading(true);
      await HAxiosService.POST(
        ThresholdLimitMasterAPI.saveThresholdLimitMaster(),
        dmnPayload,
        {}, 
        false,
        {
          "X-Tenant-Id": realm
        }
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        intl.formatMessage({
          id: "message.ThresholdLimitMaster.SaveError",
          defaultMessage: "Error while saving Threshold Limit"
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
            id: "label.ThresholdLimitMaster.title",
            defaultMessage: "Threshold Limit Master"
          })}
        />
      </div>

      <DMNDecisionTableBuilder
        rulename="ThresholdLimit"
        modulename="COL"
        tenantId={realm}
        dmnType="DECISION_TABLE"
        entityName="ThresholdLimit"
        outputAttributes={outputAttributes}
        onSubmit={handleSave}
        editMode={true}
      />
    </div>
  );
};

export default ThresholdLimitMaster;
