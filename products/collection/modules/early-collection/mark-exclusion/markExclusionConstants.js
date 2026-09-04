/** Value + i18n id for dropdowns (labels resolved in components via intl). */

export const MARK_EXCLUSION_ACTION_TYPES = [
  { value: "SMS", labelId: "markExclusion.actionType.sms" },
  { value: "Mail", labelId: "markExclusion.actionType.mail" },
  { value: "Other", labelId: "markExclusion.actionType.other" },
  { value: "Workflow", labelId: "markExclusion.actionType.workflow" },
];

export const MARK_EXCLUSION_CATEGORY_BY_TYPE = {
  Workflow: ["Early Collection", "Late Collection"],
  SMS: ["Promotional", "Informational"],
  Mail: ["Promotional", "Informational"],
  Other: ["Promotional", "Informational"],
};
