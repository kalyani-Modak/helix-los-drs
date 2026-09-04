import DMNDecisionTableBuilder from "../ruleengine/DMNDecisionTableBuilder";
import { useState } from "react";
import { GroupAllocationRuleMasterAPI } from "./apiEndpoints";
import { HAxiosService, TitleBar, HBreadCrumb, useToast } from "@helix/component-library";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";

import "./group-allocation-rule-master.screen.css";
const GroupAllocationRuleMaster = () => {
    const [loading, setLoading] = useState(false);
    const intl = useIntl();
    const toast = useToast();
    const realm = sessionStorage.getItem("SEC_REALM") || "DEFAULT";
    const location = useLocation();
    const screenMenuId = location.state.menuId;

    const outputAttributes = [
        {
            name: intl.formatMessage({
                id: "label.GroupAllocationRule.output.groupCode",
                defaultMessage: "Group Code"
            }),
            type: "string",
            code: "GroupCode"
        }
    ];

    const handleSave = async (dmnPayload) => {
        try {
            setLoading(true);

            await HAxiosService.POST(
                GroupAllocationRuleMasterAPI.saveGroupAllocationRuleMaster(screenMenuId),
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
                    id: "message.GroupAllocationRuleMaster.SaveError",
                    defaultMessage: "Error while saving Group Allocation Rule"
                })
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="group-allocation-rule-master-page">
            <div className="group-allocation-rule-master-header-card">
                <HBreadCrumb/>
                <TitleBar
                    title={intl.formatMessage({
                        id: "label.GroupAllocationRuleMaster.title",
                        defaultMessage: "Group Allocation Rule Master"
                    })}
                />
            </div>

            <DMNDecisionTableBuilder
                rulename="GroupAllocation"
                modulename="COL"
                tenantId={realm}
                dmnType="DECISION_TABLE"
                entityName="ACNT"
                outputAttributes={outputAttributes}
                onSubmit={handleSave}
                editMode={true}
            />
        </div>
    );
};

export default GroupAllocationRuleMaster;
