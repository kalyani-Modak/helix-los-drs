import { c$ as getCommonMasterApiPath } from "./index-BhdgJqva.js";
const PortfolioAPI = {
  Portfolio: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`
};
const CurrencyMasterAPI = {
  currencyMaster: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`
};
const ProductMasterAPI = {
  ProductDetails: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`,
  fetchPortfolioDetails: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`
};
const BucketMasterAPI = {
  BucketDetails: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`,
  fetchPortfolioDetails: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`
};
const FeeMasterAPI = {
  feeMaster: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`
};
const HolidayMasterAPI = {
  Holidays: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`
};
const CollectorMasterAPI = {
  CollectorDetails: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`
};
const StrategyDetailsMasterAPI = {
  fetchAllStrategyDetails: () => `${getCommonMasterApiPath()}col-common/fetchStrategyMasterDetails`,
  fetchStrategyDetails: () => `${getCommonMasterApiPath()}col-common/fetchStrategyDetails`,
  saveStrategyDetails: () => `${getCommonMasterApiPath()}col-common/saveStrategyDetails`,
  fetchDropdown: () => `${getCommonMasterApiPath()}col-common/fetchInitial`
};
const CollectionStrategiesAPI = {
  StrategyMasterDetails: (screenMenuId) => `${getCommonMasterApiPath()}col-common/master/${screenMenuId}`,
  StrategyDetails: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`
};
const StrategyActionLimitMasterAPI = {
  saveStrategyActionLimitMaster: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`
};
const ThresholdLimitMasterAPI = {
  saveThresholdLimitMaster: () => `${getCommonMasterApiPath()}col-common/saveThresholdLimitRule`
};
const ManualRevisionPolicyAPI = {
  saveManualRevisionPolicyMaster: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`
};
const TransactionMasterAPI = {
  TransactionMaster: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`
};
const BlockCodeMasterAPI = {
  BlockCode: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`
};
const WfStateMasterAPI = {
  WfStates: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`
};
const EmployerMasterAPI = {
  fetchEmployerDetails: (szEmployerCode, screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}?szEmployerCode=${szEmployerCode}`,
  saveEmployerDetails: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`,
  deleteEmployerDetails: (szEmployerCode, screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}?szEmployerCode=${szEmployerCode}`
};
const ManualStrategyActionPolicyAPI = {
  saveManualStrategyActionPolicy: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`
};
const ProvisioningActionMasterAPI = {
  saveProvisioningActionMaster: () => `${getCommonMasterApiPath()}col-common/saveProvisioningActions`,
  fetchProvisioningActionMaster: () => `${getCommonMasterApiPath()}col-common/fetchProvisioningActions`
};
const InstantUnsuspensionPolicyAPI = {
  saveInstantUnsuspensionPolicy: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`
};
const HostCodeMasterAPI = {
  HostCode: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`
};
const StrategyManagerAPI = {
  StrategyManager: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`
};
const StrategyActionMasterAPI = {
  StrategyActionMaster: (screenMenuId) => `${getCommonMasterApiPath()}col-masters/${screenMenuId}`,
  StrategyActionAccess: (screenMenuId, action) => `${getCommonMasterApiPath()}col-masters/${screenMenuId}/${action}`
};
const LeavePlannerAPI = {
  fetchLeaveByCollectorCode: () => `${getCommonMasterApiPath()}col-common/fetchLeaveByCollectorCode`,
  saveLeave: () => `${getCommonMasterApiPath()}col-common/saveLeave`
};
const MailMasterAPI = {
  MailMaster: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`
};
const ConfigurationAPI = {
  fetchSystemParamValues: () => `${getCommonMasterApiPath()}col-common/fetchSystemParamValues`,
  saveSystemParamValues: () => `${getCommonMasterApiPath()}col-common/saveSystemParams`
};
const PhasesAPI = {
  Phases: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`
};
const OrganizationMasterAPI = {
  OrganizationDetails: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`
};
const ReasonMasterAPI = {
  ReasonMasters: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`
};
const PolicyRuleAPI = {
  fetchDropdowns: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}/fetchdropdowns`,
  saveRule: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`,
  fetchGridData: (szModuleCode = null, szCode = null, szType = null, screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}/fetchGridData?szModuleCode=${szModuleCode}&szCode=${szCode}&szType=${szType}`,
  Rule: (lnRuleSeqNo = null, screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}?lnRuleSeqNo=${lnRuleSeqNo}`
};
export {
  BlockCodeMasterAPI as B,
  CollectionStrategiesAPI as C,
  EmployerMasterAPI as E,
  FeeMasterAPI as F,
  HolidayMasterAPI as H,
  InstantUnsuspensionPolicyAPI as I,
  LeavePlannerAPI as L,
  MailMasterAPI as M,
  OrganizationMasterAPI as O,
  PhasesAPI as P,
  ReasonMasterAPI as R,
  StrategyActionLimitMasterAPI as S,
  ThresholdLimitMasterAPI as T,
  WfStateMasterAPI as W,
  BucketMasterAPI as a,
  CollectorMasterAPI as b,
  ConfigurationAPI as c,
  CurrencyMasterAPI as d,
  HostCodeMasterAPI as e,
  ManualRevisionPolicyAPI as f,
  ManualStrategyActionPolicyAPI as g,
  PolicyRuleAPI as h,
  PortfolioAPI as i,
  ProductMasterAPI as j,
  ProvisioningActionMasterAPI as k,
  StrategyActionMasterAPI as l,
  StrategyDetailsMasterAPI as m,
  StrategyManagerAPI as n,
  TransactionMasterAPI as o
};
