import React, { useState } from "react";
import { Box, Card } from '@mui/material';
import { HAxiosService, FilterMaster, HButton, useToast } from "@helix/component-library";
import { DMN_API_ENDPOINTS } from "./apiEndpoints";

import PropTypes from "prop-types";



export default function CriteriaBuilder({ openGrid, selectedRule, selectedModuleName, selectedDmnType, entity, version, metaInfo, editMode, compact = false }) {

    CriteriaBuilder.propTypes = {
        openGrid: PropTypes.func,
        selectedRule: PropTypes.string,
        selectedModuleName: PropTypes.string,
        selectedDmnType: PropTypes.string,
        entity: PropTypes.string,
        version: PropTypes.string,
        metaInfo: PropTypes.shape({
            ruleName: PropTypes.string,
            ruleDesc: PropTypes.string,
            moduleName: PropTypes.string,
            type: PropTypes.string,
            entityName: PropTypes.string,
        }),
        editMode: PropTypes.bool,
    };
    console.log("CriteriaBuilder metaInfo:", metaInfo);
    const toast = useToast();
    const [dmnContext, setDmnContext] = useState(null);

    const handleSave = async () => {        
        if (!dmnContext) {
            toast.error("No criteria data to save");
            return;
        }
        
        try {
            await HAxiosService.POST(
                DMN_API_ENDPOINTS.submitDMNRule,
                dmnContext
            );
            toast.success("Criteria rule saved successfully");

        } catch (err) {
            console.error("Error in Save Criteria rule:", err);
            toast.error("Failed to save Criteria rule");
        }
        console.log("handleSave completed");
    };

    return (
        <Card >
            <Box sx={{ p: 2 }}>
                <FilterMaster
                    ruleName={metaInfo?.ruleName || selectedRule}
                    moduleName={metaInfo?.moduleName || selectedModuleName}
                    entityCode={metaInfo?.entityName || entity}
                    ruleDesc={metaInfo?.ruleDesc}
                    version={version}
                    filterTitle="Auto Dialer"
                    filterSavedDescription="Global ATD Filter"
                    isPopedUp={false}
                    ruleEngineDmnContext={setDmnContext}
                    IsRuleEngBased={true}
                    compact={compact}
                />
                {!compact && (
                    <Box sx={{ display: "flex", justifyContent: "right", width: "35%", mt: 2, gap: 2 }}>
                        <HButton id="open-grid-btn" label="Open Grid" onClick={openGrid} />
                        <HButton id="save-btn" label="Save Criteria Rule" onClick={handleSave} />
                    </Box>
                )}
            </Box>
        </Card>
    );
}
