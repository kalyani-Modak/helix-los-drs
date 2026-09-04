import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { HAxiosService } from "@helix/component-library";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import FunctionLayout from "./FunctionLayout";
import ActivitiesAndTasks from "./ActivitiesAndTasks";
import { PreviousActivitiesAPI } from "./apiEndpoints";
import { hasSelectedAccount } from "./account-overview/overviewRequestBody";
import { useLocation } from "react-router-dom";

const DEFAULT_ACTIVITY_PAGE_SIZE = 10;

//const DEFAULT_ACTIVITY_PAGE_SIZE = 10;

/**
 * Normalizes various API / gateway shapes for previous-activity rows.
 * @param {unknown} payload — axios response.data
 * @returns {unknown[]|null} list or null if payload is not a recognizable list container
 */
function extractPreviousActivityDetailsList(payload) {
  if (payload == null) return null;
  if (Array.isArray(payload)) return payload;
  if (typeof payload !== "object") return null;

  const p = payload;
  const candidates = [
    p.previousActivityDetailsDto,
    p.previous_activity_details_dto,
    p.previousActivityDetails,
    p.previous_activity_details,
    p.data?.previousActivityDetailsDto,
    p.data?.previous_activity_details_dto,
    p.result?.previousActivityDetailsDto,
    p.body?.previousActivityDetailsDto,
    p.response?.previousActivityDetailsDto,
  ];

  for (const c of candidates) {
    if (Array.isArray(c)) return c;
    if (c && typeof c === "object" && Array.isArray(c.content)) return c.content;
  }
  if (Object.prototype.hasOwnProperty.call(p, "previousActivityDetailsDto") && p.previousActivityDetailsDto == null) {
    return [];
  }
  if (Object.prototype.hasOwnProperty.call(p, "previous_activity_details_dto") && p.previous_activity_details_dto == null) {
    return [];
  }
  return null;
}

function mapActivitiesDto(dtoList, intl) {
  if (!Array.isArray(dtoList) || dtoList.length === 0) return [];
  return dtoList.map((item, index) => {
    const activityCode = item.szActivity ?? item.sz_activity ?? item.activity ?? "";
    const activityLabel = activityCode
      ? intl.formatMessage({
          id: `label.menu.${activityCode}`,
          defaultMessage: activityCode,
        })
      : "";

    return {
      srNo: index + 1,
      activity: activityLabel,
      date: item.dtActivity ?? item.dt_activity ?? item.date ?? "",
      activityBy: item.szCollectorCode ?? item.sz_collector_code ?? item.activityBy ?? item.collectorCode ?? "",
      remark: item.szRemark ?? item.sz_remark ?? item.remark ?? "",
      systemRemark: item.szSystemRemark ?? item.sz_system_remark ?? item.systemRemark ?? "",
    };
  });
}

const PreviousActivities = () => {
  const intl = useIntl();
  const { selectedRow } = useSelector((state) => state.account);

  const [activitiesRowData, setActivitiesRowData] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState(null);
  const [activitiesPageSize, setActivitiesPageSize] = useState(DEFAULT_ACTIVITY_PAGE_SIZE);
  const [activitiesTotalElements, setActivitiesTotalElements] = useState(0);

  const [tasksRowData] = useState([]);
  const [tasksLoading] = useState(false);
  const [tasksError] = useState(null);
  const tasksUnavailable = true;
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  useEffect(() => {
    if (!hasSelectedAccount(selectedRow)) {
      setActivitiesRowData([]);
      setActivitiesError(null);
      setActivitiesTotalElements(0);
      setActivitiesLoading(false);
      return;
    }
    setActivitiesLoading(true);
    setActivitiesError(null);
  }, [selectedRow?.ACNT_SEQNO]);

  const activitiesDatasource = useMemo(() => {
    if (!hasSelectedAccount(selectedRow)) return null;

    return {
      getRows: async (params) => {
        const startRow = Number(params?.startRow) || 0;
        const endRow = Number(params?.endRow) || activitiesPageSize;
        const pageSize = Math.max(1, endRow - startRow);
        const page = Math.floor(startRow / pageSize);

        setActivitiesLoading(true);
        setActivitiesError(null);

        try {
          const res = await HAxiosService.GET(PreviousActivitiesAPI.fetchPrevious(page, pageSize, screenMenuId));

          if (res == null || res.data == null || res.status < 200 || res.status >= 300) {
            setActivitiesRowData([]);
            setActivitiesTotalElements(0);
            setActivitiesError("network");
            params.failCallback?.();
            return;
          }

          let payload = res.data;
          if (typeof payload === "string") {
            try {
              payload = JSON.parse(payload);
            } catch {
              setActivitiesRowData([]);
              setActivitiesTotalElements(0);
              setActivitiesError("shape");
              params.failCallback?.();
              return;
            }
          }

          const list = extractPreviousActivityDetailsList(payload);
          if (list === null) {
            setActivitiesRowData([]);
            setActivitiesTotalElements(0);
            setActivitiesError("shape");
            params.failCallback?.();
            return;
          }

          const mappedRows = mapActivitiesDto(list, intl);
          const responsePageSize = Number(payload?.size);
          const totalElements = Number(payload?.totalElements);
          const lastRow = Number.isFinite(totalElements) ? totalElements : -1;

          if (Number.isFinite(responsePageSize) && responsePageSize > 0 && responsePageSize !== activitiesPageSize) {
            setActivitiesPageSize(responsePageSize);
          }

          setActivitiesRowData(mappedRows);
          setActivitiesTotalElements(Number.isFinite(totalElements) ? totalElements : mappedRows.length);
          setActivitiesError(null);
          params.successCallback?.(mappedRows, lastRow);
        } catch {
          setActivitiesRowData([]);
          setActivitiesTotalElements(0);
          setActivitiesError("network");
          params.failCallback?.();
        } finally {
          setActivitiesLoading(false);
        }
      },
    };
  }, [activitiesPageSize, intl, selectedRow]);

  if (!selectedRow?.ACNT_SEQNO) {
    return (
      <FunctionLayout
        title={intl.formatMessage({ id: "label.activitiesTasks.pageTitle" })}
        breadcrumbMid={intl.formatMessage({ id: "label.activitiesTasks.breadcrumbMid" })}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body1">
            {intl.formatMessage({ id: "label.activitiesTasks.noAccountSelected" })}
          </Typography>
        </Box>
      </FunctionLayout>
    );
  }

  return (
    <FunctionLayout
      title={intl.formatMessage({ id: "label.activitiesTasks.pageTitle" })}
      breadcrumbMid={intl.formatMessage({ id: "label.activitiesTasks.breadcrumbMid" })}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          width: "100%",
          maxWidth: 1320,
          mx: "auto",
          px: { xs: 1.5, sm: 2 },
          py: 1,
        }}
      >
        <ActivitiesAndTasks
          activitiesRowData={activitiesRowData}
          activitiesLoading={activitiesLoading}
          activitiesError={activitiesError}
          activitiesPageSize={activitiesPageSize}
          activitiesTotalElements={activitiesTotalElements}
          activitiesDatasource={activitiesDatasource}
          activitiesCacheBlockSize={activitiesPageSize}
          activitiesMaxBlocksInCache={2}
          tasksRowData={tasksRowData}
          tasksLoading={tasksLoading}
          tasksError={tasksError}
          tasksUnavailable={tasksUnavailable}
        />
      </Box>
    </FunctionLayout>
  );
};

export default PreviousActivities;