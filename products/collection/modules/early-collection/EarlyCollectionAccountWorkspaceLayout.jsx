import React, { Suspense, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import AccountHeader from "./account-overview/AccountHeader";
import FollowUpSidePanel, { FOLLOWUP_PANEL_WIDTH } from "../early-collection/followup/FollowUpSidePanel";
import AssistedCallingSidePanel, { ASSISTED_CALLING_PANEL_WIDTH } from "../early-collection/assisted-calling/AssistedCallingSidePanel";
import {HBox} from "@helix/component-library";

/**
 * Pathless layout for early-collection routes under /homelayout/* (except listView).
 * Renders persistent account header + function groups above the route Outlet.
 * Scroll lives on the Outlet wrapper only so header + function bar do not move (shell uses a flex height chain).
 */
export default function EarlyCollectionAccountWorkspaceLayout() {
    const [commLogOpen, setCommLogOpen] = useState(false);
    const [assistedCallingOpen, setAssistedCallingOpen] = useState(false);
    const [assistedCallingWidth, setAssistedCallingWidth] = useState(ASSISTED_CALLING_PANEL_WIDTH);
    const { selectedRow } = useSelector((s) => s.account);
    const sessionId = selectedRow?.ACNT_SEQNO ? `ACNT-${selectedRow.ACNT_SEQNO}` : null;

  return (
    <HBox
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        flex: 1,
        height: "100%",
        maxHeight: "100%",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <HBox
        sx={{
          position: "sticky",
          top: 0,
          zIndex: (theme) => theme.zIndex.appBar - 1,
          alignSelf: "stretch",
          flexShrink: 0,
          bgcolor: "background.paper",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 1px 0 rgba(255,255,255,0.08)"
              : "0 1px 0 rgba(15, 23, 42, 0.08)",
        }}
      >
        <AccountHeader />
      </HBox>
      <Suspense fallback={<HBox sx={{ p: 2 }}>Loading...</HBox>}>
        <HBox
          sx={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "row",
            width: "100%",
            overflow: "hidden",
            "--drs-side-panel-offset": [
              commLogOpen ? FOLLOWUP_PANEL_WIDTH : 0,
              assistedCallingOpen ? assistedCallingWidth : 0,
            ].reduce((a, b) => a + b, 0) + "px",
          }}
        >
          <HBox
            sx={{
              flex: 1,
              minWidth: 0,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <Outlet />
          </HBox>
          <FollowUpSidePanel open={commLogOpen} onToggle={() => setCommLogOpen((p) => !p)} />
          <AssistedCallingSidePanel
            open={assistedCallingOpen}
            onToggle={() => setAssistedCallingOpen((p) => !p)}
            panelProps={{ sessionId }}
            onWidthChange={setAssistedCallingWidth}
          />
        </HBox>
      </Suspense>
    </HBox>
  );
}
