export const getInitialProduct = () => {
  const stored = sessionStorage.getItem("SEC_PRODUCT");
  return (stored || "COLLECTIONS").toUpperCase();
};

export const setProductInSession = (product) => {
  sessionStorage.setItem("SEC_PRODUCT", product.toUpperCase());
};
