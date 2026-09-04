/**
 * Assisted Calling module — barrel export.
 *
 * Public API for this module. Internal sub-components
 * (CallControlBar, Waveform, etc.) are not re-exported here
 * as they are implementation details of the panel.
 */

export { default as AssistedCallingSidePanel, ASSISTED_CALLING_PANEL_WIDTH } from "./AssistedCallingSidePanel";
export { default as AssistedCallingPanel } from "./AssistedCallingPanel";
export { AssistedCallingUIProvider, useAssistedCallingUI } from "./useAssistedCallingUI";
export { default as FloatingMeetingWindow } from "./FloatingMeetingWindow";
