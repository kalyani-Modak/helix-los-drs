import { HAxiosService } from "@helix/component-library";
import { ProductMasterAPI } from "../apiEndpoints";
import { buildSavePayload, mapPortfolioOptions, normalizePortfolioPayload,} from "./productMasterMappers";
import { LOGGED_IN_USER } from "./productMaster.constants";

export const fetchPortfolioOptions = async (screenMenuId) => {
  const res = await HAxiosService.GET(ProductMasterAPI.fetchPortfolioDetails(screenMenuId));
  const payload = normalizePortfolioPayload(res?.data);
  return mapPortfolioOptions(payload);
};

export const fetchInitialData = async (screenMenuId) => {
 const res = await HAxiosService.GET(ProductMasterAPI.ProductDetails(screenMenuId)+`/fetchInitialData`);
  return res?.data;
};
export const fetchProductDetails = async (szPortfolioCode, screenMenuId) => {
  const res = await HAxiosService.GET(ProductMasterAPI.ProductDetails(screenMenuId)+`?szPortfolioCode=${szPortfolioCode}`);
  return res?.data;
};

export const saveProductDetails = async ({
  portfolioCode,
  screenMenuId,
  newRows,
  updatedRows,
  deletedRows,
  user = LOGGED_IN_USER,
}) => {
  const payload = buildSavePayload({
    portfolioCode,
    screenMenuId,
    user,
    newRows,
    updatedRows,
    deletedRows,
  });
  const res = await HAxiosService.POST(ProductMasterAPI.ProductDetails(screenMenuId), payload);
  return res?.data;
};
