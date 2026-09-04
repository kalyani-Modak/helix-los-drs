
import { getAllocationApiPath } from '@shared/config/apiConstants';

export const GroupHierarchyAPI = {
  GroupHierarchyDetails: (screenMenuId)=> `${getAllocationApiPath()}col-masters/${screenMenuId}`,
};

export const GroupAllocationRuleMasterAPI = {
  fetchEntityDetails: () => `${getAllocationApiPath()}col-masters/fetchEntityDetails`,
  saveGroupAllocationRuleMaster: (screenMenuId) => `${getAllocationApiPath()}col-masters/${screenMenuId}`,

};

export const GroupConfigAPI = {
  Allocation: (screenMenuId) =>
    `${getAllocationApiPath()}col-masters/${screenMenuId}`,

  fetchGroupByCompositeKey: (moduleCode, businessUnitCode, groupCode) =>
    `${getAllocationApiPath()}col-masters/${moduleCode}/${businessUnitCode}/${groupCode}`,
};

export const GroupUsersAPI = {
  Allocation: (screenMenuId) =>
    `${getAllocationApiPath()}col-masters/group-users/${screenMenuId}`,

};
