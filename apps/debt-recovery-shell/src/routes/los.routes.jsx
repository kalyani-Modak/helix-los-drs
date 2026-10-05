import { lazy } from "react";

//LOS Module
const ApplicationQuickDataEntry = lazy(() => import("@los/ApplicationQuickDataEntry"));
const ApplicationDetailedDataEntry = lazy(() => import("@los/ApplicationDetailedDataEntry"));

export const losRoutes= [
    { path: "ApplicationQuickDataEntry", component: ApplicationQuickDataEntry, module: "los" },
    { path: "ApplicationDetailedDataEntry", component: ApplicationDetailedDataEntry, module: "los" },
];
