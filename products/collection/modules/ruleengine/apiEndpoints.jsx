import {getRuleEngineApiPath} from '@shared/config/apiConstants';

export const RULEAPI = {
  submitRule: () => `${getRuleEngineApiPath()}create-rule`,
};

export const DMN_API_ENDPOINTS = {
  
  //dmn endpoints
  submitDMNRule: () => `${getRuleEngineApiPath()}rule-engine/dmn/upload`,
  updateDMNRule: () => `${getRuleEngineApiPath()}rule-engine/dmn/update`,
  deleteDMNRule: () => `${getRuleEngineApiPath()}rule-engine/dmn/delete`,
  getDMNFileNames: () => `${getRuleEngineApiPath()}rule-engine/dmn/fetch-dmn-list`,
  getDmnFileContent:()=> `${getRuleEngineApiPath()}rule-engine/dmn/dmn-json`,
  getDMNRuleVersions:()=> `${getRuleEngineApiPath()}rule-engine/dmn/get-all-versions`,
  getLatestDmnFileContent:()=> `${getRuleEngineApiPath()}rule-engine/dmn/dmn-current-json`,
  getDmnTypes:()=> `${getRuleEngineApiPath()}rule-engine/dmn/dmn-types`,
  getDmnDataTypes:()=> `${getRuleEngineApiPath()}rule-engine/dmn/dmn-datatypes`,
  
  //meta model endpoints
  getEntityData: () => `${getRuleEngineApiPath()}rule-engine/entities/attributes`,
  getEntityNames: () => `${getRuleEngineApiPath()}rule-engine/entities`,
  getModuleNames:()=> `${getRuleEngineApiPath()}rule-engine/dmn/fetch-modulenames`,
};


