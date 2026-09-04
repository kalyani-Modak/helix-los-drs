import { cX as getAllocationApiPath } from "./index-BhdgJqva.js";
const GroupHierarchyAPI = {
  GroupHierarchyDetails: (screenMenuId) => `${getAllocationApiPath()}col-masters/${screenMenuId}`
};
const GroupAllocationRuleMasterAPI = {
  fetchEntityDetails: () => `${getAllocationApiPath()}col-masters/fetchEntityDetails`,
  saveGroupAllocationRuleMaster: (screenMenuId) => `${getAllocationApiPath()}col-masters/${screenMenuId}`
};
const GroupConfigAPI = {
  Allocation: (screenMenuId) => `${getAllocationApiPath()}col-masters/${screenMenuId}`,
  fetchGroupByCompositeKey: (moduleCode, businessUnitCode, groupCode) => `${getAllocationApiPath()}col-masters/${moduleCode}/${businessUnitCode}/${groupCode}`
};
export {
  GroupAllocationRuleMasterAPI as G,
  GroupConfigAPI as a,
  GroupHierarchyAPI as b
};
