import { lazy } from "react";

const TemplatesList = lazy(() => import("@utility/TemplatesList"));
const AayuSimulator = lazy(() => import("@utility/AayuSimulator"));
const DmsDocumentsManager = lazy(() => import("@utility/DmsDocumentsManager"));

const utilityRoutes = [
  { path: "templatelist", component: TemplatesList, module: "utility" },
  { path: "dms-documents", component: DmsDocumentsManager, module: "utility" },
  { path: "repay-schedule-engine", component: AayuSimulator, module: "utility" },
];

export default utilityRoutes;
