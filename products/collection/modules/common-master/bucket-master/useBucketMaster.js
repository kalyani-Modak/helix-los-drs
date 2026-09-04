import { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { HAxiosService } from "@helix/component-library";
import { BucketMasterAPI } from "../apiEndpoints";
import { handleValidationErrors } from "../../early-collection/ValidationUtils.jsx";
import {buildSavePayload,computeAddRowDefaults,mapBucketRowsFromApi,mapPortfolioOptions,parseApiErrorMessages,} from "./bucketMasterMappers";
import { validateBucketRows } from "./bucketMasterValidators";
import { BUCKET_MODE } from "./bucketMasterConstants";
import { useLocation } from "react-router-dom";


export function useBucketMaster(toast) {
  const intl = useIntl();

  const [portfolio, setPortfolio] = useState("");
  const [portfolioOptions, setPortfolioOptions] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [originalRowData, setOriginalRowData] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [fetchedPortfolio, setFetchedPortfolio] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;


  const formatMessage = useCallback(
    (descriptor, values) => intl.formatMessage(descriptor, values),
    [intl]
  );

  useEffect(() => {
    const loadPortfolios = async () => {
      try {
        const response = await HAxiosService.GET(
          BucketMasterAPI.BucketDetails("EC-PortfolioMaster")
        );
        const options = mapPortfolioOptions(response?.data || []);
        setPortfolioOptions(options);
        if (options.length > 0) {
          setPortfolio(options[0].value);
        }
      } catch (error) {
        console.error(error);
        toast.error(
          formatMessage({
            id: "error.bucket.portfolio",
            defaultMessage: "Unable to load portfolio options.",
          })
        );
      }
    };

    loadPortfolios();
  }, [formatMessage, toast]);

  const handlePortfolioChange = useCallback((value) => {
    setPortfolio(value);
    setIsFetched(false);
    setFetchedPortfolio("");
    setRowData([]);
    setOriginalRowData([]);
  }, []);

  const handleFetch = useCallback(async () => {
    if (!portfolio?.trim()) {
      toast.error(
        formatMessage({
          id: "error.portfolioCode.required",
          defaultMessage: "Portfolio Code is required",
        })
      );
      return;
    }

    setLoading(true);
    try {
      const response = await HAxiosService.GET(
        BucketMasterAPI.BucketDetails(screenMenuId)+`?szPortfolioCode=${portfolio}`
      );

      const data = response?.data || {};

      if (data?.status?.toLowerCase() !== "success") {
        setRowData([]);
        setOriginalRowData([]);
        setIsFetched(true);
        setFetchedPortfolio(portfolio);

        if (response.status === 204 || response.status === 406) {
          toast.info(
            formatMessage({
              id: "info.no.bucket.data",
              defaultMessage: "No bucket data found for selected portfolio.",
            })
          );
          return;
        }

        if (data?.responseJson && typeof data.responseJson === "object") {
          const messages = parseApiErrorMessages(data, formatMessage);
          toast.error(messages.join("\n") || data.message || "Fetch failed");
          return;
        }

        if (data?.errors) {
          handleValidationErrors(intl, toast, data.errors);
          return;
        }

        toast.error(data?.message || "Fetch failed");
        return;
      }

      const bucketData = data?.responseJson || data;

      if (!Array.isArray(bucketData) || bucketData.length === 0) {
        setRowData([]);
        setOriginalRowData([]);
        setIsFetched(true);
        setFetchedPortfolio(portfolio);
        toast.info(
          formatMessage({
            id: "info.no.bucket.data",
            defaultMessage: "No bucket data found for selected portfolio.",
          })
        );
        return;
      }

      const mapped = mapBucketRowsFromApi(bucketData);
      setRowData(mapped);
      setOriginalRowData(JSON.parse(JSON.stringify(mapped)));
      setIsFetched(true);
      setFetchedPortfolio(portfolio);
    } catch (error) {
      console.error(error);
      setRowData([]);
      setOriginalRowData([]);
      setIsFetched(false);
      toast.error(
        formatMessage({
          id: "error.bucket.fetch",
          defaultMessage: "Error fetching bucket details",
        })
      );
    } finally {
      setLoading(false);
    }
  }, [portfolio, formatMessage, intl, toast]);

  const handleSave = useCallback(
    async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
      if (!portfolio || !isFetched || portfolio !== fetchedPortfolio) {
        toast.warn(
          formatMessage({
            id: "error.portfolioCode.fetch",
            defaultMessage: "Please select portfolio and fetch data before saving",
          })
        );
        return ;
      }

      if (
        newRows.length === 0 &&
        updatedRows.length === 0 &&
        deletedRows.length === 0
      ) {
        toast.info(
          formatMessage({
            id: "info.no.changes.save",
            defaultMessage: "No changes to save.",
          })
        );
        return ;
      }

    const updatedMap = new Map( updatedRows.map(row => [row.key, row]));
    const deletedMap = new Map( deletedRows.map(row => [row.key, row]));

    const rowsToValidate = [
                            ...rowData.map(row =>
                                 deletedMap.get(row.key) ||
                                 updatedMap.get(row.key) ||
                                 row
                              ),
                            ...newRows,
                          ];
      const validationErrors = validateBucketRows(rowsToValidate, formatMessage);
      if (validationErrors.length > 0) {
        toast.error(validationErrors.join("\n"));
        return ;
      }
    const finalUpdatedRows = [...updatedRows];

      for (let i = 1; i < rowsToValidate.length; i++) {
        const current = rowsToValidate[i];

        if (current.mode === BUCKET_MODE.DELETE) {
          continue;
        }

        let previous = null;

        for (let j = i - 1; j >= 0; j--) {
          if (rowsToValidate[j].mode !== BUCKET_MODE.DELETE) {
            previous = rowsToValidate[j];
            break;
          }
        }

        if (!previous) continue;

        const expectedFrom = Number(previous.inToPeriod) + 1;

        if (current.inFromPeriod !== expectedFrom) {
          current.inFromPeriod = expectedFrom;

          if (
            current.mode !== BUCKET_MODE.NEW &&
            !finalUpdatedRows.some(r => r.key === current.key)
          ) {
            finalUpdatedRows.push(current);
          }
        }
      }
      const payload = buildSavePayload(
        portfolio,
        { newRows, updatedRows:finalUpdatedRows, deletedRows },
        rowsToValidate
      );

      try {
        const response = await HAxiosService.POST(
          BucketMasterAPI.BucketDetails(screenMenuId),
          payload
        );

        const result = response?.data || {};

        if (result.status === "Success") {
          let successMessage = formatMessage({
            id: "success.bucket.saved",
            defaultMessage: "Bucket details saved successfully",
          });

          if (result.messageKey) {
            successMessage = formatMessage(
              { id: result.messageKey },
              result.messageParams || {}
            );
          } else if (result.message) {
            successMessage = result.message;
          }

          
          await handleFetch();
          return { success: true };
        }

        const errorMessages = parseApiErrorMessages(result, formatMessage);
        if (errorMessages.length > 0) {
          toast.error(errorMessages.join("\n"));
        } else {
          toast.error(
            formatMessage({
              id: "error.validation.failed",
              defaultMessage: "Validation failed",
            })
          );
        }
        return { success: false };
      } catch (error) {
        console.error(error);
        const status = error?.response?.status;
        const message =
          error?.response?.data?.message ||
          formatMessage({
            id: "error.bucket.save",
            defaultMessage: "Error saving bucket details.",
          });

        if (status === 409) {
          toast.error(message);
        } else {
          toast.error(message);
        }
        return { success: false };
      }
    },
    [
      portfolio,
      isFetched,
      fetchedPortfolio,
      rowData,
      formatMessage,
      toast,
      handleFetch,
    ]
  );



  const handleAddRow = useCallback(
    (newRow) => {
      if (!portfolio || !isFetched || portfolio !== fetchedPortfolio) {
        toast.warn(
          formatMessage({
            id: "info.bucket.fetchBeforeAdd",
            defaultMessage:
              "Please select a Portfolio and fetch records before adding a new row.",
          })
        );
        return null;
      }

      const defaults = computeAddRowDefaults(rowData);
      return {
        ...defaults,
        ...newRow,
        key: newRow?.key || defaults.key,
        mode: BUCKET_MODE.NEW,
      };
    },
    [portfolio, isFetched, fetchedPortfolio, rowData, formatMessage, toast]
  );

  const handleReset = useCallback(() => {
    setRowData(JSON.parse(JSON.stringify(originalRowData)));
    return { success: true };
  }, [originalRowData]);

  return {
    portfolio,
    portfolioOptions,
    rowData,
    setRowData,
    loading,
    isFetched,
    handlePortfolioChange,
    handleFetch,
    handleSave,
    handleAddRow,
    handleReset,
  };
}
