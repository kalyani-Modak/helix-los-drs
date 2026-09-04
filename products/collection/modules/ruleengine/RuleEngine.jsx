import React, { useEffect, useState } from "react";
import RuleEngineGrid from "./RuleEngineGrid";
import DMNBuilder from "./DMNBuilder";
import RuleMetaInfo from "./RuleMetaInfo";
import CriteriaBuilder from "./CriteriaBuilder";
import { useToast, HAxiosService } from "@helix/component-library";

import { DMN_API_ENDPOINTS } from "./apiEndpoints";

export default function RuleEngine() {
  const [view, setView] = useState("grid");
  const [selectedRule, setSelectedRule] = useState(null);
  const [metaInfo, setMetaInfo] = useState(null);
  const [isNewRule, setIsNewRule] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedModuleName, setSelectedModuleName] = useState(null);
  const [selectedDmnType, setSelectedDmnType] = useState(null);
  const [version, setVersion] = useState(null);
  const [entity, setEntity] = useState(null);
  const [ruleTypeMap, setRuleTypeMap] = useState(null); // { displayName -> code }
  const [loadingEnums, setLoadingEnums] = useState(true);
  const toast = useToast();

  // Fetch rule types on mount
  useEffect(() => {
    let mounted = true;
    const fetchRuleTypes = async () => {
      try {
        const response = await HAxiosService.GET(DMN_API_ENDPOINTS.getDmnTypes);
        if (response.data?.success) {
          const types = response.data.data || [];
          const map = {};
          types.forEach(t => {
            map[t.code] = t.displayName;
          });
          if (mounted) {
            setRuleTypeMap(map);
            setLoadingEnums(false);
          }
        } else {
          throw new Error(response.data?.message || "Failed to load rule types");
        }
      } catch (error) {
        console.error("Error fetching rule types:", error);
        toast.error("Failed to load rule types, using fallback");
              
      }
    };
    fetchRuleTypes();
    return () => { mounted = false; };
  }, [toast]);

  const handleOpenDMN = (
    ruleName,
    moduleName,
    dmnType,
    entityName,
    version,
    isEdit = false,
    metaInfoFromDialog = null
  ) => {
    // If enums are still loading, we cannot decide the view yet.
    if (loadingEnums) {
      toast.warn("Rule types still loading, please wait a moment.");
      return;
    }
    console.log("Selected DMN Type:", dmnType);
    const code = ruleTypeMap[dmnType];
    console.log("Mapped DMN Code:", code);

     if (!code) {
      toast.error(`Unsupported rule type: "${dmnTypeDisplayName}".`);
      setView("grid");
      return;
    }

    const isCriteriaBuilder = (code === "Criteria Builder");
    const isDecisionTable = (code === "Decision Table");

     if (!isDecisionTable && !isCriteriaBuilder) {
      toast.warn(`Builder for "${dmnTypeDisplayName}" is not yet implemented. Returning to grid.`);
      setView("grid");
      return;
    }

    if (metaInfoFromDialog) {
      setMetaInfo(metaInfoFromDialog);
      setIsNewRule(true);
      setSelectedRule(null);
      setSelectedModuleName(metaInfoFromDialog.moduleName);
      setEntity(metaInfoFromDialog.entityName);
      setVersion(null);
    } else {
      setSelectedRule(ruleName);
      setSelectedModuleName(moduleName);
      setEntity(entityName);
      setVersion(version);
      setIsNewRule(false);
      setMetaInfo(null);
    }
    setSelectedDmnType(dmnType);
    setEditMode(isEdit);
    setView(isCriteriaBuilder ? "criteriaBuilder" : "decisionTable" );
  };

  const handleNewRule = () => {
    setMetaInfo(null);
    setIsNewRule(true);
    setView("meta");
    setEditMode(true);
  };

  const handleSubmitMetaInfo = (info) => {
    handleOpenDMN(
      info.ruleName,
      info.moduleName,
      info.type,
      info.entityName,
      null,
      true,
      info
    );
  };

  const handleCancelMetaInfo = () => {
    setView("grid");
    setIsNewRule(false);
    setMetaInfo(null);
    setEditMode(false);
  };

  // While loading enums, we show a minimal loading indicator (or just the grid with a warning)
  if (loadingEnums) {
    return <div>Loading rule types...</div>;
  }

  return (
    <>
      {view === "grid" && (
        <RuleEngineGrid
          openDMN={handleOpenDMN}
          openMetaInfo={handleNewRule}
          editMode={editMode}
        />
      )}

      {view === "meta" && (
        <RuleMetaInfo
          onSubmitMetaInfo={handleSubmitMetaInfo}
          onCancel={handleCancelMetaInfo}
        />
      )}

      {view === "decisionTable" && (
        <DMNBuilder
          openGrid={() => setView("grid")}
          selectedRule={selectedRule}
          selectedModuleName={selectedModuleName}
          entityname={entity}
          version={version}
          metaInfo={isNewRule ? metaInfo : undefined}
          editMode={editMode}
        />
      )}

      {view === "criteriaBuilder" && (
        <CriteriaBuilder
          openGrid={() => setView("grid")}
          selectedRule={selectedRule}
          selectedModuleName={selectedModuleName}
          selectedDmnType={selectedDmnType}
          entity={entity}
          version={version}
          metaInfo={isNewRule ? metaInfo : undefined}
        />
      )}
    </>
  );
}
