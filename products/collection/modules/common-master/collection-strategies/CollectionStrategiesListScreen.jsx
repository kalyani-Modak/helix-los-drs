import { useCallback, useMemo, useState } from "react";
import { Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { useToast, HAxiosService, HBox, HLabel, HTextField, HButton, TitleBar, HBreadCrumb, HAgGrid } from "@helix/component-library";

import { CollectionStrategiesAPI } from "../apiEndpoints.jsx";


import { collectionStrategiesListGridStyle, getCollectionStrategiesListColumnDefs} from "./collectionStrategiesList.columnDefs.jsx";
import { mapStrategyListFromApi, STRATEGY_TYPE_COLLECTION } from "./collectionStrategies.mappers.js";
import "./collection-strategies.screen.css";

const STRATEGIES_PAGE_SIZE = 15;

function extractPagedStrategies(responseData) {
  const responseJson = responseData?.responseJson;
  const source = responseJson ?? responseData;

  let rawRows = [];
  if (Array.isArray(source)) {
    rawRows = source;
  } else if (Array.isArray(source?.content)) {
    rawRows = source.content;
  }

  const totalRaw = Number(
    responseData?.totalElements ??
      responseJson?.totalElements ??
      source?.totalElements ??
      source?.total ??
      source?.count ??
      rawRows.length,
  );

  return {
    rows: rawRows,
    totalElements: Number.isFinite(totalRaw) ? totalRaw : rawRows.length,
  };
}

const CollectionStrategiesListScreen = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const screenMenuId  = location.state?.menuId ;

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalElements, setTotalElements] = useState(0);
  const [gridRefreshVersion, setGridRefreshVersion] = useState(0);

  const openStrategy = useCallback(
    (code) => {
      if (!code) return;
      navigate(`/homelayout/collectionStrategies/${encodeURIComponent(code)}`, {
        state: {
          menuId: screenMenuId,
        },
      });
    },
    [navigate, screenMenuId],
  );

  const handleAddStrategy = useCallback(() => {
    navigate("/homelayout/collectionStrategies/new", {
      state: {
        menuId: screenMenuId,
      },
    });
  }, [navigate, screenMenuId]);

  const handleUnsupportedAction = useCallback(
    (messageId) => {
      toast.info(intl.formatMessage({ id: messageId }));
    },
    [intl, toast]
  );

  const handleDelete = useCallback(
      async (row) => {
        console.log("------------------")
        console.log(row)
        console.log("------------------")
        if (!row?.inStrategySeqNo) {
          toast.error("Invalid Strategy.");
          return;
        }
      
        const confirmed = window.confirm(
          `Are you sure you want to delete strategy "${row.szStrategyCode}"?`
        );
      
        if (!confirmed) return;
      
        try {
          setLoading(true);
        
          const response = await HAxiosService.DELETE(
            `${CollectionStrategiesAPI.StrategyMasterDetails(screenMenuId)}?inStrategySeqNo=${row.inStrategySeqNo}`,
          );
        
          if (response.data?.status === "Success") {
            toast.success(response.data.message);
          
            setGridRefreshVersion((v) => v + 1);
          } else {
            toast.error(response.data?.message);
          }
        } catch (error) {
          console.error(error);
          toast.error(
            intl.formatMessage({ id: "collection.strategy.delete.error" })
          );
        } finally {
          setLoading(false);
        }
      },
      [intl, toast]
    );

  const columnDefs = useMemo(
    () =>
      getCollectionStrategiesListColumnDefs(intl, {
        onOpenStrategy: openStrategy,
        onClone: () =>
          handleUnsupportedAction("message.CollectionStrategies.actionNotAvailable"),
        onHistory: () =>
          handleUnsupportedAction("message.CollectionStrategies.actionNotAvailable"),
        onDelete: (row) => handleDelete(row),
      }),
    [intl, openStrategy, handleUnsupportedAction,handleDelete]
  );

  const strategiesDatasource = useMemo(() => {
    return {
      getRows: async (params) => {
        const startRow = Number(params?.startRow) || 0;
        const endRow = Number(params?.endRow) || STRATEGIES_PAGE_SIZE;
        const size = Math.max(1, endRow - startRow);
        const pageNumber = Math.floor(startRow / size) + 1;

        setLoading(true);
        try {
          const payload = {
            szType: STRATEGY_TYPE_COLLECTION,
            pageNumber,
            size,
            pageSize: size,
          };

          const search = searchQuery.trim();
          if (search) {
            payload.searchQuery = search;
          }

          const res = await HAxiosService.GET(
            `${CollectionStrategiesAPI.StrategyMasterDetails(screenMenuId)}?szType=${payload.szType}`,
          );

          if (res?.data?.status !== "Success") {
            params.failCallback?.();
            return;
          }

          const { rows, totalElements: total } = extractPagedStrategies(res.data);
          const mappedRows = rows.map(mapStrategyListFromApi);
          setTotalElements(total);
          params.successCallback?.(mappedRows, total);
        } catch (error) {
          console.error(error);
          toast.error(intl.formatMessage({ id: "collection.strategy.load.error" }));
          setTotalElements(0);
          params.failCallback?.();
        } finally {
          setLoading(false);
        }
      },
    };
  }, [intl, searchQuery, toast]);

  return (
    <HBox className="collection-strategies-page">
      <HBox className="collection-strategies-header-card">
        <HBreadCrumb />
        <HBox className="collection-strategies-list-title-row">
          <TitleBar title={intl.formatMessage({ id: "collection.strategy.title" })} />
          <HButton
            label="label.CollectionStrategies.addStrategy"
            onClick={handleAddStrategy}
            variant="outlined"
            color="primary"
            inline
          />
        </HBox>
        <Typography variant="body1" className="collection-strategies-description">
          {intl.formatMessage({ id: "label.CollectionStrategies.listDescription" })}
        </Typography>
      </HBox>

      <HBox className="collection-strategies-toolbar">
        <HBox className="collection-strategies-toolbar-group">
          <HLabel
            value={intl.formatMessage({
              id: "label.CollectionStrategies.list.search",
              defaultMessage: "Search",
            })}
          />
          <HBox sx={{ mb: "5px" }}>
              <HTextField
                id="collection-strategies-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                editable
                placeholder="label.CollectionStrategies.list.searchPlaceholder"
                width="280px"
              />
          </HBox>
          
        </HBox>
        <HLabel className="collection-strategies-list-count">
          {intl.formatMessage(
            { id: "label.CollectionStrategies.list.count" },
            { filtered: totalElements, total: totalElements }
          )}
        </HLabel>
      </HBox>

      <HBox className="collection-strategies-list-grid-host">
        <HAgGrid
          key={`collection-strategies-${gridRefreshVersion}-${searchQuery}`}
          columnDefs={columnDefs}
          gridStyle={collectionStrategiesListGridStyle}
          rowModelType="infinite"
          datasource={strategiesDatasource}
          cacheBlockSize={STRATEGIES_PAGE_SIZE}
          maxBlocksInCache={2}
          pagination
          paginationPageSize={STRATEGIES_PAGE_SIZE}
          domLayout="normal"
          globalSearch={false}
          allowAdd={false}
          allowDelete={false}
          allowUpdate={false}
          getRowId={(params) => String(params.data.szStrategyCode || params.data.inStrategySeqNo)}
          suppressHorizontalScroll={false}
        />
        {!loading && totalElements === 0 && (
          <HBox className="collection-strategies-empty">
            {intl.formatMessage({ id: "label.CollectionStrategies.list.empty" })}
          </HBox>
        )}
      </HBox>
    </HBox>
  );
};

export default CollectionStrategiesListScreen;
