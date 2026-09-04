import { useEffect, useState, useRef } from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { useToast, HAxiosService, HBox, HButtonBar, HDropdown, HLabel, TitleBar, HBreadCrumb, HAgGrid } from "@helix/component-library";

import { HostCodeMasterAPI } from "./apiEndpoints";
import { handleValidationErrors } from "../early-collection/ValidationUtils.jsx";
 import { useLocation } from "react-router-dom";    


const HostCodeMaster = () => {
  const [rowData, setRowData] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [codeTypes, setCodeTypes] = useState([]);
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const [gridKey, setGridKey] = useState(0);

  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const columnDefs = [
    {
      headerName: "Seq No",
      field: "inHostCodeSeqNo",
      hide: true,
    },
    {
      headerName: intl.formatMessage({
        id: "label.HostCodeMaster.HostCode",
        defaultMessage: "Host Code",
      }),
      field: "szCode",
      width: 200,
      required: true,
      editable: (params) =>
        !params.data?.inHostCodeSeqNo || params.data?.szMode === "N",
    },
    {
      headerName: intl.formatMessage({
        id: "label.HostCodeMaster.Description",
        defaultMessage: "Host Code Description",
      }),
      field: "szDescription",
      width: 343,
      required: true,
      editable: true,
    },
  ];

  const fetchCodeTypes = async () => {
    try {
      const response = await HAxiosService.GET(HostCodeMasterAPI.HostCode(screenMenuId));

      if (response.data?.status === "Success") {
        const types = response.data.responseJson?.lstCodeTypes || [];
        setCodeTypes(types);

        if (types.length > 0 && !selectedType) {
          setSelectedType(types[0].szCondition);
        }
      } else {
        toast.error(
          response.data?.message ||
          intl.formatMessage({
            id: "message.HostCodeMaster.error.fetchTypes",
            defaultMessage: "Failed to fetch code types",
          })
        );
      }
    } catch (error) {
      toast.error(
        intl.formatMessage({
          id: "message.HostCodeMaster.error.fetchTypes",
          defaultMessage: "Failed to fetch code types",
        })
      );
    }
  };

  const fetchHostCodeDetails = async (type) => {
    try {
      const response = await HAxiosService.GET(HostCodeMasterAPI.HostCode(screenMenuId) +`/fetchHostCodeDetails?szType=${type}`);

      const data = response?.data?.responseJson || [];

      const formattedData = Array.isArray(data)
        ? data.map((row) => ({
          ...row,
          szMode: "E",
        }))
        : [];

      setRowData([...formattedData]);
    } catch (error) {
      toast.error(
        intl.formatMessage({
          id: "message.HostCodeMaster.error.fetchDetails",
          defaultMessage: "Failed to fetch host codes",
        })
      );
      setRowData([]);
    }
  };

  useEffect(() => {
    fetchCodeTypes();
  }, []);

  useEffect(() => {
    if (selectedType) {
      fetchHostCodeDetails(selectedType);
    }
  }, [selectedType]);

  const handleSave = async ({
    newRows = [],
    updatedRows = [],
    deletedRows = [],
  }) => {
    try {
      const mappedRows = [
        ...newRows.map((row) => ({
          inHostCodeSeqNo: null,
          szCode: row.szCode,
          szDescription: row.szDescription,
          szLegacySystem: "LGCY",
          szPartitionCode: row.szPartitionCode || "",
          szMode: "N",
        })),

        ...updatedRows.map((row) => ({
          inHostCodeSeqNo: row.inHostCodeSeqNo,
          szCode: row.szCode,
          szDescription: row.szDescription,
          szLegacySystem: "LGCY",
          szPartitionCode: row.szPartitionCode || "",
          szMode: "E",
        })),

        ...deletedRows.map((row) => ({
          inHostCodeSeqNo: row.inHostCodeSeqNo,
          szCode: row.szCode,
          szDescription: row.szDescription,
          szLegacySystem: "LGCY",
          szPartitionCode: row.szPartitionCode || "",
          szMode: "D",
        })),
      ];

      if (mappedRows.length === 0) {
        toast.warning(
          intl.formatMessage({
            id: "message.HostCodeMaster.warning.noChanges",
            defaultMessage: "No changes to save",
          })
        );
        return { success: false };
      }

      const payload = {
        szType: selectedType,
        lstHostCodeMasterDtos: mappedRows,
      };
      const response = await HAxiosService.POST(
        HostCodeMasterAPI.HostCode(screenMenuId),
        payload,
      );

      const data = response?.data;

      if (data?.status !== "Success") {
        if (data?.responseJson) {
          handleValidationErrors(intl, toast, data.responseJson);
        } else {
          toast.error(
            data?.message ||
            intl.formatMessage({
              id: "message.HostCodeMaster.error.saveFailed",
              defaultMessage: "Save failed",
            })
          );
        }
        return { success: false };
      }

      toast.success(
        data?.message ||
        intl.formatMessage({
          id: "message.HostCodeMaster.success.save",
          defaultMessage: "Host Code saved successfully",
        })
      );

      await fetchHostCodeDetails(selectedType);
      setGridKey(prev => prev + 1);

      return { success: true };
    } catch (error) {
      toast.error(
        intl.formatMessage({
          id: "message.HostCodeMaster.error.saveFailed",
          defaultMessage: "Host Code save failed",
        })
      );
      return { success: false };
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <HBreadCrumb />
      <TitleBar title="label.HostCodeMaster.title" />

      <Box sx={{ display: "flex", gap: 2, p: "10px 20px" }}>
        <HLabel
          value={intl.formatMessage({
            id: "label.HostCodeMaster.Type",
            defaultMessage: "Code Type",
          })}
        />
        <HDropdown
          name="CodeType"
          value={selectedType}
          width="200px"
          options={codeTypes.map((type) => ({
            value: type.szCondition,
            label: type.szi18nDesc
              ? intl.formatMessage({
                id: type.szi18nDesc,
                defaultMessage: type.szCondition
              })
              : type.szCondition,
          }))}
          onChange={(e) => setSelectedType(e.target.value)}
        />
        <Button variant="contained">
          {intl.formatMessage({
            id: "button.HostCodeMaster.fetch",
            defaultMessage: "FETCH",
          })}
        </Button>
      </Box>

      <HBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <HAgGrid
          ref={gridRef}
          key={gridKey}
          rowData={rowData}
          columnDefs={columnDefs}
          gridStyle={{ width: "50%", height: "50vh", margin: "10px auto" }}
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

export default HostCodeMaster;
