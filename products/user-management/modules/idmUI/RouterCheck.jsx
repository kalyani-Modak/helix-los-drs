// components/RouterCheck.jsx
import { useInRouterContext } from "react-router-dom";
import { useEffect } from "react";

const RouterCheck = () => {
  const inRouter = useInRouterContext();

  useEffect(() => {
    console.log("[RouterCheck] Is inside router context?", inRouter);
  }, [inRouter]);

  return null; // This component only logs to console
};

export default RouterCheck;
