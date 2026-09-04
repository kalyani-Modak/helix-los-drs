export const LOGGED_IN_USER =
  typeof sessionStorage !== "undefined"
    ? sessionStorage.getItem("LOGGED_IN_USER") || "SYSTEM"
    : "SYSTEM";

export const PRODUCT_MODE = {
  NEW: "N",
  EDIT: "E",
  DELETE: "D",
};
