import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import { useIntl } from "react-intl";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { HBox, HLabel, HButton, useToast, HDrawer, HDialog } from "@helix/component-library";
import LevelLadder from "./LevelLadder";
import { validateLevels } from "./groupHierarchy.mappers";

const HierarchyDefinitionDrawer = ({ open, hierarchy, roleOptions = [], onClose, onSave }) => {
  const intl = useIntl();
  const toast = useToast();
  const [levels, setLevels] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);

  useEffect(() => {
    if (open && hierarchy) {
      setLevels((hierarchy.levels || []).map((l) => ({ ...l })));
      setDirty(false);
      setConfirmDiscardOpen(false);
    }
  }, [open, hierarchy]);

  const warnings = useMemo(() => {
    const w = {};
    const seenUsers = new Map();
    levels.forEach((l) => {
      if (!l.roleLabel && !l.approverUserCode) return;
      if (!l.approverUserCode) {
        w[l.id] = intl.formatMessage({
          id: "label.GroupHierarchy.WarnPickApprover",
          defaultMessage: "Pick an approver",
        });
      } else if (seenUsers.has(l.approverUserCode)) {
        w[l.id] = intl.formatMessage(
          {
            id: "label.GroupHierarchy.WarnDuplicateApprover",
            defaultMessage: "Same approver as L{level}",
          },
          { level: seenUsers.get(l.approverUserCode) }
        );
      } else {
        seenUsers.set(l.approverUserCode, String(l.level));
      }
    });
    for (let i = 0; i < levels.length - 1; i++) {
      const cur = levels[i];
      const nxt = levels[i + 1];
      if (
        cur.approvalLimit != null &&
        nxt.approvalLimit != null &&
        Number(cur.approvalLimit) < Number(nxt.approvalLimit)
      ) {
        if (!w[cur.id]) {
          w[cur.id] = intl.formatMessage({
            id: "label.GroupHierarchy.WarnLimitLower",
            defaultMessage: "Limit lower than a subordinate level",
          });
        }
      }
    }
    return w;
  }, [levels, intl]);

  const handleChange = (next) => {
    setLevels(next);
    setDirty(true);
  };

  const attemptClose = () => {
    if (dirty) {
      setConfirmDiscardOpen(true);
      return;
    }
    onClose?.();
  };

  const handleCancelDiscard = () => {
    setConfirmDiscardOpen(false);
  };

  const handleConfirmDiscard = () => {
    setConfirmDiscardOpen(false);
    onClose?.();
  };

  const handleSave = () => {
    const err = validateLevels(levels);
    if (err) {
      toast.error(
        intl.formatMessage({
          id: err,
          defaultMessage:
            err === "error.GroupHierarchy.levelsRequired"
              ? "At least one level is required."
              : err === "error.GroupHierarchy.roleDuplicate"
                ? "Same role cannot be used in multiple levels."
              : "Each level requires role and approver.",
        })
      );
      return;
    }
    onSave?.(levels);
    onClose?.();
  };

  if (!hierarchy) return null;

  const warnCount = Object.keys(warnings).length;

  return (
    <HDrawer
      anchor="right"
      open={open}
      onClose={attemptClose}
      className="group-hierarchy-drawer"
      PaperProps={{ className: "group-hierarchy-drawer-paper" }}
    >
      <HBox className="group-hierarchy-drawer-header">
        <HBox className="group-hierarchy-drawer-title-block">
          <HLabel
            value={intl.formatMessage(
              {
                id: "label.GroupHierarchy.DefineTitle",
                defaultMessage: "Define hierarchy — {code}",
              },
              { code: hierarchy.hierarchyCode || "…" }
            )}
            colon={false}
          />
          <span className="group-hierarchy-drawer-subtitle">
            {hierarchy.description || ""}
          </span>
        </HBox>
        <button
          type="button"
          className="group-hierarchy-icon-btn"
          onClick={attemptClose}
          aria-label={intl.formatMessage({
            id: "label.GroupHierarchy.Cancel",
            defaultMessage: "Cancel",
          })}
        >
          <CloseIcon fontSize="small" />
        </button>
      </HBox>

      {levels.length > 0 ? (
        <HBox className="group-hierarchy-chip-strip">
          {levels.map((l, i) => (
            <HBox key={l.id} className="group-hierarchy-chip-row">
              <span className="group-hierarchy-chip">
                {l.roleLabel || `L${l.level}`}
              </span>
              {i < levels.length - 1 ? (
                <ChevronRightIcon className="group-hierarchy-chip-sep" fontSize="inherit" />
              ) : null}
            </HBox>
          ))}
        </HBox>
      ) : null}

      <HBox className="group-hierarchy-drawer-body">
        <p className="group-hierarchy-drawer-helper">
          {intl.formatMessage({
            id: "label.GroupHierarchy.LevelHelper",
            defaultMessage:
              "Level 1 is the highest authority in the chain. Approvals escalate downward through the levels until fully signed off.",
          })}
        </p>
        <LevelLadder
          levels={levels}
          roleOptions={roleOptions}
          onChange={handleChange}
          warnings={warnings}
        />
      </HBox>

      <HBox className="group-hierarchy-drawer-footer">
        <HBox className="group-hierarchy-drawer-footer-status">
          {warnCount > 0 ? (
            <span className="group-hierarchy-footer-warn">
              <WarningAmberIcon fontSize="inherit" />
              {intl.formatMessage(
                {
                  id: "label.GroupHierarchy.IssuesToReview",
                  defaultMessage: "{count} issues to review",
                },
                { count: warnCount }
              )}
            </span>
          ) : (
            <span className="group-hierarchy-footer-muted">
              {intl.formatMessage(
                {
                  id: "label.GroupHierarchy.LevelsConfigured",
                  defaultMessage: "{count} levels configured",
                },
                { count: levels.length }
              )}
            </span>
          )}
        </HBox>
        <HBox className="group-hierarchy-drawer-footer-actions">
          <HButton
            label="label.GroupHierarchy.Cancel"
            onClick={attemptClose}
            size="small"
            variant="text"
          />
          <HButton
            label="label.GroupHierarchy.SaveHierarchy"
            onClick={handleSave}
            size="small"
            variant="contained"
            disabled={levels.length === 0}
          />
        </HBox>
      </HBox>

      <HDialog
        open={confirmDiscardOpen}
        onClose={handleCancelDiscard}
        aria-labelledby="group-hierarchy-discard-title"
          title={intl.formatMessage({
            id: "label.GroupHierarchy.UnsavedChanges",
            defaultMessage: "Unsaved changes",
          })}
        titleProps={{ id: "group-hierarchy-discard-title" }}
        actions={
          <>
          <HButton
            label="label.GroupHierarchy.Cancel"
            onClick={handleCancelDiscard}
            size="small"
            variant="text"
          />
          <HButton
            label="label.GroupHierarchy.Discard"
            onClick={handleConfirmDiscard}
            size="small"
            variant="contained"
          />
          </>
        }
      >
        <Typography variant="body2">
          {intl.formatMessage({
            id: "message.GroupHierarchy.DiscardLevelChanges",
            defaultMessage: "Discard unsaved changes to this hierarchy?",
          })}
        </Typography>
      </HDialog>
    </HDrawer>
  );
};

HierarchyDefinitionDrawer.propTypes = {
  open: PropTypes.bool,
  hierarchy: PropTypes.object,
  roleOptions: PropTypes.array,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
};

export default HierarchyDefinitionDrawer;
