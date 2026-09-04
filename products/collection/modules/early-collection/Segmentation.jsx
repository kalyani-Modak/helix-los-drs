import DMNDecisionTableBuilder from "../ruleengine/DMNDecisionTableBuilder.jsx";
import React, { useEffect } from "react";
import { HAxiosService, TitleBar, useToast } from "@helix/component-library";
import { SegmentationAPI } from "./apiEndpoints.jsx";
import { useLocation } from "react-router-dom";
import { useIntl } from "react-intl";

const Segmentation = () => {
  const intl = useIntl();
  const toast = useToast();
  const location = useLocation();
  const screenMenuId  = location.state?.menuId ;

  const Realm = sessionStorage.getItem("SEC_REALM") || "DEFAULT";

  const outputAttributes = [
    { name: "Segment Code", type: "string", code: "SegmentCode" },
  ];

  useEffect(() => {
    console.log("✅ Segmentation Output Attributes Loaded:", outputAttributes);
  }, []);

  /* ==========================
     SAVE / UPLOAD API CALL
     ========================== */
  const handleSave = async (dmnPayload) => {
    console.log("➡️ Segmentation Save Clicked. Payload:", dmnPayload);

    try {
      const res = await HAxiosService.POST(
        SegmentationAPI.SegmentationRule(screenMenuId),
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
            id: "segmentation.save.success",
            defaultMessage: "Segmentation Rule uploaded successfully"
          })
        );
      } else {
        toast.error(
          res.data.msg ||
          intl.formatMessage({
            id: "segmentation.save.failed",
            defaultMessage: "Failed to upload Segmentation Rule"
          })
        );
      }
    } catch (err) {
      console.error("❌ Segmentation DMN Upload Failed:", err);
      
      toast.error(
        err.response?.data?.message ||
        intl.formatMessage({
          id: "segmentation.save.error",
          defaultMessage: "Error uploading Segmentation Rule"
        })
      );
    }
  };

  return (
    <div>
      <div style={{ marginTop: "20px", marginBottom: "10px" }}>
        <TitleBar
          title={intl.formatMessage({
            id: "segmentation.title",
            defaultMessage: "Segmentation"
          })}
        />
      </div>
      <DMNDecisionTableBuilder
        rulename="Segmentation"
        modulename="COL"
        tenantId={Realm}
        dmnType="DECISION_TABLE"
        entityName="ACNT"
        outputAttributes={outputAttributes}
        onSubmit={handleSave}
        editMode={true}
      />
    </div>
  );
};

export default Segmentation;
