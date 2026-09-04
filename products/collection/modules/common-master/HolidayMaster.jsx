import React, { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { useToast, HAxiosService, HBox, HButtonBar, TitleBar, HBreadCrumb, HAgGrid } from "@helix/component-library";

import { HolidayMasterAPI } from "./apiEndpoints";
import dayjs from "dayjs";
import { handleValidationErrors } from "../early-collection/ValidationUtils.jsx";
import { useLocation } from "react-router-dom";



const HolidayMaster = () => {
  const [rowData, setRowData] = useState([]);
  const [holidayTypeOptions, setHolidayTypeOptions] = useState([]);
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const columnDefs = [
    {
      headerName: intl.formatMessage({
        id: "label.HolidayMaster.HolidayDate",
        defaultMessage: "Holiday Date",
      }),
      field: "dtHoliday",
      editable: (params) => params.data?.mode === "N",
      width: 220,
      filter: false,
      cellEditor: "agDateCellEditor",
      valueFormatter: (p) =>
        p.value ? dayjs(p.value).format("YYYY-MM-DD") : "",
      valueParser: (p) => (p.newValue ? new Date(p.newValue) : null),
    },
    {
      headerName: intl.formatMessage({
        id: "label.HolidayMaster.Description",
        defaultMessage: "Description",
      }),
      field: "szHolidayDesc",
      editable: true,
      width: 220,
      filter: false,
    },
    {
      headerName: intl.formatMessage({
        id: "label.HolidayMaster.Type",
        defaultMessage: "Type",
      }),
      field: "szType",
      width: 194,
      filter: false,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: holidayTypeOptions.map((opt) => opt.szCondition),
      },
      valueSetter: (params) => {
        params.data.szType = params.newValue;
        return true;
      },
      valueFormatter: (params) => {
        const option = holidayTypeOptions.find(
          (opt) => opt.szCondition === params.value
        );
        if (!option) return params.value;
        return option.szi18nDesc
          ? intl.formatMessage({
            id: option.szi18nDesc,              // "label.HolidayMaster.National"
            defaultMessage: option.szCondition, // fallback to "N" if key missing
          })
          : params.value;
      },
    },
  ];

  useEffect(() => {
    HAxiosService.GET(
      HolidayMasterAPI.Holidays(screenMenuId),
    ).then((res) => {
      const wrapper = res.data?.responseJson || {};
      const holidays = wrapper.lstHolidayDTO || [];
      const holidayTypes = wrapper.lstHolidayTypes || [];

      setHolidayTypeOptions(holidayTypes);
      setRowData(
        holidays.map((row) => ({
          ...row,
          dtHoliday: row.dtHoliday ? new Date(row.dtHoliday) : null,
        }))
      );
    });
  }, []);

  const handleSave = async ({
    newRows = [],
    updatedRows = [],
    deletedRows = [],
  }) => {
    try {
      const userCode = sessionStorage.getItem("SEC_USERNAME") || "SYSTEM";

      const payload = [...newRows, ...updatedRows, ...deletedRows].map(
        (row) => {
          const mode = row.mode || "U";

          return {
            dtHoliday: row.dtHoliday
              ? dayjs(row.dtHoliday).format("YYYY-MM-DD")
              : null,
            szHolidayDesc: row.szHolidayDesc,
            szType: row.szType,
            szMode: mode,
            ...(mode === "N"
              ? { szCreatedBy: userCode }
              : { szModifiedBy: userCode }),
          };
        }
      );

      const res = await HAxiosService.POST(
        HolidayMasterAPI.Holidays(screenMenuId),
        payload
      );

      const data = res?.data;

      if (data?.errors && Object.keys(data.errors).length > 0) {
        handleValidationErrors(intl, toast, data.errors);
        return { success: false };
      }

      if (data?.status !== "Success") {
        toast.error(
          intl.formatMessage({
            id: "message.HolidayMaster.SaveError",
            defaultMessage: "Holiday Save failed",
          })
        );
        return { success: false };
      }

      toast.success(
        intl.formatMessage({
          id: "message.HolidayMaster.SaveSuccess",
          defaultMessage: "Holiday saved successfully",
        })
      );

      return { success: true };
    } catch (e) {
      const data = e?.response?.data;

      if (data?.message) {
        toast.error(data.message);
        return { success: false };
      }

      toast.error(
        intl.formatMessage({
          id: "message.HolidayMaster.SaveError",
          defaultMessage: "Holiday Save failed",
        })
      );

      return { success: false };
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <HBreadCrumb />
      <TitleBar title="label.HolidayMaster.title" />

      <HBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <HAgGrid
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          gridStyle={{ width: "60%", height: "50vh", margin: "10px auto" }}
          pagination
          paginationPageSize={10}
          allowAdd
          allowUpdate
          allowDelete
          addCheckBoxes
          onSave={handleSave}
        />
        <HButtonBar
          onSave={() => gridRef.current?.submitChanges?.()}
          onClose={() => navigate("/homelayout/welcomepage")}
          disableToast={{ save: true, close: true }}
        />
      </HBox>
    </Box>
  );
};

export default HolidayMaster;
