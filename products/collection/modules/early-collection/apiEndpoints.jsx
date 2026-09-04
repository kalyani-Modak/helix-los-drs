
import {
  getHelixEarlyCollectionsApiPath,
  getAiPredictApiPath,
} from '@shared/config/apiConstants'; 

export const FollowupAPI = {
  Followup: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-followup/${screenMenuId}`,
};

export const PickupMaintenanceAPI = {
  PickupApi: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-followup/${screenMenuId}`,
};

export const OverviewAPI = {
  fetchOverviewHeader: () => `${getHelixEarlyCollectionsApiPath()}ECF-overview/fetchOverviewHeaderDetails`,
  getAccountDetails: () => `${getHelixEarlyCollectionsApiPath()}ECF-overview/getAccountDetails`,
  getAddressDetails: () => `${getHelixEarlyCollectionsApiPath()}ECF-overview/getAddressDetails`,
  getCallDetails: () => `${getHelixEarlyCollectionsApiPath()}ECF-overview/getCallDetails`,
  fetchAccountRelationships: () => `${getHelixEarlyCollectionsApiPath()}ECF-overview/fetchAccountRelationships`,
  fetchCollectionSummary: () => `${getHelixEarlyCollectionsApiPath()}ECF-overview/fetchCollectionSummary`,
  fetchCustomerDetails: () => `${getHelixEarlyCollectionsApiPath()}ECF-overview/fetchCustomerDetails`,
  fetchPersonalDetails: () => `${getHelixEarlyCollectionsApiPath()}ECF-overview/fetchPersonalDetails`,
  getLinkedLoanDetails: () => `${getHelixEarlyCollectionsApiPath()}ECF-overview/getLinkedLoanDetails`,
  stickyNotes: () => `${getHelixEarlyCollectionsApiPath()}ECF-overview/stickyNotes`,
  getWorkFlowDetails: () => `${getHelixEarlyCollectionsApiPath()}ECF-overview/getWorkFlowDetails`,
  getDelinquencyInfo: () => `${getHelixEarlyCollectionsApiPath()}ECF-overview/getDelinquencyInfo`,
  getCardDetails: () => `${getHelixEarlyCollectionsApiPath()}ECF-overview/getCardDetails`,
  fetchAutoDetails: () => `${getHelixEarlyCollectionsApiPath()}ECF-overview/fetchAutoDetails`,
  fetchPropertyDetails: () => `${getHelixEarlyCollectionsApiPath()}ECF-overview/fetchPropertyDetails`,
};

export const AIPredictAPI = {
  predict: () => `${getAiPredictApiPath()}`,
  fetchCommonDTO: () => `${getHelixEarlyCollectionsApiPath()}fetchCommonDTO`,

};

export const TagAccountAPI = {
   TagAccount: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-followup/${screenMenuId}`,
  submitGroupTagDetails: () => `${getHelixEarlyCollectionsApiPath()}col-followup/ECF-TagAcc`
};

export const PaymentAPI = {
  Payment: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-accountmanagement/${screenMenuId}`,
};

export const ExceptionAPI = {
  Exception: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-accountmanagement/${screenMenuId}`
};

export const AuthorizationAPI = {
  Authorizations: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-common/${screenMenuId}`,
};

export const ColListingAPI = {
  ListView: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-listing/${screenMenuId}`,
};

export const AssetsAPI = {
  Assets: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-accountmanagement/${screenMenuId}`,
};

export const UpdateAddressAPI = {
  UpdateAddressApi: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-customeraddress/ECF-UpdateAddress`,
};

export const fetchCustomerAddressAPI = {
  fetchCustomerAddress: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-customeraddress/ECF-UpdateAddress/fetchCustomerAddressByAddressType`,
};


export const SearchAPI = {
  fetchSearchCommonData: () => `${getHelixEarlyCollectionsApiPath()}col-common/fetchSearchCommonData`,
};

export const ResultMasterAPI = {
  Result: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-followup/${screenMenuId}`
};

export const ActionMasterAPI = {
  ActionMaster: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-followup/${screenMenuId}`,
};

/** Action type system params (ACTION_TYPE); GET-only on backend until save endpoint exists. */
export const ActionTypeMasterAPI = {
  ActionTypes: (ScreenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-followup/${ScreenMenuId}`
};

export const MemosAPI = {
  MemosApi: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}customer-management/${screenMenuId}`,
};

export const AssetSummaryAPI = {
  AssetSummary: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-accountmanagement/${screenMenuId}`
};

export const CollateralAPI = {
  Collaterals: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-accountmanagement/${screenMenuId}`
};

export const FeeDetailsAPI = {
  FeeDetails: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-accountmanagement/${screenMenuId}`,
};


export const AgeingAPI = {
  AgeingDetails: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-accountmanagement/${screenMenuId}`,
};


export const FinancialSummaryAPI = {
  FinancialSummary: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-accountmanagement/${screenMenuId}`,
};


export const PreviousActivitiesAPI = {
  fetchPrevious: (page = 0, size = 5, screenMenuId) => `${getHelixEarlyCollectionsApiPath()}${screenMenuId}/fetchPreviousActivityDetails?page=${page}&size=${size}`,
};

export const ThirdPartyAPI = {
  AddThirdParty: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-followup/${screenMenuId}`
};




export const EmploymentDetailsAPI = {
  fetchCustomerDetails: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-customermanagement/${screenMenuId}`
};

export const FilterMasterAPI = {
  fetchFilterCommonData: () => `${getHelixEarlyCollectionsApiPath()}col-common/fetchFilterCommonData`,
  saveFilterCommonData: () => `${getHelixEarlyCollectionsApiPath()}col-common/saveFilterCommonData`,
};

export const AutoDialerAPI = {
  fetchAutoDialerDetails: () => `${getHelixEarlyCollectionsApiPath()}col-common/fetchAtdMstConfigData`,
  submitAutoDialerDetails: () => `${getHelixEarlyCollectionsApiPath()}col-common/saveAtdMstConfigData`
};

export const PromisePolicyRuleMasterAPI = {
  savePromisePolicyRuleMaster: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-followup/${screenMenuId}`,
  getDmnJson: () => `${getHelixEarlyCollectionsApiPath()}col-followup/fetchPromisePolicyRule`

};

export const AuthorizationPolicyRuleMasterAPI = {
  AuthorizationPolicyRuleMaster: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-followup/${screenMenuId}`,
};

export const ExclusionPolicyAPI = {
  ExclusionPolicy: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-followup/${screenMenuId}`
};

/** Account case exclusion maintenance (ExclusionController — accountmanagement module). */
export const MarkExclusionAPI = {
  MarkExclusionApi: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-accountmanagement/${screenMenuId}`,
  getActionTypes: () => `${getHelixEarlyCollectionsApiPath()}col-accountmanagement/getActionTypes`,
  getCategoryTypes: () => `${getHelixEarlyCollectionsApiPath()}col-accountmanagement/getCategoryTypes`,
};

export const ResultCategoryMasterAPI = {
  ResultCategoryDetails: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-followup/${screenMenuId}`,
};

export const SegmentationAPI = {
  SegmentationRule: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-followup/${screenMenuId}`,
 
};

export const ScheduleReminderAPI = {
  updateScheduleReminderDetails: () => `${getHelixEarlyCollectionsApiPath()}col-followup/updateScheduleReminderDetails`,
};

export const ReallocateCaseAPI = {
  reallocateCase: () => `${getHelixEarlyCollectionsApiPath()}col-followup/reallocateCase`,
};
export const ImmediateAttentionAPI = {
  updateImmediateAttentionDetails: () => `${getHelixEarlyCollectionsApiPath()}col-followup/updateImmediateAttentionDetails`,
}

export const StampStrategiesAPI = {
  updateStrategiesDetails: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-followup/${screenMenuId}`,
  /**
   * Strategy change history is derived from overview previous-activity rows whose
   * system remark matches the STMPSTR save path (StampStrategiesService).
   * @param {number} page
   * @param {number} size
   */
  fetchStrategyHistory: ( page = 0, size = 100, screenMenuId) =>
    `${getHelixEarlyCollectionsApiPath()}ECF-Activities/fetchPreviousActivityDetails?page=${page}&size=${size}`,
};

export const SendCommunicationAPI = {
  templates: () => `${getHelixEarlyCollectionsApiPath()}communication/templates`,
  send_email: () => `${getHelixEarlyCollectionsApiPath()}communication/send-email`,
};

/** Same contract as SendCommunicationAPI.send_email — Generate Mail screen entry point. */
export const GenerateMailAPI = {
  GenerateMailApi: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}communication/${screenMenuId}`,
};
export const ReturnMailTrackingAPI = {
  ReturnMailTracking: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}communication/${screenMenuId}`,
};
// CustomerInformation: adjust paths when Spring contracts are finalized (see customer-information/customerInformationPlaceholders.js).
export const CustomerInformationAPI = {
  fetchLinkedCustomers: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}customer-management/ECF-CustomerInformation`,
  // fetchCustomerDetails: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-customermanagement/${screenMenuId}`,
  // getLinkedLoanDetails: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}ECF-overview/getLinkedLoanDetails`,
};

export const CommunicationpreferencesAPI = {
  fetchCommunicationPreferences: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}customer-management/${screenMenuId}/fetchCommunicationPreferences`,
  saveCommunicationPreferences: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}customer-management/${screenMenuId}/saveCommunicationPreferences`
};

export const AssistedCallingAPI = {
  fetchCustomerDetails: (agreementId) =>
    `${getHelixEarlyCollectionsApiPath()}col-followup/getCustomerDetails/${encodeURIComponent(agreementId || "")}`,
};

export const DialerAPI = {
  clickToCall: () => `${getDialerApiPath()}v1/calls/click-to-call`,
};

/**
 * Account Upload Document — API contracts pending backend (helix-coll).
 * TODO: Confirm Spring paths and payloads with earlycollections-accountmanagement or dedicated document service.
 */
export const UploadDocumentAPI = {
  /** GET/POST initial screen: document types, uploaded document rows, metadata. */
  UploadDocApi: (screenMenuId) =>
    `${getHelixEarlyCollectionsApiPath()}customer-management/${screenMenuId}`,
  /** Multipart: file + account keys + documentType, referenceNo, remarks. */
  /** JSON: persist metadata / screen fields without new binary (or post-upload finalize). */
  // saveMetadata: () =>
  //   `${getHelixEarlyCollectionsApiPath()}col-customermanagement/saveUploadDocumentMetadata`,
  /** Optional: presigned URL or file stream — TODO contract. */
  downloadDocument: (screenMenuId, documentId, versionId) =>
    `${getHelixEarlyCollectionsApiPath()}customer-management/${screenMenuId}/retrieveDocument/${documentId}?versionId=${versionId}`,
};
export const FunctionFrameworkAPI = {
  fetchMenuFunctionJson: () => `${getHelixEarlyCollectionsApiPath()}function-framework/fetchFunctionMenuJson`,
  createAccountContext: () => `${getHelixEarlyCollectionsApiPath()}function-framework/createAccountContext`,
};
export const SupervisorInterventionAPI = {
  saveDetails: (screenMenuId) =>
    `${getHelixEarlyCollectionsApiPath()}col-followup/${screenMenuId}`,
};
export const EscalationAPI = {
  findEscalationsByAllocSeqNo: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-common/${screenMenuId}/findEscalationByAllocSeqNo`,
  updateEscalations: (screenMenuId) => `${getHelixEarlyCollectionsApiPath()}col-common/${screenMenuId}/updateEscalations`,
};
