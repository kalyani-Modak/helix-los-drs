import { lazy } from "react";

//Early Collection Modules
const Followup = lazy(() => import("@earlycollection/Followup"));
const ListView = lazy(() => import("@earlycollection/AccountList"));
const OverView = lazy(() => import("@earlycollection/OverViewDetails"));
const TagAccount = lazy(() => import("@earlycollection/TagAccount"));
const PaymentDetails = lazy(() => import("@earlycollection/PaymentDetails"));
const ExceptionHandling = lazy(() => import("@earlycollection/ExceptionHandling"));
const AddAssetScreen = lazy(() => import("@earlycollection/add-asset/AddAssetScreen"));
const CollateralDetails = lazy(() => import("@earlycollection/CollateralDetails"));
const UpdateAddress = lazy(() => import("@earlycollection/UpdateAddress"));
const GlobalActions = lazy(() => import("@earlycollection/global-action/GlobalActions"));
const ActionTypeMaster = lazy(() => import("@earlycollection/action-type-master/ActionTypeMasterScreen"));
const ResultMaster = lazy(() => import("@earlycollection/global-results/ResultMaster"));
const ResultCategoryMaster = lazy(() => import("@earlycollection/result-categories/ResultCategoryMaster"));
const Memos = lazy(() => import("@earlycollection/Memos"));
const AssetSummary = lazy(() => import("@earlycollection/AssetSummary"));
const ListOfCollateral = lazy(() => import("@earlycollection/ListOfCollateral"));
const FeeDetails = lazy(() => import("@earlycollection/FeeDetails"));
const PreviousActivities = lazy(() => import("@earlycollection/PreviousActivities"));
const AgeingDetails = lazy(() => import("@earlycollection/AgeingDetails"));
const AddThirdParty = lazy(() => import("@earlycollection/AddThirdParty"));
const ReasonMaster = lazy(() => import("@earlycollection/ReasonMaster"));
const EmploymentDetails = lazy(() => import("@earlycollection/EmploymentDetails"));
const CustomerInformation = lazy(() => import("@earlycollection/CustomerInformation"));
const FinancialSummary = lazy(() => import("@earlycollection/FinancialSummary"));
const PromisePolicy = lazy(() => import("@earlycollection/PromisePolicy"));
const ExclusionPolicy = lazy(() => import("@earlycollection/ExclusionPolicy"));
const MarkExclusion = lazy(() => import("@earlycollection/mark-exclusion/MarkExclusion"));
const Segmentation = lazy(() => import("@earlycollection/Segmentation"));
const AuthorizationPolicy = lazy(() => import("@earlycollection/AuthorizationPolicy"));
const Authorization = lazy(() => import("@earlycollection/Authorization"));
const AutoDialer = lazy(() => import("@earlycollection/AutoDialer"));
const CommunicationPreferences = lazy(() => import("@earlycollection/CommunicationPreferences"));
const CommonHeader = lazy(() => import("@earlycollection/CommonHeader"));
const PickupMaintenance = lazy(() => import("@earlycollection/PickupMaintenance"));
const ReallocateCase = lazy(() => import("@earlycollection/ReallocateCase"));
const ImmediateAttention = lazy(() => import("@earlycollection/ImmediateAttention"));
const StampStrategies = lazy(() => import("@earlycollection/StampStrategies"));
const BatchMaster = lazy(() => import("@batchframework/BatchMaster"));
const ProcessMaster = lazy(() => import("@batchframework/ProcessMaster"));
const PartitionMaster = lazy(() => import("@batchframework/PartitionMaster"));
const PartitionTypeMaster = lazy(() => import("@batchframework/PartitionTypeMaster"));
const BatchProcessMaster = lazy(() => import("@batchframework/BatchProcessMaster"));
const ApplicationQuickDataEntry = lazy(() => import("@los/ApplicationQuickDataEntry"));
const ApplicationDocumentUpload = lazy(() => import("@los/ApplicationDocumentUpload"));
const ReturnMailTracking = lazy(() => import("@earlycollection/ReturnMailTracking"));
const GenerateMail = lazy(() => import("@earlycollection/GenerateMail"));
const SupervisorIntervention = lazy(() => import("@earlycollection/SupervisorIntervention"));
const UploadDocument = lazy(() => import("@earlycollection/UploadDocument"));
const Escalations = lazy(() => import("@earlycollection/Escalations"));
const AIOverview = lazy(() => import("@earlycollection/AIOverview"));

//Common Master Modules
const PortfolioMaster = lazy(() => import("@common-master/PortfolioMaster"));
const ProductMaster = lazy(() => import("@common-master/ProductMaster"));
const CollectorMaster = lazy(() => import("@common-master/collector-master/CollectorMaster"));
const StrategyActionMaster = lazy(() => import("@common-master/StrategyActionMaster"));
const TransactionMaster = lazy(() => import("@common-master/TransactionMaster"));
const EmployerMaster = lazy(() => import("@common-master/EmployerMaster"));
const ManualStrategyActionPolicy = lazy(() => import("@common-master/ManualStrategyActionPolicy"));
const BucketMaster = lazy(() => import("@common-master/bucket-master/BucketMaster"));
const StrategyDetails = lazy(() => import("@common-master/StrategyDetails"));
const FeeMaster = lazy(() => import("@common-master/FeeMaster"));
const CurrencyMaster = lazy(() => import("@common-master/CurrencyMaster"));
const HolidayMaster = lazy(() => import("@common-master/HolidayMaster"));
const StrategyActionLimitMaster = lazy(() => import("@common-master/StrategyActionLimitMaster"));
const ThresholdLimitMaster = lazy(() => import("@common-master/ThresholdLimitMaster"));
const ManualRevisionPolicy = lazy(() => import("@common-master/ManualRevisionPolicyMaster"));
const BlockCodeMaster = lazy(() => import("@common-master/BlockCodeMaster"));
const HostCodeMaster = lazy(() => import("@common-master/HostCodeMaster"));
const InstantUnsuspensionPolicy = lazy(() => import("@common-master/InstantUnsuspensionPolicy"));
const ProvisioningActionMaster = lazy(() => import("@common-master/ProvisioningActionMaster"));
const ExposureStrategies = lazy(() => import("@common-master/ExposureStrategies"));
const StrategyManager = lazy(() => import("@common-master/StrategyManager"));
const LeavePlannerMaster = lazy(() => import("@common-master/LeavePlannerMaster"));
const MailMaster = lazy(() => import("@common-master/MailMaster"));
const GlobalStatesMaster = lazy(() => import("@common-master/GlobalStatesMaster"));
const PolicyRuleMaster = lazy(() => import("@common-master/PolicyRuleMaster"));
const PhaseMaster = lazy(() => import("@common-master/PhaseMaster"));
const OrganizationMaster = lazy(() => import("@common-master/OrganizationMaster"));
const SystemParameter = lazy(() => import("@common-master/SystemParametersPage"));
const CollectorMasterScreen = lazy(() => import("@common-master/collector-master/CollectorMasterScreen"));
const CollectionStrategiesList = lazy(() => import("@common-master/collection-strategies/CollectionStrategiesListScreen"));
const CollectionStrategyEdit = lazy(() => import("@common-master/collection-strategies/CollectionStrategyEditScreen"));

//Allocation Modules
const GroupHierarchy = lazy(() => import("@allocation/GroupHierarchy"));
const GroupAllocationMaster = lazy(() => import("@allocation/GroupAllocationMaster"));
const GroupAllocationRuleMaster = lazy(() => import("@allocation/GroupAllocationRuleMaster"));


export const collectionTransactionsRoutes=[
  { path: "followup/followup", component: Followup, module: "collection" },
  { path: "listView", component: ListView, module: "collection" },
  { path: "OverView", component: OverView, module: "collection" },  
  { path: "tagAccount", component: TagAccount, module: "collection" },
  { path: "payment-details", component: PaymentDetails, module: "collection" },
  { path: "exceptionMarking", component: ExceptionHandling, module: "collection" },
  { path: "assets", component: AddAssetScreen, module: "collection" },
  { path: "addAsset", component: AddAssetScreen, module: "collection" },
  { path: "collateralDetails", component: CollateralDetails, module: "collection" },
  { path: "updateaddress", component: UpdateAddress, module: "collection" },
  { path: "memos", component: Memos, module: "collection" },
  { path: "assetsummary", component: AssetSummary, module: "collection" },
  { path: "listofcollateral", component: ListOfCollateral, module: "collection" },
  { path: "FeeDetails", component: FeeDetails, module: "collection" },
  { path: "previousactivities", component: PreviousActivities, module: "collection" },
  { path: "ageingdetails", component: AgeingDetails, module: "collection" },
  { path: "addThirdParty", component: AddThirdParty, module: "collection" },
  { path: "employmentDetails", component: EmploymentDetails, module: "collection" },
  { path: "customerInformation", component: CustomerInformation, module: "collection" },
  { path: "financialsummary", component: FinancialSummary, module: "collection" },
  { path: "markExclusion", component: MarkExclusion, module: "collection" },
  { path: "authorization", component: Authorization, module: "collection" },
  { path: "auto-dialer", component: AutoDialer, module: "collection" },
  { path: "CommunicationPreferences", component: CommunicationPreferences, module: "collection" },
  { path: "commonheader", component: CommonHeader, module: "collection" },
  { path: "strategydetails", component: StrategyDetails, module: "collection" },
  { path: "exposureStrategies", component: ExposureStrategies, module: "collection" },
  { path: "PickupMaintenance", component: PickupMaintenance, module: "collection" },
  { path: "reallocateCase", component: ReallocateCase, module: "collection" },
  { path: "immediateAttention", component: ImmediateAttention, module: "collection" },
  { path: "stampStrategies", component: StampStrategies, module: "collection" },
  { path: "returnMailTracking", component: ReturnMailTracking, module: "collection" },
  { path: "generateMail", component: GenerateMail, module: "collection" },
  { path: "supervisorIntervention", component: SupervisorIntervention, module: "collection" },
  { path: "uploadDocument", component: UploadDocument, module: "collection" },
  { path: "escalations", component: Escalations, module: "collection" },
  { path: "aiOverview", component: AIOverview, module: "collection" }
];

export const collectionMasterRoutes=[
  { path: "actionmaster", component: GlobalActions, module: "collection" },
  { path: "actionTypeMaster", component: ActionTypeMaster, module: "collection" },
  { path: "resultmaster", component: ResultMaster, module: "collection" },
  { path: "resultcategorymaster", component: ResultCategoryMaster, module: "collection" },
  { path: "reasonMaster", component: ReasonMaster, module: "collection" },
  { path: "portfoliomaster", component: PortfolioMaster, module: "collection" },
  { path: "productmaster", component: ProductMaster, module: "collection" },
  { path: "collectormaster", component: CollectorMaster, module: "collection" },
  { path: "transactionmaster", component: TransactionMaster, module: "collection" },
  { path:"strategyActionMaster",component:StrategyActionMaster, module:"collection"},
  { path: "employerMaster", component: EmployerMaster, module: "collection" },
  { path: "bucketmaster", component: BucketMaster, module: "collection" },
  { path: "feeMaster", component: FeeMaster, module: "collection" },
  { path: "currencyMaster", component: CurrencyMaster, module: "collection" },
  { path: "holidayMaster", component: HolidayMaster, module: "collection" },
  { path: "strategyActionLimitMaster", component: StrategyActionLimitMaster, module: "collection" },
  { path: "thresholdLimitMaster", component: ThresholdLimitMaster, module: "collection" },
  { path: "blockCodeMaster", component: BlockCodeMaster, module: "collection" },
  { path: "hostCodeMaster", component: HostCodeMaster, module: "collection" },
  { path: "groupHierarchy", component: GroupHierarchy, module: "collection" },
  { path: "groupAllocationMaster", component: GroupAllocationMaster, module: "collection" },
  { path: "groupAllocationRuleMaster", component: GroupAllocationRuleMaster, module: "collection" },
  { path: "provisioningActionMaster", component: ProvisioningActionMaster, module: "collection" },
  { path: "PickupMaintenance", component: PickupMaintenance, module: "collection" },
  { path: "reallocateCase", component: ReallocateCase, module: "collection" },
  { path: "immediateAttention", component: ImmediateAttention, module: "collection" },
  { path: "stampStrategies", component: StampStrategies, module: "collection" },
  { path: "batchMaster", component: BatchMaster, module: "collection" },
  { path: "processMaster", component: ProcessMaster, module: "collection" },
  { path: "partitionMaster", component: PartitionMaster, module: "collection" },
  { path: "partitionTypeMaster", component: PartitionTypeMaster, module: "collection" },
  { path: "batchProcessMaster", component: BatchProcessMaster, module: "collection" },
  { path: "application-entry/quick-data-entry", component: ApplicationQuickDataEntry, module: "los" },
  { path: "application-entry/document-upload", component: ApplicationDocumentUpload, module: "los" },
  { path: "leavePlannerMaster", component: LeavePlannerMaster, module: "collection" },
  { path: "mailMaster", component: MailMaster, module: "collection" },
  { path: "globalStatesMaster", component: GlobalStatesMaster, module: "collection" },
  { path: "PolicyRuleMaster", component: PolicyRuleMaster, module: "collection" },
  { path: "phaseMaster", component: PhaseMaster, module: "collection" },
  { path: "orgMaster", component: OrganizationMaster, module: "collection" },
  { path: "SystemParameter", component: SystemParameter, module: "collection" },
  { path: "collectionStrategies/:strategyCode", component: CollectionStrategyEdit, module: "collection" },
  { path: "collectionStrategies", component: CollectionStrategiesList, module: "collection" },
  { path: "SystemParameter", component: SystemParameter, module: "collection" },
  { path: "PromisePolicy", component: PromisePolicy, module: "collection" },
  { path: "exclusionPolicy", component: ExclusionPolicy, module: "collection" },
  { path: "manualRevisionPolicy", component: ManualRevisionPolicy, module: "collection" },
  { path: "instantUnsuspensionPolicy", component: InstantUnsuspensionPolicy, module: "collection" },
  { path: "segmentation", component: Segmentation, module: "collection" },
  { path: "authorizationPolicy", component: AuthorizationPolicy, module: "collection" },
  { path: "manualStrategyActionPolicy", component: ManualStrategyActionPolicy, module: "collection" },
  {path: "strategyManager", component: StrategyManager, module: "collection" },
  { path: "strategyActionLimitMaster", component: StrategyActionLimitMaster, module: "collection" },
  {path: "collectorMasterScreen",component:CollectorMasterScreen ,module:"collection"}
];
