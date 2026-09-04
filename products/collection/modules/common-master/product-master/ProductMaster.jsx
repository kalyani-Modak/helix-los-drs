import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { useToast, HBox, HButtonBar, TitleBar, HLabel, HBreadCrumb, HAgGrid } from "@helix/component-library";



import ProductMasterToolbar from "./ProductMasterToolbar";
import {buildProductMasterColumnDefs,PRODUCT_MASTER_GRID_CLASS,} from "./productMasterGridConfig";
import { findDuplicateProductCodes,mapProductRowsFromApi,normalizeLookupOption,} from "./productMasterMappers";
import {fetchPortfolioOptions,fetchProductDetails,saveProductDetails,fetchInitialData,} from "./productMasterService";
import "./productMaster.css";
import { useLocation } from "react-router-dom";	


const ProductMaster = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const gridRef = useRef(null);

  const [portfolio, setPortfolio] = useState("");
  const [portfolioOptions, setPortfolioOptions] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [originalRowData, setOriginalRowData] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [groupTypeOptions, setGroupTypeOptions] = useState([]);
  const [groupCategoryOptions, setGroupCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(false);

   const location = useLocation();
   const screenMenuId =  location.state.menuId;

  const translate = useCallback(
    (key) => (key ? intl.formatMessage({ id: key, defaultMessage: key }) : ""),
    [intl],
  );

  useEffect(() => {
    const loadPortfolios = async () => {
      try {
        const options = await fetchPortfolioOptions("EC-PortfolioMaster");
        setPortfolioOptions(options);
        if (options.length > 0) {
          setPortfolio(options[0].value);
        }
      } catch (error) {
        console.error(error);
        toast.error(
          intl.formatMessage({
            id: "error.portfolio.fetch",
            defaultMessage: "Unable to load portfolio options.",
          }),
        );
      }
    };

    loadPortfolios();
  }, [intl, toast]);

  const columnDefs = useMemo(
    () =>
      buildProductMasterColumnDefs({
        intl,
        groupTypeOptions,
        groupCategoryOptions,
        translate,
      }),
    [intl, groupTypeOptions, groupCategoryOptions, translate],
  );

  const handlePortfolioChange = (e) => {
    setPortfolio(e.target.value);
    setIsFetched(false);
    setRowData([]);
    setOriginalRowData([]);
    setTimeout(() => {
      gridRef.current?.api?.hideOverlay();
      gridRef.current?.api?.showNoRowsOverlay();
    }, 0);
  };

  const handleFetch = async () => {
    if (!portfolio?.trim()) {
      toast.error(
        intl.formatMessage({
          id: "error.portfolioCode.required",
          defaultMessage: "Portfolio Code is required",
        }),
      );
      return;
    }


    try {
      setLoading(true);
      const result = await fetchProductDetails(portfolio, screenMenuId);
      const productData = result?.responseJson || [];

      if (!productData.length) {
        setRowData([]);
        setOriginalRowData([]);
        setIsFetched(true);
        return;
      }

      const mappedRows = mapProductRowsFromApi(productData);
      setRowData(mappedRows);
      setOriginalRowData(mappedRows);
      setIsFetched(true);
    } catch (error) {
      console.error(error);
      setIsFetched(false);
      setRowData([]);
      setOriginalRowData([]);
      toast.error(
        intl.formatMessage({
          id: "error.product.fetch",
          defaultMessage: "Error fetching product details.",
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const result = await fetchInitialData(screenMenuId);
        setGroupTypeOptions((result?.responseJson?.PRODUCTTYPE || []).map(normalizeLookupOption));
        setGroupCategoryOptions((result?.responseJson?.PRODUCTCATEGORY || []).map(normalizeLookupOption));
      } catch (error) {
        console.error(error);
        toast.error(
          intl.formatMessage({
            id: "error.initial.fetch",
            defaultMessage: "Unable to load lookup data.",
          })
        );
      }
    };

    loadInitialData();
  }, [intl, toast]);

  const handleCellEdit = (params) => {
    const { data, colDef, newValue, oldValue } = params;
    if (newValue === oldValue) return;

    setRowData((prev) =>
      prev.map((row) =>
        row.key === data.key
          ? {
            ...row,
            [colDef.field]: newValue,
            mode: row.mode !== "N" ? "E" : row.mode,
          }
          : row,
      ),
    );
  };

  const handleSave = async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
    if (!portfolio || !isFetched ) {
      toast.warn(
        intl.formatMessage({
          id: "error.portfolioCode.fetch",
          defaultMessage: "Please select portfolio and fetch data before saving",
        }),
      );
      return ;
    }

    if (![...newRows, ...updatedRows, ...deletedRows].length) {
      toast.info(
        intl.formatMessage({
          id: "info.no.changes.save",
          defaultMessage: "No changes to save.",
        }),
      );
      return ;
    }

    const allActiveRows = [...rowData, ...newRows].filter(
      (r) => !deletedRows.some((d) => d.key === r.key),
    );
    const duplicates = findDuplicateProductCodes(allActiveRows);
    if (duplicates.length > 0) {
      toast.error(
        intl.formatMessage(
          {
            id: "validation.product.duplicate",
            defaultMessage: "Duplicate product code: {code}",
          },
          { code: duplicates.join(", ") },
        ),
      );
      return { success: false };
    }

    try {
      const result = await saveProductDetails({
        portfolioCode: portfolio,
        screenMenuId: screenMenuId,
        newRows,
        updatedRows,
        deletedRows,
      });

      if (result?.status === "Success") {
        await handleFetch();
        return { success: true };
      }

      if (result?.responseJson?.["products[0].szProductCode"]) {
        toast.error(
          intl.formatMessage({
            id: "error.prdCode.required",
            defaultMessage: "Product is required",
          }),
        );
        return { success: false };
      }

      toast.error(
        result?.message ||
        intl.formatMessage({ id: "error.product.save", defaultMessage: "Save failed" }),
      );
      return { success: false };
    } catch (error) {
      console.error(error);
      toast.error(
        intl.formatMessage({
          id: "error.product.save",
          defaultMessage: "Error saving product details.",
        }),
      );
      return { success: false };
    }
  };

  const handleAddRow = (newRow) => {
    if (!portfolio || !isFetched) {
      toast.warn(
        intl.formatMessage({
          id: "info.product.fetchBeforeAdd",
          defaultMessage:
            "Please select a Portfolio and fetch records before adding a new row.",
        }),
      );
      return null;
    }

    return {
      ...newRow,
      key: newRow.key || `new-${Date.now()}-${Math.random()}`,
      mode: "N",
    };
  };

  const handleReset = () => {
    setRowData([...originalRowData]);
    return { success: true };
  };

  return (
    <>
      <HBox className="product-master-header-card">
        <HBox style={{ display: "flex", marginBottom: "8px" }} >
          <HBreadCrumb />
        </HBox>
        <TitleBar title="label.ProductMaster.title" />
        <HLabel value={intl.formatMessage({ id: "label.ProductMaster.titleDesc", defaultMessage: "Define individual loan products under each portfolio" })}
          align="left"
          colon={false} />
      </HBox>

      

      <HBox className="product-master-grid-section">
        <ProductMasterToolbar
          portfolio={portfolio}
          portfolioOptions={portfolioOptions}
          onPortfolioChange={handlePortfolioChange}
          onFetch={handleFetch}
          loading={loading}
        />
        <HAgGrid
          ref={gridRef}
          key={intl.locale}
          rowData={rowData}
          columnDefs={columnDefs}
          gridClassName={PRODUCT_MASTER_GRID_CLASS}
          gridStyle={{ width: "100%", height: "55vh", minHeight: "360px" }}
          embeddedInSection
          pagination
          paginationPageSize={10}
          globalSearch={false}
          allowAdd
          allowDelete
          allowUpdate
          onSave={handleSave}
          onAddRow={handleAddRow}
          onCellValueChanged={handleCellEdit}
          getRowId={(params) => params.data.key}
          isLoading={loading}
          hideInternalSaveButton
          overlayNoRowsTemplate={
            `<span>
            ${!isFetched
              ? intl.formatMessage({ id: "label.agGrid.fetch", defaultMessage: "Please click Fetch to load records" })
              : intl.formatMessage({ id: "label.agGrid.noData", defaultMessage: "No Data To Show" })}
            </span>`
          }
        />
        <HButtonBar
          onSave={() => gridRef.current?.submitChanges?.()}
          onReset={handleReset}
          onClose={() => navigate("/homelayout/welcomepage")}
        />
      </HBox>
   </>
  );
};

export default ProductMaster;
