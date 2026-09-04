import { HAxiosService, HBox, HButton, HLabel, HTextField, HDropdown, HTextarea, SearchCommonBox, useDrsTheme, TitleBar, HBreadCrumb, useToast } from "@helix/component-library";
import React, { useState } from "react";
import { IntegrationFrameworkAPI } from "./apiEndpoints";

import { Container, Grid, IconButton, Tooltip, Accordion, AccordionSummary, AccordionDetails,Paper } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Delete from '@mui/icons-material/Delete';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { logger } from "@helix/component-library";

import { useIntl } from "react-intl";

const responsePath2GridDefObj = [
    {
        gridMappingName: "description",
        gridHeaderDesc: "Response Path",
        gridHeaderId: "label.response.path",
        gridColumnWidth: 350,
    },
];

const ApiConfiguration = () => {
    // helper to generate stable-ish id for list items
    const uniqueId = () => `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;

    // Helper to update nested input arrays in a path object
    const updatePathsByInput = (pathsArray, pathIndex, inputArrayName, field, index, value) => {
        return pathsArray.map((path, i) => {
            if (i !== pathIndex) return path;
            const inputs = path[inputArrayName] || [];
            const updatedInputs = inputs.map((input, j) => (j === index ? { ...input, [field]: value } : input));
            return { ...path, [inputArrayName]: updatedInputs };
        });
    };
    const [jsonBodies, setJsonBodies] = useState({ body1: "", body2: "", });
    const [jsonResponseBodies, setJsonResponseBodies] = useState({ responsebody1: "", responsebody2: "", });
    const [paths, setPaths] = useState([{ id: uniqueId(), path1: "", path2: "", dropdownSelections: [], byKeyInputs: [], bySplitInputs: [], byFormulaInputs: [], error: null }]);
    const [jsonPath, setJsonPath] = useState([]);
    const [jsonPath2, setJsonPath2] = useState([]);
    const [responsePaths, setResponsePaths] = useState([{ id: uniqueId(), responsePath1: "", responsePath2: "", dropdownSelections: [], byKeyInputs: [], bySplitInputs: [], byFormulaInputs: [], error: null }]);
    const [jsonResponsePath, setjsonResponsePath] = useState([]);
    const [jsonResponsePath2, setjsonResponsePath2] = useState([]);
    const [apiName, setApiName] = useState("");
    const [apiUrl, setApiUrl] = useState("");
    const [methodType, setMethodType] = useState("");
    const [headers, setHeaders] = useState([{ id: uniqueId(), key: "", value: "" }]);
    const [transactionType, setTransactionType] = useState("");
    const [clickedT, setClickedT] = useState({});
    const [responseClickedT, setResponseClickedT] = useState({});
    const toast = useToast();
    const intl = useIntl();
    const { themeVars, surfaces, text, border, action, colors, isDark } = useDrsTheme();

    const handleTClick = (e, pathIndex) => {
        try {
            logger.info("handleTClick executed", { event: e, pathIndex });

            if (!clickedT[pathIndex]) {
                setClickedT((prev) => ({ ...prev, [pathIndex]: true }));
            } else {
                e.stopPropagation();
            }
            addDropdownSelection(pathIndex);
        } catch (error) {
            logger.error("Error in handleTClick", error);
        }
    };

    const handleResponseTClick = (e, ResponsepathIndex) => {
        try {
            logger.info("handleResponseTClick executed", { event: e, ResponsepathIndex });
            if (!responseClickedT[ResponsepathIndex]) {
                setResponseClickedT((prev) => ({ ...prev, [ResponsepathIndex]: true }));
            } else {
                e.stopPropagation();
            }
            addResponseDropdownSelection(ResponsepathIndex);
        } catch (error) {
            logger.error("Error in handleResponseTClick", error);
        }
    };
    const handleRequestByKeyInputChange = (e, pathIndex, field, index) => {
        try {
            const { value } = e.target;
            logger.info("handleRequestByKeyInputChange executed", { event: e, pathIndex, field, index });
            setPaths((prev) => updatePathsByInput(prev, pathIndex, "byKeyInputs", field, index, value));
        } catch (error) {
            logger.error("Error in handleRequestByKeyInputChange", error);
        }
    };

    const handleRequestBySplitInputChange = (e, pathIndex, field, index) => {
        try {
            const { value } = e.target;
            logger.info("handleRequestBySplitInputChange executed", { event: e, pathIndex, field, index });
            setPaths((prev) => updatePathsByInput(prev, pathIndex, "bySplitInputs", field, index, value));
        } catch (error) {
            logger.error("Error in handleRequestBySplitInputChange", error);
        }
    };

    const handleRequestByFormulaInputChange = (e, pathIndex, field, index) => {
        try {
            const { value } = e.target;
            logger.info("handleRequestByFormulaInputChange executed", { event: e, pathIndex, field, index });
            setPaths((prev) => updatePathsByInput(prev, pathIndex, "byFormulaInputs", field, index, value));
        } catch (error) {
            logger.error("Error in handleRequestByFormulaInputChange", error);
        }
    };



    const buildRequestConversionMap = () => {
        try {
            logger.info("buildRequestConversionMap executed", { paths });
            const conversionRequestMap = paths.map((path) => {
                const { path1, path2, dropdownSelections, byKeyInputs, bySplitInputs, byFormulaInputs } = path;
                let transformer = {};
                let transformType = "";

                dropdownSelections.forEach((selection, index) => {
                    if (selection === "byKey" && byKeyInputs[index]) {
                        transformType = "byKey";
                        transformer[byKeyInputs[index].when] = byKeyInputs[index].then;
                    } else if (selection === "bySplit" && bySplitInputs[index]) {
                        transformType = "bySplit";
                        transformer[bySplitInputs[index].startPosition] = bySplitInputs[index].delimiter;
                    } else if (selection === "byFormula" && byFormulaInputs[index]) {
                        transformType = "byFormula";
                        transformer[byFormulaInputs[index].order] = byFormulaInputs[index].delimiter;
                    }
                });

                const productPathString = Array.isArray(path1) ? path1.join(",") : path1;
                const clientPathString = Array.isArray(path2) ? path2.join(",") : path2;

                return {
                    productPath: productPathString,
                    clientPath: clientPathString,
                    "transform-type": transformType,
                    transformer,
                };
            });
            logger.info("Conversion map built", { conversionRequestMap });

            return { conversionRequestMap };
        } catch (error) {
            logger.error("Error in buildRequestConversionMap", error);
        }
    };

    const addDropdownSelection = (pathIndex) => {
        try {
            logger.info("addDropdownSelection executed", { pathIndex });
            const updatedPaths = [...paths];

            const currentSelections = updatedPaths[pathIndex].dropdownSelections;
            if (currentSelections.some(selection => !selection)) {
                toast.error(intl.formatMessage({ id: "error.select.option", defaultMessage: "Please select an option before adding a new one." }));

                logger.warn('Empty dropdown selection detected', { pathIndex });

            } else {
                updatedPaths[pathIndex].dropdownSelections.push("");
                updatedPaths[pathIndex].error = null;
            }
            setPaths(updatedPaths);
        } catch (error) {
            logger.error("Error in addDropdownSelection", error);
        }
    };



    const handleDropdownChange = (e, pathIndex, dropdownIndex) => {
        try {
            const { value } = e.target;
            logger.info("handleDropdownChange executed", { event: e, pathIndex, dropdownIndex });
            const updatedPaths = [...paths];
            if (!updatedPaths[pathIndex]) {
                console.error(`Invalid response path index: ${pathIndex}`);
                return;
            }

            const updatedDropdownSelections = [...(updatedPaths[pathIndex].dropdownSelections || [])];
            updatedDropdownSelections[dropdownIndex] = value;
            updatedPaths[pathIndex].dropdownSelections = updatedDropdownSelections;

            if (value) {
                updatedPaths[pathIndex].error = null;
            }
            updatedPaths[pathIndex].byKeyInputs = updatedPaths[pathIndex].byKeyInputs || [];
            updatedPaths[pathIndex].bySplitInputs = updatedPaths[pathIndex].bySplitInputs || [];
            updatedPaths[pathIndex].byFormulaInputs = updatedPaths[pathIndex].byFormulaInputs || [];

            if (value === "byKey") {
                updatedPaths[pathIndex].byKeyInputs[dropdownIndex] =
                    updatedPaths[pathIndex].byKeyInputs[dropdownIndex] || { when: "", then: "" };
            } else if (value === "bySplit") {
                updatedPaths[pathIndex].bySplitInputs[dropdownIndex] =
                    updatedPaths[pathIndex].bySplitInputs[dropdownIndex] || { startPosition: "", delimiter: "" };
            } else if (value === "byFormula") {
                updatedPaths[pathIndex].byFormulaInputs[dropdownIndex] =
                    updatedPaths[pathIndex].byFormulaInputs[dropdownIndex] || { order: "", delimiter: "" };

                if (!Array.isArray(updatedPaths[pathIndex].path1)) {
                    updatedPaths[pathIndex].path1 = [];
                }

                updatedPaths[pathIndex].selection = "byFormula";
            } else {
                updatedPaths[pathIndex].selection = "";
            }

            setPaths(updatedPaths);
        } catch (error) {
            logger.error("Error in handleDropdownChange", error);
        }
    };

    const removeDropdownSelection = (pathIndex, dropdownIndex) => {
        try {
            logger.info("removeDropdownSelection executed", { pathIndex, dropdownIndex });
            const updatedPaths = [...paths];
            const updatedDropdownSelections = [...updatedPaths[pathIndex].dropdownSelections];
            updatedDropdownSelections.splice(dropdownIndex, 1);
            updatedPaths[pathIndex].dropdownSelections = updatedDropdownSelections;
            setPaths(updatedPaths);
        } catch (error) {
            logger.error("Error in removeDropdownSelection", error);
        }
    };
    const addResponseDropdownSelection = (responsePathIndex) => {
        try {
            logger.info("addResponseDropdownSelection executed", { responsePathIndex });
            const updatedResponsePaths = [...responsePaths];

            const currentSelections = updatedResponsePaths[responsePathIndex].dropdownSelections;
            if (currentSelections.some(selection => !selection)) {
                toast.error(intl.formatMessage({ id: "error.select.option", defaultMessage: "Please select an option before adding a new one." }));
                logger.warn('Empty dropdown selection detected in response path', { responsePathIndex });

            } else {
                updatedResponsePaths[responsePathIndex].dropdownSelections.push("");
                updatedResponsePaths[responsePathIndex].error = null;
            }

            setResponsePaths(updatedResponsePaths);
        } catch (error) {
            logger.error("Error in addResponseDropdownSelection", error);
        }
    };

    const handleResponseDropdownChange = (e, responsePathIndex, dropdownIndex) => {
        try {
            const { value } = e.target;
            logger.info("handleResponseDropdownChange executed", { event: e, responsePathIndex, dropdownIndex });
            const updatedResponsePaths = [...responsePaths];

            if (!updatedResponsePaths[responsePathIndex]) {
                console.error(`Invalid response path index: ${responsePathIndex}`);
                return;
            }

            const updatedDropdownSelections = [...(updatedResponsePaths[responsePathIndex].dropdownSelections || [])];
            updatedDropdownSelections[dropdownIndex] = value;
            updatedResponsePaths[responsePathIndex].dropdownSelections = updatedDropdownSelections;

            if (value) {
                updatedResponsePaths[responsePathIndex].error = null;
            }
            updatedResponsePaths[responsePathIndex].byKeyInputs = updatedResponsePaths[responsePathIndex].byKeyInputs || [];
            updatedResponsePaths[responsePathIndex].bySplitInputs = updatedResponsePaths[responsePathIndex].bySplitInputs || [];
            updatedResponsePaths[responsePathIndex].byFormulaInputs = updatedResponsePaths[responsePathIndex].byFormulaInputs || [];

            if (value === "byKey") {
                updatedResponsePaths[responsePathIndex].byKeyInputs[dropdownIndex] =
                    updatedResponsePaths[responsePathIndex].byKeyInputs[dropdownIndex] || { when: "", then: "" };
            } else if (value === "bySplit") {
                updatedResponsePaths[responsePathIndex].bySplitInputs[dropdownIndex] =
                    updatedResponsePaths[responsePathIndex].bySplitInputs[dropdownIndex] || { startPosition: "", delimiter: "" };
            } else if (value === "byFormula") {
                updatedResponsePaths[responsePathIndex].byFormulaInputs[dropdownIndex] =
                    updatedResponsePaths[responsePathIndex].byFormulaInputs[dropdownIndex] || { order: "", delimiter: "" };

                if (!Array.isArray(updatedResponsePaths[responsePathIndex].responsePath1)) {
                    updatedResponsePaths[responsePathIndex].responsePath1 = [];
                }

                updatedResponsePaths[responsePathIndex].selection = "byFormula";
            } else {
                updatedResponsePaths[responsePathIndex].selection = "";
            }

            setResponsePaths(updatedResponsePaths);

        } catch (error) {
            logger.error("Error in handleResponseDropdownChange", error);
        }
    };

    const handleByKeyInputChange = (e, pathIndex, field, index) => {
        try {
            const { value } = e.target;
            logger.info("handleByKeyInputChange executed", { event: e, pathIndex, field, index });
            setResponsePaths((prev) => updatePathsByInput(prev, pathIndex, "byKeyInputs", field, index, value));
        } catch (error) {
            logger.error("Error in handleByKeyInputChange", error);
        }
    };

    const handleBySplitInputChange = (e, pathIndex, field, index) => {
        try {
            const { value } = e.target;
            logger.info("handleBySplitInputChange executed", { event: e, pathIndex, field, index });
            setResponsePaths((prev) => updatePathsByInput(prev, pathIndex, "bySplitInputs", field, index, value));
        } catch (error) {
            logger.error("Error in handleBySplitInputChange", error);
        }
    };

    const handleByFormulaInputChange = (e, pathIndex, field, index) => {
        try {
            const { value } = e.target;
            logger.info("handleByFormulaInputChange executed", { event: e, pathIndex, field, index });
            setResponsePaths((prev) => updatePathsByInput(prev, pathIndex, "byFormulaInputs", field, index, value));
        } catch (error) {
            logger.error("Error in handleByFormulaInputChange", error);
        }
    };

    const removeResponseDropdownSelection = (responsePathIndex, dropdownIndex) => {
        try {
            logger.info("removeResponseDropdownSelection executed", { responsePathIndex, dropdownIndex });
            const updatedResponsePaths = [...responsePaths];
            const updatedDropdownSelections = [...updatedResponsePaths[responsePathIndex].dropdownSelections];
            updatedDropdownSelections.splice(dropdownIndex, 1);
            updatedResponsePaths[responsePathIndex].dropdownSelections = updatedDropdownSelections;
            setResponsePaths(updatedResponsePaths);
        } catch (error) {
            logger.error("Error in removeResponseDropdownSelection", error);
        }
    };

    const addPathFields = () => {
        try {
            logger.info("addPathFields executed");

            setPaths((prev) => [...prev, { id: uniqueId(), path1: "", path2: "", dropdownSelections: [] }]);
        } catch (error) {
            logger.error("Error in addPathFields", error);
        }
    };

    const removePathField = (index) => {
        try {
            logger.info("removePathField executed", { index });
            if (paths.length > 1) {
                setPaths((prevPaths) => prevPaths.filter((_, i) => i !== index));
            }
        } catch (error) {
            logger.error("Error in removePathField", error);
        }
    };

    const handleRemoveHeader = (index) => {
        try {
            logger.info("handleRemoveHeader executed", { index });
            if (headers.length > 1) {
                setHeaders(headers.filter((_, i) => i !== index));
            }
        } catch (error) {
            logger.error("Error in handleRemoveHeader", error);
        }
    };

    const handleApiUrlChange = (event) => {
        try {
            logger.info("handleApiUrlChange executed", { event });
            setApiUrl(event.target.value);
        } catch (error) {
            logger.error("Error in handleApiUrlChange", error);
        }
    };

    const handleApiNameChange = (event) => {
        try {
            logger.info("handleApiNameChange executed", { event });
            setApiName(event.target.value);

        } catch (error) {
            logger.error("Error in handleApiNameChange", error);
        }
    };
    const handleMethodChange = (event) => {
        try {
            logger.info("handleMethodChange executed", { event });
            setMethodType(event.target.value);
        } catch (error) {
            logger.error("Error in handleMethodChange", error);
        }
    };

    const handleTransactionChange = (event) => {
        try {
            logger.info("handleTransactionChange executed", { event });
            setTransactionType(event.target.value);
        } catch (error) {
            logger.error("Error in handleTransactionChange", error);
        }
    };
    const handleResponseChange = (e) => {
        try {
            const { id, value } = e.target;
            logger.info("handleResponseChange executed", { event: e });

            const isXml = value.startsWith('<');

            setJsonResponseBodies((prev) => ({
                ...prev,
                [id]: value,
            }));
            const headers = {
                "Content-Type": isXml ? "text/xml" : "application/json",
            };
            HAxiosService
                .POST(IntegrationFrameworkAPI.path, value, {}, false, headers)
                .then((response) => {
                    if (id === "responsebody1") {
                        setjsonResponsePath(response.data);
                    } else if (id === "responsebody2") {
                        setjsonResponsePath2(response.data);
                    }
                })
                .catch((error) => {
                    console.error("Error making POST request:", error);
                });
        } catch (error) {
            logger.error("Error in handleResponseChange", error);
        }
    };

    const handleJsonChange = (e) => {
        try {
            const { id, value } = e.target;
            logger.info("handleJsonChange executed", { event: e });
            setJsonBodies((prev) => ({
                ...prev,
                [id]: value,
            }));
            HAxiosService
                .POST(IntegrationFrameworkAPI.path, value)
                .then((response) => {
                    if (id === "body1") {
                        setJsonPath(response.data);
                    } else if (id === "body2") {
                        setJsonPath2(response.data);
                    }
                })
                .catch((error) => {
                    console.error("Error making POST request:", error);
                });
        } catch (error) {
            logger.error("Error in handleJsonChange", error);
        }
    };
    const transformHeaders = () => {
        try {
            logger.info("transformHeaders executed");
            const headersObject = {};
            headers.forEach(({ key, value }) => {
                if (key && value) {
                    headersObject[key] = value;
                }
            });
            return headersObject;
        } catch (error) {
            logger.error("Error in transformHeaders", error);
        }
    };

    const buildConversionMap = () => {
        try {
            logger.info("buildConversionMap executed");
            const conversionResponseMap = responsePaths.map((responsePath) => {
                const { responsePath1, responsePath2, dropdownSelections, byKeyInputs, bySplitInputs, byFormulaInputs } = responsePath;
                let transformer = {};
                let transformType = "";

                dropdownSelections.forEach((selection, index) => {
                    if (selection === "byKey" && byKeyInputs[index]) {
                        transformType = "byKey";
                        transformer[byKeyInputs[index].when] = byKeyInputs[index].then;
                    } else if (selection === "bySplit" && bySplitInputs[index]) {
                        transformType = "bySplit";
                        transformer[bySplitInputs[index].startPosition] = bySplitInputs[index].delimiter;
                    } else if (selection === "byFormula" && byFormulaInputs[index]) {
                        transformType = "byFormula";
                        transformer[byFormulaInputs[index].order] = byFormulaInputs[index].delimiter;
                    }
                });

                const productPathString = Array.isArray(responsePath1) ? responsePath1.join(",") : responsePath1;
                const clientPathString = Array.isArray(responsePath2) ? responsePath2.join(",") : responsePath2;

                return {
                    productPath: productPathString,
                    clientPath: clientPathString,
                    "transform-type": transformType,
                    transformer,
                };
            });

            return { conversionResponseMap };
        } catch (error) {
            logger.error("Error in buildConversionMap", error);
        }
    };

    const handleSubmit = () => {
        try {
            logger.info("handleSubmit executed");
            // if (!apiName) {
            //     toast.error("API Name is required");
            //     return;
            // }
            // if (!methodType) {
            //     toast.error("HTTP Method is required");
            //     return;
            // }
            // if (!apiUrl) {
            //     toast.error("API URL is required");
            //     return;
            // }
            // if (!transactionType) {
            //     toast.error("Transaction Type is required");
            //     return;
            // }
            // if (!jsonBodies.body1 || !jsonBodies.body2) {
            //     toast.error("Request bodies are required");
            //     return;
            // }
            // if (!jsonResponseBodies.responsebody1 || !jsonResponseBodies.responsebody2) {
            //     toast.error("Response bodies are required");
            //     return;
            // }

            // if (headers.length === 0 || headers.some(header => !header.key || !header.value)) {
            //     toast.error("Please add valid headers");
            //     return;
            // }


            const isJSON = (str) => {
                try {
                    JSON.parse(str);
                    return true;
                } catch (err) {
                    logger.error("isJSON: invalid JSON", { input: str, error: err });
                    return false;
                }
            };
            const productRequestBody = typeof jsonBodies.body1 === "string" && isJSON(jsonBodies.body1)
                ? JSON.parse(jsonBodies.body1)
                : jsonBodies.body1;
            const clientRequestBody = typeof jsonBodies.body2 === "string" && isJSON(jsonBodies.body2)
                ? JSON.parse(jsonBodies.body2)
                : jsonBodies.body2;

            const productResponseBody = typeof jsonResponseBodies.responsebody1 === "string" && isJSON(jsonResponseBodies.responsebody1)
                ? JSON.parse(jsonResponseBodies.responsebody1)
                : jsonResponseBodies.responsebody1;

            const clientResponseBody = typeof jsonResponseBodies.responsebody2 === "string" && isJSON(jsonResponseBodies.responsebody2)
                ? JSON.parse(jsonResponseBodies.responsebody2)
                : jsonResponseBodies.responsebody2;

            const responsePayload = buildConversionMap();
            const requestPayload = buildRequestConversionMap();


            const { conversionResponseMap } = responsePayload;
            const { conversionRequestMap } = requestPayload;


            const requestBody = {
                productRequestBody,
                clientRequestBody,
                apiName,
                apiUrl,
                requestHeaders: transformHeaders(),
                method: methodType,
                conversionResponseMap,
                conversionRequestMap,
                productResponseBody,
                clientResponseBody,
                transType: transactionType,
            };
            logger.info("Sending request body to server", { requestBody });


            HAxiosService
                .POST(IntegrationFrameworkAPI.apiConfig, requestBody)
                .then((response) => {
                    logger.info("Data sent successfully", { response: response.data });

                    toast.success(intl.formatMessage({ id: "success.data.sent", defaultMessage: "Data sent and received successfully" }));
                })
                .catch((error) => {
                    logger.error("Error during data submission", { error });
                    toast.error(intl.formatMessage({ id: "error.during.request", defaultMessage: "An error occurred during the request." }));
                });
        } catch (error) {
            logger.error("Error in handleSubmit", error);
        }
    };

    const handlePathChange = (index, e) => {
        try {
            logger.info("handlePathChange executed", { index, event: e });
            const updatedPaths = [...paths];
            const { name, value } = e.target;
            updatedPaths[index][name] = Array.isArray(value) ? value : [value];
            setPaths(updatedPaths);
        } catch (error) {
            logger.error("Error in handlePathChange", error);
        }
    };

    const handleResponsePathChange = (index, e) => {
        try {
            logger.info("handleResponsePathChange executed", { index, event: e });
            const updatedResponsePaths = [...responsePaths];
            const { name, value } = e.target;
            updatedResponsePaths[index][name] = Array.isArray(value) ? value : [value];
            setResponsePaths(updatedResponsePaths);
        } catch (error) {
            logger.error("Error in handleResponsePathChange", error);
        }
    };

    const addPathResponseFields = () => {
        try {
            logger.info("addPathResponseFields executed");
            setResponsePaths((prev) => [...prev, { id: uniqueId(), responsePath1: "", responsePath2: "", dropdownSelections: [] }]);
        } catch (error) {
            logger.error("Error in addPathResponseFields", error);
        }
    };

    const removeResponsePathField = (indexOrId) => {
        try {
            logger.info("removeResponsePathField executed", { indexOrId });
            if (responsePaths.length > 1) {
                setResponsePaths((prevResponsePaths) => prevResponsePaths.filter((rp) => rp.id !== indexOrId));
            }
        } catch (error) {
            logger.error("Error in removeResponsePathField", error);
        }
    };

    const addHeaderFields = () => {
        try {
            logger.info("addHeaderFields executed");

            setHeaders((prev) => [...prev, { id: uniqueId(), key: "", value: "" }]);
        } catch (error) {
            logger.error("Error in addHeaderFields", error);
        }
    };
    const handleHeaderChange = (index, key, value) => {
        try {
            logger.info("handleHeaderChange executed", { index, key, value });
            const newHeaders = [...headers];
            newHeaders[index] = { ...newHeaders[index], [key]: value };
            setHeaders(newHeaders);
        } catch (error) {
            logger.error("Error in handleHeaderChange", error);
        }
    };

    const fetchResponsePath2 = async () => {
        return {
            data: {
                responseJson: [
                    ...jsonResponsePath2.map((item) => ({
                        responsePath: item,
                        description: item,
                    })),
                ],
            },
        };
    };
    const fetchRequestPath1 = async () => {
        return {
            data: {
                responseJson: [
                    ...jsonPath.map((item) => ({
                        requestPath: item,
                        description: item,
                    })),
                ],
            },
        };
    };

    return (
        <Paper>
            <HBox style={{ display: "flex", flexDirection: "column", padding: "1rem", borderBottom: "1px solid var(--drs-border-divider, hsl(215 14% 90%))" }} >
                <HBreadCrumb />
                <TitleBar title="label.api.configurator" />
            </HBox>
            <Container
                maxWidth='lg'
                style={{
                    padding: "20px",
                    marginBottom: "1rem",
                    paddingBottom: "2.5rem",
                }}>

                <Grid container spacing={2}>
                    <Grid size={5.6}>
                        <HTextField
                            label={intl.formatMessage({ id: "label.api.name", defaultMessage: "API Name" })}
                            editable
                            value={apiName}
                            onChange={handleApiNameChange}
                            placeholder="Enter API Name"
                            fullWidth
                            InputLabelProps={{
                                sx: {
                                    backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                                    transform: 'translate(14px, 2px) scale(1)',
                                    '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                                }
                            }}
                        />
                    </Grid>
                    <Grid size={5.6}>
                        <HDropdown
                            name="methodType"
                            value={methodType}
                            placeholder={intl.formatMessage({ id: "placeholder.http.method", defaultMessage: "Select HTTP Method" })}
                            width="100%"
                            options={[
                                { label: "GET", value: "GET" },
                                { label: "POST", value: "POST" },
                                { label: "PUT", value: "PUT" },
                                { label: "DELETE", value: "DELETE" }
                            ]}
                            onChange={handleMethodChange}
                        />
                    </Grid>
                    <Grid size={5.6}>
                        <HTextField
                            label={intl.formatMessage({ id: "label.api.url", defaultMessage: "API URL" })}
                            editable
                            value={apiUrl}
                            onChange={handleApiUrlChange}
                            placeholder="Enter API Url"
                            fullWidth
                            InputLabelProps={{
                                sx: {
                                    backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                                    transform: 'translate(14px, 2px) scale(1)',
                                    '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                                }
                            }}
                        />
                    </Grid>
                    <Grid size={5.6}>
                        <HDropdown
                            name="transactionType"
                            value={transactionType}
                            placeholder={intl.formatMessage({ id: "label.transaction.type", defaultMessage: "Select Transaction Type" })}
                            width="100%"
                            options={[
                                { label: "SOAP", value: "SOAP" },
                                { label: "REST", value: "REST" }
                            ]}
                            onChange={handleTransactionChange}
                        />
                    </Grid>
                    <Grid size={12}>
                        <HLabel
                            variant="h7"
                            colon={false}
                            sx={{ fontWeight: "bold", fontSize: "14px", color: text.primary }}
                            value={intl.formatMessage({ id: "label.Headers", defaultMessage: "Headers" })}
                            align="left" />
                        {headers.map((header, index) => (
                            <Grid container spacing={2} key={index} alignItems="center">
                                <Grid size={5.6}>
                                    <HTextField
                                        editable
                                        placeholder="Header Key"
                                        label={intl.formatMessage({ id: "label.Key", defaultMessage: "Key" })}
                                        value={header.key}
                                        onChange={(e) =>
                                            handleHeaderChange(index, "key", e.target.value)
                                        }
                                        fullWidth
                                        InputLabelProps={{
                                            sx: {
                                                backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                                                transform: 'translate(14px, 2px) scale(1)',
                                                '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid size={5.6}>
                                    <HTextField
                                        editable
                                        label={intl.formatMessage({ id: "label.Value", defaultMessage: "Value" })}
                                        placeholder="Header Value"
                                        style={{ backgroundColor: "#EDE8F34D" }}
                                        value={header.value}
                                        onChange={(e) =>
                                            handleHeaderChange(index, "value", e.target.value)
                                        }
                                        fullWidth
                                        InputLabelProps={{
                                            sx: {
                                                backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                                                transform: 'translate(14px, 2px) scale(1)',
                                                '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid container justifyContent="center" size={0.4}>
                                    <IconButton
                                        size="medium"
                                        sx={{}}
                                        onClick={addHeaderFields}
                                        aria-label="add path"
                                    >
                                        <AddCircleIcon />
                                    </IconButton>
                                </Grid>
                                <Grid container justifyContent="center" size={0.2}>
                                    <IconButton
                                        onClick={() => handleRemoveHeader(index)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>

                    <Grid size={5.6}>
                        <HTextarea
                            placeholder={intl.formatMessage({ id: "placeholder.request.body", defaultMessage: "Enter Product Request Body" })}
                            id="body1"
                            width="100%"
                            height="100%"
                            maxLength="500"
                            value={jsonBodies.body1}
                            onChange={handleJsonChange}
                            maxLines={4}
                        />
                    </Grid>

                    <Grid size={5.6}>
                        <HTextarea
                            placeholder={intl.formatMessage({ id: "placeholder.client.request", defaultMessage: "Enter Client Request Body" })}
                            style={{ backgroundColor: "#EDE8F34D" }}
                            id="body2"
                            width="100%"
                            maxLength="500"
                            value={jsonBodies.body2}
                            onChange={handleJsonChange}
                            maxLines={4}
                        />
                    </Grid>

                    <Grid size={12}>
                        <Grid container alignItems="center" justifyContent="space-between" marginBottom={"0.5rem"}>
                            <Grid size={4}>
                                <HLabel
                                    variant="h7"
                                    sx={{ fontWeight: "bold", fontSize: "15px", color: text.primary }}
                                    colon={false}
                                    align="left"
                                    value={intl.formatMessage({ id: "label.path.selections", defaultMessage: "Path Selections for Request Body" })}
                                />
                            </Grid>
                            <Grid container size={1.9}>
                                <HButton
                                    size="small"
                                    variant="outlined"
                                    onClick={addPathFields}
                                    aria-label="add path"
                                    label={intl.formatMessage({ id: "label.add.paths", defaultMessage: "Add Paths" })}
                                />

                            </Grid>
                        </Grid>
                        {paths.map((path, pathIndex) => (
                            <Accordion key={pathIndex} disableGutters

                                style={{ border: "none", boxShadow: "none", padding: 0 }}
                            >
                                <AccordionSummary
                                    style={{ border: "none", boxShadow: "none", padding: 0 }}
                                    aria-controls={`panel${pathIndex}-content`}
                                    id={`panel${pathIndex}-header`}
                                >
                                    <Grid container spacing={2} alignItems="center"   >
                                        <Grid size={5.6}>
                                            {path.dropdownSelections.includes("byFormula") ? (
                                                <SearchCommonBox
                                                    searchCode="RequestPath1"
                                                    searchDependentInput={JSON.stringify(jsonPath)}
                                                    customFetchFunction={fetchRequestPath1}
                                                    multiSelect
                                                    searchBoxWidth="100%"
                                                    selectedValue={path.path1}
                                                    selectedColumn="requestPath"
                                                    gridDefObj={responsePath2GridDefObj}
                                                    placeholder={intl.formatMessage({ id: "placeholder.select.path1", defaultMessage: "Select Path 1" })}
                                                    setSelectedValue={(value) =>
                                                        handlePathChange(pathIndex, {
                                                            target: {
                                                                name: "path1",
                                                                value,
                                                            },
                                                        })
                                                    }
                                                />
                                            ) : (
                                                <HDropdown
                                                    name="path1"
                                                    width="100%"
                                                    value={
                                                        Array.isArray(path.path1)
                                                            ? path.path1[0] || ""
                                                            : path.path1
                                                    }
                                                    placeholder={intl.formatMessage({ id: "placeholder.select.path1", defaultMessage: "Select Path 1" })}
                                                   options={[
                                                    ...jsonPath.map((item) => ({
                                                        label: item,
                                                        value: item,
                                                    })),
                                                ]}
                                                    onChange={(e) => handlePathChange(pathIndex, e)}
                                                />
                                            )}
                                        </Grid>

                                        <Grid size={5.6}>
                                            <HDropdown
                                                name="path2"
                                                width="100%"
                                                value={Array.isArray(path.path2) ? path.path2[0] : path.path2}
                                                placeholder={intl.formatMessage({ id: "placeholder.select.path2", defaultMessage: "Select Path 2" })}
                                                options={[
                                                    ...jsonPath2.map((item) => ({
                                                        label: item,
                                                        value: item,
                                                    })),
                                                ]}
                                                onChange={(e) => handlePathChange(pathIndex, e)}
                                            />
                                        </Grid>

                                        <Grid container justifyContent="center" size={0.4}>
                                            <Tooltip title="Transform">
                                                <HBox
                                                    disabled={path.dropdownSelections.includes("bySplit") || path.dropdownSelections.includes("byFormula")}
                                                    sx={{
                                                        width: 25,
                                                        height: 25,
                                                        backgroundColor: surfaces.paper,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: "bold",
                                                        borderRadius: "1rem",
                                                        color: "white",
                                                        cursor: "pointer",
                                                        visibility: path.dropdownSelections.includes("bySplit") || path.dropdownSelections.includes("byFormula")
                                                            ? "hidden"
                                                            : "visible",
                                                    }}
                                                    onClick={(e) => handleTClick(e, pathIndex)}
                                                    aria-label="add dropdown selection"
                                                >
                                                    <HLabel
                                                        value="T"
                                                        colon={false}
                                                        align="left"
                                                        sx={{ fontWeight: "bold", color: text.primary, fontSize: "14px" }} />
                                                </HBox>
                                            </Tooltip>
                                        </Grid>

                                        <Grid container justifyContent="center" size={0.2}>
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removePathField(pathIndex);
                                                }}
                                                aria-label="remove path"
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Grid>
                                        <Grid size={0.1}>
                                            <ExpandMore style={{ transform: "none", margin: 0 }} />
                                        </Grid>
                                    </Grid>
                                </AccordionSummary>

                                <AccordionDetails>
                                    <Grid container spacing={1}>
                                        {path.dropdownSelections.map((selection, dropdownIndex) => (
                                            <React.Fragment key={dropdownIndex}>
                                                <Grid size={3}>
                                                    <HDropdown
                                                        width="100%"
                                                        value={selection}
                                                        placeholder={intl.formatMessage({ id: "placeholder.select.option", defaultMessage: "Select an option" })}
                                                        options={[
                                                            { label: "Select an option", value: "" },
                                                            {
                                                                label: "By Key",
                                                                value: "byKey",
                                                            },
                                                            {
                                                                label: "By Split",
                                                                value: "bySplit",
                                                            },
                                                            {
                                                                label: "By Formula",
                                                                value: "byFormula",
                                                            },
                                                        ]}
                                                        onChange={(e) => handleDropdownChange(e, pathIndex, dropdownIndex)}
                                                    />
                                                </Grid>

                                                {selection === "bySplit" && (
                                                    <>
                                                        <Grid size={4}>
                                                            <HTextField
                                                                label={intl.formatMessage({ id: "label.start.position", defaultMessage: "Start Position" })}
                                                                editable
                                                                fullWidth
                                                                value={path.bySplitInputs[dropdownIndex]?.startPosition || ""}
                                                                onChange={(e) => handleRequestBySplitInputChange(e, pathIndex, "startPosition", dropdownIndex)}
                                                                InputLabelProps={{
                                                                    sx: {
                                                                        backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                                                                        transform: 'translate(14px, 2px) scale(1)',
                                                                        '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                                                                    }
                                                                }} />
                                                        </Grid>
                                                        <Grid size={4}>
                                                            <HTextField
                                                                label={intl.formatMessage({ id: "label.delimiter", defaultMessage: "Delimiter" })}
                                                                editable
                                                                value={path.bySplitInputs[dropdownIndex]?.delimiter || ""}
                                                                onChange={(e) => handleRequestBySplitInputChange(e, pathIndex, "delimiter", dropdownIndex)}
                                                                colourSpacing
                                                                fullWidth
                                                                InputLabelProps={{
                                                                    sx: {
                                                                        backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                                                                        transform: 'translate(14px, 2px) scale(1)',
                                                                        '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                                                                    }
                                                                }}
                                                            />
                                                        </Grid>
                                                    </>
                                                )}

                                                {selection === "byFormula" && (
                                                    <>
                                                        <Grid size={4}>
                                                            <HTextField
                                                                label={intl.formatMessage({ id: "label.order", defaultMessage: "Order" })}
                                                                editable
                                                                value={path.byFormulaInputs[dropdownIndex]?.order || ""}
                                                                onChange={(e) => handleRequestByFormulaInputChange(e, pathIndex, "order", dropdownIndex)}
                                                                fullWidth
                                                                InputLabelProps={{
                                                                    sx: {
                                                                        backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                                                                        transform: 'translate(14px, 2px) scale(1)',
                                                                        '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                                                                    }
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid size={4}>
                                                            <HTextField
                                                                label={intl.formatMessage({ id: "label.delimiter", defaultMessage: "Delimiter" })}
                                                                editable
                                                                value={path.byFormulaInputs[dropdownIndex]?.delimiter || ""}
                                                                onChange={(e) => handleRequestByFormulaInputChange(e, pathIndex, "delimiter", dropdownIndex)}
                                                                fullWidth
                                                                colourSpacing
                                                                InputLabelProps={{
                                                                    sx: {
                                                                        backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                                                                        transform: 'translate(14px, 2px) scale(1)',
                                                                        '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                                                                    }
                                                                }}
                                                            />
                                                        </Grid>
                                                    </>
                                                )}

                                                {selection === "byKey" && (
                                                    <>
                                                        <Grid size={4}>
                                                            <HTextField
                                                                label={intl.formatMessage({ id: "label.When", defaultMessage: "When" })}
                                                                editable
                                                                value={path.byKeyInputs[dropdownIndex]?.when || ""}
                                                                onChange={(e) => handleRequestByKeyInputChange(e, pathIndex, "when", dropdownIndex)}
                                                                fullWidth
                                                                InputLabelProps={{
                                                                    sx: {
                                                                        backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                                                                        transform: 'translate(14px, 2px) scale(1)',
                                                                        '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                                                                    }
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid size={4}>
                                                            <HTextField
                                                                label={intl.formatMessage({ id: "label.Then", defaultMessage: "Then" })}
                                                                editable
                                                                value={path.byKeyInputs[dropdownIndex]?.then || ""}
                                                                onChange={(e) => handleRequestByKeyInputChange(e, pathIndex, "then", dropdownIndex)}
                                                                fullWidth
                                                                InputLabelProps={{
                                                                    sx: {
                                                                        backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                                                                        transform: 'translate(14px, 2px) scale(1)',
                                                                        '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                                                                    }
                                                                }}
                                                            />
                                                        </Grid>
                                                    </>
                                                )}

                                                <Grid container justifyContent="right" size={0.4}>
                                                    <Tooltip title="Remove Transform" arrow>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => removeDropdownSelection(pathIndex, dropdownIndex)}
                                                            aria-label="remove dropdown selection"
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                            </React.Fragment>
                                        ))}
                                    </Grid>
                                </AccordionDetails>

                            </Accordion>
                        ))}
                    </Grid>


                    <Grid size={5.6}>
                        <HTextarea
                            width="100%"
                            placeholder={intl.formatMessage({ id: "placeholder.product.response", defaultMessage: "Enter Product Response Body" })}
                            id="responsebody1"
                            maxLength="500"
                            value={jsonResponseBodies.responsebody1}
                            onChange={handleResponseChange}
                            maxLines={5}
                        />
                    </Grid>
                    <Grid size={5.6}>
                        <HTextarea
                            width="100%"
                            placeholder={intl.formatMessage({ id: "placeholder.client.response", defaultMessage: "Enter Client Response Body" })}
                            maxLines={5}
                            maxLength="500"
                            id="responsebody2"
                            value={jsonResponseBodies.responsebody2}
                            onChange={handleResponseChange}
                        />
                    </Grid>

                    <Grid size={12}>
                        <Grid container alignItems="center" justifyContent="space-between" marginBottom={"0.5rem"} >
                            <Grid size={4}>
                                <HLabel
                                    colon={false}
                                    sx={{ fontWeight: "bold", fontSize: "15px", color: text.primary }}
                                    align="left"
                                    value={intl.formatMessage({ id: "label.path.selections.response", defaultMessage: "Path Selections for Response Body" })}
                                />
                            </Grid>
                            <Grid container size={1.9}>
                                <HButton
                                    variant="outlined"
                                    size="small"
                                    label={intl.formatMessage({ id: "label.add.paths", defaultMessage: "Add Paths" })}
                                    onClick={addPathResponseFields}
                                    aria-label="add response path"
                                />
                            </Grid>
                        </Grid>

                        {responsePaths.map((responsePath, responsePathIndex) => (
                            <Accordion key={responsePathIndex} disableGutters

                                style={{ border: "none", boxShadow: "none", padding: 0 }}
                            >
                                <AccordionSummary
                                    style={{ border: "none", boxShadow: "none", padding: 0 }}
                                    aria-controls={`panel${responsePathIndex}-content`}
                                    id={`panel${responsePathIndex}-header`}
                                >
                                    <Grid container spacing={2} alignItems="center"   >
                                        <Grid size={5.6}>
                                            <HDropdown
                                                name="responsePath1"
                                                width="100%"
                                                value={
                                                    Array.isArray(responsePath.responsePath1)
                                                        ? responsePath.responsePath1[0]
                                                        : responsePath.responsePath1
                                                }
                                                placeholder={intl.formatMessage({ id: "placeholder.response.path1", defaultMessage: "Select Response Path 1" })}
                                                options={[
                                                    ...jsonResponsePath.map((item) => ({
                                                        label: item,
                                                        value: item,
                                                    })),
                                                ]}
                                                onChange={(e) =>
                                                    handleResponsePathChange(responsePathIndex, e)
                                                }
                                            />
                                        </Grid>

                                        <Grid size={5.6}>
                                            {responsePath.dropdownSelections.includes("byFormula") ? (
                                                <SearchCommonBox
                                                    searchCode="ResponsePath2"
                                                    searchDependentInput={JSON.stringify(jsonResponsePath2)}
                                                    customFetchFunction={fetchResponsePath2}
                                                    multiSelect
                                                    searchBoxWidth="100%"
                                                    selectedValue={responsePath.responsePath2}
                                                    selectedColumn="responsePath"
                                                    gridDefObj={responsePath2GridDefObj}
                                                    placeholder={intl.formatMessage({ id: "placeholder.response.path2", defaultMessage: "Select Response Path 2" })}
                                                    setSelectedValue={(value) =>
                                                        handleResponsePathChange(responsePathIndex, {
                                                            target: {
                                                                name: "responsePath2",
                                                                value,
                                                            },
                                                        })
                                                    }
                                                />
                                            ) : (
                                                <HDropdown
                                                    name="responsePath2"
                                                    placeholder={intl.formatMessage({ id: "placeholder.response.path2", defaultMessage: "Select Response Path 2" })}
                                                    width="100%"
                                                    value={
                                                        Array.isArray(responsePath.responsePath2)
                                                            ? responsePath.responsePath2[0] || ""
                                                            : responsePath.responsePath2
                                                    }
                                                    options={[
                                                        ...jsonResponsePath2.map((item) => ({
                                                            label: item,
                                                            value: item,
                                                        })),
                                                    ]}
                                                    onChange={(e) =>
                                                        handleResponsePathChange(responsePathIndex, e)
                                                    }
                                                />
                                            )}

                                        </Grid>

                                        <Grid container justifyContent="center" size={0.4}>
                                            <Tooltip title="Transform">
                                                <HBox
                                                    disabled={responsePath.dropdownSelections.includes("bySplit") || responsePath.dropdownSelections.includes("byFormula")}
                                                    sx={{
                                                        width: 25,
                                                        height: 25,
                                                        backgroundColor: surfaces.paper,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: "bold",
                                                        color: "white",
                                                        cursor: "pointer",
                                                        borderRadius: "1rem",
                                                        visibility:
                                                            responsePath.dropdownSelections.includes("bySplit") ||
                                                                responsePath.dropdownSelections.includes("byFormula")
                                                                ? "hidden"
                                                                : "visible",
                                                    }}
                                                    onClick={(e) => handleResponseTClick(e, responsePathIndex)}

                                                >
                                                    <HLabel
                                                        value="T"
                                                        colon={false}
                                                        align="left"
                                                        sx={{ fontWeight: "bold", color: text.primary, fontSize: "14px" }} />
                                                </HBox>
                                            </Tooltip>
                                        </Grid>

                                        <Grid container justifyContent="right" size={0.2}>
                                            <IconButton
                                                sx={{ marginRight: "-19px" }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeResponsePathField(responsePathIndex);
                                                }}
                                                aria-label="remove  reposne path"
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Grid>

                                        <Grid size={0.1}>
                                            <ExpandMore style={{ transform: "none", margin: 0 }} />
                                        </Grid>
                                    </Grid>
                                </AccordionSummary>

                                <AccordionDetails>
                                    <Grid container spacing={1}>
                                        {responsePath.dropdownSelections.map((selection, dropdownIndex) => (
                                            <React.Fragment key={dropdownIndex} >
                                                <Grid size={4}>
                                                    <HDropdown
                                                        width="100%"
                                                        value={selection}
                                                        placeholder={intl.formatMessage({ id: "placeholder.select.option", defaultMessage: "Select an option" })}
                                                        options={[
                                                            { label: "Select an option", value: "" },
                                                            {
                                                                label: "By Key",
                                                                value: "byKey",
                                                            },
                                                            {
                                                                label: "By Split",
                                                                value: "bySplit",
                                                            },
                                                            {
                                                                label: "By Formula",
                                                                value: "byFormula",
                                                            },
                                                        ]}
                                                        onChange={(e) =>
                                                            handleResponseDropdownChange(
                                                                e,
                                                                responsePathIndex,
                                                                dropdownIndex
                                                            )
                                                        }
                                                    />
                                                </Grid>

                                                {selection === "bySplit" && (
                                                    < >
                                                        <Grid size={3.5}>
                                                            <HTextField
                                                                label={intl.formatMessage({ id: "label.start.position", defaultMessage: "Start Position" })}
                                                                editable value={responsePath.bySplitInputs[dropdownIndex]?.startPosition || ""}
                                                                onChange={(e) => handleBySplitInputChange(e, responsePathIndex, "startPosition", dropdownIndex)} fullWidth
                                                                InputLabelProps={{
                                                                    sx: {
                                                                        backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                                                                        transform: 'translate(14px, 2px) scale(1)',
                                                                        '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                                                                    }
                                                                }} />
                                                        </Grid>
                                                        <Grid size={3.5}>
                                                            <HTextField
                                                                label={intl.formatMessage({ id: "label.delimiter", defaultMessage: "Delimiter" })}
                                                                editable value={responsePath.bySplitInputs[dropdownIndex]?.delimiter || ""}
                                                                onChange={(e) => handleBySplitInputChange(e, responsePathIndex, "delimiter", dropdownIndex)} fullWidth colourSpacing
                                                                InputLabelProps={{
                                                                    sx: {
                                                                        backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                                                                        transform: 'translate(14px, 2px) scale(1)',
                                                                        '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                                                                    }
                                                                }} />
                                                        </Grid>
                                                    </>
                                                )}

                                                {selection === "byFormula" && (
                                                    <>
                                                        <Grid size={3.5}>
                                                            <HTextField
                                                                label={intl.formatMessage({ id: "label.order", defaultMessage: "Order" })}
                                                                editable value={responsePath.byFormulaInputs[dropdownIndex]?.order || ""}
                                                                onChange={(e) => handleByFormulaInputChange(e, responsePathIndex, "order", dropdownIndex)} fullWidth
                                                                InputLabelProps={{
                                                                    sx: {
                                                                        backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                                                                        transform: 'translate(14px, 2px) scale(1)',
                                                                        '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                                                                    }
                                                                }} />
                                                        </Grid>
                                                        <Grid size={3.5}>
                                                            <HTextField
                                                                label={intl.formatMessage({ id: "label.delimiter", defaultMessage: "Delimiter" })}
                                                                editable value={responsePath.byFormulaInputs[dropdownIndex]?.delimiter || ""}
                                                                onChange={(e) => handleByFormulaInputChange(e, responsePathIndex, "delimiter", dropdownIndex)} fullWidth colourSpacing
                                                                InputLabelProps={{
                                                                    sx: {
                                                                        backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                                                                        transform: 'translate(14px, 2px) scale(1)',
                                                                        '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                                                                    }
                                                                }} />
                                                        </Grid>
                                                    </>
                                                )}

                                                {selection === "byKey" && (
                                                    <>
                                                        <Grid size={3.5}>
                                                            <HTextField
                                                                label={intl.formatMessage({ id: "label.When", defaultMessage: "When" })}
                                                                editable value={responsePath.byKeyInputs[dropdownIndex]?.when || ""}
                                                                onChange={(e) => handleByKeyInputChange(e, responsePathIndex, "when", dropdownIndex)} fullWidth
                                                                InputLabelProps={{
                                                                    sx: {
                                                                        backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                                                                        transform: 'translate(14px, 2px) scale(1)',
                                                                        '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                                                                    }
                                                                }} />
                                                        </Grid>
                                                        <Grid size={3.5}>
                                                            <HTextField
                                                                label={intl.formatMessage({ id: "label.Then", defaultMessage: "Then" })}
                                                                editable value={responsePath.byKeyInputs[dropdownIndex]?.then || ""}
                                                                onChange={(e) => handleByKeyInputChange(e, responsePathIndex, "then", dropdownIndex)} fullWidth
                                                                InputLabelProps={{
                                                                    sx: {
                                                                        backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                                                                        transform: 'translate(14px, 2px) scale(1)',
                                                                        '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                                                                    }
                                                                }} />
                                                        </Grid>
                                                    </>
                                                )}

                                                <Grid container size={1}>
                                                    <Tooltip title="Remove Transform" arrow>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => removeResponseDropdownSelection(responsePathIndex, dropdownIndex)}
                                                            aria-label="remove dropdown selection"
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                            </React.Fragment>
                                        ))}
                                    </Grid>
                                </AccordionDetails>

                            </Accordion>
                        ))}
                    </Grid>

                </Grid>
                <HBox sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "19px",
                    backgroundColor: "transparent"
                }}>
                    <HButton
                        label={intl.formatMessage({ id: "Submit", defaultMessage: "Submit" })}
                        variant="outlined"
                        size="small"
                        onClick={handleSubmit}
                    />

                </HBox>
            </Container>
        </Paper>
    );
};

export default ApiConfiguration;
