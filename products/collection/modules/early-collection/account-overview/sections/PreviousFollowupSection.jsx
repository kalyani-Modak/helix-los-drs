import React, { useEffect, useMemo, useState } from "react";
import { Chip } from "@mui/material";
import { History, EventAvailable } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { HAxiosService, HBox, HLabel, OverviewField, OverviewSectionCard } from "@helix/component-library";
import { FollowupAPI } from "../../apiEndpoints";
import { formatDate, formatDateTime } from "../overviewApiHelpers";
import { useIntl } from "react-intl";
 import { useLocation } from "react-router-dom";

function resultTone(result = "") {
  const value = String(result).toLowerCase();
  if (value.includes("promise") || value.includes("paid")) {
    return { bg: "#dcfce7", color: "#15803d" };
  }
  if (value.includes("visit") || value.includes("schedule")) {
    return { bg: "#dbeafe", color: "#1d4ed8" };
  }
  return { bg: "#fef3c7", color: "#b45309" };
}

export default function PreviousFollowupSection() {
  const { selectedRow } = useSelector((s) => s.account);
  const intl = useIntl();
  const [state, setState] = useState({ loading: false, row: null, error: null });
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  useEffect(() => {
    let active = true;
    if (!selectedRow) {
      setState({ loading: false, row: null, error: null });
      return undefined;
    }

 

    setState({ loading: true, row: null, error: null });
    HAxiosService.GET(FollowupAPI.Followup(screenMenuId) + `/fetchFollowupHisForAcct`)
      .then((res) => {
        const rows = Array.isArray(res?.data?.responseJson) ? res.data.responseJson : [];
        const latest = [...rows].sort((a, b) => {
          const left = new Date(b?.dtAction || 0).getTime();
          const right = new Date(a?.dtAction || 0).getTime();
          return left - right;
        })[0] || null;

        if (active) setState({ loading: false, row: latest, error: null });
      })
      .catch((error) => {
        if (active) {
          setState({
            loading: false,
            row: null,
            error:
              error?.message ||
              intl.formatMessage({
                id: "label.Overview.previous_followup.load_error",
                defaultMessage: "Unable to load previous follow-up details",
              }),
          });
        }
      });

    return () => {
      active = false;
    };
  }, [intl, selectedRow]);

     useEffect(()=>{
          console.log("PreviousFollowupsection------------------------------------------------",screenMenuId);
        },[])

  const tone = useMemo(() => resultTone(state.row?.szResultCode), [state.row?.szResultCode]);

  return (
    <OverviewSectionCard
      title={intl.formatMessage({
        id: "label.Overview.sections.previous_followup",
        defaultMessage: "Previous Followup",
      })}
      icon={History}
      accentColor="#2563eb"
      subtitle={intl.formatMessage({
        id: "label.Overview.previous_followup.subtitle",
        defaultMessage: "Latest action, next planned step and recovery result from follow-up history.",
      })}
      loading={state.loading}
      error={state.error}
      minHeight={state.row ? 108 : 48}
      emptyMinHeight={46}
      action={
        state.row?.szResultCode ? (
          <Chip
            size="small"
            label={state.row.szResultCode}
            sx={{
              height: 22,
              bgcolor: tone.bg,
              color: tone.color,
              fontSize: 10,
              fontWeight: 700,
            }}
          />
        ) : null
      }
    >
      {!state.row ? (
        <HLabel 
          value={intl.formatMessage({
            id: "label.Overview.previous_followup.empty",
            defaultMessage: "No follow-up history is available for this account yet.",
          })}
          colon={false}
          align='left'
        />
      ) : (
        <HBox sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <HBox
            sx={{
              display: "flex",
              gap: 0.75,
              flexWrap: "wrap",
            }}
          >
            <Chip
              size="small"
              label={intl.formatMessage(
                { id: "label.Overview.previous_followup.action_chip", defaultMessage: "Action: {action}" },
                { action: state.row.szActionCode || "--" }
              )}
              sx={{
                height: 22,
                bgcolor: "#dbeafe",
                color: "#1d4ed8",
                fontSize: 9,
                fontWeight: 800,
              }}
            />
            <Chip
              size="small"
              label={
                state.row.dtNextAction
                  ? intl.formatMessage(
                      { id: "label.Overview.previous_followup.next_chip", defaultMessage: "Next: {date}" },
                      { date: formatDate(state.row.dtNextAction) }
                    )
                  : intl.formatMessage({
                      id: "label.Overview.previous_followup.next_not_planned",
                      defaultMessage: "Next: Not planned",
                    })
              }
              sx={{
                height: 22,
                bgcolor: "#ede9fe",
                color: "#6d28d9",
                fontSize: 9,
                fontWeight: 800,
              }}
            />
          </HBox>

          <HBox
            sx={{
              display: "grid",
              gap: 1.5,
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
            }}
          >
            <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.last_action", defaultMessage: "Last Action" })} value={state.row.szActionCode} />
            <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.last_action_date", defaultMessage: "Last Action Date" })} value={formatDateTime(state.row.dtAction)} />
            <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.logged_in_user", defaultMessage: "Logged In User" })} value={state.row.szLogedInUser || "ADMIN"} />
            <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.action_planned", defaultMessage: "Action Planned" })} value={state.row.szNextActionCode} />
            <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.planned_date", defaultMessage: "Planned Date" })} value={formatDateTime(state.row.dtNextAction)} />
            <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.result", defaultMessage: "Result" })} value={state.row.szResultCode} />
          </HBox>

          <HBox
            sx={{
              borderRadius: 2,
              px: 1.25,
              py: 1,
              border: "1px solid rgba(37, 99, 235, 0.10)",
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            <EventAvailable sx={{ fontSize: 18, color: "#2563eb", mt: 0.2 }} />
            <HBox>
              <HLabel
                value={intl.formatMessage({
                  id: "label.Overview.previous_followup.planning_note",
                  defaultMessage: "Planning Note",
                })}
                colon={false}
                align="left"
                sx={{ textTransform: "uppercase" }}
              />
              <HLabel
                value={state.row.szNextActionCode
                  ? intl.formatMessage(
                      {
                        id: "label.Overview.previous_followup.planning_note_scheduled",
                        defaultMessage: "{action} scheduled for {date}.",
                      },
                      { action: state.row.szNextActionCode, date: formatDate(state.row.dtNextAction) }
                    )
                  : intl.formatMessage({
                      id: "label.Overview.previous_followup.planning_note_empty",
                      defaultMessage: "No next action has been scheduled.",
                    })}
                colon={false}
                align="left"
                sx={{ mt: 0.5, fontSize: 11, fontWeight: 600 }}
              />
            </HBox>
          </HBox>
        </HBox>
      )}
    </OverviewSectionCard>
  );
}
