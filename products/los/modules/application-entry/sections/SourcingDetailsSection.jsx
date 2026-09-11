import { HBox, HDropdown, HLabel, HTextField } from "@helix/component-library";
import SectionBlock from "../components/SectionBlock";
import { BRANCHES, CHANNELS } from "../constants/qdeOptions";

const SourcingDetailsSection = ({ form, setField }) => {
  const isDsa = form.channel === "DSA";
  const isRm = form.channel === "RM";
  const isDealer = form.channel === "Dealer";

  return (
    <SectionBlock sectionKey="sourcing" titleKey="label.qde.section.sourcing">
      <HBox sx={{ width: "100%", display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.channel" required align="left" colon={false} />
          <HDropdown
            name="channel"
            options={CHANNELS}
            value={form.channel}
            onChange={(e) => setField("channel", e.target.value)}
            required
            width="100%"
          />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.sourcingBranch" required align="left" colon={false} />
          <HDropdown
            name="sourcingBranch"
            options={BRANCHES}
            value={form.sourcingBranch}
            onChange={(e) => setField("sourcingBranch", e.target.value)}
            required
            width="100%"
          />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.servicingBranch" required align="left" colon={false} />
          <HDropdown
            name="servicingBranch"
            options={BRANCHES}
            value={form.servicingBranch}
            onChange={(e) => setField("servicingBranch", e.target.value)}
            required
            width="100%"
          />
        </HBox>

        {isDsa && (
          <>
            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
              <HLabel value="label.qde.field.channelName" required align="left" colon={false} />
              <HTextField
                value={form.channelName}
                onChange={(e) => setField("channelName", e.target.value)}
                editable
                required
                width="100%"
              />
            </HBox>

            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
              <HLabel value="label.qde.field.channelCode" required align="left" colon={false} />
              <HTextField
                value={form.channelCode}
                onChange={(e) => setField("channelCode", e.target.value)}
                editable
                width="100%"
              />
            </HBox>

            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
              <HLabel value="label.qde.field.dsaMobile" align="left" colon={false} />
              <HTextField
                value={form.dsaMobile}
                onChange={(e) => setField("dsaMobile", e.target.value)}
                editable
                type="phone"
                length={10}
                width="100%"
              />
            </HBox>

            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
              <HLabel value="label.qde.field.dsaEmail" align="left" colon={false} />
              <HTextField
                value={form.dsaEmail}
                onChange={(e) => setField("dsaEmail", e.target.value)}
                editable
                width="100%"
              />
            </HBox>
          </>
        )}

        {isRm && (
          <>
            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
              <HLabel value="label.qde.field.rmName" required align="left" colon={false} />
              <HTextField
                value={form.rmName}
                onChange={(e) => setField("rmName", e.target.value)}
                editable
                required
                type="name"
                width="100%"
              />
            </HBox>

            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
              <HLabel value="label.qde.field.rmCode" required align="left" colon={false} />
              <HTextField
                value={form.rmCode}
                onChange={(e) => setField("rmCode", e.target.value)}
                editable
                width="100%"
              />
            </HBox>
          </>
        )}
        {isDealer && (
          <>
            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
              <HLabel value="label.qde.field.dealerName" required align="left" colon={false} />
              <HTextField
                value={form.dealerName}
                onChange={(e) => setField("dealerName", e.target.value)}
                editable
                required
                type="name"
                width="100%"
              />
            </HBox>

            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
              <HLabel value="label.qde.field.dealerCode" required align="left" colon={false} />
              <HTextField
                value={form.dealerCode}
                onChange={(e) => setField("dealerCode", e.target.value)}
                editable
                width="100%"
              />
            </HBox>
          </>
        )}
      </HBox>
    </SectionBlock>
  );
};

export default SourcingDetailsSection;