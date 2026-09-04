import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import CloseIcon from '@mui/icons-material/Close';
import QuickFollowupDetails from "./QuickFollowupDetails";
import { useDrsTheme, HBox } from "@helix/component-library";
import { useIntl } from "react-intl";

export const FOLLOWUP_PANEL_WIDTH = 320;

const FollowUpSidePanel = ({ open, onToggle }) => {
  const { themeVars, surfaces, text, theme } = useDrsTheme();
  const panelWidth = FOLLOWUP_PANEL_WIDTH;
  const collapsedWidth = 0;
  const intl = useIntl();

  return (
    <HBox
      sx={{
        width: open ? panelWidth : collapsedWidth,
        flexShrink: 0,
        transition: 'width 225ms cubic-bezier(0,0,0.2,1)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: `1px solid ${theme.palette.divider}`,
        backgroundColor: surfaces.paper,
        zIndex: 1200,
        overflow: 'hidden',
      }}
    >
      {!open && <button
        onClick={onToggle}
        style={{
          position: 'fixed',
          right: open ? 320 : 0,   // slides with the panel
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1300,
          transition: 'right 225ms cubic-bezier(0,0,0.2,1)',
          borderRadius: '8px 0 0 8px',
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor:  surfaces.paper,
          padding: '6px 8px',
        }}
        title={intl.formatMessage({
              id: "label.followup.quickFollowupTitle",
              defaultMessage: "Quick Follow Up",
            })}
      >
         <ChevronLeftIcon sx={{ fontSize: 15 , color:"text.primary"}}  />
        <br></br>
        <ContentPasteIcon sx={{ fontSize: 15, color: "primary.main" }} />
      </button>}

      {open && (
        <HBox sx={{ flex: 1, minWidth: 0, overflowY: 'auto', p: 0 }}>
          <QuickFollowupDetails compact onCloseCompact={onToggle} />
        </HBox>
      )}
    </HBox>
  );
};

export default FollowUpSidePanel;
