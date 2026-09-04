import React from "react";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoutes() {
  const token = sessionStorage.getItem("SEC_TOKEN") !== null;
  const realm = sessionStorage.getItem("SEC_REALM");

  if (!token) {
    return realm ? <Navigate to={`/${realm}`} /> : <Navigate to="/" />;
  }

  return <Outlet />;
}
