import SectionBlock from "./SectionBlock";
import DdeFieldGrid from "./DdeFieldGrid";
import { DDE_FIELDS } from "../constants/ddeFieldMetadata";

const fieldsForSection = (sectionConfig) => {
  if (sectionConfig.fieldNames?.length) {
    return DDE_FIELDS.filter((f) => sectionConfig.fieldNames.includes(f.name));
  }
  let list = DDE_FIELDS.filter((f) => f.section === sectionConfig.sectionFilter);
  if (sectionConfig.excludeFieldNames?.length) {
    list = list.filter((f) => !sectionConfig.excludeFieldNames.includes(f.name));
  }
  return list;
};

const DdeFormSection = ({ sectionConfig, icon, form, setField, errors, lookups, expanded, onExpandedChange }) => (
  <SectionBlock
    sectionKey={sectionConfig.key}
    titleKey={sectionConfig.titleKey}
    subTitleKey={sectionConfig.subTitleKey}
    icon={icon}
    defaultExpanded={false}
    expanded={expanded}
    onExpandedChange={onExpandedChange}
  >
    <DdeFieldGrid
      fields={fieldsForSection(sectionConfig)}
      form={form}
      setField={setField}
      errors={errors}
      lookups={lookups}
    />
  </SectionBlock>
);

export default DdeFormSection;
