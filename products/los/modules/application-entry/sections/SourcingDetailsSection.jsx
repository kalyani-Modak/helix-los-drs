import { HBox, HDropdown, HLabel, HTextField } from "@helix/component-library";
import SectionBlock from "../components/SectionBlock";
import { BRANCHES, CHANNELS } from "../constants/qdeOptions";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";

const SourcingDetailsSection = ({ form, setField, errors = {} }) => {
  const isDsa = form.channel === "DSA";
  const isRm = form.channel === "RM";
  const isDealer = form.channel === "Dealer";
  const err = (name) => errors[name];

  return (
    <SectionBlock sectionKey="sourcing" titleKey="label.qde.section.sourcing" subTitleKey="label.qde.section.sourcing.subtitle" icon={<AccountTreeOutlinedIcon fontSize="small" />}>
      <HBox sx={{ width: "100%", display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.channel" required align="left" colon={false} />
          <HDropdown
            name="channel"
            options={CHANNELS}
            value={form.channel}
            onChange={(e) => setField("channel", e.target.value)}
            required
            error={Boolean(err("channel"))}
            width="100%"
            placeholder="Select channel"
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
            error={Boolean(err("sourcingBranch"))}
            width="100%"
            placeholder="Select branch"
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
            error={Boolean(err("servicingBranch"))}
            width="100%"
            placeholder="Select branch"
          />
        </HBox>

        {isDsa && (
          <>
            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
              <HLabel value="label.qde.field.dsaName" required align="left" colon={false} />
              <HTextField
                value={form.dsaName}
                onChange={(e) => setField("dsaName", e.target.value)}
                required
                error={Boolean(err("dsaName"))}
                width="100%"
                placeholder="salesofficer"
              />
            </HBox>

            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
              <HLabel value="label.qde.field.dsaCode" required align="left" colon={false} />
              <HTextField
                value={form.dsaCode}
                onChange={(e) => setField("dsaCode", e.target.value)}
                required
                error={Boolean(err("dsaCode"))}
                width="100%"
                placeholder="EMP-9AE607"
              />
            </HBox>

            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
              <HLabel value="label.qde.field.dsaMobile" align="left" colon={false} />
              <HTextField
                value={form.dsaMobile}
                onChange={(e) => setField("dsaMobile", e.target.value)}
                type="phone"
                length={10}
                width="100%"
                placeholder="9876543210"
              />
            </HBox>

            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
              <HLabel value="label.qde.field.dsaEmail" align="left" colon={false} />
              <HTextField
                value={form.dsaEmail}
                onChange={(e) => setField("dsaEmail", e.target.value)}
                width="100%"
                placeholder="salesofficer@gmail.com"
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
                required
                type="name"
                error={Boolean(err("rmName"))}
                width="100%"
                placeholder="salesofficer"
              />
            </HBox>

            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
              <HLabel value="label.qde.field.rmCode" required align="left" colon={false} />
              <HTextField
                value={form.rmCode}
                onChange={(e) => setField("rmCode", e.target.value)}
                required
                error={Boolean(err("rmCode"))}
                width="100%"
                placeholder="EMP-9AE607"
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
                error={Boolean(err("dealerName"))}
                width="100%"
                placeholder="Search dealer"
              />
            </HBox>

            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
              <HLabel value="label.qde.field.dealerCode" required align="left" colon={false} />
              <HTextField
                value={form.dealerCode}
                onChange={(e) => setField("dealerCode", e.target.value)}
                editable
                required
                error={Boolean(err("dealerCode"))}
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