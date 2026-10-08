import { useEffect, useRef, useState } from "react";
import { Grid,IconButton } from "@mui/material";
import { HBox, HButton, HLabel, useDrsTheme } from "@helix/component-library";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import UnfoldMoreOutlinedIcon from "@mui/icons-material/UnfoldMoreOutlined";
import UnfoldLessOutlinedIcon from "@mui/icons-material/UnfoldLessOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SectionBlock from "../components/SectionBlock";
import DdePartyApplicantSections from "../components/DdePartyApplicantSections";
import { emptyCoApplicant, emptyGuarantor, partyDisplayName } from "../utils/ddePartyState";
import { partySubsections } from "../utils/ddePartyFields";

const DdePartyListSection = ({
  variant,
  titleKey,
  subTitleKey,
  items = [],
  borrower,
  onAdd,
  onRemove,
  onChange,
  lookups,
  expandedSections,
  onSectionExpandedChange,
}) => {
  const { colors, text, border, action } = useDrsTheme();
  const [openPartyIds, setOpenPartyIds] = useState(() => new Set(items[0]?.id ? [items[0].id] : []));
  const initializedPartyAccordion = useRef(false);

  useEffect(() => {
    if (!initializedPartyAccordion.current && items.length > 0) {
      initializedPartyAccordion.current = true;
      setOpenPartyIds((prev) => (prev.size > 0 ? prev : new Set([items[0].id])));
    }
  }, [items]);

  const createParty = () => (variant === "co" ? emptyCoApplicant() : emptyGuarantor());
  const optionLabel = (type, value) =>
    (lookups?.[type] || []).find((option) => option.value === value)?.label || "";
  const isNonEarning = (party) =>
    variant === "co" &&
    (lookups?.["los.coapplicanttype"] || []).find((option) => option.value === party.type)
      ?.label === "Non-Earning";

  const handleAdd = () => {
    const party = createParty();
    onAdd(party);
    setOpenPartyIds((prev) => new Set([...prev, party.id]));
  };

  const updateParty = (id, patch) => {
    onChange(items.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const setPartySectionsExpanded = (party, isExpanded) => {
    partySubsections(variant, isNonEarning(party)).forEach((subsection) => {
      onSectionExpandedChange(`${variant}-${party.id}-${subsection.key}`, isExpanded);
    });
  };

  return (
    <HBox
      sx={{
        width: "100%",
        mb: 2,
        border: `1px solid ${border.control}`,
        borderRadius: 2,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <HBox
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          px: 2,
          py: 1.5,
          boxSizing: "border-box",
        }}
      >
        <HBox sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
          <HBox
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              flexShrink: 0,
              borderRadius: 1,
              color: colors.primary,
              backgroundColor: action.hover,
            }}
          >
            {variant === "co" ? (
              <PersonOutlineOutlinedIcon fontSize="small" />
            ) : (
              <ShieldOutlinedIcon fontSize="small" />
            )}
          </HBox>
          <HBox sx={{ display: "flex", flexDirection: "column" }}>
            <HLabel
              value={titleKey}
              align="left"
              colon={false}
              sx={{ fontWeight: "bold",fontSize: 15, }}
            />
            <HLabel
              value={subTitleKey}
              align="left"
              colon={false}
              sx={{ fontSize: 11, color: text.secondary }}
            />
          </HBox>
        </HBox>
        <HButton
          label={variant === "co" ? "label.dde.button.addCoApplicant" : "label.dde.button.addGuarantor"}
          variant="outlined"
          size="small"
          inline
          onClick={handleAdd}
          startIcon={<PersonAddAltIcon fontSize="small" />}
        />
      </HBox>

      <HBox sx={{ px: 2, pb: 2, boxSizing: "border-box" }}>
        {items.length === 0 ? (
          <HBox
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 50,
              width: "100%",
              border: `1px dashed ${border.control}`,
              borderRadius: 1,
              backgroundColor: action.hover,
              boxSizing: "border-box",
            }}
          >
            <HLabel
              value={variant === "co" ? "label.dde.coApplicant.empty" : "label.dde.guarantor.empty"}
              align="center"
              colon={false}
              sx={{ fontSize: 12, color: text.secondary }}
            />
          </HBox>
        ) : (
          <Grid container spacing={1.4} sx={{ width: "100%" }}>
            {items.map((party, index) => {
              const name = partyDisplayName(party);
              const isOpen = openPartyIds.has(party.id);
              const relationshipLabel = optionLabel(
                variant === "co" ? "los.coapplicant.relationship" : "los.guarantor.relationship",
                party.relationship
              );
              const typeLabel = variant === "co"
                ? optionLabel("los.coapplicanttype", party.type)
                : "";
              const headerLabel =
                variant === "co"
                  ? `Co-Applicant #${index + 1}${name ? ` — ${name}` : ""}${relationshipLabel ? ` (${relationshipLabel})` : ""}${typeLabel ? ` — ${typeLabel}` : ""}`
                  : `Guarantor #${index + 1}${name ? ` — ${name}` : ""}${relationshipLabel ? ` (${relationshipLabel})` : ""}`;

              return (
                <Grid key={party.id} size={12}>
                  <SectionBlock
                    sectionKey={`${variant}-party-${party.id}`}
                    title={headerLabel}
                    defaultExpanded
                    expanded={isOpen}
                    headerActionWidth={112}
                    onExpandedChange={(nextExpanded) =>
                      setOpenPartyIds((prev) => {
                        const next = new Set(prev);
                        if (nextExpanded) {
                          next.add(party.id);
                        } else {
                          next.delete(party.id);
                        }
                        return next;
                      })
                    }
                    headerAction={
                      <IconButton
                        size="small"
                        onClick={() => {
                          onRemove(party.id);
                          setOpenPartyIds((prev) => {
                            const next = new Set(prev);
                            next.delete(party.id);
                            return next;
                          });
                        }}
                        sx={{color: colors.primary,backgroundColor: action.hover,
                           border: `1px solid ${border.control}`,borderRadius: 1,
                        }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <Grid container spacing={1.4}>
                      <Grid
                        size={12}
                        container
                        justifyContent="flex-end"
                        spacing={1}
                        sx={{ mb: 1 }}
                      >
                        <HButton
                          label="label.dde.button.expandAll"
                          variant="outlined"
                          size="small"
                          inline
                          startIcon={<UnfoldMoreOutlinedIcon fontSize="small" />}
                          onClick={() => setPartySectionsExpanded(party, true)}
                        />
                        <HButton
                          label="label.dde.button.collapseAll"
                          variant="outlined"
                          size="small"
                          inline
                          startIcon={<UnfoldLessOutlinedIcon fontSize="small" />}
                          onClick={() => setPartySectionsExpanded(party, false)}
                        />
                      </Grid>
                      {isOpen ? (
                        <Grid size={12}>
                          <DdePartyApplicantSections
                            party={party}
                            variant={variant === "co" ? "co" : "guarantor"}
                            borrower={borrower}
                            onUpdate={(patch) => updateParty(party.id, patch)}
                            lookups={lookups}
                            expandedSections={expandedSections}
                            onSectionExpandedChange={onSectionExpandedChange}
                          />
                        </Grid>
                      ) : null}
                    </Grid>
                  </SectionBlock>
                </Grid>
              );
            })}
          </Grid>
        )}
      </HBox>
    </HBox>
  );
};

export default DdePartyListSection;
