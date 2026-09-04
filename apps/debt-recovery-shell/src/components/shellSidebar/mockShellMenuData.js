/**
 * Sample `SEC_MENUS`-shaped payload for the shell sidebar.
 *
 * - Human-readable copy: `mockShellMenu.sample.json` (same shape; keep in sync when editing).
 * - Set `USE_MOCK_SHELL_MENU_ONLY` to `false` to prefer live `SEC_MENUS` when it validates.
 */

/** When `true`, sidebar always uses mock data. Set `false` once `SEC_MENUS` / `hangingFunctions` is correct. */
export const USE_MOCK_SHELL_MENU_ONLY = true;

/**
 * Same structure as `sessionStorage` key `SEC_MENUS` after login:
 * `Record<productKey, { hangingFunctions: [...] }>`
 */
export const MOCK_SEC_MENUS = {
  "EARLY-COLLECTIONS": {
    hangingFunctions: [
      {
        parentMenu: "Configuration",
        menuId: "9855-9083",
        name: "List View",
        uris: ["/collection-listing/api/*"],
        path: "/homelayout/listView",
      },
      {
        parentMenu: "Configuration",
        menuId: "9855-9085",
        name: "Strategy Rules",
        uris: ["/strategy/api/*"],
        path: "/homelayout/strategy-rules",
      },
      {
        parentMenu: "Workflow Registry",
        menuId: "wf-reg-upload",
        name: "Upload & Save",
        uris: ["/api/master/draft", "/api/master/save"],
        path: "/homelayout/workflow-registry/upload",
      },
      {
        parentMenu: "Workflow Registry",
        menuId: "wf-reg-list",
        name: "Workflow List",
        uris: ["/api/master/list"],
        path: "/homelayout/workflow-registry/list",
      },
      {
        parentMenu: "Workflow Registry",
        menuId: "wf-reg-designer",
        name: "Workflow Designer",
        uris: [
          "/api/master/{id}",
          "/api/master/{id}/bpmn",
          "/api/master/name/{workflowName}",
          "/api/master/save",
        ],
        path: "/homelayout/workflow-registry/designer",
      },
      {
        parentMenu: "Workflow Registry",
        menuId: "wf-reg-application-entry",
        name: "Application Entry Form",
        uris: ["/api/los/applications/draft", "/api/los/applications/submit"],
        path: "/homelayout/workflow-registry/application-entry-form",
      },
      {
        parentMenu: "Workflow Registry",
        menuId: "wf-reg-application-list",
        name: "Application List",
        uris: ["/api/los/applications"],
        path: "/homelayout/workflow-registry/application-list",
      },
      {
        parentMenu: "Application Entry",
        menuId: "los-qde-quick-data-entry",
        name: "Quick data entry",
        uris: [
          "/api/los/v1/qde/applications/*",
          "/api/los/v1/qde/verify/*",
          "/api/los/v1/qde/pincode/*",
        ],
        path: "/homelayout/application-entry/quick-data-entry",
      },
      {
        parentMenu: "Application Entry",
        menuId: "los-doc-upload",
        name: "Document upload",
        uris: ["/api/los/v1/documents/*"],
        path: "/homelayout/application-entry/document-upload",
      },
      {
        parentMenu: "CNI",
        menuId: "9855-9084",
        name: "CNI Masters",
        uris: ["/collection-listing/api/*"],
        path: "/homelayout/cni-masters",
      },
      {
        parentMenu: "Follow Up & Collection",
        menuId: "ec-fu-01",
        name: "Follow Up",
        uris: ["/early-collection/*"],
        path: "/homelayout/followup/followup",
      },
      {
        parentMenu: "Follow Up & Collection",
        menuId: "ec-tag-01",
        name: "Tag Account",
        uris: ["/early-collection/*"],
        path: "/homelayout/tagAccount",
      },
    ],
  },
  USERMANAGEMENT: {
    hangingFunctions: [
      {
        parentMenu: "Administration",
        menuId: "um-users",
        name: "Users",
        uris: ["/idm/*"],
        path: "/homelayout/users",
      },
      {
        parentMenu: "Administration",
        menuId: "um-clients",
        name: "Clients",
        uris: ["/idm/*"],
        path: "/homelayout/clients",
      },
      {
        parentMenu: "Security",
        menuId: "um-roles",
        name: "Roles",
        uris: ["/idm/*"],
        path: "/homelayout/role",
      },
    ],
  },
};

const DEFAULT_PRODUCT = "EARLY-COLLECTIONS";

function isWellFormedMenuItem(item) {
  return (
    item &&
    typeof item === "object" &&
    typeof item.name === "string" &&
    item.name.length > 0 &&
    typeof item.path === "string" &&
    item.path.length > 0
  );
}

function isValidHangingFunctions(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return false;
  return arr.every(isWellFormedMenuItem);
}

/**
 * @param {string | null | undefined} activeClient
 * @returns {object[]}
 */
export function getMockHangingFunctions(activeClient) {
  const key =
    activeClient && MOCK_SEC_MENUS[activeClient] ? activeClient : DEFAULT_PRODUCT;
  const block = MOCK_SEC_MENUS[key];
  return Array.isArray(block?.hangingFunctions) ? block.hangingFunctions : [];
}

/**
 * Sidebar menu list: mock-only while `USE_MOCK_SHELL_MENU_ONLY` is true; otherwise live data when valid.
 *
 * @param {string | null | undefined} activeClient
 * @param {unknown} menus
 * @returns {object[]}
 */
export function resolveShellMenuItems(activeClient, menus) {
  if (USE_MOCK_SHELL_MENU_ONLY) {
    return getMockHangingFunctions(activeClient);
  }
  const live = activeClient && menus?.[activeClient]?.hangingFunctions;
  if (isValidHangingFunctions(live)) {
    return live;
  }
  return getMockHangingFunctions(activeClient);
}
