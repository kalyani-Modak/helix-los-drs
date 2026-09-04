import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DMNDecisionTableBuilder from "./DMNDecisionTableBuilder";
import { HAxiosService, useToast } from "@helix/component-library";
import { DMN_API_ENDPOINTS } from "./apiEndpoints";


const DNMBuilder = ({openGrid,selectedRule, selectedModuleName,entityname ,version,metaInfo,editMode}) => {
  console.log("DMNBuilder props:", { openGrid, selectedRule, selectedModuleName, version, metaInfo, editMode });
  console.log("metaInfo in DMNBuilder:", metaInfo);
  DNMBuilder.propTypes = {
      openGrid: PropTypes.func,
      selectedRule: PropTypes.string,
      selectedModuleName: PropTypes.string,
      version: PropTypes.number,
      metaInfo: PropTypes.shape({
      ruleName: PropTypes.string,
      ruleDesc:PropTypes.string,
      moduleName: PropTypes.string,
      type: PropTypes.string,
      entityName: PropTypes.string,
      outputAttributes:PropTypes.array,
      
    }),
    editMode: PropTypes.bool,
  };
  const toast = useToast();
  const [entityName, setEntityName]=useState("");
  const [moduleName, setModuleName] = useState("");
  const [ruleName, setRuleName] = useState("");
  const [type, setType] = useState("");

  const outputs= metaInfo?.outputAttributes || [];
  console.log("outputs",outputs);
  useEffect(() => {
  setModuleName(selectedModuleName || metaInfo?.moduleName || "");
  setRuleName(selectedRule || metaInfo?.ruleName || "");
  setType(metaInfo?.type || "");
  setEntityName(metaInfo?.entityName || entityname );
  console.log("useEffect - DMNBuilder props updated:", { selectedModuleName, selectedRule, metaInfo, entityname });
}, [selectedModuleName, selectedRule, metaInfo]);
 

//  Save DMN rule (creation): transform keys
const handleSave = async (payload) => {
  try {
    await HAxiosService.POST(
      DMN_API_ENDPOINTS.submitDMNRule,
      payload
      );
    toast.success("DMN saved successfully");
  } catch (err) {
    console.error("Error in Save DMN:", err);
    toast.error("Failed to save DMN");
  }
};  

  return (
    <DMNDecisionTableBuilder
      showRuleMetaInfo={true}
      rulename={ruleName} 
      ruleDesc={metaInfo?.ruleDesc || ""}
      modulename={moduleName}
      version={version}
      dmnType={type}
      entityName={entityName || entityname} 
      outputAttributes={outputs} 
      onSubmit={handleSave}
      openGrid={openGrid}
      editMode={editMode}
    />
  );
};

export default DNMBuilder;
