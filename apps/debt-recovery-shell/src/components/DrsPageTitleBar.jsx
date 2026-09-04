import { Box } from "@mui/material";

/** Debt Recovery–style blue gradient page title strip. */
export function DrsPageTitleBar({ children }) {
  return (
    <Box className="drs-page-title-bar" component="h1" sx={{ m: 0 }}>
      {children}
    </Box>
  );
}

export default DrsPageTitleBar;
