import React, { useState, useEffect } from 'react';
import { Grid,Select,  InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, Typography, Box, IconButton } from '@mui/material';
import { HAxiosService, HAgGrid, HBox, HButton, HLabel, HTextField, HDropdown, useDrsTheme, TitleBar, HBreadCrumb, useToast } from "@helix/component-library";

import { useIntl } from "react-intl";

import { IntegrationFrameworkAPI } from "./apiEndpoints";
import { logger } from "@helix/component-library";


const DatabaseForm = () => {
  const [dbUrl, setDbUrl] = useState('');
  const [dbUsername, setDbUsername] = useState('');
  const [dbPassword, setDbPassword] = useState('');
  const [urlIdentifier, setUrldentifier] = useState("");
  const [filePath, setFilePath] = useState("");
  const [topicName, setTopicName] = useState("");
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableMetadata, setTableMetadata] = useState([]);
  const [transactionType, setTransactionType] = useState("");
  const [targetDbUrl, setTargetDbUrl] = useState('');
  const [targetDbUsername, setTargetDbUsername] = useState('');
  const [targetDbPassword, setTargetDbPassword] = useState('');
  const [targetTableNames, setTargetTableNames] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedTablesAndColumns, setSelectedTablesAndColumns] = useState([
    { tableName: '', columns: [], selectedColumn: '' },
  ]);

  const toast = useToast();
  const intl = useIntl();
  const { themeVars, surfaces, text, border, action, colors, isDark } = useDrsTheme();

  const handleFilePathChange = (event) => {
    const newFilePath = event.target.value;
    setFilePath(newFilePath);
    logger.info('DatabaseForm', 'info', `File path changed to: ${newFilePath}`);
  };
  const handleTopicChange = (event) => {
    const newTopicName = event.target.value;
    setTopicName(newTopicName);
    logger.info('DatabaseForm', 'info', `Topic name changed to: ${newTopicName}`);
  };
  
  const handleTransactionChange = (event) => {
    const newTransactionType = event.target.value;
    setTransactionType(newTransactionType);
    logger.info('DatabaseForm', 'info', `Transaction type changed to: ${newTransactionType}`);
  };

  const handleFetchTables = async () => {
    setIsSubmitted(true);

    if (!dbUrl || !dbUsername || !dbPassword) {
      logger.info('DatabaseForm', 'warn', 'Missing database credentials. Cannot fetch tables.');
      return;
    }

    try {
      logger.info('Fetching Tables..');
      const response = await HAxiosService.POST(IntegrationFrameworkAPI.fetchTables, {
        dbUrl,
        dbUsername,
        dbPassword,
      });
      setTables(response.data);
      logger.info('DatabaseForm', 'info', `Fetched tables: ${JSON.stringify(response.data)}`);
    } catch (error) {
      logger.info('DatabaseForm', 'error', `Error fetching tables: ${error.message}`);
      console.error('Error fetching tables:', error);
    }
  };
  const handleFetchMetadata = async () => {

    try {
      logger.info(`Fetching metadata for table: ${selectedTable}`);
      const response = await HAxiosService.POST(IntegrationFrameworkAPI.tableMetadata, {
        dbUrl,
        dbUsername,
        dbPassword,
        tableName: selectedTable,
      });
      setTableMetadata(response.data.tableMetadata);
      logger.info('DatabaseForm', 'info', `Fetched metadata: ${JSON.stringify(response.data.tableMetadata)}`);
    } catch (error) {
      logger.info('DatabaseForm', 'error', `Error fetching table metadata: ${error.message}`);
      console.error('Error fetching table metadata:', error);
    }
  };

  const fetchTargetTables = async () => {
    try {
      logger.info('Fetching Target Tables..');
      const response = await HAxiosService.POST(IntegrationFrameworkAPI.getTargetTables, {
        targetDbUrl,
        targetDbUsername,
        targetDbPassword,
      });
      setTargetTableNames(response.data);
      logger.info('DatabaseForm', 'info', `Fetched target tables: ${JSON.stringify(response.data)}`);
      console.log("Fetched tables: ", response.data);
    } catch (error) {
      logger.info('DatabaseForm', 'error', `Error fetching target tables: ${error.message}`);
      console.error('Error fetching target tables:', error);
    }
  };


  const fetchTargetColumns = async (tableName, index) => {

    try {
      logger.info('DatabaseForm', 'info', `Fetching columns for table: ${tableName}`);
      const response = await HAxiosService.POST(IntegrationFrameworkAPI.fetchTargetColumns, {
        targetDbUrl,
        targetDbUsername,
        targetDbPassword,
        tableName,
      });

      setSelectedTablesAndColumns((prevSelections) => {
        const updatedSelections = [...prevSelections];

        if (!updatedSelections[index]) {
          updatedSelections[index] = { tableName: '', columns: [], selectedColumn: '' };
        }

        updatedSelections[index].columns = response.data;

        return updatedSelections;
      });
      logger.info('DatabaseForm', 'info', `Fetched columns for table ${tableName}: ${JSON.stringify(response.data)}`);
      console.log('Fetched columns: ', response.data);
    } catch (error) {
      logger.info('DatabaseForm', 'error', `Error fetching target columns for ${tableName}: ${error.message}`);
      console.error('Error fetching target table metadata:', error);
    }
  };

  const handleTableChange = (event, index) => {
    const { value } = event.target;

    setSelectedTablesAndColumns((prevSelections) => {
      const updatedSelections = [...prevSelections];

      if (!updatedSelections[index]) {
        updatedSelections[index] = { tableName: value, columns: [], selectedColumn: '' };
      } else {
        updatedSelections[index].tableName = value;
      }

      return updatedSelections;
    });

    fetchTargetColumns(value, index);
  };

  const handleColumnChange = (event, index) => {
    const { value } = event.target;
    setSelectedTablesAndColumns((prevSelections) => {
      const updatedSelections = [...prevSelections];

      if (!updatedSelections[index]) {
        updatedSelections[index] = { tableName: '', columns: [], selectedColumn: value };
      } else {
        updatedSelections[index].selectedColumn = value;
      }

      return updatedSelections;
    });
  };
  useEffect(() => {
    if (targetDbUrl && targetDbUsername && targetDbPassword) {
      fetchTargetTables();
    }
  }, [targetDbUrl, targetDbUsername, targetDbPassword]);


  const handleSubmit = async () => {
    logger.info('DatabaseForm', 'info', 'Preparing to submit metadata...');
    const sourcePrimaryKeyName = tableMetadata.find((column) => column.isPrimaryKey === "true")?.name || "";

    let missingFields = [];

    if (!urlIdentifier) missingFields.push('URL Identifier');
    if (!dbUrl) missingFields.push('Database URL');
    if (!dbUsername) missingFields.push('Database Username');
    if (!dbPassword) missingFields.push('Database Password');
    if (!targetDbUrl) missingFields.push('Target Database URL');
    if (!targetDbUsername) missingFields.push('Target Database Username');
    if (!targetDbPassword) missingFields.push('Target Database Password');
    if (!selectedTable) missingFields.push('Selected Table');

    tableMetadata.forEach((column, index) => {
      const targetTableName = selectedTablesAndColumns[index]?.tableName;
      const targetSelectedColumn = selectedTablesAndColumns[index]?.selectedColumn;

      if (!targetTableName) missingFields.push(`Target Table for column ${column.name}`);
      if (!targetSelectedColumn) missingFields.push(`Target Column for column ${column.name}`);
    });

    // if (missingFields.length > 0) {
    //   toast.error(intl.formatMessage({id:"error.all.fields", defaultMeassage: "All fields are required"}));
    //   return;
    // }

    missingFields.forEach(field => {
      toast.error(`${field} is required`);
      return;
    });

    if (missingFields.length === 0) {
      const requestBody = {
        urlIdentifier,
        dbUrl,
        dbUsername,
        dbPassword,
        targetDbUrl,
        targetDbUsername,
        targetDbPassword,
        sourceTableName: selectedTable,
        sourcePrimaryKeyName,
        selectedTablesAndColumns: tableMetadata.map((column, index) => {
          let primaryKey = selectedTablesAndColumns[index]?.primaryKey || '';

          if (!primaryKey && index > 0) {
            primaryKey = selectedTablesAndColumns[index - 1]?.primaryKey || '';
          }

          return {
            sourceColumnName: column.name,
            sourceColumnDataType: column.dataType,
            targetTableName: selectedTablesAndColumns[index]?.tableName || '',
            targetSelectedColumn: selectedTablesAndColumns[index]?.selectedColumn || '',
            isPrimaryKey: column.isPrimaryKey,
            targetTablePrimaryKey: primaryKey,
          };
        }),
      };

      console.log('requestBody Data:', JSON.stringify(requestBody));

      try {
         const response = await HAxiosService.POST(IntegrationFrameworkAPI.saveMetadata, requestBody);

        toast.success(intl.formatMessage({id:"success.request", defaultMessage:"Request successful"}));

        console.log('Response Data:', response.data);
      } catch (error) {
        console.error('Error submitting the form:', error);
        toast.error(intl.formatMessage({id:"error.failed.submit",defaultMessage:"Failed to submit the form"}));
      }
    }
  };

  const handleConversion = async () => {
    logger.info('DatabaseForm', 'info', 'Preparing to convert data...');
    let missingFields = [];

    if (!dbUrl) missingFields.push('Database URL');
    if (!dbUsername) missingFields.push('Database Username');
    if (!dbPassword) missingFields.push('Database Password');
    if (!selectedTable) missingFields.push('Selected Table');
    if (!selectedFormat) missingFields.push('File Format');
    if (!filePath) missingFields.push('File Path');

    // if (missingFields.length > 0) {
    //   toast.error(intl.formatMessage({id:"error.all.fields", defaultMeassage: "All fields are required"}));
    //   return;
    // }

    missingFields.forEach(field => {
      toast.error(`${field} is required`);
      return ;
    });

    if (missingFields.length === 0) {
      const requestBody = {
        dbUrl,
        dbUsername,
        dbPassword,
        sourceTableName: selectedTable,
        fileFormat: selectedFormat,
        filePath,topicName
      };

      console.log('requestBody handleConversion Data:', JSON.stringify(requestBody));

      try {
           await HAxiosService.POST(IntegrationFrameworkAPI.fileConversion, requestBody);

        toast.success(intl.formatMessage({id:"success.request", defaultMessage:"Request successful"}));

      } catch (error) {
        logger.info('DatabaseForm', 'error', `Error submitting the form: ${error.message}`);
        console.error('Error submitting the form:', error);
        toast.error(intl.formatMessage({id:"error.failed.submit",defaultMessage:"Failed to submit the form"}));
      }
    }
  };

  const names = [
    { label: "Convert Into Csv File", value: "csv" },
    { label: "Convert Into Excel File", value: "excel" },
    { label: "Convert Into Json File", value: "json" },
    { label: "Convert Into XML File", value: "xml" },

  ];

  const handlePrimaryKeyChange = (event, index) => {
    const { value } = event.target;
    setSelectedTablesAndColumns((prevSelections) => {
      const updatedSelections = [...prevSelections];
      if (!updatedSelections[index]) {
        updatedSelections[index] = { tableName: '', columns: [], selectedColumn: '', primaryKey: value };
      } else {
        updatedSelections[index].primaryKey = value;
      }
      return updatedSelections;
    });
  };

  const columnDefs = [
  {
    headerName: intl.formatMessage({id:"label.source.table", defaultMessage:"Source Table Column Name"}),
    field: "name",
    editable: false,
    flex: 1,
  },
  {
    headerName: intl.formatMessage({id:"label.Data.Type", defaultMessage:"Data Type"}),
    field: "dataType",
    editable: false,
    flex: 1,
  },
  {
    headerName: intl.formatMessage({id:"label.target.table", defaultMessage:"Target Table"}),
    field: "tableName",
    editable: true,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: (params) => ({
      values: targetTableNames,
    }),
    flex: 1,
  },
  {
    headerName: intl.formatMessage({id:"label.target.column", defaultMessage:"Target Column"}),
    field: "selectedColumn",
    editable: true,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: (params) => ({
      values: params.data.columns || [],
    }),
    flex: 1,
  },
  {
    headerName: intl.formatMessage({id:"label.primary.key", defaultMessage:"Primary Key"}),
    field: "primaryKey",
    editable: true,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: (params) => ({
      values: params.data.columns || [],
    }),
    flex: 1,
  },
];

  return (
    <Paper>
      <HBox style={{ display: "flex", flexDirection: "column", padding: "1rem", borderBottom: "1px solid var(--drs-border-divider, hsl(215 14% 90%))" }} >
        <HBreadCrumb />
        <TitleBar title="label.database.configurator" />
      </HBox>
      <Container
        maxWidth="lg"
        style={{        
          padding: "20px",
          marginBottom: "1rem",
          paddingBottom: "1.5rem",
        }}
      >
            
        <Grid container spacing={3} padding={3}>

          <Grid size={transactionType === "transfer-data" ? 6 : 12}>
            <HDropdown
              name="transactionType"
              width="100%"
              value={transactionType}
              onChange={handleTransactionChange}
              placeholder={intl.formatMessage({id:"label.transaction.type",defaultMessage:"Select Transaction Type"})}
              options={[
                { label: "Convert To File", value: "convert-file" },
                { label: "Transfer Data To Target DB", value: "transfer-data" },
              ]}
            />
          </Grid>
          {transactionType === "convert-file" && (

            <>
              <Grid size={{ xs: 12, md: 4 }}>
                <HTextField
                  label={intl.formatMessage({id:"Enter Topic Name", defaultMessage:"Enter Topic Name"})}
                  editable
                  width="100%"
                  onChange={handleTopicChange}
                  value={topicName}
                  InputLabelProps={{
                    sx: {
                      backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                      transform: 'translate(14px, 2px) scale(1)',
                      '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                    }
                  }} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <HDropdown
                  width="100%"
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  placeholder={intl.formatMessage({id:"label.file.format",defaultMessage:"Select File Format"})}
                  options={names}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <HTextField 
                  label={intl.formatMessage({id:"Enter path",defaultMessage:"Enter File Path"})}
                  onChange={handleFilePathChange} 
                  editable
                  width="100%"
                  value={filePath}
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

          {transactionType === "transfer-data" && (<Grid size={6}>
            <HTextField
              label={intl.formatMessage({id:"label.db.identifier",defaultMessage:"Enter DB File Identifier"})}
              variant="outlined"
              fullWidth
              editable
              value={urlIdentifier}
              onChange={(e) => {
                setUrldentifier(e.target.value);
              }}
              InputLabelProps={{
                sx: {
                  backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                  transform: 'translate(14px, 2px) scale(1)',
                  '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                }
              }}
            />
          </Grid>)}
          {(transactionType === "transfer-data" || transactionType === "convert-file") && (<>
            <Grid size={12}>
              <HTextField
                label={intl.formatMessage({id:"Database URL",defaultMessage:"Database URL"})}
                fullWidth
                editable
                value={dbUrl}
                onChange={(e) => setDbUrl(e.target.value)}
                error={isSubmitted && !dbUrl}
                helperText={isSubmitted && !dbUrl && "Database URL is required"}
                InputLabelProps={{
                  sx: {
                    backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                    transform: 'translate(14px, 2px) scale(1)',
                    '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                  }
                }}
              />
            </Grid>
            <Grid sx={{mt:1.5}} size={{ xs: 12, sm: 6 }}>
              <HTextField
                label={intl.formatMessage({id:"Database Username",defaultMessage:"Database Username"})}
                fullWidth
                editable
                value={dbUsername}
                onChange={(e) => setDbUsername(e.target.value)}
                error={isSubmitted && !dbUsername}
                helperText={isSubmitted && !dbUsername && "Database Username is required"}
                InputLabelProps={{
                  sx: {
                    backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                    transform: 'translate(14px, 2px) scale(1)',
                    '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                  }
                }}
              />
            </Grid>
            <Grid sx={{mt:1.5}} size={{ xs: 12, sm: 6 }}>
              <HTextField
                label={intl.formatMessage({id:"Database Password",defaultMessage:"Database Password"})}
                type="password"
                fullWidth
                editable
                value={dbPassword}
                onChange={(e) => setDbPassword(e.target.value)}
                error={isSubmitted && !dbPassword}
                helperText={isSubmitted && !dbPassword && "Database Password is required"}
                InputLabelProps={{
                  sx: {
                    backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                    transform: 'translate(14px, 2px) scale(1)',
                    '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                  }
                }}
              />
            </Grid>

            <Grid container justifyContent="center" style={{ marginTop:"1rem" }} size={12}>
              <HButton
                label={intl.formatMessage({id:"label.fetch.tables",defaultMessage:"Fetch Tables"})}
                variant="outlined"
                color="primary"
                onClick={handleFetchTables}
              />
            </Grid>

            {tables.length > 0 && (
              <Grid style={{ textAlign: "center" }} size={12}>
                <HDropdown
                  width="100%"
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  placeholder={intl.formatMessage({id:"label.select.table",defaultMessage:"Select Table"})}
                  options={tables.map((table) => ({
                    label: table,
                    value: table,
                  }))}
                />
              </Grid>
            )}

          </>)}

          {transactionType === "convert-file" && (
            <Grid sx={{ display: "flex", justifyContent: "center",}} size={12}>
              <HButton
                label={intl.formatMessage({id:"label.convert.file",defaultMessage:"Convert Into File"})}
                variant="outlined"
                color="secondary"
                onClick={handleConversion}
              />
            </Grid>

          )}
          {transactionType === "transfer-data" && (<>
            {selectedTable && (
              <>
                <Grid size={12}>
                  <HTextField
                    label={intl.formatMessage({id:"label.db.url",defaultMessage:"Target Database URL"})}
                    fullWidth
                    editable
                    value={targetDbUrl}
                    onChange={(e) => setTargetDbUrl(e.target.value)}
                    InputLabelProps={{
                      sx: {
                        backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                        transform: 'translate(14px, 2px) scale(1)',
                        '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <HTextField
                    label={intl.formatMessage({id:"label.db.username",defaultMessage:"Target Database Username"})}
                    fullWidth
                    editable
                    value={targetDbUsername}
                    onChange={(e) => setTargetDbUsername(e.target.value)}
                    InputLabelProps={{
                      sx: {
                        backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                        transform: 'translate(14px, 2px) scale(1)',
                        '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <HTextField
                    label={intl.formatMessage({id:"label.db.password",defaultMessage:"Target Database Password"})}
                    type="password"
                    fullWidth
                    editable
                    value={targetDbPassword}
                    onChange={(e) => setTargetDbPassword(e.target.value)}
                    InputLabelProps={{
                      sx: {
                        backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
                        transform: 'translate(14px, 2px) scale(1)',
                        '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
                      }
                    }}
                  />
                </Grid>
                {targetDbUrl && targetDbUsername && targetDbPassword && (
                  <Grid style={{ textAlign: "center" }} size={12}>
                    <HButton
                      label={intl.formatMessage({id:"label.fetch.metadata",defaultMessage:"Fetch Table Metadata"})}
                      variant="outlined"
                      color="secondary"
                      onClick={handleFetchMetadata}
                    />
                  </Grid>
                )}
              </>
            )}

            {tableMetadata.length > 0 && (
              <Grid size={12}>
                <HAgGrid
                  rowData={tableMetadata}
                  columnDefs={columnDefs}
                  allowUpdate
                  pagination={false}
                  gridStyle={{ width: "100%" }}
                />
              </Grid>
            )} </>)}
        </Grid>
        {transactionType === "transfer-data" && (<HBox
          sx={{
            display: "flex",
            justifyContent: "center",
            backgroundColor:"transparent"
          }}
        >
          <HButton
            size='small'
            label={intl.formatMessage({id:"Submit",defaultMessage:"Submit"})}
            variant="outlined"
            color="secondary"
            onClick={handleSubmit}
          />
        </HBox>)}

      </Container>
    </Paper>
  );
};

export default DatabaseForm;
