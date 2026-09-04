import { getCommonMasterApiPath } from '@shared/config/apiConstants';

export const PortfolioAPI = {
  Portfolio: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`
};

export const CurrencyMasterAPI = {
  currencyMaster: (screenMenuId ) => `${getCommonMasterApiPath()}col-common/${ screenMenuId }`,
};

export const SearchAPI = {
  fetchSearchCommonData: () => `${getCommonMasterApiPath()}col-common/fetchSearchCommonData`,
};

export const ProductMasterAPI = {
  ProductDetails: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`,
  fetchPortfolioDetails: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`,  
};

export const BucketMasterAPI = {
  BucketDetails: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`,
  fetchPortfolioDetails: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`,  
};

export const FeeMasterAPI = {
  feeMaster: (screenMenuId ) => `${getCommonMasterApiPath()}col-common/${screenMenuId }`,
};
export const HolidayMasterAPI = {
  Holidays: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`,
};

export const CollectorMasterAPI = {
  CollectorDetails: (screenMenuId ) =>`${getCommonMasterApiPath()}col-common/${screenMenuId }`,
};

export const StrategyDetailsMasterAPI = {
  fetchAllStrategyDetails: () => `${getCommonMasterApiPath()}col-common/fetchStrategyMasterDetails`,
  fetchStrategyDetails: () => `${getCommonMasterApiPath()}col-common/fetchStrategyDetails`,
  saveStrategyDetails: () => `${getCommonMasterApiPath()}col-common/saveStrategyDetails`,
  fetchDropdown: () => `${getCommonMasterApiPath()}col-common/fetchInitial`,
};

export const CollectionStrategiesAPI = {
  StrategyMasterDetails: (screenMenuId) =>`${getCommonMasterApiPath()}col-common/master/${screenMenuId}`,
  StrategyDetails: (screenMenuId) =>`${getCommonMasterApiPath()}col-common/${screenMenuId}`,
};

export const StrategyActionLimitMasterAPI = {
  saveStrategyActionLimitMaster: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`,
};
export const ThresholdLimitMasterAPI = {
  saveThresholdLimitMaster: () => `${getCommonMasterApiPath()}col-common/saveThresholdLimitRule`,
};
export const ManualRevisionPolicyAPI = {
  saveManualRevisionPolicyMaster: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`,
};
export const TransactionMasterAPI = {
  TransactionMaster: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`
};
export const BlockCodeMasterAPI = {
  BlockCode: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`,
};

export const WfStateMasterAPI = {
  WfStates: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`
};


export const EmployerMasterAPI={
  fetchEmployerDetails: (szEmployerCode,screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}?szEmployerCode=${szEmployerCode}`,
  saveEmployerDetails: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`,
  deleteEmployerDetails: (szEmployerCode,screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}?szEmployerCode=${szEmployerCode}`,
}

export const ManualStrategyActionPolicyAPI = {
  saveManualStrategyActionPolicy: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`,
  };
export const ProvisioningActionMasterAPI = {
  saveProvisioningActionMaster: () => `${getCommonMasterApiPath()}col-common/saveProvisioningActions`,
  fetchProvisioningActionMaster: () => `${getCommonMasterApiPath()}col-common/fetchProvisioningActions`,

};


 export const InstantUnsuspensionPolicyAPI = {
  saveInstantUnsuspensionPolicy: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`,
  };

  export const HostCodeMasterAPI = {
  HostCode: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`,
};

export const StrategyManagerAPI = {
  StrategyManager: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`,
};

export const StrategyActionMasterAPI = {
  StrategyActionMaster: (screenMenuId) => `${getCommonMasterApiPath()}col-masters/${screenMenuId}`,
  StrategyActionAccess: (screenMenuId, action) => `${getCommonMasterApiPath()}col-masters/${screenMenuId}/${action}`,
};

export const LeavePlannerAPI = {
  fetchLeaveByCollectorCode: () => `${getCommonMasterApiPath()}col-common/fetchLeaveByCollectorCode`,
  saveLeave: () => `${getCommonMasterApiPath()}col-common/saveLeave`,
}
export const MailMasterAPI = {
  MailMaster: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`,
};

export const ConfigurationAPI = {
  fetchSystemParamValues: () => `${getCommonMasterApiPath()}col-common/fetchSystemParamValues`,
  saveSystemParamValues: () => `${getCommonMasterApiPath()}col-common/saveSystemParams`,
};

export const PhasesAPI = {
  Phases: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`,
};

export const OrganizationMasterAPI = {
  OrganizationDetails: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`,
};

export const ReasonMasterAPI = {
  ReasonMasters: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`,
};

export const PolicyRuleAPI = {
  fetchDropdowns: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}/fetchdropdowns`,
  saveRule: (screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}`,
  fetchGridData: (szModuleCode=null, szCode=null, szType=null, screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}/fetchGridData?szModuleCode=${szModuleCode}&szCode=${szCode}&szType=${szType}`,
  Rule: (lnRuleSeqNo=null, screenMenuId) => `${getCommonMasterApiPath()}col-common/${screenMenuId}?lnRuleSeqNo=${lnRuleSeqNo}`,
};
