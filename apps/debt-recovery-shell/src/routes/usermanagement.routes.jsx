import { lazy } from "react";

const CreateUser              = lazy(() => import("@usermanagement/CreateUser"));
const CreateResource          = lazy(() => import("@usermanagement/CreateResource"));
const CreateRole              = lazy(() => import("@usermanagement/CreateRole"));
const CreateScope             = lazy(() => import("@usermanagement/CreateScope"));
const CreatePolicy            = lazy(() => import("@usermanagement/Createpolicy"));
const PermissionWithScope     = lazy(() => import("@usermanagement/PermissionwithScope"));
const PermissionWithResource  = lazy(() => import("@usermanagement/PermissionwithResource"));
const ClientsScreen           = lazy(() => import("@usermanagement/ClientScreen"));
const ClientDetails           = lazy(() => import("@usermanagement/ClientDetails"));
const UserScreen              = lazy(() => import("@usermanagement/UserScreen"));
const CreateClient            = lazy(() => import("@usermanagement/CreateClient"));
const ShowSessionScreen       = lazy(() => import("@usermanagement/ShowSessionScreen"));
const ResetPassword           = lazy(() => import("@usermanagement/ResetPassword"));
const CreateRealm             = lazy(() => import("@usermanagement/CreateRealm"));
const DataTable               = lazy(() => import("@usermanagement/DataTable"));
const UserAssignedRoles       = lazy(() => import("@usermanagement/UserAssignedRoles"));
const AccessMenu              = lazy(() => import("@usermanagement/AccessMenu"));
const ModuleCards             = lazy(() => import("@usermanagement/ModuleCards"));
const PasswordManager         = lazy(() => import("@usermanagement/PasswordManager"));
const EventSettingsScreen     = lazy(() => import("@usermanagement/EventSettingsScreen"));
const SessionLimitManager     = lazy(() => import("@usermanagement/SessionLimitManager"));
const SessionTokenTimeout     = lazy(() => import("@usermanagement/SessionTokenTimeout"));
const SecurityDefences        = lazy(() => import("@usermanagement/SecurityDefences"));
const GroupComponent          = lazy(() => import("@usermanagement/GroupComponent"));
const WelcomePage             = lazy(() => import("@usermanagement/WelcomePage"));
const LoginScreen 			  = lazy(() => import("@usermanagement/LoginScreen"));
const Reports                 = lazy(() => import("@usermanagement/Reports"));
const TokenConfiguration      = lazy(() => import("@usermanagement/TokenConfiguration"));
const UserProfileAttributes   = lazy(() => import("@usermanagement/UserProfileAttributes"));
const AuthenticationFlows     = lazy(() => import("@usermanagement/AuthenticationFlows"));
const AuthenticationFlowDetails = lazy(() => import("@usermanagement/AuthenticationFlowDetails"));
const LdapProviders           = lazy(() => import("@usermanagement/LdapProviders"));
const LdapProviderDetail      = lazy(() => import("@usermanagement/LdapProviderDetail"));
const LdapMapperDetail        = lazy(() => import("@usermanagement/LdapMapperDetail"));
const UploadFederationUsers   = lazy(() => import("@usermanagement/UploadFederationUsers"));
const Dashboard               = lazy(() => import("@usermanagement/Dashboard"));

// Error pages from local folder
const UnauthorizedError       = lazy(() => import("../error-pages/UnauthorizedError"));
const ServerErrorPage         = lazy(() => import("../error-pages/ServerErrorPage"));

const userManagementRoutes = [
  { path: "login", component: LoginScreen, module: "usermanagement" },
  { path: "create-user", component: CreateUser, module: "usermanagement"  },
  { path: "create-user/:userId/:userNameId", component: CreateUser , module: "usermanagement"},
  { path: "reset-password/:userId/:userNameId", component: ResetPassword, module: "usermanagement" },

  { path: "clients", component: ClientsScreen, module: "usermanagement"  },
  { path: "client/:clientId1", component: ClientDetails, module: "usermanagement"  },
  { path: "create-client", component: CreateClient, module: "usermanagement"  },
  { path: "create-client/:clientId1", component: CreateClient, module: "usermanagement"  },
  { path: "create-resource", component: CreateResource, module: "usermanagement"  },
  { path: "create-resource/:resourceId", component: CreateResource, module: "usermanagement"  },
  { path: "role", component: CreateRole, module: "usermanagement"  },
  { path: "role/:roleId", component: CreateRole, module: "usermanagement"  },
  { path: "scope", component: CreateScope, module: "usermanagement"  },
  { path: "scope/:scopeId", component: CreateScope, module: "usermanagement"  },
  { path: "policy", component: CreatePolicy, module: "usermanagement"  },
  { path: "policy/:policyId", component: CreatePolicy, module: "usermanagement"  },
  { path: "permission-scope", component: PermissionWithScope, module: "usermanagement"  },
  { path: "permission-resource", component: PermissionWithResource, module: "usermanagement"  },
  { path: "permission-resource/:permissionResourceId", component: PermissionWithResource, module: "usermanagement"  },
  
  { path: "users", component: UserScreen, module: "usermanagement"  },
  { path: "upload-federation-users", component: UploadFederationUsers, module: "usermanagement" },

  { path: "sessions", component: ShowSessionScreen, module: "usermanagement"  },
  { path: "create-realm", component: CreateRealm, module: "usermanagement"  },
  { path: "data", component: DataTable, module: "usermanagement"  },
  { path: "user-roles/:userId/:userNameId", component: UserAssignedRoles, module: "usermanagement"  },
  { path: "access", component: AccessMenu, module: "usermanagement"  },
  { path: "token-config", component: TokenConfiguration, module: "usermanagement" },
  { path: "user-profile-attributes", component: UserProfileAttributes, module: "usermanagement" },
  { path: "cards", component: ModuleCards, module: "usermanagement"  },
  { path: "event", component: EventSettingsScreen, module: "usermanagement"  },
  { path: "group", component: GroupComponent, module: "usermanagement"  },
  { path: "session-limit", component: SessionLimitManager, module: "usermanagement"  },
  { path: "session-token-timeout", component: SessionTokenTimeout, module: "usermanagement"  },
  { path: "security-defences", component: SecurityDefences, module: "usermanagement"  },
  { path: "password-policy", component: PasswordManager, module: "usermanagement"  },
  { path: "authentication-flows", component: AuthenticationFlows, module: "usermanagement" },
  { path: "authentication-flows/:id", component: AuthenticationFlowDetails, module: "usermanagement" },
  { path: "ldap-providers", component: LdapProviders, module: "usermanagement" },
  { path: "ldap-providers/:providerId", component: LdapProviderDetail, module: "usermanagement" },
  { path: "ldap-providers/:providerId/mappers/new/:mapperTypeId", component: LdapMapperDetail, module: "usermanagement" },
  { path: "ldap-providers/:providerId/mappers/:mapperId", component: LdapMapperDetail, module: "usermanagement" },
  { path: "reports", component: Reports, module: "usermanagement" },
  { path: "dashboard", component: Dashboard, module: "usermanagement" },

  { path: "unauthorized", component: UnauthorizedError, module: "usermanagement"  },
  { path: "welcomepage", component: WelcomePage, module: "usermanagement"  },
  { path: "server-error", component: ServerErrorPage, module: "usermanagement"  },
];

export default userManagementRoutes;
