import "./App.css";
import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { Alert, Box, Button, CssBaseline, DialogContent, Typography } from "@mui/material";
import { IntlProvider } from "react-intl";
import { Suspense } from "react";
import EarlyCollectionAccountWorkspaceLayout from "@earlycollection/EarlyCollectionAccountWorkspaceLayout";

import AppDrawLayout from "./layout/AppDrawLayout";
import { ThemeSelectionProvider } from "./themeSelectionConfig";
import { ToastProvider, HAxiosService, HelixApiProvider, ThemeModeProvider, AxiosClient, HDialog } from "@helix/component-library";


import { FilterMasterAPI, OverviewAPI } from "@earlycollection/apiEndpoints";
import { DMN_API_ENDPOINTS } from "@ruleengine/apiEndpoints";

import enBatchFramework from "@translations/batch-framework/en.json";
import esBatchFramework from "@translations/batch-framework/es.json";
import frBatchFramework from "@translations/batch-framework/fr.json";
import deBatchFramework from "@translations/batch-framework/de.json";
import enCollection from "@translations/early-collections/en.json";
import esCollection from "@translations/early-collections/es.json";
import frCollection from "@translations/early-collections/fr.json";
import deCollection from "@translations/early-collections/de.json";
import enUser from "@translations/usermanagement/en.json";
import esUser from "@translations/usermanagement/es.json";
import frUser from "@translations/usermanagement/fr.json";
import deUser from "@translations/usermanagement/de.json";
import enCollections from "@translations/collections/en.json";
import esCollections from "@translations/collections/es.json";
import frCollections from "@translations/collections/fr.json";
import deCollections from "@translations/collections/de.json";
import enIntegration from "@translations/integration-framework/en.json";
import esIntegration from "@translations/integration-framework/es.json";
import frIntegration from "@translations/integration-framework/fr.json";
import deIntegration from "@translations/integration-framework/de.json";
import enUtility from "@translations/utility/en.json";
import esUtility from "@translations/utility/es.json";
import frUtility from "@translations/utility/fr.json";
import deUtility from "@translations/utility/de.json";
import enLos from "@translations/los/en.json";
import esLos from "@translations/los/es.json";
import frLos from "@translations/los/fr.json";
import deLos from "@translations/los/de.json";

// ? Screens
import NotFound from "./error-pages/NotFound";
import UnauthorizedError from "./error-pages/UnauthorizedError";
import RedirectToLogin from "./RedirectToLogin";
import LoginScreen from "@usermanagement/LoginScreen";
import WelcomePage from "@usermanagement/WelcomePage";
import UserScreen from "@usermanagement/UserScreen";
import ClientsScreen from "@usermanagement/ClientScreen";
import ClientDetails from "@usermanagement/ClientDetails";
import CreateClient from "@usermanagement/CreateClient";
import CreateUser from "@usermanagement/CreateUser";
import ResetPassword from "@usermanagement/ResetPassword";
import CreateResource from "@usermanagement/CreateResource";
import CreateRole from "@usermanagement/CreateRole";
import CreateScope from "@usermanagement/CreateScope";
import CreatePolicy from "@usermanagement/Createpolicy";
import PermissionWithScope from "@usermanagement/PermissionwithScope";
import PermissionWithResource from "@usermanagement/PermissionwithResource";
import UploadFederationUsers from "@usermanagement/UploadFederationUsers";
import ShowSessionScreen from "@usermanagement/ShowSessionScreen";
import CreateRealm from "@usermanagement/CreateRealm";
import DataTable from "@usermanagement/DataTable";
import UserAssignedRoles from "@usermanagement/UserAssignedRoles";
import AccessMenu from "@usermanagement/AccessMenu";
import TokenConfiguration from "@usermanagement/TokenConfiguration";
import UserProfileAttributes from "@usermanagement/UserProfileAttributes";
import ModuleCards from "@usermanagement/ModuleCards";
import PasswordManager from "@usermanagement/PasswordManager";
import EventSettingsScreen from "@usermanagement/EventSettingsScreen";
import SessionLimitManager from "@usermanagement/SessionLimitManager";
import SessionTokenTimeout from "@usermanagement/SessionTokenTimeout";
import SecurityDefences from "@usermanagement/SecurityDefences";
import GroupComponent from "@usermanagement/GroupComponent";
import AuthenticationFlows from "@usermanagement/AuthenticationFlows";
import AuthenticationFlowDetails from "@usermanagement/AuthenticationFlowDetails";
import LdapProviders from "@usermanagement/LdapProviders";
import LdapProviderDetail from "@usermanagement/LdapProviderDetail";
import LdapMapperDetail from "@usermanagement/LdapMapperDetail";
import Reports from "@usermanagement/Reports";

import PasswordUpdateByLink from "@usermanagement/PasswordUpdateByLink";
import RuleEngine from "@ruleengine/RuleEngine";

// ? Early Collection
import { store, persistor } from "./store";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import RealmSelector from "./RealmSelector";
import AuthLayout from "./AuthLayout";
// UTILITY IMPORTS
import AayuSimulator from "@utility/AayuSimulator";
import TemplatesList from "@utility/TemplatesList";
import DmsDocumentsManager from "@utility/DmsDocumentsManager";
import TemplateEditorPage, { LegacyTemplateEditorRedirect } from "@utility/TemplateEditorPage";
import DocxEditor from "@utility/DocxEditor";
import TextEditor from "@utility/TextEditor";
import TestComService from "@utility/TestComService";
import PreviewAndDocxEditor from "@utility/PreviewAndDocxEditor";

//  INTEGRATION FRAMEWORK IMPORTS
import NewFileUpload from "@integrationframework/NewFileUpload";
import RetryData from "@integrationframework/RetryData";
import ExistingFileUpload from "@integrationframework/ExistingFileUpload";
import ApiTester from "@integrationframework/ApiTester";
import ExistingAPITester from "@integrationframework/ExistingAPITester";
import ApiConfiguration from "@integrationframework/ApiConfiguration";
import ApiConfiguratorTester from "@integrationframework/ApiConfiguratorTester";
import DatabaseForm from "@integrationframework/DatabaseForm";
import ExistingDbConfigurator from "@integrationframework/ExistingDbConfigurator";
import Dashboard from "../../../products/user-management/modules/idmUI/Dashboard";
import WorkflowDesignerPage from "./pages/WorkflowDesignerPage";
import WorkflowUploadPage from "./pages/WorkflowUploadPage";
import WorkflowListPage from "./pages/WorkflowListPage";
import WorkflowDetailPage from "./pages/WorkflowDetailPage";
import ApplicationEntryFormPage from "./pages/ApplicationEntryFormPage";
import ApplicationListPage from "./pages/ApplicationListPage";
import WorkflowGraphicalLogPage from "./pages/WorkflowGraphicalLogPage";
import ApplicationQuickDataEntry from "../../../products/los/modules/application-entry/ApplicationQuickDataEntry"
import ApplicationDocumentUpload from "../../../products/los/modules/application-entry/ApplicationDocumentUpload"; 

import { collectionTransactionsRoutes, collectionMasterRoutes } from "./routes/collections.routes";

const ACTIVE_MENU_ID_SESSION_KEY = "SEC_ACTIVE_MENU_ID";

/* ==========================================================
   ?? Translation Map
========================================================== */
const translationsMap = {
  earlycollections: { en: enCollection, es: esCollection, fr: frCollection, de: deCollection },
  usermanagement: { en: enUser, es: esUser, fr: frUser, de: deUser },
  batchframework: {
    en: enBatchFramework,
    es: esBatchFramework,
    fr: frBatchFramework,
    de: deBatchFramework,
  },
  collections: { en: enCollections, es: esCollections, fr: frCollections, de: deCollections },
  integrationFramework: { en: enIntegration, es: esIntegration, fr: frIntegration, de: deIntegration },
  utility: { en: enUtility, es: esUtility, fr: frUtility, de: deUtility },
  los: { en: enLos, es: esLos, fr: frLos, de: deLos },
};



const getModuleMessages = (language, product) => translationsMap[product?.toLowerCase()]?.[language] || {};
/* ==========================================================
   ?? AppContent
========================================================== */

const AppContent = ({ language, setLanguage }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/" || /^\/[^/]+$/.test(location.pathname);
  const [popupBlocked, setPopupBlocked] = useState(false);

  const openInNewWindow = () => {
    if (window.opener || window.name === "drs-app-window") {
      return;                         //if window already open then do nothing
    }

    const currentUrl = window.location.href;

    const appWindow = window.open(
      currentUrl,
      "drs-app-window",
      `width=${window.screen.availWidth}, height=${window.screen.availHeight}, left=0, top=0, scrollbars=no,resizable=yes`
    );

    if (!appWindow) {
      setPopupBlocked(true);
      return;
    }

    appWindow.focus();

    try {
      appWindow.moveTo(0, 0);
      appWindow.resizeTo(window.screen.availWidth, window.screen.height);
    } catch (error) {
      console.warn("Unable to force fullscreen window:", error);
    }

    // 🔥 IMPORTANT PART
    setTimeout(() => {
      window.open("", "_self");   // detach current tab //Replaces current page with blank
      window.close();             // try closing

      // Fallback if close fails
      document.body.innerHTML = `
      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        height:100vh;
        font-family:sans-serif;
        flex-direction:column;
        gap:10px;
      ">
        <h3>Application opened in new window</h3>
        <p>Please close this tab</p>
      </div>
    `;
    }, 500);

    setPopupBlocked(false);
  };

  useEffect(() => {
    const isChild = window.name === "drs-app-window";

    if (!isChild) {
      openInNewWindow();
    }
  }, []);


  useEffect(() => {
    const handlePop = () => {
      const realm = sessionStorage.getItem("SEC_REALM");
      sessionStorage.clear();
      navigate(`/${realm}`);
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [navigate]);

  useEffect(() => {
    document.body.style.overflow = isLoginPage ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [location.pathname]);

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ flexGrow: 1, padding: isLoginPage ? 0 : 0 }}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route
              index
              element={
                sessionStorage.getItem("SEC_REALM") &&
                  sessionStorage.getItem("SEC_REALM") !== "UNKNOWN"
                  ? <Navigate to={`/${sessionStorage.getItem("SEC_REALM")}`} replace />
                  : <RealmSelector />
              }
            />
            <Route path=":orgName" element={<RedirectToLogin />} />
            <Route path="homelayout/login" element={<LoginScreen />} />
          </Route>

          <Route path="update-password-link/:realm/:token" element={<PasswordUpdateByLink />} />

          {/* ? Protected routes go here */}
          <Route path="homelayout" element={<AppDrawLayout setLanguage={setLanguage} language={language} />}>
            <Route path="welcomepage" element={<WelcomePage language={language} setLanguage={setLanguage} />} />
            <Route path="unauthorized" element={<UnauthorizedError />} />

            <Route path="users" element={<UserScreen />} />
            <Route path="upload-federation-users" element={<UploadFederationUsers />} />
            <Route path="clients" element={<ClientsScreen />} />
            <Route path="client/:clientId1" element={<ClientDetails />} />
            <Route path="create-client" element={<CreateClient />} />
            <Route path="create-client/:clientId1" element={<CreateClient />} />
            <Route path="create-user" element={<CreateUser />} />
            <Route path="create-user/:userId/:userNameId" element={<CreateUser />} />
            <Route path="reset-password/:userId/:userNameId" element={<ResetPassword />} />
            <Route path="create-resource" element={<CreateResource />} />
            <Route path="create-resource/:resourceId" element={<CreateResource />} />
            <Route path="role" element={<CreateRole />} />
            <Route path="role/:roleId" element={<CreateRole />} />
            <Route path="scope" element={<CreateScope />} />
            <Route path="scope/:scopeId" element={<CreateScope />} />
            <Route path="policy" element={<CreatePolicy />} />
            <Route path="policy/:policyId" element={<CreatePolicy />} />
            <Route path="permission-scope" element={<PermissionWithScope />} />
            <Route path="permission-resource" element={<PermissionWithResource />} />
            <Route path="permission-resource/:permissionResourceId" element={<PermissionWithResource />} />
            <Route path="sessions" element={<ShowSessionScreen />} />
            <Route path="create-realm" element={<CreateRealm />} />
            <Route path="data" element={<DataTable />} />
            <Route path="user-roles/:userId/:userNameId" element={<UserAssignedRoles />} />
            <Route path="access" element={<AccessMenu />} />
            <Route path="token-config" element={<TokenConfiguration />} />
            <Route path="user-profile-attributes" element={<UserProfileAttributes />} />
            <Route path="cards" element={<ModuleCards />} />
            <Route path="event" element={<EventSettingsScreen />} />
            <Route path="group" element={<GroupComponent />} />
            <Route path="session-limit" element={<SessionLimitManager />} />
            <Route path="session-token-timeout" element={<SessionTokenTimeout />} />
            <Route path="security-defences" element={<SecurityDefences />} />
            <Route path="password-policy" element={<PasswordManager />} />
            <Route path="ldap-providers" element={<LdapProviders />} />
            <Route path="ldap-providers/:providerId" element={<LdapProviderDetail />} />
            <Route path="ldap-providers/:providerId/mappers/new/:mapperTypeId" element={<LdapMapperDetail />} />
            <Route path="ldap-providers/:providerId/mappers/:mapperId" element={<LdapMapperDetail />} />
            <Route path="ruleengine/builder" element={<RuleEngine />} />
            <Route path="templatelist" element={<TemplatesList />} />
            <Route path="dms-documents" element={<DmsDocumentsManager />} />
            <Route path="email-preview-docx/:primary_Name" element={<PreviewAndDocxEditor />} />
            <Route path="email-preview-docx" element={<PreviewAndDocxEditor />} />
            <Route path="editor" element={<TemplateEditorPage />} />
            <Route path="editor/:name" element={<LegacyTemplateEditorRedirect />} />
            <Route path="text-editor/:templateId" element={<TextEditor />} />
            <Route path="doc-editor/:templateId" element={<DocxEditor />} />
            <Route path="repay-schedule-engine" element={<AayuSimulator />} />
            <Route path="file-upload" element={<NewFileUpload />} />
            <Route path="retrydata" element={<RetryData />} />
            <Route path="existing-file-upload" element={<ExistingFileUpload />} />
            <Route path="api-test" element={<ApiTester />} />
            <Route path="existing-api-test" element={<ExistingAPITester />} />
            <Route path="api-config" element={<ApiConfiguration />} />
            <Route path="api-config-test" element={<ApiConfiguratorTester />} />
            <Route path="db-config" element={<DatabaseForm />} />
            <Route path="existing-db-config" element={<ExistingDbConfigurator />} />
            <Route path="testcomservice/:channel" element={<TestComService />} />
            <Route path="authentication-flows" element={<AuthenticationFlows />} />
            <Route path="authentication-flows/:id" element={<AuthenticationFlowDetails />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="reports" element={<Reports/>}/>
            <Route path="workflow-registry/designer" element={<WorkflowDesignerPage />} />
            <Route path="workflow-registry/upload" element={<WorkflowUploadPage />} />
            <Route path="workflow-registry/list" element={<WorkflowListPage />} />
            <Route path="workflow-registry/workflow/:id" element={<WorkflowDetailPage />} />
            <Route path="workflow-registry/application-entry-form" element={<ApplicationEntryFormPage />} />
            <Route path="workflow-registry/application-list" element={<ApplicationListPage />} />
            <Route path="workflow-registry/graphical-log" element={<WorkflowGraphicalLogPage />} />
            <Route path="workflow-registry/graphical-log/:appNo" element={<WorkflowGraphicalLogPage />} />
            <Route path="application-entry/retail" element={<ApplicationQuickDataEntry />} />
            <Route path="application-entry/uploadDocument" element={<ApplicationDocumentUpload />} />
        

            {/* Account list: no persistent AccountHeader / FunctionGroupsBar */}
            {collectionTransactionsRoutes
              .filter((route) => route.path === "listView")
              .map((route) => {
                const Component = route.component;
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <Component />
                      </Suspense>
                    }
                  />
                );
              })}
            {/* ROUTES WITH ACCOUNT HEADER */}
            <Route element={<EarlyCollectionAccountWorkspaceLayout />}>
              {collectionTransactionsRoutes
                .filter((route) => route.path !== "listView")
                .map((route) => {
                  const Component = route.component;
                  return (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        <Suspense fallback={<div>Loading...</div>}>
                          <Component />
                        </Suspense>
                      }
                    />
                  );
                })}
            </Route>
            {/* ROUTES WITHOUT ACCOUNT HEADER */}
            {collectionMasterRoutes.map((route) => {
              const Component = route.component;

              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <Component />
                    </Suspense>
                  }
                />
              );
            })}
          </Route>
          <Route path="/notfound" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
      <HDialog
        open={popupBlocked}
        onClose={() => setPopupBlocked(false)}
        disableEscapeKeyDown
        title="Application Window Blocked"
        aria-describedby="popup-blocked-dialog-description"
        slotProps={{
          paper: {
            sx: {
              width: "100%",
              maxWidth: 560,
              borderRadius: 2,
            },
          },
        }}
        actions={
          <Button variant="contained" onClick={openInNewWindow}>
            Open In New Window
          </Button>
        }
      >
        <>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Application window was unable to open, and may have been blocked by a pop-up blocker.
          </Alert>
          <Typography id="popup-blocked-dialog-description" variant="body1">
            Please add this Application server to the list of sites your pop-up blocker allows to open new windows.
          </Typography>
        </>
      </HDialog>
    </Box>
  );
};

AppContent.propTypes = {
  language: PropTypes.string.isRequired,
  setLanguage: PropTypes.func.isRequired,
};

const App = () => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const attachMenuIdHeader = (config = {}) => {
      const menuId = sessionStorage.getItem(ACTIVE_MENU_ID_SESSION_KEY);

      if (!menuId) {
        return config;
      }

      if (!config.headers) {
        config.headers = {};
      }

      if (menuId && !config.headers["X-Menu-Id"]) {
        config.headers["X-Menu-Id"] = menuId;
      }
      return config;
    };

    const clientCandidates = [AxiosClient, HAxiosService?.AxiosClient].filter(Boolean);
    const interceptorRefs = [];

    const withMenuHeader = (header = {}) => {
      const menuId = sessionStorage.getItem(ACTIVE_MENU_ID_SESSION_KEY);

      if (!menuId) {
        return header;
      }

      return {
        ...(menuId ? { "X-Menu-Id": menuId } : {}),
        ...(header || {}),
      };
    };

    const originalPost = HAxiosService?.POST;
    const originalPut = HAxiosService?.PUT;
    const originalGet = HAxiosService?.GET;
    const originalDelete = HAxiosService?.DELETE;

    if (typeof originalPost === "function") {
      HAxiosService.POST = (url, payload = {}, params = {}, fetchURLParams = false, header = {}) =>
        originalPost(url, payload, params, fetchURLParams, withMenuHeader(header));
    }

    if (typeof originalPut === "function") {
      HAxiosService.PUT = (url, payload = {}, params = {}, fetchURLParams = false, header = {}) =>
        originalPut(url, payload, params, fetchURLParams, withMenuHeader(header));
    }

    if (typeof originalGet === "function") {
      HAxiosService.GET = (url, payload = {}, params = {}, fetchURLParams = false, header = {}) =>
        originalGet(url, payload, params, fetchURLParams, header);
    }

    if (typeof originalDelete === "function") {
      HAxiosService.DELETE = (url, params = {}, fetchURLParams = false) =>
        originalDelete(url, params, fetchURLParams);
    }

    clientCandidates.forEach((client) => {
      const requestInterceptor = client?.interceptors?.request;

      if (!requestInterceptor?.use) {
        return;
      }

      const id = requestInterceptor.use(
        (config) => attachMenuIdHeader(config),
        (error) => Promise.reject(error)
      );
      interceptorRefs.push({ requestInterceptor, id });
    });

    return () => {
      interceptorRefs.forEach(({ requestInterceptor, id }) => {
        if (requestInterceptor?.eject) {
          requestInterceptor.eject(id);
        }
      });

      if (typeof originalPost === "function") {
        HAxiosService.POST = originalPost;
      }
      if (typeof originalPut === "function") {
        HAxiosService.PUT = originalPut;
      }
      if (typeof originalGet === "function") {
        HAxiosService.GET = originalGet;
      }
      if (typeof originalDelete === "function") {
        HAxiosService.DELETE = originalDelete;
      }
    };
  }, []);

  const product = sessionStorage.getItem("SEC_PRODUCT")?.toLowerCase();
  const mergedMessages = useMemo(() => {
    const common = translationsMap.earlycollections?.[language] || {};

    // ? Merge all module translations (so no missing keys)
    const allModules = Object.keys(translationsMap)
      .filter((key) => key !== "earlycollections")
      .reduce(
        (acc, key) => ({ ...acc, ...(translationsMap[key]?.[language] || {}) }),
        {}
      );

    const module = getModuleMessages(language, product);

    return { ...common, ...allModules, ...module };
  }, [language, product]);

  return (
    <ThemeModeProvider>
      <ThemeSelectionProvider>
        <ToastProvider>
          <HelixApiProvider
            httpClient={HAxiosService}
            endpoints={{
              filterMaster: {
                fetchFilterCommonData: FilterMasterAPI.fetchFilterCommonData(),
                saveFilterCommonData: FilterMasterAPI.saveFilterCommonData(),
              },
              overview: {
                fetchOverviewHeader: OverviewAPI.fetchOverviewHeader(),
              },
              dmn: {
                getEntityData: DMN_API_ENDPOINTS.getEntityData(),
                getDmnFileContent: DMN_API_ENDPOINTS.getDmnFileContent(),
                getLatestDmnFileContent: DMN_API_ENDPOINTS.getLatestDmnFileContent(),
              },
            }}
          >
            <IntlProvider locale={language} messages={mergedMessages}>
              <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                  <CssBaseline />
                  <AppContent language={language} setLanguage={setLanguage} />
                </PersistGate>
              </Provider>
            </IntlProvider>
          </HelixApiProvider>
        </ToastProvider>
      </ThemeSelectionProvider>
    </ThemeModeProvider>
  );
};

export default App;