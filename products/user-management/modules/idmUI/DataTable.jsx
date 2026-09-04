import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, IconButton, Collapse, Box, Select, MenuItem
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const CircularCheckbox = styled(Checkbox)(() => ({
  "& .MuiSvgIcon-root": {
    borderRadius: "10%",
    width: "0.8em",
    height: "0.6em",
  },
}));

const DataTable = () => {
  const [files, setFiles] = useState({});
  const [selectedFile, setSelectedFile] = useState("");
  const [data, setData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [checkboxState, setCheckboxState] = useState({});
  // Load JSON files dynamically using Vite import.meta.glob
  useEffect(() => {
    const loadFiles = async () => {
      const modules = import.meta.glob("@resources/*.json");
      const loadedFiles = {};

      await Promise.all(
        Object.entries(modules).map(async ([path, loader]) => {
          const fileName = path.split("/").pop().replace(".json", "");
          const module = await loader();
          loadedFiles[fileName] = module.default;
        })
      );

      setFiles(loadedFiles);
      const firstFile = Object.keys(loadedFiles)[0];
      if (firstFile) setSelectedFile(firstFile);
    };

    loadFiles();
  }, []);

  // Load data and initialize checkbox state
  useEffect(() => {
    if (selectedFile && files[selectedFile]) {
      const hierarchy = Array.isArray(files[selectedFile])
        ? files[selectedFile]
        : Object.values(files[selectedFile]);

      setData(hierarchy);

      const initializeCheckboxState = (items) => {
        return items.reduce((acc, item) => {
          acc[item.caption] = {
            read: false,
            create: false,
            update: false,
            delete: false,
            full: false,
          };
          if (item.items) {
            acc = { ...acc, ...initializeCheckboxState(item.items) };
          }
          return acc;
        }, {});
      };

      setCheckboxState(initializeCheckboxState(hierarchy));
    }
  }, [selectedFile, files]);

  const handleCheckboxChange = (caption, action, parent = null) => {
    setCheckboxState((prev) => {
      const newState = { ...prev };
      newState[caption][action] = !newState[caption][action];

      if (action === "full") {
        const isChecked = newState[caption].full;
        newState[caption] = {
          read: isChecked,
          create: isChecked,
          update: isChecked,
          delete: isChecked,
          full: isChecked,
        };
        if (parent && Array.isArray(parent.items)) {
          const updateChildren = (items) => {
            items.forEach((item) => {
              newState[item.caption] = {
                read: isChecked,
                create: isChecked,
                update: isChecked,
                delete: isChecked,
                full: isChecked,
              };
              if (item.items) updateChildren(item.items);
            });
          };
          updateChildren(parent.items);
        }
      } else {
        const { read, create, update, delete: del } = newState[caption];
        newState[caption].full = read && create && update && del;
      }
      return newState;
    });
  };

  const toggleRow = (caption) => {
    setExpandedRows((prev) => ({
      ...prev,
      [caption]: !prev[caption],
    }));
  };

  const renderRows = (items, level = 0, parent = null) =>
    items.map((item, idx) => {
      const isFullOnly = item.showFullOnly === true;
      const uniqueKey = `${level}-${parent?.caption || "root"}-${item.caption}-${idx}`;

      return (
        <React.Fragment key={uniqueKey}>
          <TableRow>
            <TableCell style={{ paddingLeft: `${level * 20}px`, width: "60%" }}>
              {item.items && (
                <IconButton size="small" onClick={() => toggleRow(item.caption)}>
                  {expandedRows[item.caption] ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              )}
              {item.caption}
            </TableCell>
            {["read", "create", "update", "delete", "full"].map((action) =>
              isFullOnly && action !== "full" ? (
                <TableCell key={action} />
              ) : (
                <TableCell align="center" key={action}>
                  <CircularCheckbox
                    checked={checkboxState[item.caption]?.[action] || false}
                    onChange={() => handleCheckboxChange(item.caption, action, item)}
                  />
                </TableCell>
              )
            )}
          </TableRow>
          {item.items && (
            <TableRow>
              <TableCell style={{ padding: 0 }} colSpan={6}>
                <Collapse in={expandedRows[item.caption]} timeout="auto" unmountOnExit>
                  <Table size="small">
                    <TableBody>{renderRows(item.items, level + 1, item)}</TableBody>
                  </Table>
                </Collapse>
              </TableCell>
            </TableRow>
          )}
        </React.Fragment>
      );
    });

  return (
    <Box sx={{ padding: 2 }}>
      <Select
        value={selectedFile}
        onChange={(e) => setSelectedFile(e.target.value)}
        sx={{ mb: 2, height: "2rem" }}
      >
        {Object.keys(files).map((fileName) => (
          <MenuItem key={fileName} value={fileName}>
            {fileName}
          </MenuItem>
        ))}
      </Select>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Menu</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Read</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Create</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Update</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Delete</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Full</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderRows(data)}</TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DataTable;
