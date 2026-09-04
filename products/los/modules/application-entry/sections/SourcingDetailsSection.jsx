import React from "react";
import { HDropdown, HTextField } from "@helix/component-library";
import FieldRow from "../components/FieldRow";
import SectionBlock from "../components/SectionBlock";
import { BRANCHES, CHANNELS } from "../constants/qdeOptions";

const SourcingDetailsSection = ({ form, setField }) => {
  const isDsa = form.channel === "DSA";
  const isRm = form.channel === "RM";

  return (
    <SectionBlock sectionKey="sourcing" titleKey="label.qde.section.sourcing">
      <FieldRow labelKey="label.qde.field.channel" required>
        <HDropdown
          name="channel"
          options={CHANNELS}
          value={form.channel}
          onChange={(e) => setField("channel", e.target.value)}
          required
          width="100%"
        />
      </FieldRow>

      <FieldRow labelKey="label.qde.field.sourcingBranch" required>
        <HDropdown
          name="sourcingBranch"
          options={BRANCHES}
          value={form.sourcingBranch}
          onChange={(e) => setField("sourcingBranch", e.target.value)}
          required
          width="100%"
        />
      </FieldRow>

      <FieldRow labelKey="label.qde.field.servicingBranch" required>
        <HDropdown
          name="servicingBranch"
          options={BRANCHES}
          value={form.servicingBranch}
          onChange={(e) => setField("servicingBranch", e.target.value)}
          required
          width="100%"
        />
      </FieldRow>

      {isDsa ? (
        <>
          <FieldRow labelKey="label.qde.field.channelName" required>
            <HTextField
              value={form.channelName}
              onChange={(e) => setField("channelName", e.target.value)}
              editable
              required
              width="100%"
            />
          </FieldRow>

          <FieldRow labelKey="label.qde.field.channelCode" required>
            <HTextField
              value={form.channelCode}
              onChange={(e) => setField("channelCode", e.target.value)}
              editable
              required
              width="100%"
            />
          </FieldRow>

          <FieldRow labelKey="label.qde.field.dsaMobile">
            <HTextField
              value={form.dsaMobile}
              onChange={(e) => setField("dsaMobile", e.target.value)}
              editable
              type="phone"
              length={10}
              width="100%"
            />
          </FieldRow>

          <FieldRow labelKey="label.qde.field.dsaEmail">
            <HTextField
              value={form.dsaEmail}
              onChange={(e) => setField("dsaEmail", e.target.value)}
              editable
              width="100%"
            />
          </FieldRow>
        </>
      ) : null}

      {isRm ? (
        <>
          <FieldRow labelKey="label.qde.field.rmName" required>
            <HTextField
              value={form.rmName}
              onChange={(e) => setField("rmName", e.target.value)}
              editable
              required
              type="name"
              width="100%"
            />
          </FieldRow>

          <FieldRow labelKey="label.qde.field.rmCode" required>
            <HTextField
              value={form.rmCode}
              onChange={(e) => setField("rmCode", e.target.value)}
              editable
              required
              width="100%"
            />
          </FieldRow>
        </>
      ) : null}
    </SectionBlock>
  );
};

export default SourcingDetailsSection;
