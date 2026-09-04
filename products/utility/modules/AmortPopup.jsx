import React,{ useMemo }from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { PictureAsPdf } from "@mui/icons-material"; 
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import ebixLogo from "@images/Ebix_logo.png";
import excelLogo from "@images/excel-logo.jpg";
import { HDialog } from "@helix/component-library";

function AmortPopup({ open, onClose, data, tenor, roi, tenorIn, variations }) {
  // Check if we have Skip EMI variations with skippartpay = "Y"
  const hasSkipPartPayY = useMemo(() => {
    const skipVariations = variations?.Skip_EMI || {};
    return Object.values(skipVariations).some(skip => skip.skippartpay === "Y");
  }, [variations]);

  const mappedData = (Array.isArray(data) ? data : []).map(row => ({
    no: row.NO,
    cycleDate: row.CYLDT,
    openingBalance: row.OPBAL,
    emi: row.EMI,
    principal: row.PRIEMI,
    interest: row.INTEMI,
    closingBalance: row.CLSBAL,
    ...(hasSkipPartPayY && {
      intBeforePartSkip: row.INTBEFPARTSKP,
      skipIntOpen: row.SKPINTOPN,
      skipInterest: row.SKPINT,
      skipIntOnInt: row.SKPINTONINT,
      skipIntClose: row.SKPINTCLS
    })
  }));

  // PDF Download
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    const img = new Image();
    img.src = ebixLogo; // path from public folder
    console.log(ebixLogo);
    img.onload = () => {
      doc.addImage(img, "PNG", 182, 4, 14, 10); // x=10, y=10, width=30, height=30

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(0, 51, 102);
      doc.text("Amortization Schedule", 14, 12);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const tenorText = `Tenor: ${derivedTenor} ${derivedTenorIn}`;
      const roiText = `Rate of Interest: ${roi}%`;
      doc.text(tenorText, 14, 20);
      doc.text(roiText, 14, 26);

      // formatter for comma-separated numbers (Indian format)
      const nf = new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      const totalPrincipalText = `Total Principal: ${nf.format(totalPrincipal)}`;
      const totalInterestText = `Total Interest: ${nf.format(totalInterest)}`;

      const totalPrincipalWidth = doc.getTextWidth(totalPrincipalText);
      const totalInterestWidth = doc.getTextWidth(totalInterestText);

      doc.text(totalPrincipalText, pageWidth - totalPrincipalWidth - 14, 20);
      doc.text(totalInterestText, pageWidth - totalInterestWidth - 14, 26);

      // Define base table columns
      const baseTableColumns = [
        "No",
        "Installment Date",
        "Opening Balance",
        "EMI",
        "Principal",
        "Interest",
        "Closing Balance"
      ];

      // Add Skip Part Pay columns if applicable
      const tableColumns = hasSkipPartPayY 
        ? [
            ...baseTableColumns,
            "Int Before Part Skip",
            "Skip Int Open",
            "Skip Interest",
            "Skip Int on Int",
            "Skip Int Close"
          ]
        : baseTableColumns;

      const tableRows = mappedData.map((row, index) => {
        const baseRow = [
          // keep installment number as plain integer (no commas)
          index + 1,
          // keep date as formatted string
          formatDate(row.cycleDate),
          // numeric values formatted with comma separators
          nf.format(Number(row.openingBalance)),
          nf.format(Number(row.emi)),
          nf.format(Number(row.principal)),
          nf.format(Number(row.interest)),
          nf.format(Number(row.closingBalance)),
        ];

        if (hasSkipPartPayY) {
          baseRow.push(
            nf.format(Number(row.intBeforePartSkip || 0)),
            nf.format(Number(row.skipIntOpen || 0)),
            nf.format(Number(row.skipInterest || 0)),
            nf.format(Number(row.skipIntOnInt || 0)),
            nf.format(Number(row.skipIntClose || 0))
          );
        }
        return baseRow;
      });

      // Prepare totals row: number of installments, total principal, total interest
      const numInstallments = mappedData.length;
      let totalsRow = [
        // Show number of installments in the No column
        numInstallments,
        // blank date cell
        "",
        // blank opening balance
        "",
        // blank EMI
        "",
        // principal total
        nf.format(totalPrincipal),
        // interest total
        nf.format(totalInterest),
        // blank closing balance
        "",
      ];

      if (hasSkipPartPayY) {
        // sum skip-related columns
        const skipSums = mappedData.reduce(
          (acc, r) => {
            acc.intBeforePartSkip += Number(r.intBeforePartSkip || 0);
            acc.skipIntOpen += Number(r.skipIntOpen || 0);
            acc.skipInterest += Number(r.skipInterest || 0);
            acc.skipIntOnInt += Number(r.skipIntOnInt || 0);
            acc.skipIntClose += Number(r.skipIntClose || 0);
            return acc;
          },
          { intBeforePartSkip: 0, skipIntOpen: 0, skipInterest: 0, skipIntOnInt: 0, skipIntClose: 0 }
        );

        totalsRow = totalsRow.concat([
          nf.format(skipSums.intBeforePartSkip),
          nf.format(skipSums.skipIntOpen),
          nf.format(skipSums.skipInterest),
          nf.format(skipSums.skipIntOnInt),
          nf.format(skipSums.skipIntClose),
        ]);
      }

      const bodyWithTotals = [...tableRows, totalsRow];

      autoTable(doc,{
        head: [tableColumns],
        body: bodyWithTotals,
        startY: 28,
        styles: { 
          halign: "right", 
          fontSize: hasSkipPartPayY ? 7 : 8 },
        columnStyles: { 1: { halign: "right" } },
        didParseCell: function (data) {
          // style the last row (totals) to be slightly bold and highlighted
          if (data.row.section === 'body' && data.row.index === bodyWithTotals.length - 1) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [240, 240, 240];
          }
        }
      });

      doc.save("amortization.pdf");
    };
  };

  const totalPrincipal = mappedData?.reduce(
    (sum, row) => sum + Number(row.principal || 0),
    0
  );
  const totalInterest = mappedData?.reduce(
    (sum, row) => sum + Number(row.interest || 0),
    0
  );

  // Utility function for date formatting
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) // dd-MMM-yyyy
      .replace(/ /g, "-");
  };

  // Compute tenor fallback if not provided
  const derivedTenor = useMemo(() => {
    if (!tenor && Array.isArray(data) && data.length > 0) {
      return data.length; // derive from amortization rows
    }
    return tenor;
  }, [tenor, data]);

  const derivedTenorIn = useMemo(() => {
    if (!tenor && Array.isArray(data) && data.length > 0) {
      return "Installments"; // hardcoded
    }
    return tenorIn;
  }, [tenor, tenorIn, data]);


  const handleDownloadExcel = () => {
    const createBaseRow = (row, index) => ({
      No: index + 1,
      "Installment Date": formatDate(row.cycleDate),
      "Opening Balance": Number(row.openingBalance).toFixed(2),
      EMI: Number(row.emi).toFixed(2),
      Principal: Number(row.principal).toFixed(2),
      Interest: Number(row.interest).toFixed(2),
      "Closing Balance": Number(row.closingBalance).toFixed(2)
    });

    const addSkipColumns = (baseRow, row) => ({
      ...baseRow,
      "Int Before Part Skip": Number(row.intBeforePartSkip || 0).toFixed(2),
      "Skip Int Open": Number(row.skipIntOpen || 0).toFixed(2),
      "Skip Interest": Number(row.skipInterest || 0).toFixed(2),
      "Skip Int on Int": Number(row.skipIntOnInt || 0).toFixed(2),
      "Skip Int Close": Number(row.skipIntClose || 0).toFixed(2)
    });

    const formattedData = mappedData.map((row, index) => {
      const base = createBaseRow(row, index);
      return hasSkipPartPayY ? addSkipColumns(base, row) : base;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    const isCenterColumn = (header) =>
      header === "No" || header === "Installment Date";

    const getAlignment = (header) =>
      header === "EMI" || isCenterColumn(header) ? "center" : "right";

    const styleHeader = (cell, header) => {
      cell.s = {
        ...(cell.s || {}),
        alignment: { horizontal: getAlignment(header) }
      };
    };

    const styleCell = (cell, header) => {
      const alignment = getAlignment(header);
      const skipFill = header.includes("Skip")
        ? { fill: { fgColor: { rgb: "FFFFCD" } } }
        : {};

      cell.t = "n";
      cell.z = "0.00";

      cell.s = {
        ...(cell.s || {}),
        alignment: { horizontal: alignment },
        ...skipFill
      };
    };

    // Apply formatting
    for (let C = 0; C <= range.e.c; ++C) {
      const headerCellRef = XLSX.utils.encode_cell({ c: C, r: 0 });
      const header = worksheet[headerCellRef]?.v;

      if (worksheet[headerCellRef]) {
        styleHeader(worksheet[headerCellRef], header);
      }

      for (let R = 1; R <= range.e.r; ++R) {
        const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
        const cell = worksheet[cellRef];
        if (!cell) continue;
        styleCell(cell, header);
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Amortization");
    XLSX.writeFile(workbook, "amortization.xlsx");
  };

    // Define table columns based on Skip Part Pay condition
    const tableColumns = [
      { key: 'no', label: 'Installment No', align: 'center' },
      { key: 'cycleDate', label: 'Installment Date', align: 'center' },
      { key: 'openingBalance', label: 'Opening Balance', align: 'right' },
      { key: 'emi', label: 'EMI', align: 'center' },
      { key: 'principal', label: 'Principal', align: 'right' },
      { key: 'interest', label: 'Interest', align: 'right' },
      { key: 'closingBalance', label: 'Closing Balance', align: 'right' },
    ];
    // Add Skip Part Pay columns if applicable
    if (hasSkipPartPayY) {
      tableColumns.push(
        { key: 'intBeforePartSkip', label: 'Int Before Part Skip', align: 'right' },
        { key: 'skipIntOpen', label: 'Skip Int Open', align: 'right' },
        { key: 'skipInterest', label: 'Skip Interest', align: 'right' },
        { key: 'skipIntOnInt', label: 'Skip Int on Int', align: 'right' },
        { key: 'skipIntClose', label: 'Skip Int Close', align: 'right' }
      );
    }

  const formatINR = (value) => {
    if (value == null || value === '') return '';
    const num = Number(value);
    if (isNaN(num)) return value;
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <HDialog disableContentWrapper open={open} onClose={onClose} maxWidth={hasSkipPartPayY ? "xl" : "lg"} fullWidth>
      <DialogTitle sx={{ color: "#2C5BB5", fontWeight: 600 }}>
        <Box display="flex" flexDirection="column">
          {/* Row 1: Title + Totals */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              sx={{ color: "#2C5BB5", fontWeight: 600, fontSize: 20 }}
            >
              Repayment Schedule
              {hasSkipPartPayY && (
                <Box component="span" sx={{ fontSize: 14, color: "#666", ml: 1 }}>
                  (with Skip Part Pay Details)
                </Box>
              )}
            </Typography>

            {mappedData && (
              <Box display="flex">
                <Typography sx={{ mr: 3, fontWeight: 600, color: "#2C5BB5" }}>
                  Total Principal:{" "}
                  <Box
                    component="span"
                    sx={{ color: "#4880FF", fontWeight: 600 }}
                  >
                    {formatINR(totalPrincipal)}
                  </Box>
                </Typography>
                <Typography sx={{ fontWeight: 600, color: "#2C5BB5" }}>
                  Total Interest:{" "}
                  <Box
                    component="span"
                    sx={{ color: "#4880FF", fontWeight: 600 }}
                  >
                    {formatINR(totalInterest)}
                  </Box>
                </Typography>
              </Box>
            )}
          </Box>

          {/* Row 2: Tenor & ROI */}
          <Box display="flex" justifyContent="flex-end" gap={4} mt={1}>
            <Typography
              sx={{ fontSize: 14, color: "#2C5BB5", fontWeight: 500 }}
            >
              Tenor:{" "}
              <Box component="span" sx={{ color: "#4880FF", fontWeight: 500 }}>
                {derivedTenor}
              </Box>{" "}
              <Box component="span" sx={{ color: "#4880FF", fontWeight: 500 }}>
                {derivedTenorIn}
              </Box>
            </Typography>
            <Typography
              sx={{ fontSize: 14, color: "#2C5BB5", fontWeight: 500 }}
            >
              Rate of Interest:{" "}
              <Box component="span" sx={{ color: "#4880FF", fontWeight: 500 }}>
                {roi}%
              </Box>
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {!mappedData ? (
          <p>No data available</p>
        ) : (
          <Paper sx={{ maxHeight: 340, overflow: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {tableColumns.map((column) => (
                    <TableCell
                      key={column.key}
                      align={column.align}
                      sx={{ 
                        position: "sticky",
                        top: 0, 
                        zIndex: 1, 
                        backgroundColor: "#F0F5FF",
                        color: "#2C5BB5", 
                        fontWeight: 550, 
                        fontSize: hasSkipPartPayY ? 14 : 16,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {mappedData.map((row) => (
                  <TableRow key={row.id || row.code || row.uniqueKey}>
                    {tableColumns.map((column) => (
                      <TableCell
                        key={column.key}
                        align={column.align}
                        sx={{
                          color: "#4880FF",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {(() => {
                          if (column.key === "cycleDate") {
                            return formatDate(row[column.key]);
                          }
                          if (column.key === "no") {
                            return row[column.key]; // plain integer
                          }
                          return formatINR(row[column.key]);
                        })()}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "flex-end", px: 3 }}>
        <Box display="flex" alignItems="center" gap={0.5} mr={2}>
          <Typography
            variant="body1"
            sx={{ mr: 1, color: "#2C5BB5", fontWeight: 550 }}
          >
            Download:
          </Typography>
          <IconButton color="error" onClick={handleDownloadPDF} size="small">
            <PictureAsPdf />
          </IconButton>
          <IconButton
            color="primary"
            onClick={handleDownloadExcel}
            size="small"
          >
            <img src={excelLogo} alt="Excel" width={22} height={22} />
          </IconButton>
        </Box>

        <Button onClick={onClose} color="secondary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </HDialog>
  );
}

AmortPopup.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.any,  // or PropTypes.object if it’s an object
  tenor: PropTypes.number,
  roi: PropTypes.number,
  tenorIn: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  variations: PropTypes.shape({
    Skip_EMI: PropTypes.objectOf(
      PropTypes.shape({
        skippartpay: PropTypes.string
      })
    )
  })
};

export default AmortPopup;
