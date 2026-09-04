import React from "react";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, FormControl, Select, MenuItem, TextField, Radio, Autocomplete } from "@mui/material";
import { useDrsTheme } from "@helix/component-library";

const MetadataTable = ({
  metadata,
  errors,
  tableOptions,
  selectedPrimaryKey,
  selectedNullChecks,
  handleDataTypeChange,
  handleMaxColumnLengthChange,
  handlePrimaryKeyChange,
  handleNullChange,
  handleTableNameChange,
  handleInputChange,
  validateField,formData, verifyClicked
}) => {
    const { surfaces} = useDrsTheme();
  return (
    <div id="responseContainer">
      <h3>Metadata:</h3>
      <form>
        <TableContainer component={Paper} style={{ maxHeight: 2000 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {["Column Name", "Data Type", "Max length", "tableName.columnName", "Primary Key", "Not Null"].map((header) => (
                  <TableCell
                    key={header}
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      border: "1px solid #ccc",
                      width: header === "Max length" ? "125px" : undefined,
                      minWidth: header === "Max length" ? "125px" : undefined,
                      backgroundColor:surfaces.panel
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {metadata.map((data, index) => (
                <TableRow key={index}>
                  <TableCell style={{ border: "1px solid #ccc" }} align="center">
                    {data.columnName}
                    {errors[`metadata[${index}]`] && errors[`metadata[${index}]`].columnName && (
                      <div style={{ color: "red" }}>{errors[`metadata[${index}]`].columnName}</div>
                    )}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ccc" }}>
                    <FormControl fullWidth size="small">
                      <Select
                        value={data.dataType}
                        onChange={(e) => handleDataTypeChange(e, index)}
                        inputProps={{
                          style: {
                            fontSize: "0.8rem",
                            color: "black",
                            fontFamily: "Arial, Regular",
                          },
                        }}
                        sx={{
                          height: "2rem",
                          paddingTop: "0.5rem",
                        }}
                      >
                        {["String", "Integer", "Date", "Double", "Timestamp"].map((type) => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {errors[`metadata[${index}]`] && errors[`metadata[${index}]`].dataType && (
                      <div style={{ color: "red" }}>{errors[`metadata[${index}]`].dataType}</div>
                    )}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ccc" }} align="center">
                    {data.dataType === "Double" ? (
                      <TextField
                        label="Precision"
                        type="text"
                        value={data.maxColumnLength}
                        onChange={(e) => handleMaxColumnLengthChange(e, index)}
                        inputProps={{
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                        }}
                        InputProps={{
                          style: {
                            height: "2rem",
                            padding: "0",
                          },
                        }}
                        size="small"
                        fullWidth
                      />
                    ) : data.dataType === "Date" ? (
                      <TextField
                        label="Date Pattern"
                        value={data.format}
                        onChange={(e) => handleMaxColumnLengthChange(e, index)}
                        size="small"
                        fullWidth
                        inputProps={{
                          maxLength: 11,
                        }}
                        InputProps={{
                          style: {
                            height: "2rem",
                            padding: "0",
                          },
                        }}
                      />
                    ) : data.dataType === "Timestamp" ? (
                      <TextField
                        label="DateTimestamp Pattern"
                        value={data.format}
                        onChange={(e) => handleMaxColumnLengthChange(e, index)}
                        size="small"
                        fullWidth
                        inputProps={{
                          maxLength: 25,
                        }}
                        InputProps={{
                          style: {
                            height: "2rem",
                            padding: "0",
                          },
                        }}
                      />
                    ) : (
                      <TextField
                        type="text"
                        value={data.maxColumnLength}
                        onChange={(e) => handleMaxColumnLengthChange(e, index)}
                        inputProps={{
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                        }}
                        InputProps={{
                          style: {
                            height: "2rem",
                            padding: "0",
                          },
                        }}
                        size="small"
                        fullWidth
                      />
                    )}
                    {verifyClicked && !["Date", "Timestamp"].includes(data.dataType) &&!errors[`metadata[${index}]`]?.maxColumnLength &&
                      data.dbMaxLength && (
                        <div
                          style={{
                            color: "#666",
                            fontSize: "0.75rem",
                            marginTop: "4px",
                          }}
                        >
                          MaxLength Allowed: {data.dbMaxLength}
                        </div>
                      )}
                    {errors[`metadata[${index}]`] && errors[`metadata[${index}]`].maxColumnLength && (
                      <div style={{ color: "red" }}>{errors[`metadata[${index}]`].maxColumnLength}</div>
                    )}
                    {errors[`metadata[${index}]`] && errors[`metadata[${index}]`].format && (
                      <div style={{ color: "red" }}>{errors[`metadata[${index}]`].format}</div>
                    )}
                  </TableCell>
                  <TableCell style={{ border: '1px solid #ccc', width: "400px" }}>
                    <Autocomplete
                      freeSolo
                      options={tableOptions}
                      value={data.tableNameColumnName || ''}
                      onChange={(event, newValue) => handleTableNameChange(newValue, index)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                          name={`column_${index}`}
                          onChange={(event) => handleInputChange(event, index)}
                          onBlur={(event) => validateField(index, 'tableNameColumnName', event.target.value.trim())}
                          onPaste={(event) => event.preventDefault()}
                        //  value={data.tableNameColumnName || ''}
                        value={formData[index]?.[`column_${index}`]?.split('.')[0] || ''}

                          style={{ fontSize: '14px' }}
                          InputProps={{
                            ...params.InputProps,
                            style: {
                              height: '2rem',
                              padding: '0 14px',
                            },
                          }}
                        />
                      )}
                    />
                    {errors[`metadata[${index}]`] && errors[`metadata[${index}]`].tableNameColumnName && (
                      <div style={{ color: 'red' }}>{errors[`metadata[${index}]`].tableNameColumnName}</div>
                    )}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ccc" }} align="center">
                    <Radio
                      checked={selectedPrimaryKey === index}
                      onChange={() => handlePrimaryKeyChange(index)}
                    />
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ccc" }} align="center">
                    <Radio
                      checked={selectedNullChecks.includes(index)}
                      onClick={() => handleNullChange(index)}
                      onDoubleClick={() => handleNullChange(index, true)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </form>
    </div>
  );
};

export default MetadataTable;
