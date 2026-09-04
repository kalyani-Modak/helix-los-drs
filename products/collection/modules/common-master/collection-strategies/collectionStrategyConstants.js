let conditionSeq = 0;

export const createConditionId = () =>
  `c-${Date.now().toString(36)}-${(conditionSeq++).toString(36)}`;

export const emptyCondition = () => ({
  id: createConditionId(),
  field: CRITERIA_FIELDS[0],
  operator: "=",
  value: "",
  conjunction: "AND",
});

export const emptyScheduleRow = () => ({
  key: `new-${Date.now()}`,
  tempId: `new-${Date.now()}`,
  szActionCode: "",
  szChannel: "",
  nOnDay: "",
  szReferenceDate: "",
  nRequiresAuthorization: false,
  szAllocateTo: "",
  bAllocate: false,
  szHolidayTreatmentBehavior: "",
  szOnExclusion: "",
  szPhase: "",
  szDependsOn: "",
  szSuccessors: "",
  szPerformOnNWD: false,
});
