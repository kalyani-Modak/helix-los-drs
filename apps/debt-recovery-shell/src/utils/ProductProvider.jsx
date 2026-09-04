import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useInRouterContext } from "react-router-dom";
import { setProductInSession } from "./productUtils";
const ProductContext = createContext(undefined);

export const ProductProvider = ({ children }) => {
  const location = useLocation();

	const inferProductFromPath = () => {
	  const fromSession = sessionStorage.getItem("SEC_PRODUCT");
	  return fromSession && fromSession !== "UNKNOWN" ? fromSession : null;
	};

  const [product, setProduct] = useState(inferProductFromPath());

  useEffect(() => {
    if (product) {
      setProductInSession(product);
    }
  }, [location.pathname, product]);

  const basename = `/${product}`;

  return (
    <ProductContext.Provider value={{ product, setProduct, basename }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  console.log("[ProductProvider] in router context:", useInRouterContext());

  if (!context) {
    console.warn("[useProduct] Missing ProductProvider. Did you forget to wrap your app?");
    return { product: null, setProduct: () => { }, basename: "" }; // fallback to avoid crash
  }
  return context;
};
