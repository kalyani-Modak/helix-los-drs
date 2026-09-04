import DMNDecisionTableBuilder from "../ruleengine/DMNDecisionTableBuilder";
import  { useState } from "react";
import { ManualRevisionPolicyAPI } from "./apiEndpoints";
import { HAxiosService, HBreadCrumb, TitleBar, useToast } from "@helix/component-library";
import { useLocation } from "react-router-dom";
import { useIntl } from "react-intl";



const ManualRevisionPolicyMaster = () => {
    const [loading, setLoading] = useState(false);
    const intl = useIntl();
    const toast = useToast();
    const realm = sessionStorage.getItem("SEC_REALM") || "DEFAULT";
    const location = useLocation();
    const screenMenuId  = location.state?.menuId ;

    const outputAttributes = [
        {
            name: intl.formatMessage({
                id: "label.ManualRevisionPolicy.output.minNewLimit",
                defaultMessage: "Minimum New Credit Limit Amount"
            }),
            type: "number",
            code: "MinimumNewCreditLimitAmount"
        },
        {
            name: intl.formatMessage({
                id: "label.ManualRevisionPolicy.output.maxNewLimit",
                defaultMessage: "Maximum New Credit Limit Amount"
            }),
            type: "number",
            code: "MaximumNewCreditLimitAmount"
        },
        {
            name: intl.formatMessage({
                id: "label.ManualRevisionPolicy.output.increasePercent",
                defaultMessage: "Increase Max Percent Change in Credit Limit"
            }),
            type: "number",
            code: "IncreaseMaxPercentChangeInCreditLimit"
        },
        {
            name: intl.formatMessage({
                id: "label.ManualRevisionPolicy.output.decreasePercent",
                defaultMessage: "Decrease Max Percent Change in Credit Limit"
            }),
            type: "number",
            code: "DecreaseMaxPercentChangeInCreditLimit"
        },
        {
            name: intl.formatMessage({
                id: "label.ManualRevisionPolicy.output.allowed",
                defaultMessage: "Allowed"
            }),
            type: "string",
            code: "Allowed",
            options: [
                { label: "Yes", value: "Y" },
                { label: "No", value: "N" }
            ],
        },
        {
            name: intl.formatMessage({
                id: "label.ManualRevisionPolicy.output.hardValidate",
                defaultMessage: "Hard Validate"
            }),
            type: "string",
            code: "HardValidate",
            options: [
                { label: "Yes", value: "Y" },
                { label: "No", value: "N" }
            ],
        },
        {
            name: intl.formatMessage({
                id: "label.ManualRevisionPolicy.output.requiresAuth",
                defaultMessage: "Requires Authorization"
            }),
            type: "string",
            code: "RequiresAuthorization",
            options: [
                { label: "Yes", value: "Y" },
                { label: "No", value: "N" }
            ],
        }
    ];

    const handleSave = async (dmnPayload) => {
        try {
            setLoading(true);

            await HAxiosService.POST(
                ManualRevisionPolicyAPI.saveManualRevisionPolicyMaster(screenMenuId),
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
                    id: "message.ManualRevisionPolicy.SaveError",
                    defaultMessage: "Error while saving Manual Revision Policy"
                })
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <HBreadCrumb/>
            <div style={{ marginTop: "20px", marginBottom: "10px" }}>
                <TitleBar
                    title={intl.formatMessage({
                        id: "label.ManualRevisionPolicy.title",
                        defaultMessage: "Manual Revision Policy Master"
                    })}
                />
            </div>

            <DMNDecisionTableBuilder
                rulename="PolicyManualRevision"
                modulename="COL"
                tenantId={realm}
                dmnType="DECISION_TABLE"
                entityName="ManualRevisionPolicy"
                outputAttributes={outputAttributes}
                onSubmit={handleSave}
                editMode={true}
            />

           
        </div>
    );
};

export default ManualRevisionPolicyMaster;
