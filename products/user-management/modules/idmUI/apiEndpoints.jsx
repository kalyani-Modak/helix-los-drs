import { getKeycloakApiPath } from "@shared/config/apiConstants";

export const UserManagementAPI = { 
  fetchAllRealms: () => `${getKeycloakApiPath()}realms`,
  createRealm: () => `${getKeycloakApiPath()}realm`,

  fetch_clients: () => `${getKeycloakApiPath()}clients`,
  create_client: () => `${getKeycloakApiPath()}clients`,
  client_details: (clientId) => `${getKeycloakApiPath()}clients/${encodeURIComponent(clientId)}`,

  create_role: () => `${getKeycloakApiPath()}role`,
  putRoles: (realm, product) => `${getKeycloakApiPath()}roles${product ? `?product=${encodeURIComponent(product)}` : ""}`,
  fetchUsersInRole: (realm, userName) => `${getKeycloakApiPath()}role-user?userName=${encodeURIComponent(userName)}`,
  unassign_role: (realm, product, userName, roleName) =>
    `${getKeycloakApiPath()}user-role/unassign?product=${encodeURIComponent(product)}&userName=${encodeURIComponent(userName)}&roleName=${encodeURIComponent(roleName)}`,
  getRole: (realm, product, roleName) => `${getKeycloakApiPath()}role-data?product=${encodeURIComponent(product)}&roleName=${encodeURIComponent(roleName)}`,
  delete_role: (roleId, realm, product) => `${getKeycloakApiPath()}role/${roleId}?product=${product}`,
  role: () => `${getKeycloakApiPath()}role`,
  roles_menu_access: () => `${getKeycloakApiPath()}roles-menu-access`,

  getSessionLimit: (type) => `${getKeycloakApiPath()}limit-session/${encodeURIComponent(type)}`,
  setDefaultSessionLimit: (limit) => `${getKeycloakApiPath()}limit-session/default?limit=${encodeURIComponent(limit)}`,
  setLdapSessionLimit: (limit) => `${getKeycloakApiPath()}limit-session/ldap?limit=${encodeURIComponent(limit)}`,

  resource: () => `${getKeycloakApiPath()}resource`,
  fetch_resources: (realm, product) => `${getKeycloakApiPath()}resource-name?product=${encodeURIComponent(product)}`,
  get_resource_data: (realm, product, resourceName) => `${getKeycloakApiPath()}resource-data?product=${encodeURIComponent(product)}&resourceName=${encodeURIComponent(resourceName)}`,
  delete_resource: (resourceId, realm, product) => `${getKeycloakApiPath()}resource/${resourceId}?product=${product}`,

  create_policy: () => `${getKeycloakApiPath()}policies`,
  fetch_policies: (realm, product) => `${getKeycloakApiPath()}policy-name?product=${encodeURIComponent(product)}`,

  scope: () => `${getKeycloakApiPath()}scope`,
  fetch_scopes: (realm, product) => `${getKeycloakApiPath()}scope-names?product=${encodeURIComponent(product)}`,
  getScope: (realm, product, scopeName) => `${getKeycloakApiPath()}scope-data?product=${encodeURIComponent(product)}&scopeName=${encodeURIComponent(scopeName)}`,
  delete_scope: (scopeId, realm, product) => `${getKeycloakApiPath()}scope/${scopeId}?product=${product}`,

  create_permission_resource: () => `${getKeycloakApiPath()}permission-resource`,
  create_permission_scope: () => `${getKeycloakApiPath()}permission-scope`,
  fetch_permissions: (realm, product) => `${getKeycloakApiPath()}permission-name?product=${encodeURIComponent(product)}`,
  permission_scope: () => `${getKeycloakApiPath()}permission-scope`,
  permission_resource: () => `${getKeycloakApiPath()}permission-resource`,
  permission_data: (realm, product, permissionName) => `${getKeycloakApiPath()}permission-data?product=${encodeURIComponent(product)}&permissionName=${encodeURIComponent(permissionName)}`,
  delete_permission: (permissionName, realm, product) => `${getKeycloakApiPath()}permission-resource/${permissionName}?product=${product}`,
  fetch_access_menus: () => `${getKeycloakApiPath()}menu`,
  fetchAllMenus: () => `${getKeycloakApiPath()}menu`,
  assign_access_menus: () => `${getKeycloakApiPath()}roles-menu-access`,

  create_bulk_users: () => `${getKeycloakApiPath()}users/bulk-import`,

  fetch_users: (realm) => `${getKeycloakApiPath()}users`,
  get_user_federations: () => `${getKeycloakApiPath()}user-federation/providers`,
  validate_upload_federation_users: () => `${getKeycloakApiPath()}user-federation/validate-uploaded-users`,
  sync_selected_federation_users: () => `${getKeycloakApiPath()}user-federation/sync-selected-users`,
  get_user_data: (userId, realm) => `${getKeycloakApiPath()}users/${encodeURIComponent(userId)}`,
  assign_role: () => `${getKeycloakApiPath()}user-role`,
  user: () => `${getKeycloakApiPath()}users`,
  delete_user_by_id: (userId, realm) => `${getKeycloakApiPath()}users/${encodeURIComponent(userId)}`,
  toggle_user_status: (userId, enable) => `${getKeycloakApiPath()}users/status/${encodeURIComponent(userId)}?enable=${encodeURIComponent(enable)}`,
  unlock_user:        (userId)         => `${getKeycloakApiPath()}users/unlock/${encodeURIComponent(userId)}`,
  enforceUserToChangePassword: (userId) => `${getKeycloakApiPath()}users/enforce-password-change/${userId}`,
  login: () => `${getKeycloakApiPath()}login`,
  reset_password_login: () => `${getKeycloakApiPath()}temp/resetpass`,

  logout: () => `${getKeycloakApiPath()}users/logout`,
  refresh: () => `${getKeycloakApiPath()}refresh`,

  fetch_password_policies: (realm) => `${getKeycloakApiPath()}password`,
  update_password_policy: (realm) => `${getKeycloakApiPath()}password`,
  get_user_credentials: (realm, userId) => `${getKeycloakApiPath()}users/credentials/${encodeURIComponent(userId)}`,

  reset_password: () => `${getKeycloakApiPath()}users/password`,

  delete_group: (groupId) => `${getKeycloakApiPath()}groups/${groupId}`,
  fetch_groups_by_id: (groupId) => `${getKeycloakApiPath()}groups/${groupId}`,
  fetch_groups: () => `${getKeycloakApiPath()}groups`,
  groups: () => `${getKeycloakApiPath()}groups`,

  realm: () => `${getKeycloakApiPath()}realm`,
  realms: () => `${getKeycloakApiPath()}realms`,
  realm_data: () => `${getKeycloakApiPath()}realm`,
  
  //Sessions
  fetch_all_users_sessions: (realm) => `${getKeycloakApiPath()}sessions`,
  forcefully_logout_single_user_session: (realm,sessionId) => `${getKeycloakApiPath()}sessions/logout/${encodeURIComponent(sessionId)}`,
  forcefully_logout_all_users_sessions: (realm) => `${getKeycloakApiPath()}sessions/logout-all`,

// Manage User Profile attributes
  user_profile_attributes_cru_operation: () => `${getKeycloakApiPath()}profileattributes`,
  user_profile_attributes_delete_operation: (attributeKey) => `${getKeycloakApiPath()}profileattributes/${attributeKey}`,

  verify_token_update: () => `${getKeycloakApiPath()}verify-password-update-token`,  
  
  // Authentication Flows
  fetch_auth_flows: () => `${getKeycloakApiPath()}authflows`,
  delete_auth_flow: (flowId) => `${getKeycloakApiPath()}authflows/delete/${flowId}`,
  duplicate_auth_flow: () => `${getKeycloakApiPath()}authflows/copy`,
  bind_auth_flow: () => `${getKeycloakApiPath()}authflows/bind`,
  update_execution: () => `${getKeycloakApiPath()}authflows/executions/update`,
  // Fetch available authenticator providers (used when adding a step)
  fetch_authenticator_providers: () => `${getKeycloakApiPath()}authflows/auth-providers`,
  // Create a new execution/step under a flow (matches backend endpoint for adding an execution)
  create_execution: () => `${getKeycloakApiPath()}authflows/executions/add-execution`,
  // Fetch available form providers (used when adding a sub-flow)
  fetch_form_providers: () => `${getKeycloakApiPath()}authflows/form-providers`,
  // Create a new sub-flow under a flow
  create_subflow: () => `${getKeycloakApiPath()}authflows/executions/add-subflow`,
  // Delete an execution
  delete_execution: (executionId) => `${getKeycloakApiPath()}authflows/executions/delete/${executionId}`,
  
  //Samples Download
  download_sample: (fileName) => `${getKeycloakApiPath()}samples/${encodeURIComponent(fileName)}`,
  
  // LDAP Providers
  fetch_ldap_providers: () => `${getKeycloakApiPath()}ldap-providers`,
  fetch_ldap_mappers: (providerId) => `${getKeycloakApiPath()}ldap-mappers/${encodeURIComponent(providerId)}`,
  ldap_mapper_by_id: (providerId, mapperId) => `${getKeycloakApiPath()}ldap-mappers/${encodeURIComponent(providerId)}/${encodeURIComponent(mapperId)}`,
  fetch_ldap_mapper_types: (providerId) => `${getKeycloakApiPath()}ldap-mappers/sub-component-types/${encodeURIComponent(providerId)}`,
  test_ldap_connection: (params) => `${getKeycloakApiPath()}ldap-providers/test-connection?${new URLSearchParams(params).toString()}`,
  

  //Token Configuration
   fetch_token_config: (clientId) => `${getKeycloakApiPath()}token-config/${encodeURIComponent(clientId)}`,
  update_token_config_status: (clientId, configId, type, enable) =>
    `${getKeycloakApiPath()}token-config/update/${encodeURIComponent(configId)}?clientId=${encodeURIComponent(clientId)}&type=${encodeURIComponent(type)}&enable=${encodeURIComponent(enable)}`,
  delete_token_config_scope: (clientId, scopeId) =>
    `${getKeycloakApiPath()}token-config/${encodeURIComponent(clientId)}/scope/${encodeURIComponent(scopeId)}`,
  delete_token_config_mapper: (clientId, mapperId) =>
    `${getKeycloakApiPath()}token-config/${encodeURIComponent(clientId)}/mapper/${encodeURIComponent(mapperId)}`,
  add_token_config_mapper: (clientId) =>
    `${getKeycloakApiPath()}token-config/${encodeURIComponent(clientId)}/mapper`,
  fetch_token_config_user_attributes: () =>
    `${getKeycloakApiPath()}token-config/user-attributes`,
  fetch_token_config_mapper_types: () =>
    `${getKeycloakApiPath()}token-config/mapper-types`,

  fetch_session_token_timeout: () =>
    `${getKeycloakApiPath()}session-token-timeout`,
  update_session_token_timeout: () =>
    `${getKeycloakApiPath()}session-token-timeout`,

  fetch_security_defence_headers: () =>
    `${getKeycloakApiPath()}security-defences/headers`,
  update_security_defence_headers: () =>
    `${getKeycloakApiPath()}security-defences/headers`,
  fetch_brute_force_detection: () =>
    `${getKeycloakApiPath()}security-defences/brute-force-detection`,
  update_brute_force_detection: () =>
    `${getKeycloakApiPath()}security-defences/brute-force-detection`,

  // reports endpoints
  user_filter_reports: () => `${getKeycloakApiPath()}reports/user-filter-reports`,
  password_change_report: () => `${getKeycloakApiPath()}reports/password-change-report`,
  login_report: () => `${getKeycloakApiPath()}reports/login-report`,
};

export const ClientDetailsAPI = {
  ROLES: (realm, product) => `${getKeycloakApiPath()}roles${product ? `?product=${encodeURIComponent(product)}` : ""}`,
  RESOURCES: (realm, product) => `${getKeycloakApiPath()}resource-name?product=${encodeURIComponent(product)}`,
  POLICIES: (realm, product) => `${getKeycloakApiPath()}policy-name?product=${encodeURIComponent(product)}`,
  PERMISSIONS: (realm, product) => `${getKeycloakApiPath()}permission-name?product=${encodeURIComponent(product)}`,
  SCOPES: (realm, product) => `${getKeycloakApiPath()}scope-names?product=${encodeURIComponent(product)}`,
  GET_CLIENTS_BY_REALM: (realm) => `${getKeycloakApiPath()}clients`,
  GET_CLIENT_BY_ID: (realm, clientId) => `${getKeycloakApiPath()}clients/${encodeURIComponent(clientId)}`,
  CREATE_OR_UPDATE_CLIENT: () => `${getKeycloakApiPath()}clients`,
  DELETE_CLIENT: (clientId, realm) => `${getKeycloakApiPath()}clients/${encodeURIComponent(clientId)}`,
  GET_CLIENTS: (realm) => `${getKeycloakApiPath()}clients`,
};

export const EventTypesAPI = {
  FETCH_DISABLED: (page, size) => `${getKeycloakApiPath()}events-disabled?page=${page}&size=${size}`,
  UPDATE_ENABLED: () => `${getKeycloakApiPath()}events/update-enabled-events`,
  GET_DISABLED_EVENTS: (page, size) => `${getKeycloakApiPath()}events-disabled?page=${page}&size=${size}`,
  FETCH_EVENT_CONFIG: () => `${getKeycloakApiPath()}events/event-config`,
  UPDATE_EVENT_CONFIG: () => `${getKeycloakApiPath()}events/event-config`,
  FETCH_ADMIN_EVENT_CONFIG: () => `${getKeycloakApiPath()}events/admin-config`,
  UPDATE_ADMIN_EVENT_CONFIG: () => `${getKeycloakApiPath()}events/admin-config`,
  FETCH_AVAILABLE_LISTENERS: () => `${getKeycloakApiPath()}available-event-listeners`,
  EVENT_LISTENER_CONFIG: () => `${getKeycloakApiPath()}events/event-listener-config`,
  GET_ENABLED_EVENTS_LIST: (pageNumber, pageSize) => `${getKeycloakApiPath()}events?page=${pageNumber}&size=${pageSize}`,
};

export const KeyCloakAPI = {
  GET_POLICY_DATA: (realm, product, policyName) => `${getKeycloakApiPath()}policy-data?product=${encodeURIComponent(product)}&policyName=${encodeURIComponent(policyName)}`,
  SAVE_POLICY: () => `${getKeycloakApiPath()}policies`,
  DELETE_POLICY: (policyId, realm, product) => `${getKeycloakApiPath()}policy/${policyId}?product=${product}`,
  GET_ROLES: (realm, product) => `${getKeycloakApiPath()}roles${product ? `?product=${encodeURIComponent(product)}` : ""}`,
};

export const PolicyAPI = {
  GET_POLICY_BY_ID: (realm, product, policyName) => `${getKeycloakApiPath()}policy-data?product=${encodeURIComponent(product)}&policyName=${encodeURIComponent(policyName)}`,
  CREATE_OR_UPDATE_POLICY: () => `${getKeycloakApiPath()}policies`,
  DELETE_POLICY: (policyId, realm, product) => `${getKeycloakApiPath()}policy/${policyId}?product=${product}`,
};
