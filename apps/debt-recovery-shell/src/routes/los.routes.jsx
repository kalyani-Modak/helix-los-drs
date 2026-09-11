import { lazy } from "react";

//LOS Module
const ApplicationQuickDataEntry = lazy(() => import("@los/ApplicationQuickDataEntry"));

export const losRoutes= [
    { path: "ApplicationQuickDataEntry", component: ApplicationQuickDataEntry, module: "los" },
];