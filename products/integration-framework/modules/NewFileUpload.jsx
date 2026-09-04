import React, { useState, useRef, useEffect } from "react";
import { useToast, HAgGrid, HAxiosService, HBox, HButton, HLabel, HTextField, HDropdown, useDrsTheme, TitleBar, HBreadCrumb, HDialog } from "@helix/component-library";
import { useIntl } from "react-intl";

import { Container, Card, CardHeader, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, Paper} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MetadataTable from "./MetadataTable";
import { IntegrationFrameworkAPI } from "./apiEndpoints";



export default function NewFileUpload() {
  const toast = useToast();
  const intl = useIntl();
  const [file, setFile] = useState(null);
  const [topicName, setTopicName] = useState("");
  const [xmlFilePath, SetXmlFilePath] = useState("");
  const [jsonFilePath, SetJsonFilePath] = useState("");
  const [metadata, setMetadata] = useState([]);
  const [formData, setFormData] = useState([]);
  const fileInputRef = useRef(null);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedPrimaryKey, setSelectedPrimaryKey] = useState(null);
  const [selectedNullChecks, setSelectedNullChecks] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [csvColumns, setCsvColumns] = useState([]);
  const [csvFilePath, setCsvFilePath] = useState("");
  const [fileExtension, setFileExtension] = useState("");
  const [columnsFetched, setColumnsFetched] = useState(false);
  const [fileType, setFileType] = useState("");
  const { themeVars, surfaces, text, border, action, colors, isDark } = useDrsTheme();
  const [fileNames, setFileNames] = useState([]);
  const [verifyClicked, setVerifyClicked] = useState(false);
  const [dbCredentials, setDbCredentials] = useState({
    dbUrl: "",
    dbUsername: "",
    dbPassword: "",
  });

  // ---- NEW: DB table / table-metadata related state ----
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [dbTables, setDbTables] = useState([]);
  const [selectedDbTable, setSelectedDbTable] = useState("");
  const [dbTableMetadata, setDbTableMetadata] = useState([]);
  const [fetchingDbTables, setFetchingDbTables] = useState(false);
  const [fetchingDbTableMetadata, setFetchingDbTableMetadata] = useState(false);

  // ---- NEW: Verify Metadata related state ----
  const [isMetadataVerified, setIsMetadataVerified] = useState(false);
  const [verifyingMetadata, setVerifyingMetadata] = useState(false);
  // Caches the DB column info (dataType/maxColumnLength) found for each row
  // during the last successful Verify Metadata run, keyed by row index, so
  // that live edits afterwards can be checked locally without another API call.
  const [dbVerifiedColumnInfo, setDbVerifiedColumnInfo] = useState({});
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setVerifyClicked(false);
    if (selectedFile) {
      const fileName = selectedFile.name;
      const fileExtension = fileName.split(".").pop().toLowerCase();

      if (
        fileExtension === "csv" ||
        fileExtension === "xlsx" ||
        fileExtension === "xls" || fileExtension === "xml" ||
        fileExtension === "json"
      ) {
        setFileType(fileExtension);
        setFile(selectedFile);

        setErrors({});
      } else {
        setFileType("");
        setFile(null);
        setErrors({
          file: "File type not acceptable. Please select .csv, .xlsx,  .xls  , .xml or .json files.",
        });
      }
    } else {
      setFileType("");
      setErrors({});
      setFile(null);
    }
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [overrideMetadata, setOverrideMetadata] = useState(false);
  const validateDbCredentials = () => {
    let validationErrors = {};
    if (!dbCredentials.dbUrl) validationErrors.dbUrl = "Database URL is required";
    if (!dbCredentials.dbUsername) validationErrors.dbUsername = "Database Username is required";
    if (!dbCredentials.dbPassword) validationErrors.dbPassword = "Database Password is required";
    return validationErrors;
  };
  const validateSelectedValue = () => {
    let validationErrors = {};
    if (!selectedValue) validationErrors.selectedValue = "Required field";
    return validationErrors;
  };

  const handleGetMetadata = async () => {

    const dbValidationErrors = validateDbCredentials();
    const selectedValueErrors = validateSelectedValue();

    const validationErrors = { ...dbValidationErrors, ...selectedValueErrors };

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }


    try {
      const headersMatch = await checkHeadersMatch();
      if (headersMatch) {
        setOpenDialog(true);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      const url = IntegrationFrameworkAPI.getMetaData;
      const response = await HAxiosService.POST(url, formData, {}, false, { "Content-Type": "multipart/form-data", });

      const selectedFileName = file.name.split(".")[0] + ".json";
      if (fileNames.includes(selectedFileName)) {
        setOpenDialog(true);
        return;
      }

      setMetadata(response.data);
      setIsMetadataVerified(false);
      setDbVerifiedColumnInfo({});
      setVerifyClicked(false);
    } catch (error) {
      //logWithComponent('NewFileUpload', 'error', 'Error fetching metadata:', { error });
      console.error("Error fetching metadata:", error);
    }
  };


  const checkHeadersMatch = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const url = IntegrationFrameworkAPI.getStatusHeaderMatch();

      const response = await HAxiosService.POST(url, formData, {}, false, { "Content-Type": "multipart/form-data", });

      return response.data;
    } catch (error) {
      //logWithComponent('NewFileUpload', 'error', 'Error checking header match', { error });
      console.error("Error checking header match:", error);
      toast.error(intl.formatMessage({
        id: "error.header",
        defaultMessage: "Error checking header match"
      }));
      return false;
    }
  };

  const handleConfirmOverride = async () => {
    try {
      setOverrideMetadata(true);
      setOpenDialog(false);

      const formData = new FormData();
      formData.append("file", file);
      const url = IntegrationFrameworkAPI.getMetaData();

      const response = await HAxiosService.POST(url, formData, {}, false, { "Content-Type": "multipart/form-data", });

      setMetadata(response.data);
      setIsMetadataVerified(false);
      setDbVerifiedColumnInfo({});
    } catch (error) {
      //logWithComponent('NewFileUpload', 'error', 'Error fetching metadata:', { error });
      console.error("Error fetching metadata:", error);
    }
  };

  const handleCancelOverride = () => {
    setOpenDialog(false);
    setFile(null);
  };

  // Live-checks a row's dataType against the DB column's type captured by the
  // last Verify Metadata run (if any), and sets/clears the "data type
  // mismatch" message accordingly - without needing another API call.
  const checkDataTypeAgainstDb = (index, newValue) => {
    const dbInfo = dbVerifiedColumnInfo[index];
    if (!dbInfo || !dbInfo.dataType) {
      return;
    }

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      const rowKey = `metadata[${index}]`;

      if (newValue !== dbInfo.dataType) {
        newErrors[rowKey] = {
          ...newErrors[rowKey],
          dataType: `Data type mismatch. Change to "${dbInfo.dataType}"`,
        };
      } else if (newErrors[rowKey]?.dataType?.startsWith("Data type mismatch")) {
        const updatedRow = { ...newErrors[rowKey] };
        delete updatedRow.dataType;
        if (Object.keys(updatedRow).length === 0) {
          delete newErrors[rowKey];
        } else {
          newErrors[rowKey] = updatedRow;
        }
      }
      return newErrors;
    });
  };

  const handleDataTypeChange = (event, index) => {
    const { value } = event.target;
    setErrors(prev => {
      const updated = { ...prev };
      const rowKey = `metadata[${index}]`;

      if (updated[rowKey]) {
        delete updated[rowKey].maxColumnLength;
        delete updated[rowKey].format;

        if (Object.keys(updated[rowKey]).length === 0) {
          delete updated[rowKey];
        }
      }

      return updated;
    });
    const newMetadata = [...metadata];
    newMetadata[index] = {
      ...newMetadata[index],
      dataType: value,
      format: "",
      maxColumnLength: "",
    };
    setMetadata(newMetadata);
    validateField(index, 'dataType', event.target.value);
    checkDataTypeAgainstDb(index, value);

    if (value === "Date" || value === "Timestamp") {
      // The Max Column Length box now holds "format", which was just
      // cleared - surface that immediately instead of waiting for the user
      // to type or re-run Verify Metadata.
      validateField(index, 'format', '');
    } else {
      // maxColumnLength was just cleared - same idea, so a stale
      // "max-length exceed"/"Required" message from before gets replaced
      // with the correct state for the new type right away.
      checkMaxLengthAgainstDb(index, '');
    }

    setIsMetadataVerified(false);
  };

  // Live-checks a row's maxColumnLength against the DB column size captured by
  // the last Verify Metadata run (if any), and sets/clears the "Required" /
  // "max-length exceed" message accordingly - without needing another API call.
  const checkMaxLengthAgainstDb = (index, value) => {
    const dbInfo = dbVerifiedColumnInfo[index];
    if (!dbInfo || dbInfo.maxColumnLength === undefined || dbInfo.maxColumnLength === null) {
      return;
    }
    if (metadata[index].dataType === "Date" || metadata[index].dataType === "Timestamp") {
      return;
    }
    const dbMaxLength = parseInt(dbInfo.maxColumnLength, 10);
    const trimmedValue = (value ?? "").toString().trim();
    const currentLength = parseInt(trimmedValue, 10);

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      const rowKey = `metadata[${index}]`;

      if (trimmedValue === "" || isNaN(currentLength)) {
        // Empty/invalid value (e.g. right after switching dataType, which
        // clears this field) - flag it so it doesn't silently pass unnoticed.
        newErrors[rowKey] = { ...newErrors[rowKey], maxColumnLength: "Required" };
      } else if (!isNaN(dbMaxLength) && currentLength > dbMaxLength) {
        newErrors[rowKey] = { ...newErrors[rowKey], maxColumnLength: "max-length exceed" };
      } else if (
        newErrors[rowKey]?.maxColumnLength === "max-length exceed" ||
        newErrors[rowKey]?.maxColumnLength === "Required"
      ) {
        const updatedRow = { ...newErrors[rowKey] };
        delete updatedRow.maxColumnLength;
        if (Object.keys(updatedRow).length === 0) {
          delete newErrors[rowKey];
        } else {
          newErrors[rowKey] = updatedRow;
        }
      }
      return newErrors;
    });
  };

  const handleMaxColumnLengthChange = (event, index) => {
    let { value } = event.target;

    const newMetadata = [...metadata];

    if (metadata[index].dataType === "Date") {
      value = value
        .toLowerCase()
        .replace(/[^dmy/-]/gi, "")
        .replace(/m/g, "M");
      newMetadata[index] = { ...newMetadata[index], format: value };
      setMetadata(newMetadata);
      validateField(index, 'format', value);
    } else if (metadata[index].dataType === "Timestamp") {
      value = value.toLowerCase().replace(/[^dmyhs/:. -]/gi, "");

      // Replace 'm' with 'M' if not preceded by 'h'
      value = value.replace(/(?<!h)m/g, "M");

      // Replace 'h' with 'H'
      value = value.replace(/h/g, "H");

      // Replace 'M' with 'm' if preceded by 'HH:'
      value = value.replace(/(?<=HH:)M/g, "m");

      // Replace all 'M' with 'm' if preceded by 'HH:'
      value = value.replace(/(?<=HH:).*?M/g, (match) => match.toLowerCase());

      // Replace 'S with 's
      value = value.replace(/'S/g, "'s");

      newMetadata[index] = { ...newMetadata[index], format: value };
      setMetadata(newMetadata);
      validateField(index, 'format', value);
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
      validateField(index, 'maxColumnLength', value);
      checkMaxLengthAgainstDb(index, value);
    } else {
      value = value.replace(/\D/g, "");
      newMetadata[index] = { ...newMetadata[index], maxColumnLength: value };
      setMetadata(newMetadata);
      validateField(index, 'maxColumnLength', value);
      checkMaxLengthAgainstDb(index, value);
    }
    setIsMetadataVerified(false);
  };


  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    setFile(droppedFile);
    setFileExtension(droppedFile.name.split(".").pop().toLowerCase());
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

    setIsDbConnected(false);
    setDbTables([]);
    setSelectedDbTable("");
    setDbTableMetadata([]);
    setIsMetadataVerified(false);
    setDbVerifiedColumnInfo({});
  };


  const handlePrimaryKeyChange = (index) => {
    setSelectedPrimaryKey(index);
    const newFormData = [...formData];
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
        const newFormData = [...formData];
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
      const newFormData = [...formData];
      newFormData[index] = {
        ...newFormData[index],
        nullCheck: metadata[index].columnName,
      };
      setFormData(newFormData);
    }

    setSelectedNullChecks(updatedSelection);
  };

  const handleSelectedFileClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const [tableOptions, setTableOptions] = useState([]);

  const handleTableNameChange = (newValue, index) => {
    const newMetadata = [...metadata];
    newMetadata[index].tableNameColumnName = newValue || '';
    setMetadata(newMetadata);
    validateField(index, 'tableNameColumnName', newValue || '');
    setIsMetadataVerified(false);
  };

  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    const newData = [...formData];
    const columnName = metadata[index].columnName;
    newData[index] = { ...newData[index], [name]: `${value.trim()}.${columnName}` };
    setFormData(newData);

    validateField(index, 'tableNameColumnName', value.trim());
    setIsMetadataVerified(false);
  };

  const validateField = (index, field, value) => {
    const newErrors = { ...errors };


    if (!value || value.trim() === '') {
      if (!newErrors[`metadata[${index}]`]) {
        newErrors[`metadata[${index}]`] = {};
      }
      newErrors[`metadata[${index}]`][field] = "Required";
    } else {
      if (newErrors[`metadata[${index}]`]) {
        delete newErrors[`metadata[${index}]`][field];
        if (Object.keys(newErrors[`metadata[${index}]`]).length === 0) {
          delete newErrors[`metadata[${index}]`];
        }
      }
    }

    setErrors(newErrors);
  };

  const handleTestConnection = async () => {
    const validationErrors = validateDbCredentials();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    const formDataToSend = new FormData();

    formDataToSend.append("dbUrl", dbCredentials.dbUrl);
    formDataToSend.append("dbUsername", dbCredentials.dbUsername);
    formDataToSend.append("dbPassword", dbCredentials.dbPassword);

    try {
      const url = IntegrationFrameworkAPI.testDbConnection();

      const response = await HAxiosService.POST(
        url,
        formDataToSend,
        {},
        false,
        { "Content-Type": "multipart/form-data" }
      );
      if (response.data.tables) {
        setTableOptions(response.data.tables.split(', '));
      }

      if (response.data.valid) {
        setIsDbConnected(true);
       
          toast.success(intl.formatMessage({
            id: "success.connection",
            defaultMessage: "Database connection successful"
          }));
       

      } else {
        setIsDbConnected(false);
          toast.error(intl.formatMessage({
            id: "error.connection",
            defaultMessage: "Database connection failed"
          }));
      }
    } catch (error) {
      setIsDbConnected(false);
      //logWithComponent('NewFileUpload', 'error', 'Error testing database connection:', { error });
      console.error("Error testing database connection:", error);
   
        toast.error(intl.formatMessage({
          id: "error.connection.test",
          defaultMessage: "Error testing database connection"
        }));

    }
  };
  const handleFetchDbTables = async () => {
    const validationErrors = validateDbCredentials();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setFetchingDbTables(true);
    try {
      const url = IntegrationFrameworkAPI.fetchTables();

      const response = await HAxiosService.POST(url, {
        dbUrl: dbCredentials.dbUrl,
        dbUsername: dbCredentials.dbUsername,
        dbPassword: dbCredentials.dbPassword,
      });

      const tables = Array.isArray(response.data) ? response.data : [];
      setDbTables(tables);
      setSelectedDbTable("");
      setDbTableMetadata([]);

      if (tables.length === 0) {
        toast.info("No tables found for the given database.");
      }
    } catch (error) {
      //logWithComponent('NewFileUpload', 'error', 'Error fetching tables:', { error });
      console.error("Error fetching tables:", error);
      toast.error("Error fetching tables from database");
    } finally {
      setFetchingDbTables(false);
    }
  };

  const handleDbTableChange = (event) => {
    setSelectedDbTable(event.target.value);
    setDbTableMetadata([]);
  };
  const mapDbColumnsToMetadata = (dbColumns, tableName) => {
    if (!metadata || metadata.length === 0 || !dbColumns || dbColumns.length === 0) {
      return;
    }

    const newMetadata = metadata.map((row) => {
      const fileColumnName = (row.columnName || "").toString().trim().toLowerCase();
      const matchedColumn = dbColumns.find(
        (col) => (col.name || "").toString().trim().toLowerCase() === fileColumnName
      );

      return {
        ...row,
        tableNameColumnName: matchedColumn
          ? `${tableName}.${matchedColumn.name}`
          : row.tableNameColumnName || "",
        dbMaxLength: matchedColumn?.columnSize || "",
      };
    });

    setMetadata(newMetadata);
    setIsMetadataVerified(false);
    setDbVerifiedColumnInfo({});
    setFormData((prevFormData) => {
      const newFormData = [...prevFormData];
      newMetadata.forEach((row, index) => {
        const fileColumnName = (metadata[index].columnName || "").toString().trim().toLowerCase();
        const matchedColumn = dbColumns.find(
          (col) => (col.name || "").toString().trim().toLowerCase() === fileColumnName
        );
        if (matchedColumn) {
          const key = `column_${index}`;
          newFormData[index] = {
            ...newFormData[index],
            [key]: `${tableName}.${row.columnName}`,
          };
        }
      });
      return newFormData;
    });

    // Clear "required" validation errors for rows that just got auto-filled.
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      newMetadata.forEach((row, index) => {
        if (row.tableNameColumnName && newErrors[`metadata[${index}]`]) {
          delete newErrors[`metadata[${index}]`].tableNameColumnName;
          if (Object.keys(newErrors[`metadata[${index}]`]).length === 0) {
            delete newErrors[`metadata[${index}]`];
          }
        }
      });
      return newErrors;
    });

    const matchedCount = newMetadata.filter((row, index) => {
      const fileColumnName = (metadata[index].columnName || "").toString().trim().toLowerCase();
      return dbColumns.some(
        (col) => (col.name || "").toString().trim().toLowerCase() === fileColumnName
      );
    }).length;

    toast.success(
      `Mapped ${matchedCount} of ${metadata.length} column(s) from "${tableName}". Please review and edit if needed.`);
  };

  const handleGetTableMetadata = async () => {
    if (!selectedDbTable) {
      toast.error("Please select a table first");
      return;
    }

    setFetchingDbTableMetadata(true);
    try {
      const url = IntegrationFrameworkAPI.tableMetadata();

      const response = await HAxiosService.POST(url, {
        dbUrl: dbCredentials.dbUrl,
        dbUsername: dbCredentials.dbUsername,
        dbPassword: dbCredentials.dbPassword,
        tableName: selectedDbTable
      });

      const columns = response.data?.tableMetadata || [];
      setDbTableMetadata(columns);
      mapDbColumnsToMetadata(columns, selectedDbTable);
      setVerifyClicked(false);
    } catch (error) {
      //logWithComponent('NewFileUpload', 'error', 'Error fetching table metadata:', { error });
      console.error("Error fetching table metadata:", error);
      toast.error("Error fetching table metadata");
    } finally {
      setFetchingDbTableMetadata(false);
    }
  };

  // Maps a raw DB column type (as returned by the table-metadata API, e.g.
  // "varchar", "date", "numeric", "int4") to the dataType values this form
  // already uses ("String" / "Integer" / "Date" / "Timestamp" / "Double").
  // Adjust this mapping if your "Data Type" dropdown supports additional or
  // differently-named values (e.g. "Boolean").
  const mapDbDataTypeToAppType = (dbDataType) => {
    const type = (dbDataType || "").toString().trim().toLowerCase();
    if (!type) return null;
    if (type.includes("timestamp")) return "Timestamp";
    if (type === "date") return "Date";
    if (["numeric", "decimal", "float", "float4", "float8", "double", "real"].some((t) => type.includes(t))) {
      return "Double";
    }
    if (["int2", "int4", "int8", "smallint", "integer", "bigint", "serial", "bigserial", "smallserial"].some((t) => type.includes(t))) {
      return "Integer";
    }
    return "String";
  };

  // ---- NEW: Verify Metadata ----
  // For every row, looks up the table/column it was mapped to (via
  // tableNameColumnName) in the database, then:
  //  - dataType: if it matches the DB column's type, leave it as-is; if it
  //    differs, flag it with a "Data type mismatch. Change to "X"" message
  //    under the Data Type field (same errors[...].dataType path already
  //    used for "Required" messages) - it is NOT auto-corrected, the user
  //    must pick the right type from the dropdown themselves.
  //  - The "Max Column Length" box means different things depending on type:
  //    - Date / Timestamp: that box actually holds the date/timestamp format
  //      string (see handleMaxColumnLengthChange), not a numeric length, so
  //      there's no DB size to compare against - instead we just require a
  //      non-empty format and flag it with "Required" if missing.
  //    - Everything else: if the entered length is within the DB column's
  //      size, leave it; if it exceeds it, flag it with a "max-length exceed"
  //      message under that row's Max Column Length field (via the same
  //      errors[...].maxColumnLength / errors[...].format paths already used
  //      for "Required" messages) and block Publish until fixed.
  // Publish only becomes enabled once a full run completes with no such
  // blocking issues.
  const handleVerifyMetadata = async () => {
    if (!metadata || metadata.length === 0) {
      toast.error("No metadata to verify.");
      return;
    }
    setVerifyClicked(true);
    // Every row needs a table.column mapping before we can look anything up.
    let missingTableColumn = false;
    metadata.forEach((row, index) => {
      if (!row.tableNameColumnName) {
        validateField(index, 'tableNameColumnName', '');
        missingTableColumn = true;
      }
    });
    if (missingTableColumn) {
      toast.error("Please set table.column for every row before verifying.");
      return;
    }

    const dbValidationErrors = validateDbCredentials();
    if (Object.keys(dbValidationErrors).length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, ...dbValidationErrors }));
      toast.error("Database credentials are required to verify metadata.");
      return;
    }

    setVerifyingMetadata(true);
    try {
      // Group rows by table name so we only call table-metadata once per table.
      const rowIndexesByTable = {};
      metadata.forEach((row, index) => {
        const tableName = (row.tableNameColumnName || "").split(".")[0];
        if (!tableName) return;
        if (!rowIndexesByTable[tableName]) rowIndexesByTable[tableName] = [];
        rowIndexesByTable[tableName].push(index);
      });

      const tableColumnCache = {};
      for (const tableName of Object.keys(rowIndexesByTable)) {
        const url = IntegrationFrameworkAPI.tableMetadata();
        const response = await HAxiosService.POST(url, {
          dbUrl: dbCredentials.dbUrl,
          dbUsername: dbCredentials.dbUsername,
          dbPassword: dbCredentials.dbPassword,
          tableName,
        });
        tableColumnCache[tableName] = response.data?.tableMetadata || [];
      }

      const newDbInfo = {};
      const newErrors = { ...errors };
      let hasBlockingError = false;

      metadata.forEach((row, index) => {
        const parts = (row.tableNameColumnName || "").split(".");
        const tableName = parts[0];
        const dbColumnName = parts.slice(1).join(".");
        const dbColumns = tableColumnCache[tableName] || [];
        const matchedColumn = dbColumns.find(
          (col) => (col.name || "").toString().trim().toLowerCase() === (dbColumnName || "").toString().trim().toLowerCase()
        );

        const rowKey = `metadata[${index}]`;

        if (!matchedColumn) {
          newErrors[rowKey] = { ...newErrors[rowKey], tableNameColumnName: "Column not found in database" };
          hasBlockingError = true;
          return;
        }

        const mappedDataType = mapDbDataTypeToAppType(matchedColumn.dataType);

        newDbInfo[index] = {
          dataType: mappedDataType,
          maxColumnLength: matchedColumn.columnSize,
        };

        // ---- DataType check: same → skip, different → flag (no silent correction) ----
        if (mappedDataType && row.dataType !== mappedDataType) {
          newErrors[rowKey] = {
            ...newErrors[rowKey],
            dataType: `Data type mismatch. Change to "${mappedDataType}"`,
          };
          hasBlockingError = true;
        } else if (newErrors[rowKey]?.dataType?.startsWith("Data type mismatch")) {
          const updatedRow = { ...newErrors[rowKey] };
          delete updatedRow.dataType;
          if (Object.keys(updatedRow).length === 0) {
            delete newErrors[rowKey];
          } else {
            newErrors[rowKey] = updatedRow;
          }
        }

        if (row.dataType === "Date" || row.dataType === "Timestamp") {
          // For Date/Timestamp rows, the "Max Column Length" box actually holds
          // the date/timestamp format string (see handleMaxColumnLengthChange),
          // not a numeric length - so there's nothing meaningful to compare
          // against the DB's column size here. Instead, just make sure a
          // format was actually provided, same as handlePublish already requires.
          const formatValue = (row.format || "").toString().trim();

          if (!formatValue) {
            newErrors[rowKey] = { ...newErrors[rowKey], format: "Required" };
            hasBlockingError = true;
          } else if (newErrors[rowKey]?.format === "Required") {
            const updatedRow = { ...newErrors[rowKey] };
            delete updatedRow.format;
            if (Object.keys(updatedRow).length === 0) {
              delete newErrors[rowKey];
            } else {
              newErrors[rowKey] = updatedRow;
            }
          }

          // maxColumnLength isn't meaningful for these types - clear any stale
          // "max-length exceed" message that might be left over from before
          // the dataType was changed.
          if (newErrors[rowKey]?.maxColumnLength === "max-length exceed") {
            const updatedRow = { ...newErrors[rowKey] };
            delete updatedRow.maxColumnLength;
            if (Object.keys(updatedRow).length === 0) {
              delete newErrors[rowKey];
            } else {
              newErrors[rowKey] = updatedRow;
            }
          }
        } else {
          // ---- Max length check: empty → Required, existing <= DB size → skip, > DB size → flag ----
          const dbMaxLength = parseInt(matchedColumn.columnSize, 10);
          const trimmedMaxLength = (row.maxColumnLength ?? "").toString().trim();
          const currentMaxLength = parseInt(trimmedMaxLength, 10);

          if (trimmedMaxLength === "" || isNaN(currentMaxLength)) {
            // Empty/invalid value (e.g. right after switching dataType, which
            // clears this field) - flag it so it doesn't silently pass unnoticed.
            newErrors[rowKey] = { ...newErrors[rowKey], maxColumnLength: "Required" };
            hasBlockingError = true;
          } else if (!isNaN(dbMaxLength) && currentMaxLength > dbMaxLength) {
            newErrors[rowKey] = { ...newErrors[rowKey], maxColumnLength: "max-length exceed" };
            hasBlockingError = true;
          } else if (
            newErrors[rowKey]?.maxColumnLength === "max-length exceed" ||
            newErrors[rowKey]?.maxColumnLength === "Required"
          ) {
            const updatedRow = { ...newErrors[rowKey] };
            delete updatedRow.maxColumnLength;
            if (Object.keys(updatedRow).length === 0) {
              delete newErrors[rowKey];
            } else {
              newErrors[rowKey] = updatedRow;
            }
          }
        }
      });

      setErrors(newErrors);
      setDbVerifiedColumnInfo(newDbInfo);

      if (hasBlockingError) {
        setIsMetadataVerified(false);
        toast.error("Metadata verification found issues. Please review the highlighted rows.");
      } else {
        setIsMetadataVerified(true);
        toast.success("Metadata verified successfully. You can now publish.");
      }
    } catch (error) {
      setIsMetadataVerified(false);
      //logWithComponent('NewFileUpload', 'error', 'Error verifying metadata:', { error });
      console.error("Error verifying metadata:", error);
      toast.error("Error verifying metadata against the database");
    } finally {
      setVerifyingMetadata(false);
    }
  };

  useEffect(() => {
    const fetchFileNames = async () => {
      const url = IntegrationFrameworkAPI.getGeneratedFileNames();

      try {
        const response = await HAxiosService.GET(url);
        setFileNames(response.data);
      } catch (error) {
        console.error("Error fetching file names:", error);
        //logWithComponent('NewFileUpload', 'error', 'Error fetching file names:', { error });
      }
    };
    fetchFileNames();
  }, [intl, toast]);
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const names = [
    { label: "Save Into Database", value: 10 },
    { label: "Convert Into Csv File", value: 20 },
    { label: "Convert Into Excel File", value: 30 },
    { label: "Convert Into Json File", value: 40 },
  ];

  const fileTypeNames = [
    { label: "Convert Into XML File", value: 50 },
    { label: "Save Into Database", value: 60 }
  ]
  const fileTypeNamesxml = [
    { label: "Convert Xml Into Json File", value: 70 },

  ]

  const handleRetry = async () => {
    let validationErrors = {};

    if (!topicName.trim()) {
      validationErrors.topicName = "Required field";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    const modifiedTopicName = `${topicName}_retryTopic`;

    try {
      const postUrl = IntegrationFrameworkAPI.addListener();
      const formDataToSend = new FormData();
      formDataToSend.append("topicName", modifiedTopicName);

      HAxiosService.POST(postUrl, formDataToSend, {}, false, { "Content-Type": "multipart/form-data" }).then((response) => {
        const expectedResponseMessage = `Listener added and data receiving started for topic: ${modifiedTopicName}`;

        if (response.data === expectedResponseMessage) {
          localStorage.setItem("topicName", topicName);
          navigate("/homelayout/retrydata", {
            state: {
              from: "/homelayout/file-upload",
            },
          });
        }

      });
    } catch (error) {
      //logWithComponent('NewFileUpload', 'error', 'Error fetching data: ', { error });
      console.error("Error fetching data:", error);
      toast.error(intl.formatMessage({
        id: "error.fetch.retry",
        defaultMessage: "An error occurred while fetching retry data."
      }));
    }
  };

  const handlePublish = async () => {
    try {
      if (!isMetadataVerified) {
        toast.error("Please verify metadata before publishing.");
        return;
      }
      let validationErrors = {};
      const metadataErrors = metadata.map((data, index) => {
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
      metadata.forEach((data, index) => {
        const key = `column_${index}`;
        const existing = formData[index];
        if (existing && Object.prototype.hasOwnProperty.call(existing, key)) {
          formattedData[key] = existing;
        } else {
          const tableNamePortion = (data.tableNameColumnName || "").split(".")[0] || "";
          formattedData[key] = { [key]: `${tableNamePortion}.${data.columnName}` };
        }
      });

      const nullChecks = selectedNullChecks.map(
        (index) => metadata[index].columnName
      );

      const metadataWithNullChecks = metadata.map((item, index) => ({
        ...item,
        allowNull: selectedNullChecks.includes(index) ? false : true,
      }));

      const formDataToSend = new FormData();
      formDataToSend.append("file", file);
      formDataToSend.append("selectedValue", selectedValue);
      formDataToSend.append("topicName", topicName);
      formDataToSend.append("metadata", JSON.stringify(metadataWithNullChecks));
      formDataToSend.append("formattedData", JSON.stringify(formattedData));
      formDataToSend.append("dbUrl", dbCredentials.dbUrl);
      formDataToSend.append("dbUsername", dbCredentials.dbUsername);
      formDataToSend.append("dbPassword", dbCredentials.dbPassword);
      if (selectedPrimaryKey !== null) {
        formDataToSend.append(
          "primaryKey",
          metadata[selectedPrimaryKey].columnName
        );
      }
      formDataToSend.append("nullChecks", JSON.stringify(nullChecks));

      metadata.forEach((data, index) => {
        const combinedValue = `${data.columnName}.${formData[index]?.[`column_${index}`] || ""
          }`;
        formDataToSend.append(`column_${index}`, combinedValue);
        formDataToSend.append(`table_column_${index}`, data.tableNameColumnName);
      });


      const response = await HAxiosService.POST(IntegrationFrameworkAPI.newUpload, formDataToSend, {}, false, { "Content-Type": "multipart/form-data" });


      const result = response.data;

      if (result === "TODO") {
        toast.success(intl.formatMessage({
          id: "success.publish",
          defaultMessage: "Messages Publish Successfully........."
        }));
      } else {
        toast.error(intl.formatMessage({
          id: "error.result",
          defaultMessage: `result`
        }));
      }
    } catch (error) {
      //logWithComponent('NewFileUpload', 'error', 'Error publishing file:', { error });
      console.error("Error publishing file:", error);

      if (error.response && error.response.data) {
        toast.error(intl.formatMessage({
          id: "error.response.data",
          defaultMessage: `error.response.data`
        }));
      } else {
        toast.error(intl.formatMessage({
          id: "error.unexpected",
          defaultMessage: "An unexpected error occurred while publishing the file."
        }));
      }
    }
  };


  const handleGetCsv = () => {
    if (!csvFilePath) {
      toast.error(intl.formatMessage({
        id: "error.csv.path",
        defaultMessage: "First enter CSV path"
      }));
      return;
    }

    try {
      const postUrl = IntegrationFrameworkAPI.getAllFilesHeaders();
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);

      HAxiosService.POST(postUrl, formDataToSend, {}, false, { "Content-Type": "multipart/form-data" }).then((response) => {
        let columns = response.data;
        if (typeof columns === "string") {
          columns = columns.split(",");
        }
        setCsvColumns(columns);
        setGridData(
          columns.map((column, index) => ({
            id: index,
            columnName: column,
            newName: "",
          })));

        setColumnsFetched(true);
      });
    } catch (error) {    //logWithComponent('NewFileUpload', 'error', 'Error fetching data:', { error });
      console.error("Error fetching data:", error);

      toast.error(intl.formatMessage({
        id: "error.fetch",
        defaultMessage: "An error occurred while fetching  data."
      }));
    }
  };
  const [gridData, setGridData] = useState([]);
  const gridRef = useRef();


  const handleNewColumnChange = (event, index) => {
    const { value } = event.target;
    const newData = [...newformData];
    newData[index] = { newName: value };
    setNewFormData(newData);
  };

  const handleCsvFilePathChange = (event) => {
    setCsvFilePath(event.target.value);
  };

  const handlePublishCsv = () => {
    try {
      if (!columnsFetched) {
        toast.error(intl.formatMessage({
          id: "error.getColumns",
          defaultMessage: "Press 'Get Columns' button first"
        }));
        return;
      }
      if (!file || !csvFilePath || !topicName || !selectedValue) {
        toast.error(intl.formatMessage({
          id: "error.incomplete.data",
          defaultMessage: "Incomplete data for publishing"
        }));
        return;
      }

      const rows = gridRef.current.getCurrentData();

      const invalidColumns = [];

      for (let i = 0; i < rows.length; i++) {
        if (!rows[i].newName || rows[i].newName.trim() === "") {
          invalidColumns.push(csvColumns[i]);
        }
      }

      if (invalidColumns.length > 0) {
        toast.error(
          `New column name required for: ${invalidColumns.join(", ")}`
        );
        return;
      }

      const postUrl = IntegrationFrameworkAPI.publishCSV();
      const formDataToSend = new FormData();
      const headerMapping = {};

      rows.forEach((row) => {
        headerMapping[row.columnName] = row.newName || row.columnName;
      });

      formDataToSend.append("csvFilePath", csvFilePath);
      formDataToSend.append("file", file);
      formDataToSend.append("selectedValue", selectedValue);
      formDataToSend.append("topicName", topicName);
      formDataToSend.append("csvColumns", JSON.stringify(headerMapping));

      HAxiosService.POST(postUrl, formDataToSend, {}, false, { "Content-Type": "multipart/form-data" }).then((response) => { });

      toast.success(intl.formatMessage({
        id: "success.converted",
        defaultMessage: "Successfully converted file ....."
      }));

    } catch (error) {
      //logWithComponent('NewFileUpload', 'error', 'Error publishing CSV:', { error });
      console.error("Error publishing CSV:", error);
      toast.error(intl.formatMessage({
        id: "error.publish.csv",
        defaultMessage: "An error occurred while publishing CSV."
      }));
    }
  };
  const handleXMLToJSONPublish = async () => {
    try {
      if (!file || !topicName || !selectedValue || !xmlFilePath) {

        toast.error(intl.formatMessage({
          id: "error.incomplete.data",
          defaultMessage: "Incomplete data for publishing"
        }));

        return;
      }

      if (fileType === "xml" && selectedValue === 70) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("topicName", topicName);
        formData.append("selectedValue", selectedValue);
        formData.append("xmlFilePath", xmlFilePath);



        const url = IntegrationFrameworkAPI.convertXmlToJson();
        try {
          const response = await HAxiosService.POST(url, formData, {}, false, { "Content-Type": "multipart/form-data", });

          toast.success(intl.formatMessage({
            id: "success.conversion",
            defaultMessage: "Conversion successful........."
          }));

        } catch (error) {

          toast.error(intl.formatMessage({
            id: "success.converting.XMLtoJSON",
            defaultMessage: "Error converting   XML to JSON: " + error.message
          }));

          //logWithComponent('NewFileUpload', 'error', 'Error converting XML to JSON:', { error });
          console.error("Error converting XML to JSON:", error);
        }
      }
    } catch (error) {
      //logWithComponent('NewFileUpload', 'error', 'Error handling XML publish:', { error });
      console.error("Error handling XML publish:", error);
    }
  };
  const handleJsonToXMLPublish = async () => {
    try {
      if (!file || !topicName || !selectedValue || !jsonFilePath) {

        toast.error(intl.formatMessage({
          id: "error.incomplete.data",
          defaultMessage: "Incomplete data for publishing"
        }));

        return;
      }

      if (fileType === "json" && selectedValue === 50) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("topicName", topicName);
        formData.append("selectedValue", selectedValue);
        formData.append("jsonFilePath", jsonFilePath);



        const url = IntegrationFrameworkAPI.convertJsonToXml();
        try {
          const response = await HAxiosService.POST(url, formData, {}, false, { "Content-Type": "multipart/form-data", });

          toast.success(intl.formatMessage({ id: "success.conversion", defaultMessage: "Conversion successful........." }));

        } catch (error) {
          //logWithComponent('NewFileUpload', 'error', 'Error converting JSON to XML:', { error });

          toast.error(intl.formatMessage({
            id: "error.converting.jsonToXml",
            defaultMessage: "Error converting JSON to XML: " + error.message
          }));

          console.error("Error converting JSON to XML:", error);
        }
      }
    } catch (error) {
      //logWithComponent('NewFileUpload', 'error', 'Error handling XML publish:', { error });

      console.error("Error handling XML publish:", error);
    }
  };
  const containerMaxWidth = metadata.length > 0 && (selectedValue === 10 || selectedValue === 60) ? 'lg' : 'md';
  const columnDefs = [
    {
      headerName: intl.formatMessage({
        id: "label.Column.Name",
        defaultMessage: "Column Name",
      }),
      field: "columnName",
      editable: false,
      flex: 1,
    },
    {
      headerName: intl.formatMessage({
        id: "label.Column.Name.new",
        defaultMessage: "New Column Name",
      }),
      field: "newName",
      editable: true,
      flex: 1,
    },
  ];
  return (
    <Paper>
      <HBox style={{ display: "flex", flexDirection: "column", padding: "1rem", borderBottom: "1px solid var(--drs-border-divider, hsl(215 14% 90%))" }} >
        <HBreadCrumb />
        <TitleBar title="Upload Data" />
      </HBox>
      <Container
        maxWidth={containerMaxWidth}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          padding: "20px",
          marginBottom: "1rem",
          paddingBottom: "2.5rem",
        }}
      >
        <HBox
          sx={{
            display: "flex",
            justifyContent: "right",
            marginTop: "19px",
            bgcolor: "transparent",
          }}
        >
          <HButton
            label={intl.formatMessage({ id: "View Retry Data", defaultMessage: "View Retry Data", })}
            variant="outlined"
            color="secondary"
            onClick={handleRetry}
          />

        </HBox>

        <HTextField
          id="topicName"
          label={intl.formatMessage({ id: "Enter Topic Name", defaultMessage: "Enter Topic Name", })}
          value={topicName}
          editable={true}
          onChange={(e) => {
            setTopicName(e.target.value);

            if (errors.topicName && e.target.value.trim()) {
              setErrors({ ...errors, topicName: '' });
            }
          }}
          size="small"
          fullWidth
          margin="normal"
          error={!!errors.topicName}
          helperText={errors.topicName}
          style={{ marginBottom: "1.5rem" }}
          sx={{ color: surfaces.input }}
          InputLabelProps={{
            sx: {
              backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
              transform: 'translate(14px, 2px) scale(1)',
              '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
            }
          }}
        />

        <HBox sx={{ display: "flex", padding: "5px 5px 10px 5px", bgcolor: "transparent", justifyContent: "space-between" }}>
          <HLabel
            align="left"
            value={intl.formatMessage({ id: "Note", defaultMessage: "Note: only plain json save into databse", })}
            color="brown"
            sx={{ color: text.tertiary }}
            marginBottom="-0.9rem"
            colon={false}
          />

          <HLabel
            value={intl.formatMessage({ id: "FileType", defaultMessage: "Acceptable file types:.csv,.xls, .xlsx, .json, .xml", })}
            sx={{ color: text.primary, }}
            marginBottom="-0.9rem"
            colon={false}
          />
        </HBox>
        <HTextField
          label={intl.formatMessage({ id: "FileSelect", defaultMessage: "Select file or Drag and Drop here", })}
          value={file ? file.name : ""}
          editable={true}
          size="small"
          fullWidth
          onClick={handleSelectedFileClick}
          sx={{ color: surfaces.input }}
          InputLabelProps={{
            sx: {
              backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
              transform: 'translate(14px, 2px) scale(1)',
              '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
            }
          }}
        />

        <input
          accept=".csv, .xlsx, .xls, .json , .xml"
          style={{ display: "none" }}
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        {errors.file && (
          <HLabel
            value={errors.file}
            variant="body2"
            color="error"
          />

        )}
        <HBox
          sx={{
            display: "flex",
            justifyContent: "right",
            marginTop: "1rem",
            bgcolor: "transparent",
          }}
        >
          {file ? (
            (fileType === "json" && selectedValue === 50) || (fileType === "xml") ? (

              <HButton
                label={intl.formatMessage({ id: "Select", defaultMessage: "Select File", })}
                variant="outlined"
                component="span"
                onClick={() => fileInputRef.current?.click()}
              />
            ) : (
              selectedValue !== 20 && selectedValue !== 30 && selectedValue !== 40 && (

                <HButton
                  label={intl.formatMessage({ id: "MetaData", defaultMessage: "Get Metadata", })}
                  variant="outlined"
                  component="span"
                  onClick={handleGetMetadata}
                />
              )
            )
          ) : (
            <HButton
              label={intl.formatMessage({ id: "Select", defaultMessage: "Select File", })}
              variant="outlined"
              component="span"
              onClick={() => fileInputRef.current?.click()}
            />
          )}
        </HBox>

        <HBox sx={{ mt: 2 }}>
          <HDropdown
            id="selectType"
            name="selectedValue"
            options={fileType === "json"
              ? fileTypeNames
              : fileType === "xml"
                ? fileTypeNamesxml
                : names}
            value={selectedValue}
            placeholder={intl.formatMessage({ id: "Select Type", defaultMessage: "Select Type", })}
            width="100%"
            error={!!errors.selectedValue}
            onChange={(e) => {
              setSelectedValue(Number(e.target.value));
            }}
          />

          {errors.selectedValue && (
            <HLabel
              value={errors.selectedValue}
              color="error.main"
              colon={false}
              align="left"
              sx={{
                mt: 0.5,
                display: "block",
              }}
            />
          )}
        </HBox>
        {file && (selectedValue === 10 || selectedValue === 60) && (
          <>
            <Card
              sx={{
                mt: 3,
                p: 2,
                bgcolor: surfaces.paper,
                color: text.primary,
                border: `1px solid ${border.divider}`,
                boxShadow: isDark
                  ? "0 4px 12px rgba(0,0,0,0.4)"
                  : "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >

              <HLabel
                value={intl.formatMessage({ id: "Database Credentials", defaultMessage: "Database Credentials", })}
                colon={false}
                align="left"
                sx={{ color: text.primary, fontWeight: "bold", fontSize: "1rem" }}
              />
              <CardContent>

                <HTextField
                  label={intl.formatMessage({ id: "Database URL", defaultMessage: "Database URL", })}
                  name="dbUrl"
                  value={dbCredentials.dbUrl}
                  editable={true}
                  onChange={handleDbCredentialsChange}
                  fullWidth
                  margin="high"
                  size="small"
                  error={!!errors.dbUrl}
                  helperText={errors.dbUrl}
                  sx={{ color: surfaces.input, mb: "2rem" }}
                  InputLabelProps={{
                    sx: {
                      backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                      transform: 'translate(14px, 2px) scale(1)',
                      '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                    }
                  }}
                />
                <HTextField
                  label={intl.formatMessage({ id: "Database Username", defaultMessage: "Database Username", })}
                  name="dbUsername"
                  value={dbCredentials.dbUsername}
                  editable={true}
                  onChange={handleDbCredentialsChange}
                  fullWidth
                  margin="normal"
                  size="small"
                  error={!!errors.dbUsername}
                  helperText={errors.dbUsername}
                  sx={{ color: surfaces.input, mb: "2rem" }}
                  InputLabelProps={{
                    sx: {
                      backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                      transform: 'translate(14px, 2px) scale(1)',
                      '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                    }
                  }}
                />
                <HTextField
                  label={intl.formatMessage({ id: "Database Password", defaultMessage: "Database Password", })}
                  name="dbPassword"
                  type="password"
                  value={dbCredentials.dbPassword}
                  editable={true}
                  onChange={handleDbCredentialsChange}
                  fullWidth
                  margin="normal"
                  size="small"
                  error={!!errors.dbPassword}
                  helperText={errors.dbPassword}
                  sx={{ color: surfaces.input, mb: "1.5rem" }}
                  InputLabelProps={{
                    sx: {
                      backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                      transform: 'translate(14px, 2px) scale(1)',
                      '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                    }
                  }}
                />
                <HButton
                  label={intl.formatMessage({ id: "Test Connection", defaultMessage: "Test Connection", })}
                  variant="outlined"
                  color="secondary"
                  onClick={handleTestConnection}
                  sx={{ marginTop: "1rem", alignSelf: "center" }}
                />
                {isDbConnected && metadata && metadata.length > 0 && (
                  <>
                    <HBox sx={{ marginTop: "1rem" }}>
                      <HButton
                        label={fetchingDbTables ? "Fetching..." : "Fetch Tables"}
                        variant="outlined"
                        color="secondary"
                        onClick={handleFetchDbTables}
                        disabled={fetchingDbTables}
                      />

                    </HBox>

                    {dbTables.length > 0 && (
                      <HBox sx={{ marginTop: "1rem" }}>
                        <HDropdown
                          id="selectedDbTable"
                          name="selectedDbTable"
                          options={dbTables.map((table) => ({
                            label: table,
                            value: table,
                          }))}
                          value={selectedDbTable}
                          placeholder="Select Table"
                          width="100%"
                          onChange={handleDbTableChange}
                        />
                      </HBox>
                    )}

                    {selectedDbTable && (
                      <HBox sx={{ marginTop: "1rem" }}>
                        <HButton
                          label={fetchingDbTableMetadata ? "Fetching..." : "Update Metadata"}
                          variant="outlined"
                          color="secondary"
                          onClick={handleGetTableMetadata}
                          disabled={fetchingDbTableMetadata}
                        />

                      </HBox>
                    )}
                  </>
                )}
              </CardContent>
            </Card></>
        )}


        {fileType === "json" && selectedValue === 50 && (
          <>
            <HTextField
              label={intl.formatMessage({ id: "Enter path", defaultMessage: "Enter path", })}
              value={jsonFilePath}
              editable={true}
              onChange={(e) => {
                SetJsonFilePath(e.target.value);

                if (errors.jsonFilePath && e.target.value.trim()) {
                  setErrors({ ...errors, jsonFilePath: '' });
                }
              }}
              size="small"
              fullWidth
              margin="normal"
              error={!!errors.jsonFilePath}
              helperText={errors.jsonFilePath}
              style={{ marginBottom: "1.5rem", marginTop: "2.5rem" }}
              sx={{ color: surfaces.input }}
              InputLabelProps={{
                sx: {
                  backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                  transform: 'translate(14px, 2px) scale(1)',
                  '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                }
              }}
            />
            <HBox
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "19px",
                bgcolor: "transparent"
              }}
            >
              <HButton
                label={intl.formatMessage({ id: "Publish xml", defaultMessage: "Publish xml", })}
                variant="outlined"
                color="secondary"
                onClick={handleJsonToXMLPublish}
              />

            </HBox>
          </>
        )}

        {fileType === "xml" && selectedValue === 70 && (
          <>
            <HTextField
              label={intl.formatMessage({ id: "Enter path", defaultMessage: "Enter path", })}
              value={xmlFilePath}
              onChange={(e) => {
                SetXmlFilePath(e.target.value);

                if (errors.xmlFilePath && e.target.value.trim()) {
                  setErrors({ ...errors, xmlFilePath: '' });
                }
              }}
              size="small"
              fullWidth
              margin="normal"
              error={!!errors.xmlFilePath}
              helperText={errors.xmlFilePath}
              style={{ marginBottom: "1.5rem", marginTop: "2.5rem" }}
              sx={{ color: surfaces.input }}
              InputLabelProps={{
                sx: {
                  backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                  transform: 'translate(14px, 2px) scale(1)',
                  '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                }
              }}
            />
            <HBox
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "19px",
                bgcolor: "transparent "
              }}
            >
              <HButton
                label={intl.formatMessage({ id: "Publish", defaultMessage: "Publish", })}
                variant="outlined"
                color="secondary"
                onClick={handleXMLToJSONPublish}
              />
            </HBox>
          </>
        )}
        {metadata.length > 0 && (selectedValue === 10 || selectedValue === 60) && (
          <>
            <HBox id="responseContainer" sx={{ bgcolor: "transparent" }}>
              <form>
                <MetadataTable
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
                  formData={formData}
                  verifyClicked={verifyClicked}
                />
              </form>
            </HBox>


            <HBox
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "19px",
                bgcolor: "transparent",
                gap:"1rem"
              }}
            >
              <HButton
                label={verifyingMetadata ? "Verifying..." : "Verify Metadata"}
                variant="outlined"
                color="secondary"
                onClick={handleVerifyMetadata}
                disabled={verifyingMetadata}
              />

              <HButton
                label="Publish"
                variant="outlined"
                color="secondary"
                onClick={handlePublish}
                disabled={!isMetadataVerified}
              />

            </HBox>
          </>
        )}
        {(selectedValue === 20 ||
          selectedValue === 30 ||
          selectedValue === 40) && (
            <>
              <Card
                sx={{
                  marginTop: "3rem",
                  padding: "0.8rem",
                  borderRadius: "1px",
                  bgcolor: surfaces.paper
                }}
              >
                <HLabel
                  value={selectedValue === 20
                    ? intl.formatMessage({ id: "CSV", defaultMessage: "CSV Conversion Details", })
                    : selectedValue === 30
                      ? intl.formatMessage({ id: "EXCEL", defaultMessage: "Excel Conversion Details", })
                      : intl.formatMessage({ id: "JSON", defaultMessage: "JSON Conversion Details", })
                  }
                  align="left"
                  colon={false}
                  sx={{ color: text.primary, fontWeight: "bold", fontSize: "1rem" }}

                />
                <CardContent>
                  <HButton
                    label={intl.formatMessage({ id: "Get Columns", defaultMessage: "Get Columns", })}
                    sx={{
                      marginTop: "0.1rem",
                    }}
                    variant="outlined"
                    color="secondary"
                    onClick={handleGetCsv}
                  />

                  <HTextField
                    label={selectedValue === 20
                      ? intl.formatMessage({ id: "CsvPath", defaultMessage: "CSV File Path", })
                      : selectedValue === 30
                        ? intl.formatMessage({ id: "ExcelPath", defaultMessage: "Excel  File Path", })
                        : intl.formatMessage({ id: "JsonPath", defaultMessage: "JSON  File Path", })
                    }
                    editable={true}
                    name="csvFilePath"
                    value={csvFilePath}
                    error={!!errors.csvFilePath}
                    helperText={errors.csvFilePath}
                    onChange={handleCsvFilePathChange}
                    fullWidth
                    margin="normal"
                    size="small"
                    style={{ marginTop: "1rem" }}
                    sx={{ color: surfaces.input }}
                    InputLabelProps={{
                      sx: {
                        backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                        transform: 'translate(14px, 2px) scale(1)',
                        '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                      }
                    }}
                  />
                  {gridData.length > 0 && (
                    <HAgGrid
                      ref={gridRef}
                      rowData={gridData}
                      columnDefs={columnDefs}
                      allowUpdate={true}
                      allowAdd={false}
                      allowDelete={false}
                      pagination={false}
                      sort={false}
                    />
                  )}
                </CardContent>
              </Card>
              <HBox
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "19px",
                  bgcolor: "transparent"
                }}
              >
                <HButton
                  label={intl.formatMessage({ id: "Publish data", defaultMessage: "Publish Data", })}
                  variant="outlined"
                  color="secondary"
                  onClick={handlePublishCsv}
                />

              </HBox>
            </>
          )}
      </Container>
      <HDialog
        open={openDialog}
        onClose={handleCancelOverride}
        title={intl.formatMessage({ id: "FileMetaData", defaultMessage: "Metadata for this file is already available.", })}
        actions={
          <HBox sx={{ display: "flex", justifyContent: "flex-end", gap: "1rem", backgroundColor: "transparent" }}>
          <HButton label={intl.formatMessage({ id: "Cancel", defaultMessage: "Cancel" })} onClick={handleCancelOverride} color="primary" />
          <HButton label={intl.formatMessage({ id: "YesOverride", defaultMessage: "Yes, Override" })} onClick={handleConfirmOverride} color="primary" autoFocus />
          </HBox>
        }
      >
        <HBox sx={{ backgroundColor: "transparent" }}>
          {intl.formatMessage({ id: "OverrideMetaData", defaultMessage: "Do you want to override the existing metadata?", })}
        </HBox>
      </HDialog>
    </Paper>
  );
}
