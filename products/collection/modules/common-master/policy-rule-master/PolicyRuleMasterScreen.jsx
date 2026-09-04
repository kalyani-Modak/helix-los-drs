import React, { useState, useEffect, useMemo, useRef } from "react";
import { useIntl } from "react-intl";
import { HBox, HButtonBar, TitleBar, HBreadCrumb, HAgGrid, useToast, HAxiosService} from "@helix/component-library";
import { useNavigate } from "react-router-dom";
import PolicyRulePopup from "./PolicyRulePopup.jsx";
import { PolicyRuleAPI } from "../apiEndpoints.jsx";
import { useLocation } from "react-router-dom";    

const RULES_PAGE_SIZE = 10;

const PolicyRule = () => {
    const intl = useIntl();
    const navigate = useNavigate();
    const toast = useToast();
    const gridRef = useRef(null);
    const [rowData, setRowData] = useState([]);
    const [openPopup, setOpenPopup] = useState(false);
    const [ruleSeqNo, setRuleSeqNo] = useState(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const screenMenuId =  location.state.menuId;
    
    const columnDefs = useMemo(() => [
        {
            headerName: intl.formatMessage({
                id: "label.workflowRule.ceventtype",
                defaultMessage: " ",
            }),
            field: "cEventType",
            flex: 0.5,
        },
        {
            headerName: intl.formatMessage({
                id: "label.workflowRule.szprefiltercode",
                defaultMessage: " ",
            }),
            field: "szPreFiltercode",
            flex: 0.5,
        },
        {
            headerName: intl.formatMessage({
                id: "label.workflowRule.cdeletedyn",
                defaultMessage: " ",
            }),
            field: "cDeletedYN",
            flex: 0.5,
        },
        {
            headerName: intl.formatMessage({
                id: "label.workflowRule.description",
                defaultMessage: "Description",
            }),
            field: "szRuleDesc",
            flex: 4,
            editable: true,
            filter: false,
            required: false,
        },
        {
            headerName: intl.formatMessage({
                id: "label.workflowRule.changewhat",
                defaultMessage: "Change What",
            }),
            field: "chwht",
            flex: 2,
            editable: true,
            filter: false,
            required: false,
        },
        {
            headerName: intl.formatMessage({
                id: "label.workflowRule.changeTo",
                defaultMessage: "Change To",
            }),
            field: "chto",
            flex: 1.5,
            editable: true,
            filter: false,
            required: false,
        },
        {
            headerName: intl.formatMessage({
                id: "label.workflowRule.edit",
                defaultMessage: " ",
            }),
            field: "edit",
            flex: 1.5,
            editable: false,
            filter: false,
            required: false,
        },

    ], [intl.locale]);

    const queryObject = {
        txtType: "G",
        szWFCode: "code",
        txtBaseType: "A"
    };

    const policyRuleDatasource = useMemo(() => {
    return {
        getRows: async (params) => {
            const startRow = Number(params?.startRow) || 0;
            const endRow = Number(params?.endRow) || POLICY_RULE_PAGE_SIZE;

            const size = Math.max(1, endRow - startRow);
            const pageNumber = Math.floor(startRow / size) + 1;

            const param = ["A", "EXQ", "G"];

            if (param.length !== 3) {
                toast.error(
                    intl.formatMessage({
                        id: "error.WorkflowRule.missingParameter",
                        defaultMessage: "Required parameters are missing",
                    })
                );

                params.successCallback?.([], 0);
                setRowData([]);
                return;
            }

            setLoading(true);

            try {
                const result = await HAxiosService.GET(
                    PolicyRuleAPI.fetchGridData(
                        ...param,
                        screenMenuId,
                        pageNumber,
                        size
                    )
                );

                if (result?.data?.status !== "Success") {
                    toast.error(
                        intl.formatMessage({
                            id: result?.data?.message,
                            defaultMessage: result?.data?.message,
                        })
                    );

                    params.failCallback?.();
                    setRowData([]);
                    return;
                }
                console.log("------------- ",result);
                

                const rows = result?.data?.responseJson?.content || [];
                const total = result?.data?.responseJson?.totalElements || 0;

                const mappedRows = rows.map(item => ({
                    ...item,
                    edit: "Edit",
                }));

                setRowData(mappedRows);

                params.successCallback?.(mappedRows, total);

            } catch (error) {
                console.error(error);

                toast.error(
                    intl.formatMessage({
                        id: "error.WorkflowRule.failedGridData",
                        defaultMessage: "Failed to fetch grid data.",
                    })
                );

                setRowData([]);
                params.failCallback?.();

            } finally {
                setLoading(false);
            }
        },
    };
}, [intl, screenMenuId, toast]);

    const handleEdit = (data) => {
        setRuleSeqNo(data.iRuleSequenceNo);
        setOpenPopup(true);
    };

    return (
        <HBox sx={{ mt: 2 }}>
            <HBreadCrumb />
            <TitleBar
                title={intl.formatMessage({
                    id: "label.WorkflowRule.title",
                    defaultMessage: "Policy Rules",
                })}
            />
            <HBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <HAgGrid
                    ref={gridRef}
                    key={intl.locale}
                    columnDefs={columnDefs}
                    datasource={policyRuleDatasource}
                    cacheBlockSize={RULES_PAGE_SIZE}
                    onClickMapping={{
                        edit: (params) => handleEdit(params.data),
                    }}
                    gridStyle={{ width: "100%", height: "320px" }}
                    rowModelType="infinite"
                    pagination
                    paginationPageSize={RULES_PAGE_SIZE}
                    sort={true}
                    globalSearch={false}
                    rowDragging={false}
                    // onSave={handleSave}
                    addCheckBoxes={true}
                    openPopupNewRow={() => setOpenPopup(true)}
                    allowAdd
                    allowUpdate
                    allowDelete
                    isLoading={loading}
                />
                <HButtonBar
                    onSave={() => gridRef.current?.submitChanges?.()}
                    onClose={() => navigate("/homelayout/welcomepage")}
                />
                <PolicyRulePopup
                    open={openPopup}
                    onClose={() => {
                        setOpenPopup(false);
                        setRuleSeqNo(null);
                    }}
                    onSaveSuccess={policyRuleDatasource}
                    props={{
                        ...queryObject,
                        ruleSeqNo: ruleSeqNo,
                        screenMenuId: screenMenuId
                    }}
                />
            </HBox>
        </HBox>
    );
};

export default PolicyRule;