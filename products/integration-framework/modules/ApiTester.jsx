import React, { useState,useRef  } from "react";
import { useToast, HAxiosService, HBox, HButton, HLabel, HTextField, HDropdown, HTextarea, useDrsTheme, TitleBar, HBreadCrumb } from "@helix/component-library";
import { IntegrationFrameworkAPI } from "./apiEndpoints";
import { logger } from "@helix/component-library";
import {Container,Select,MenuItem,IconButton,Paper,InputLabel,FormControl,Tabs,Tab,Card,CardHeader,CardContent,} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import MetadataTable from "./MetadataTable";
import { KJUR } from "jsrsasign";
import OAuthPopup from "./OAuthPopup";

import { useIntl } from "react-intl";

const jwtAlgorithms = [
  "HS256",
  "HS384",
  "HS512",
  "RS256",
  "RS384",
  "RS512",
  "ES256",
  "ES384",
  "ES512",
  "PS256",
  "PS384",
  "PS512",
];
const ApiTester = () => {
  const uniqueId = () => `qp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  const [httpMethod, setHttpMethod] = useState("GET");
  const [apiUrl, setApiUrl] = useState("");
  const [tabValue, setTabValue] = useState("headers");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [queryParams, setQueryParams] = useState([{ id: uniqueId(), key: "", value: "" }]);
  const [requestBodyType, setRequestBodyType] = useState("none");
  const [requestBody, setRequestBody] = useState("");
  const [formData, setFormData] = useState([
    { type: "text", key: "", value: "", id: `fd-${Date.now()}-${Math.random().toString(36).slice(2, 11)}` },
  ]);
  const [topicName, setTopicName] = useState("");
  const [urlIdentifier, setUrlIdentifier] = useState("");
  const [metadata, setMetadata] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedPrimaryKey, setSelectedPrimaryKey] = useState(null);
  const [selectedNullChecks, setSelectedNullChecks] = useState([]);
  const [tableOptions, setTableOptions] = useState([]);
  const [formData1] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [jsonBody1, setJsonBody1] = useState(null);
  const [xmlBody, setXmlBody] = useState(null);

  const [formDataObj, setFormDataObj] = useState(null);
  const [queryString1, setQueryString1] = useState(null);
  const [fullUrl1, setFullUrl1] = useState(null);
  const [bodyType, setBodyType] = useState("json"); // or any default value
  const [authType, setAuthType] = useState("no-auth");
  const [apiKey, setApiKey] = useState("");
  const [apiValue, setApiValue] = useState("");
  const [addTo, setAddTo] = useState("header");
  const [jwtAlgorithm, setJwtAlgorithm] = useState("");
  const [secret, setSecret] = useState("");
  const [payload, setPayload] = useState("");
  const [jwtLocation, setJwtLocation] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bearerToken, setBearerToken] = useState("");
  const toast = useToast();
  const intl = useIntl();
  const { themeVars, surfaces, text, border, action, colors, isDark } = useDrsTheme();
  const metadataTableRef = useRef(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleBearerTokenChange = (e) => {
    setBearerToken(e.target.value);
  };
  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleApiValueChange = (event) => {
    setApiValue(event.target.value);
  };

  const handleAddToChange = (event) => {
    setAddTo(event.target.value);
  };

  const handleAuthTypeChange = (event) => {
    setAuthType(event.target.value);
  };

  const [dbCredentials, setDbCredentials] = useState({
    dbUrl: "",
    dbUsername: "",
    dbPassword: "",
  });
  const [errorShown, setErrorShown] = useState(false);
  const [successShown, setSuccessShown] = useState(false);

  const validateDbCredentials = () => {
    let validationErrors = {};
    if (!dbCredentials.dbUrl)
      validationErrors.dbUrl = "Database URL is required";
    if (!dbCredentials.dbUsername)
      validationErrors.dbUsername = "Database Username is required";
    if (!dbCredentials.dbPassword)
      validationErrors.dbPassword = "Database Password is required";
    return validationErrors;
  };
  const handleTestConnection = async () => {
    const validationErrors = validateDbCredentials();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      logger.info('Validation errors found, returning early.');
      return;
    }
    const formDataToSend = new FormData();

    formDataToSend.append("dbUrl", dbCredentials.dbUrl);
    formDataToSend.append("dbUsername", dbCredentials.dbUsername);
    formDataToSend.append("dbPassword", dbCredentials.dbPassword);
    try {
      logger.info(`Testing database connection with URL: ${dbCredentials.dbUrl}`);
      const response = await HAxiosService.POST(IntegrationFrameworkAPI.testDbConnection,formDataToSend,{},false,{"Content-Type": "multipart/form-data",});
      
      if (response.data.tables) {
        setTableOptions(response.data.tables.split(", "));
      }

      if (response.data.valid) {
        if (!successShown) {
          logger.info('Database connection successful.');
          toast.success(intl.formatMessage({id:"success.connection",defaultMessage:"Database connection successful"}));
          setSuccessShown(true);
        }
      } else if (!errorShown) {
        logger.error('Database connection failed.');
        toast.error(intl.formatMessage({id:"error.connection",defaultMessage:"Database connection failed"}));
        setErrorShown(true);
      }
    } catch (error) {
      logger.error(`Error testing database connection: ${error.message}`);
      if (!errorShown) {
        toast.error(intl.formatMessage({id:"error.connection.test",defaultMessage:"Error testing database connection"}));
        setErrorShown(true);
      }
    }
  };
  const handleDbCredentialsChange = (event) => {
    const { name, value } = event.target;
    setDbCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const generateJwtToken = () => {
    const header = { alg: jwtAlgorithm, typ: "JWT" };
    const token = KJUR.jws.JWS.sign(
      null,
      header,
      payload,
      { utf8: secret }
    );
    return token;
  };

  // Helpers to reduce cognitive complexity in handleSendRequest
  const buildQueryString = (params) =>
    params
      .filter((p) => p.key && p.value)
      .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
      .join("&");

  const buildRequestHeaders = (hdrs) =>
    hdrs
      .filter((h) => h.key && h.value)
      .reduce((acc, h) => {
        acc[h.key] = h.value;
        return acc;
      }, {});

  const applyAuth = ({ type, addTo, jwtLocation, apiKey, apiValue, bearerToken, username, password, jwtToken }, fullUrl, requestHeaders, queryString) => {
    const hdrs = { ...requestHeaders };
    let updatedUrl = fullUrl;
    let updatedQuery = queryString;

    const appendQueryParam = (key, value) => {
      updatedUrl += `${updatedUrl.includes("?") ? "&" : "?"}${key}=${value}`;
      updatedQuery += `${updatedQuery ? "&" : ""}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    };

    if (type === "jwt") {
      if (jwtLocation === "header") hdrs["Authorization"] = `Bearer ${jwtToken}`;
      else appendQueryParam("token", jwtToken);
    } else if (type === "api_key") {
      if (addTo === "header") hdrs[apiKey] = apiValue;
      else appendQueryParam(apiKey, apiValue);
    } else if (type === "Bearer_token") {
      hdrs["Authorization"] = `Bearer ${bearerToken}`;
    } else if (type === "basic_auth") {
      const basicAuth = btoa(username + ":" + password);
      hdrs["Authorization"] = `Basic ${basicAuth}`;
    }

    return { fullUrl: updatedUrl, requestHeaders: hdrs, updatedQuery };
  };

  const sendHttpRequest = async ({ url, method, headers, bodyTypeLocal, requestBodyTypeLocal, requestBodyLocal, formDataLocal }) => {
    if (requestBodyTypeLocal === "form-data") {
      const fd = new FormData();
      formDataLocal.forEach(({ key, value, type }) => {
        if ((type === "file" || type === "text") && value) {
          fd.append(key, value);
        }
      });
      setFormDataObj(formDataLocal);
      return fetch(url, { method, headers, body: fd });
    }

    if (requestBodyTypeLocal === "body") {
      if (bodyTypeLocal === "json") {
        // Parse JSON body and allow any parsing error to propagate to the caller
        const jsonBody = JSON.parse(requestBodyLocal);
        setJsonBody1(jsonBody);
        return fetch(url, { method, headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(jsonBody) });
      }

      if (bodyTypeLocal === "xml") {
        setXmlBody(requestBodyLocal);
        return fetch(url, { method, headers: { "Content-Type": "application/xml", ...headers }, body: requestBodyLocal });
      }
    }

    return fetch(url, { method, headers });
  };

  const parseResponse = async (response) => {
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const contentType = response.headers.get("Content-Type") || "";
    if (contentType.includes("application/json")) return { data: await response.json(), contentType };
    if (contentType.includes("application/xml") || contentType.includes("text/xml")) return { data: await response.text(), contentType };
    if (contentType.includes("text/plain")) return { data: await response.text(), contentType };
    throw new Error("Unsupported response type");
  };

  const fetchMetadataFromResponse = async (responseDataLocal, contentTypeLocal) => {
    const metadataApiUrl = contentTypeLocal.includes("application/json")
      ? "http://10.141.51.105:8082/integration-producer-service/integration-api/json-metadata"
      : "http://10.141.51.105:8082/integration-producer-service/integration-api/xml-metadata";

    const metadataResponse = await fetch(metadataApiUrl, {
      method: "POST",
      headers: { "Content-Type": contentTypeLocal.includes("application/json") ? "application/json" : "application/xml" },
      body: contentTypeLocal.includes("application/json") ? JSON.stringify(responseDataLocal) : responseDataLocal,
    });

    if (!metadataResponse.ok) throw new Error(`Metadata API error! Status: ${metadataResponse.status}`);
    return metadataResponse.json();
  };

  const handleSendRequest = async () => {
    try {
      const queryString = buildQueryString(queryParams);
      let fullUrl = queryString ? `${apiUrl}?${queryString}` : apiUrl;
      const requestHeaders = buildRequestHeaders(headers);

      logger.info(`sending request to URL: ${fullUrl}`);

      const jwtToken = authType === "jwt" ? generateJwtToken() : null;
      const authResult = applyAuth({ type: authType, addTo, jwtLocation, apiKey, apiValue, bearerToken, username, password, jwtToken }, fullUrl, requestHeaders, queryString);
      fullUrl = authResult.fullUrl;
      const finalHeaders = authResult.requestHeaders;
      const updatedQueryString = authResult.updatedQuery || queryString;

      setFullUrl1(decodeURIComponent(fullUrl));
      setQueryString1(decodeURIComponent(updatedQueryString));

      console.log("Decoded Query String:", decodeURIComponent(updatedQueryString));
      console.log("queryParams :", queryParams);
      console.log("Updated URL:", fullUrl);
      console.log("Updated Request Headers:", finalHeaders);

      const response = await sendHttpRequest({ url: fullUrl, method: httpMethod, headers: finalHeaders, bodyTypeLocal: bodyType, requestBodyTypeLocal: requestBodyType, requestBodyLocal: requestBody, formDataLocal: formData });

      const { data: parsedData, contentType } = await parseResponse(response);
      setResponseData(parsedData);

      const metadata = await fetchMetadataFromResponse(parsedData, contentType);
      setMetadata(metadata);
      console.log("Metadata:", metadata);
    } catch (error) {
      logger.error(`Error sending request: ${error.message}`);
    }
  };

  const handleAddHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const handleRemoveHeader = (index) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const handleHeaderChange = (index, key, value) => {
    const newHeaders = [...headers];
    newHeaders[index] = { ...newHeaders[index], [key]: value };
    setHeaders(newHeaders);
  };

  const handleAddQueryParam = () => {
    setQueryParams((prev) => [...prev, { id: uniqueId(), key: "", value: "" }]);
  };

  const handleRemoveQueryParam = (id) => {
    setQueryParams((prev) => prev.filter((p) => p.id !== id));
  };

  const handleQueryParamChange = (index, key, value) => {
    setQueryParams((prev) => prev.map((p, i) => (i === index ? { ...p, [key]: value } : p)));
  };

  const handleTypeChange = (index, type) => {
    const newFormData = [...formData];
    newFormData[index].type = type;
    setFormData(newFormData);
  };

  const handleFormDataChange = (index, key, value) => {
    const newFormData = [...formData];
    newFormData[index][key] = value;
    setFormData(newFormData);
  };

  const handleAddFormData = () => {
    setFormData([
      ...formData,
      { type: "text", key: "", value: "", id: `fd-${Date.now()}-${Math.random().toString(36).slice(2, 11)}` },
    ]);
  };

  const handleRemoveFormData = (index) => {
    setFormData(formData.filter((_, i) => i !== index));
  };

  const handleDataTypeChange = (event, index) => {
    const { value } = event.target;
    const newMetadata = [...metadata];
    newMetadata[index] = {
      ...newMetadata[index],
      dataType: value,
      format: "",
      maxColumnLength: "",
    };
    setMetadata(newMetadata);
    console.log("Updated handleDataTypeChange: ", newMetadata);
    validateField(index, "dataType", event.target.value);
  };

  const handleMaxColumnLengthChange = (event, index) => {
    let { value } = event.target;

    const newMetadata = [...metadata];

    if (metadata[index].dataType === "Date") {
      value = value
        .toLowerCase()
        .replaceAll(/[^dmy/-]/gi, "")
        .replaceAll(/m/g, "M");
      newMetadata[index] = { ...newMetadata[index], format: value };
      setMetadata(newMetadata);
      console.log("Updated Metadata: ", newMetadata);
      validateField(index, "format", value);
    } else if (metadata[index].dataType === "Timestamp") {
      value = value.toLowerCase().replaceAll(/[^dmyhs/: -]/gi, "");
      value = value.replaceAll(/(?<!h)m/g, "M");
      value = value.replaceAll(/h/g, "H");
      value = value.replaceAll(/(?<=HH:)M/g, "m");
      value = value.replaceAll(/(?<=HH:).*?M/g, (match) => match.toLowerCase());
      value = value.replaceAll(/'S/g, "'s");
      newMetadata[index] = { ...newMetadata[index], format: value };
      setMetadata(newMetadata);
      console.log("Updated Metadata: ", newMetadata);
      validateField(index, "format", value);
    } else if (metadata[index].dataType === "Double") {
      value = value.replace(/[^\d.]/g, "");
      const dotIndex = value.indexOf(".");
      if (dotIndex !== -1) {
        value =
          value.substring(0, dotIndex + 1) +
          value.substring(dotIndex + 1).replace(".", "");
      }
      newMetadata[index] = { ...newMetadata[index], maxColumnLength: value };
      setMetadata(newMetadata);
      console.log("Updated Metadata: ", newMetadata);
      validateField(index, "maxColumnLength", value);
    } else {
      value = value.replace(/\D/g, "");
      newMetadata[index] = { ...newMetadata[index], maxColumnLength: value };
      setMetadata(newMetadata);
      console.log("Updated Metadata: ", newMetadata);
      validateField(index, "maxColumnLength", value);
    }
  };

  const handlePrimaryKeyChange = (index) => {
    setSelectedPrimaryKey(index);
    const newFormData = [...formData1];
    newFormData[index] = {
      ...newFormData[index],
      primaryKey: metadata[index].columnName,
    };
    setFormData(newFormData);
  };

  const handleNullChange = (index, isDoubleClick = false) => {
    let updatedSelection;

    if (selectedNullChecks.includes(index)) {
      if (isDoubleClick) {
        updatedSelection = selectedNullChecks.filter((i) => i !== index);
        const newFormData = [...formData1];
        newFormData[index] = {
          ...newFormData[index],
          nullCheck: null,
        };
        setFormData(newFormData);
      } else {
        return;
      }
    } else {
      updatedSelection = [...selectedNullChecks, index];
      const newFormData = [...formData1];
      newFormData[index] = {
        ...newFormData[index],
        nullCheck: metadata[index].columnName,
      };
      setFormData(newFormData);
    }

    setSelectedNullChecks(updatedSelection);
  };

  const handleTableNameChange = (newValue, index) => {
    const newMetadata = [...metadata];
    newMetadata[index].tableNameColumnName = newValue;
    setMetadata(newMetadata);
    validateField(index, "tableNameColumnName", newValue);
  };

  const handleInputChange = (event, index) => {
    const { value } = event.target;
    const newMetadata = [...metadata];
    newMetadata[index].tableNameColumnName = value;
    setMetadata(newMetadata);
  };

  const validateField = (index, field, value) => {
    const newErrors = { ...errors };

    if (!value || value.trim() === "") {
      if (!newErrors[`metadata[${index}]`]) {
        newErrors[`metadata[${index}]`] = {};
      }
      newErrors[`metadata[${index}]`][field] = "Required";
    } else if (newErrors[`metadata[${index}]`]) {
      delete newErrors[`metadata[${index}]`][field];
      if (Object.keys(newErrors[`metadata[${index}]`]).length === 0) {
        delete newErrors[`metadata[${index}]`];
      }
    }
    setErrors(newErrors);
  };

  const handleSendMetadata = async () => {
    try {
      if (selectedPrimaryKey === null) {
        toast.error(intl.formatMessage({id:"error.primaryKey",defaultMessage:"One primary key needs to be selected."}));
        return;
      }
      const latestMetadata =metadataTableRef.current?.getCurrentData() || metadata;

      let validationErrors = {};
      const metadataErrors = latestMetadata.map((data, index) => {
        let errors = {};
        if (!data.dataType) {
          errors.dataType = "Required";
        }
        if (data.dataType === "Double" && !data.maxColumnLength) {
          errors.maxColumnLength = "Required";
        }
        if (data.dataType === "Date" && !data.format) {
          errors.format = "Required";
        }
        if (data.dataType === "Timestamp" && !data.format) {
          errors.format = "Required";
        }
        if (!data.tableNameColumnName) {
          errors.tableNameColumnName = "Required";
        }
        return errors;
      });

      metadataErrors.forEach((error, index) => {
        if (Object.keys(error).length > 0) {
          validationErrors[`metadata[${index}]`] = error;
        }
      });

      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        return;
      }

      const formattedData = {};
      latestMetadata.forEach((data, index) => {
        const columnName = data.columnName;
        const tableName = data.tableNameColumnName
          ? data.tableNameColumnName.split(".")[0]
          : "undefined";
        const tableColumn = data.tableNameColumnName
          ? data.tableNameColumnName.split(".")[1]
          : "undefined";

        formattedData[`column_${index}`] = {
          [`column_${index}`]: `${tableName}.${tableColumn}.${columnName}`,
        };
        if (index === selectedPrimaryKey) {
          formattedData[`column_${index}`].primaryKey = columnName;
        }
        if (selectedNullChecks.includes(index)) {
          formattedData[`column_${index}`].nullCheck = columnName;
        }
      });

      const nullChecks = selectedNullChecks.map(
        (index) => latestMetadata[index].columnName
      );

      const metadataWithNullChecks = latestMetadata.map((item, index) => ({
        ...item,
        allowNull: !selectedNullChecks.includes(index),
      }));

      const combinedValues = latestMetadata.map((data, index) => ({
        column: `column_${index}`,
        value: `${data.tableNameColumnName}.${data.columnName}`,
        tableColumn: data.tableNameColumnName,
      }));

      const requestBodyToSend = {
        metadata: JSON.stringify(metadataWithNullChecks),
        formattedData: JSON.stringify(formattedData),
        dbUrl: dbCredentials.dbUrl,
        dbUsername: dbCredentials.dbUsername,
        dbPassword: dbCredentials.dbPassword,
        primaryKey: latestMetadata[selectedPrimaryKey].columnName,
        nullChecks: JSON.stringify(nullChecks),
        combinedValues: JSON.stringify(combinedValues),
        topicName: topicName,
        responseData: JSON.stringify(responseData),
      };

      if (fullUrl1) {
        requestBodyToSend.fullUrl1 = fullUrl1;
        console.log("fullUrl1: ", fullUrl1)
      }
      if (xmlBody) {
        requestBodyToSend.xmlBody = xmlBody;
      }
      if (queryString1) {
        requestBodyToSend.queryString1 = queryString1;
        console.log("queryString1: ", queryString1);

      }

      if (jsonBody1) {
        requestBodyToSend.jsonBody1 = JSON.stringify(jsonBody1);
      }
      if (headers && headers.length > 0) {
        const formattedHeaders = headers.map(({ key, value }) => ({
          [key]: value.trim(), // This will create { "Content-Type": "application/xml" }
        }));

        requestBodyToSend.requestHeaders = formattedHeaders;
      }

      if (formDataObj) {
        const formDataEntries = Object.fromEntries(formDataObj.entries());
        requestBodyToSend.formDataObj = JSON.stringify(formDataEntries);
        console.log(JSON.stringify(formDataEntries));
      }
      const response = HAxiosService.POST(IntegrationFrameworkAPI.sendApiCall, requestBodyToSend,
        {
          apiUrl,
          httpMethod,
          topicName,
          urlIdentifier,
        },
        false,
        {
          "Content-Type": "application/json",
        },
      );

      console.log(JSON.stringify(response.data, null, 2));
      setErrors("");
    } catch (err) {
      setErrors(err.message);
    }
  };
  const containerMaxWidth = metadata.length > 0 ? "lg" : "md";

  return (
<Paper>
      <HBox style={{ display: "flex", flexDirection: "column", padding: "1rem", borderBottom: "1px solid var(--drs-border-divider, hsl(215 14% 90%))" }} >
        <HBreadCrumb />
        <TitleBar title="label.API.Tester" />
      </HBox>
    <Container
      maxWidth={containerMaxWidth}
      style={{
        padding: "20px",
        marginBottom: "1rem",
        paddingBottom: "2.5rem",
      }}
    >      
        <HBox className="api-url-row">
          <HBox className="api-method-select">
            <HDropdown
              name="httpMethod"
              width="100%"
              value={httpMethod}
              options={[
                { label: "GET", value: "GET" },
                { label: "POST", value: "POST" },
                { label: "PUT", value: "PUT" },
                { label: "DELETE", value: "DELETE" },
              ]}
              onChange={(e) => setHttpMethod(e.target.value)}
            />
          </HBox>
          <HBox className="api-url-input">
            <HTextField
              fullWidth
              editable
              label={intl.formatMessage({id:"label.api.url",defaultMessage:"API URL"})}
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              size="small"
              sx={{ minWidth: 0 }}
              InputLabelProps={{
                sx: {
                  backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                  transform: 'translate(14px, 2px) scale(1)',
                  '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                }
              }}
            />
          </HBox>
        </HBox>
        <HTextField
          label={intl.formatMessage({id:"Enter Topic Name",defaultMessage:"Enter Topic Name"})}
          value={topicName}
          editable
          onChange={(e) => {
            setTopicName(e.target.value);

            if (errors.topicName && e.target.value.trim()) {
              setErrors({ ...errors, topicName: "" });
            }
          }}
          size="small"
          fullWidth
          margin="normal"
          error={!!errors.topicName}
          helperText={errors.topicName}
          style={{ marginBottom: "3rem", marginTop: "2rem" }}
          InputLabelProps={{
            sx: {
              backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
              transform: 'translate(14px, 2px) scale(1)',
              '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
            }
          }}
        />
        <HTextField
          label={intl.formatMessage({id:"label.url.identifier",defaultMessage:"Enter URL Identifier"})}
          variant="outlined"
          fullWidth
          editable
          size="small"
          value={urlIdentifier}
          onChange={(e) => {
            setUrlIdentifier(e.target.value);

            if (errors.urlIdentifier && e.target.value.trim()) {
              setErrors({ ...errors, urlIdentifier: "" });
            }
          }}
          error={!!errors.urlIdentifier}
          helperText={errors.urlIdentifier}
          InputLabelProps={{
            sx: {
              backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
              transform: 'translate(14px, 2px) scale(1)',
              '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
            }
          }}
        />

        <HBox sx={{ backgroundColor: "transparent" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{ "& .MuiTabs-indicator": { backgroundColor: text.primary } }}
          >
            <Tab
              label={intl.formatMessage({id:"label.Headers",defaultMessage:"Headers"})}
              value="headers"
              sx={{
                color: text.primary,
              }}
            />
            <Tab
              label={intl.formatMessage({id:"label.query.parameters",defaultMessage:"Query Parameters"})}
              value="queryParams"
              sx={{
                color: text.primary,
              }}
            />

            <Tab
              label={intl.formatMessage({id:"label.Authorization",defaultMessage:"Authorization"})}
              value="authorization"
              sx={{
                color: text.primary,
              }}
            />
          </Tabs>
          {tabValue === "authorization" && (
            <HBox mt={2}>
              <HDropdown
                name="authType"
                width="100%"
                placeholder={intl.formatMessage({id:"placeholder.Authorization.Type",defaultMessage:"Authorization Type"})}
                value={authType}
                options={[
                  { label: "No Auth", value: "no-auth" },
                  { label: "JWT Bearer", value: "jwt" },
                  { label: "API Key", value: "api_key" },
                  { label: "Bearer Token", value: "Bearer_token" },
                  { label: "Basic Auth", value: "basic_auth" },
                  { label: "OAuth 2.0", value: "oauth2" },
                ]}
                onChange={handleAuthTypeChange}
              />
            </HBox>
          )}
          {authType === "jwt" && (
            <HBox className="dbform-grid" style={{ alignItems: 'center', marginTop: '0.5rem' }}>
              <HBox className="col-3">
                <HDropdown
                  name="jwtAlgorithm"
                  width="100%"
                  placeholder={intl.formatMessage({id:"placeholder.jwt.algorithm",defaultMessage:"JWT Algorithm"})}
                  value={jwtAlgorithm}
                  options={jwtAlgorithms.map((algo) => ({
                    label: algo,
                    value: algo,
                  }))}
                  onChange={(e) => setJwtAlgorithm(e.target.value)}
                />
              </HBox>

              <HBox className="col-9">
                <HTextField
                  fullWidth
                  editable
                  label={intl.formatMessage({id:"label.secret",defaultMessage:"Secret"})}
                  size="small"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  InputLabelProps={{
                    sx: {
                      backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                      transform: 'translate(14px, 2px) scale(1)',
                      '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                    }
                  }}
                />
              </HBox>
              <HBox className="col-3" style={{ marginTop: '0.5rem' }}>
                <HDropdown
                  name="jwtLocation"
                  width="100%"
                  placeholder={intl.formatMessage({id:"placeholder.add.jwt",defaultMessage:"Add JWT Token To"})}
                  value={jwtLocation}
                  options={[
                    { label: "Request Header", value: "header" },
                    { label: "Query Param", value: "queryParam" },
                  ]}
                  onChange={(e) => setJwtLocation(e.target.value)}
                />
              </HBox>
              <HBox className="col-9">
                <HTextarea
                  fullWidth
                  size="small"
                  placeholder={intl.formatMessage({id:"placeholder.payload",defaultMessage:"Payload"})}
                  maxLines={4}
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                />
              </HBox>
            </HBox>
          )}
          {authType === "basic_auth" && (
            <HBox className="dbform-grid" style={{ marginTop: '0.5rem' }}>
              <HBox className="col-6">
                <HTextField
                  label={intl.formatMessage({id:"label.username",defaultMessage:"Username"})}
                  size="small"
                  editable
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    sx: {
                      backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                      transform: 'translate(14px, 2px) scale(1)',
                      '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                    }
                  }}
                />
              </HBox>
              <HBox className="col-6">
                <HTextField
                  label={intl.formatMessage({id:"label.password",defaultMessage:"Password"})}
                  type="password"
                  editable
                  value={password}
                  size="small"
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    sx: {
                      backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                      transform: 'translate(14px, 2px) scale(1)',
                      '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                    }
                  }}
                />
              </HBox>
            </HBox>
          )}
          {authType === "oauth2" && (
            <HBox mt={2} spacing={2}>
              <HTextField
                label={intl.formatMessage({id:"label.access.token",defaultMessage:"Access Token"})}
                editable
                size="small"
                width="49%"
                sx={{ marginBottom: 2, mt: "1rem",mr:"1rem"}}
                InputLabelProps={{
                  sx: {
                    backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                    transform: 'translate(14px, 2px) scale(1)',
                    '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                  }
                }}
              />
              <HTextField
                size="small"
                label={intl.formatMessage({id:"label.header.prefix",defaultMessage:"Header Prefix"})}
                width="49%"
                editable
                sx={{ marginBottom: 2, mt: "1rem" }}
                InputLabelProps={{
                  sx: {
                    backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                    transform: 'translate(14px, 2px) scale(1)',
                    '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                  }
                }} />
              <HBox
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "19px",
                }}
              >
                <HButton
                  label={intl.formatMessage({id:"label.get.new.token",defaultMessage:"Get New Access Token"})}
                  variant="outlined"
                  color="secondary"
                  onClick={handleOpenPopup}
                />


              </HBox>
              <OAuthPopup open={popupOpen} onClose={handleClosePopup} />
            </HBox>
          )}

          {authType === "Bearer_token" && (
            <HBox mt={2}>
              <HTextField
                label={intl.formatMessage({id:"label.bearer.token",defaultMessage:"Enter Bearer Token"})}
                editable
                fullWidth
                value={bearerToken} size="small"
                onChange={handleBearerTokenChange}
                InputLabelProps={{
                  sx: {
                    backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                    transform: 'translate(14px, 2px) scale(1)',
                    '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                  }
                }} />
            </HBox>
          )}
          {authType === "api_key" && (
            <HBox className="dbform-grid" style={{ marginTop: '0.5rem' }}>
              <HBox className="col-4">
                <HTextField
                  label={intl.formatMessage({id:"label.Key",defaultMessage:"Key"})}
                  fullWidth
                  editable
                  size="small"
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  InputLabelProps={{
                    sx: {
                      backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                      transform: 'translate(14px, 2px) scale(1)',
                      '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                    }
                  }}
                />
              </HBox>
              <HBox className="col-4">
                <HTextField
                  label={intl.formatMessage({id:"label.Value",defaultMessage:"Value"})}
                  fullWidth
                  editable
                  size="small"
                  value={apiValue}
                  onChange={handleApiValueChange}
                  InputLabelProps={{
                    sx: {
                      backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                      transform: 'translate(14px, 2px) scale(1)',
                      '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                    }
                  }}
                />
              </HBox>
              <HBox className="col-4">
                <HDropdown
                  name="addTo"
                  width="100%"
                  placeholder={intl.formatMessage({id:"placeholder.add.to",defaultMessage:"Add to"})}
                  value={addTo}
                  options={[
                    { label: "Header", value: "header" },
                    { label: "Query Params", value: "queryParams" },
                  ]}
                  onChange={handleAddToChange}
                />
              </HBox>
            </HBox>
          )}
          {tabValue === "headers" && (
            <HBox mt={3}>
              <HLabel 
                 value={intl.formatMessage({id:"label.Headers",defaultMessage:"Headers"})}
                 sx={{fontSize:"15px",fontWeight:"bold",color:text.primary}}
                 colon={false}
                 align="left" 
                />
              {headers.map((header, index) => (
                <HBox key={`${header.key || 'header'}-${index}`} className="dbform-grid" style={{ alignItems: 'center' }}>
                  <HBox className="col-5">
                    <HTextField
                      fullWidth
                      size="small"
                      editable
                      label={intl.formatMessage({id:"label.Key",defaultMessage:"Key"})}
                      value={header.key}
                      onChange={(e) =>
                        handleHeaderChange(index, "key", e.target.value)
                      }
                      InputLabelProps={{
                        sx: {
                          backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                          transform: 'translate(14px, 2px) scale(1)',
                          '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                        }
                      }}
                    />
                  </HBox>
                  <HBox className="col-5">
                    <HTextField
                      fullWidth
                      label={intl.formatMessage({id:"label.Value",defaultMessage:"Value"})}
                      size="small"
                      editable
                      value={header.value}
                      onChange={(e) =>
                        handleHeaderChange(index, "value", e.target.value)
                      }
                      InputLabelProps={{
                        sx: {
                          backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                          transform: 'translate(14px, 2px) scale(1)',
                          '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                        }
                      }}
                    />
                  </HBox>
                  <HBox className="col-2">
                    <IconButton
                      onClick={() => handleRemoveHeader(index)}
                      sx={{ mr: "3rem", mb: "1rem" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </HBox>
                </HBox>
              ))}
              <HButton
                label={intl.formatMessage({id:"label.add.header",defaultMessage:"Add Header"})}
                startIcon={<AddIcon />}
                onClick={handleAddHeader}
              />

            </HBox>
          )}

          {tabValue === "queryParams" && (
            <HBox mt={3}>
              <HLabel sx={{ fontWeight: "bold", fontSize: "14px", color: text.primary }}
                value={intl.formatMessage({id:"label.query.parameters",defaultMessage:"Query Parameters"})}
                colon={false}
                align="left" />
              {queryParams.map((param, index) => (
                <HBox className="dbform-grid" key={param.id} style={{ alignItems: 'center' }}>
                  <HBox className="col-5">
                    <HTextField
                      fullWidth
                      label={intl.formatMessage({id:"label.Key",defaultMessage:"Key"})}
                      editable
                      size="small"
                      value={param.key}
                      onChange={(e) =>
                        handleQueryParamChange(index, "key", e.target.value)
                      }
                      InputLabelProps={{
                        sx: {
                          backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                          transform: 'translate(14px, 2px) scale(1)',
                          '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                        }
                      }}
                    />
                  </HBox>
                  <HBox className="col-5">
                    <HTextField
                      fullWidth
                      editable
                      label={intl.formatMessage({id:"label.Value",defaultMessage:"Value"})}
                      size="small"
                      value={param.value}
                      onChange={(e) =>
                        handleQueryParamChange(index, "value", e.target.value)
                      }
                      InputLabelProps={{
                        sx: {
                          backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                          transform: 'translate(14px, 2px) scale(1)',
                          '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                        }
                      }}
                    />
                  </HBox>
                  <HBox className="col-2">
                    <IconButton
                      onClick={() => handleRemoveQueryParam(param.id)}
                      sx={{ mr: "3rem", mb: "1rem" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </HBox>
                </HBox>
              ))}
              <HButton
                label={intl.formatMessage({id:"label.add.queryParameter",defaultMessage:"Add Query Parameter"})}
                startIcon={<AddIcon />}
                onClick={handleAddQueryParam}
              />

            </HBox>
          )}
        </HBox>
        <Card
          sx={{
            marginTop: "2rem",
            padding: "0.8rem",
            border: "1px solid #ccc",
            borderRadius: "1px",
          }}
        >
          <CardHeader
            title={intl.formatMessage({id:"Database Credentials",defaultMessage:"Database Credentials"})}
          />
          <CardContent>
            <HTextField
              label={intl.formatMessage({id:"Database URL",defaultMessage:"Database URL"})}
              name="dbUrl"
              editable
              value={dbCredentials.dbUrl}
              onChange={handleDbCredentialsChange}
              fullWidth
              size="small"
              margin="normal"
              error={!!errors.dbUrl}
              helperText={errors.dbUrl}
              sx={{ mb: "2rem" }}
              InputLabelProps={{
                sx: {
                  backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                  transform: 'translate(14px, 2px) scale(1)',
                  '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                }
              }}
            />
            <HTextField
              label={intl.formatMessage({id:"Database Username",defaultMessage:"Database Username"})}
              name="dbUsername"
              value={dbCredentials.dbUsername}
              onChange={handleDbCredentialsChange}
              fullWidth
              editable
              size="small"
              margin="normal"
              error={!!errors.dbUsername}
              helperText={errors.dbUsername}
              sx={{ mb: "2rem" }}
              InputLabelProps={{
                sx: {
                  backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                  transform: 'translate(14px, 2px) scale(1)',
                  '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                }
              }}
            />
            <HTextField
              label={intl.formatMessage({id:"Database Password",defaultMessage:"Database Password"})}
              name="dbPassword"
              type="password"
              value={dbCredentials.dbPassword}
              onChange={handleDbCredentialsChange}
              fullWidth
              editable
              size="small"
              margin="normal"
              error={!!errors.dbPassword}
              helperText={errors.dbPassword}
              sx={{ mb: "2rem" }}
              InputLabelProps={{
                sx: {
                  backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                  transform: 'translate(14px, 2px) scale(1)',
                  '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                }
              }}
            />
            <HButton
              label={intl.formatMessage({id:"Test Connection",defaultMessage:"Test Connection"})}
              variant="outlined"
              color="secondary"
              onClick={handleTestConnection}
            />
          </CardContent>
        </Card>
        <HBox mt={3}>
          <Tabs
            value={requestBodyType}
            onChange={(e, newValue) => setRequestBodyType(newValue)}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab
              label={intl.formatMessage({id:"label.none",defaultMessage:"None"})}
              value="none"
            />
            <Tab
              label={intl.formatMessage({id:"label.body",defaultMessage:"Body"})}
              value="body"
            />
            <Tab
              label={intl.formatMessage({id:"label.form.data",defaultMessage:"Form Data"})}
              value="form-data"
            />
          </Tabs>

          {requestBodyType === "body" && (
            <HBox mt={2}>
              <HDropdown
                name="bodyType"
                width="100%"
                placeholder={intl.formatMessage({id:"placeholder.body.type",defaultMessage:"Body Type"})}
                value={bodyType}
                options={[
                  { label: "JSON", value: "json" },
                  { label: "XML", value: "xml" },
                ]}
                onChange={(e) => setBodyType(e.target.value)}
                sx={{ mb: "2rem" }}
              />

              <HTextarea
                width="100%"
                placeholder={`${bodyType.toUpperCase()} Body`}
                maxLines={4}
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                size="small"
              />
            </HBox>
          )}

          {requestBodyType === "form-data" && (
            <HBox mt={2}>
              {formData.map((data, index) => (
                <HBox className="dbform-grid" key={data.id || `${data.type}-${index}`} style={{ alignItems: 'center' }}>
                  <HBox className="col-3">
                    <HDropdown
                      name={`formType-${index}`}
                      width="100%"
                      value={data.type}
                      options={[
                        { label: "Text", value: "text" },
                        { label: "File", value: "file" },
                      ]}
                      onChange={(e) => handleTypeChange(index, e.target.value)}
                    />
                  </HBox>
                  <HBox className="col-4">
                    <HTextField
                      fullWidth
                      editable
                      label={intl.formatMessage({id:"label.Key",defaultMessage:"Key"})}
                      size="small"
                      value={data.key}
                      onChange={(e) =>
                        handleFormDataChange(index, "key", e.target.value)
                      }
                      InputLabelProps={{
                        sx: {
                          backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                          transform: 'translate(14px, 2px) scale(1)',
                          '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                        }
                      }}
                    />
                  </HBox>
                  {data.type === "text" && (
                    <HBox className="col-4">
                      <HTextField
                        fullWidth
                        editable
                        label={intl.formatMessage({id:"label.Value",defaultMessage:"Value"})}
                        size="small"
                        value={data.value}
                        onChange={(e) =>
                          handleFormDataChange(index, "value", e.target.value)
                        }
                        InputLabelProps={{
                          sx: {
                            backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                            transform: 'translate(14px, 2px) scale(1)',
                            '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                          }
                        }}
                      />
                    </HBox>
                  )}
                  {data.type === "file" && (
                    <HBox className="col-4">
                      <input
                        type="file"
                        onChange={(e) =>
                          handleFormDataChange(
                            index,
                            "value",
                            e.target.files[0]
                          )
                        }
                      />
                    </HBox>
                  )}
                  <HBox className="col-1">
                    <IconButton
                      onClick={() => handleRemoveFormData(index)}
                      sx={{ mb: "1rem" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </HBox>
                </HBox>
              ))}
              <HButton
                label={intl.formatMessage({id:"label.add.formData",defaultMessage:"Add Form Data"})}
                startIcon={<AddIcon />}
                onClick={handleAddFormData}
              />

            </HBox>
          )}
        </HBox>
        {metadata.length > 0 && (
          <HBox mt={4}>
            <MetadataTable
              ref={metadataTableRef}
              metadata={metadata}
              errors={errors}
              tableOptions={tableOptions}
              selectedPrimaryKey={selectedPrimaryKey}
              selectedNullChecks={selectedNullChecks}
              handleDataTypeChange={handleDataTypeChange}
              handleMaxColumnLengthChange={handleMaxColumnLengthChange}
              handlePrimaryKeyChange={handlePrimaryKeyChange}
              handleNullChange={handleNullChange}
              handleTableNameChange={handleTableNameChange}
              handleInputChange={handleInputChange}
              validateField={validateField}
              formData={formData1}
            />
          </HBox>
        )}
        {metadata.length === 0 && (
          <HBox
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "19px",
              backgroundColor: "transparent"
            }}
          >
            <HButton
              label={intl.formatMessage({id:"MetaData",defaultMessage:"Get Metadata"})}
              variant="outlined"
              color="secondary"
              onClick={handleSendRequest}
            />

          </HBox>
        )}

        {metadata.length > 0 && (
          <HBox
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "19px",
              backgroundColor: "transparent"
            }}
          >
            <HButton
              label={intl.formatMessage({id:"Publish Data",defaultMessage:"Publish Data"})}
              variant="outlined"
              color="secondary"
              onClick={handleSendMetadata}
            />

          </HBox>
        )}
      
    </Container>
    </Paper>
  );
};

export default ApiTester;
