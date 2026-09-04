import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Chip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation } from "react-router-dom";
import { HAxiosService } from "@helix/component-library";
import { AllocationAPI } from "./apiEndpoints";

const screenMap = [
  { name: "Allocation List", path: "/homelayout/allocation" },
  { name: "User Management", path: "/homelayout/usermanagement" },
  { name: "Early Collection Dashboard", path: "/homelayout/earlycollection/dashboard" },
  { name: "Reports", path: "/homelayout/reports" },
  { name: "Dashboard", path: "/homelayout/dashboard" },
];

const QuickNavigateChatBot = ({ open, onClose, navigate }) => {
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hi! Type commands like 'account 1234', 'user AB001', 'high priority case', or search screens below." }
  ]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation(); // Optional for debugging
  console.log("ChatBot mounted at route:", location.pathname);

  const quickActions = [
    { label: "Show Top 5 Cases", action: "show_top_cases" },
    { label: "Show PTP Follow-ups", action: "show_ptp_followups" },
    { label: "Show Overdue Cases", action: "show_overdue_cases" },
  ];

  const handleUserMessage = async (command) => {
    const userMessage = command || input.trim();
    if (!userMessage) return;
    setMessages(prev => [...prev, { type: "user", text: userMessage }]);
    setInput("");

    const lower = userMessage.toLowerCase();

    if (lower.includes("help")) {
      setMessages(prev => [...prev, { type: "bot", text: "Type: 'account {id}', 'user {id}', 'high priority case' or click a quick action." }]);
      return;
    }

    if (lower.includes("high priority")) {
      setLoading(true);
      try {
        const response = await HAxiosService.GET(AllocationAPI.fetchHighPriority);
        const caseData = response.data;
        if (caseData?.accountNumber) {
          setMessages(prev => [...prev, { type: "bot", text: `Your highest priority case is Account ${caseData.accountNumber}. Navigating...` }]);
          setTimeout(() => {
            navigate(`/homelayout/allocation/${caseData.accountNumber}`);
            onClose();
          }, 1200);
        } else {
          setMessages(prev => [...prev, { type: "bot", text: "No high priority case found for today." }]);
        }
      } catch (error) {
        console.error(error);
        setMessages(prev => [...prev, { type: "bot", text: "Error fetching high priority case." }]);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (lower.includes("account")) {
      const parts = lower.split(" ");
      const idx = parts.indexOf("account");
      if (idx !== -1 && parts[idx + 1]) {
        const accountId = parts[idx + 1];
        setMessages(prev => [...prev, { type: "bot", text: `Navigating to account ${accountId}...` }]);
        setTimeout(() => {
          navigate(`/homelayout/allocation/${accountId}`);
          onClose();
        }, 1000);
        return;
      }
    }

    if (lower.includes("user")) {
      const parts = lower.split(" ");
      const idx = parts.indexOf("user");
      if (idx !== -1 && parts[idx + 1]) {
        const userId = parts[idx + 1];
        setMessages(prev => [...prev, { type: "bot", text: `Navigating to user ${userId}...` }]);
        setTimeout(() => {
          navigate(`/user/details/${userId}`);
          onClose();
        }, 1000);
        return;
      }
    }

    setMessages(prev => [...prev, { type: "bot", text: "Sorry, I didn't understand. Type 'help' or use quick actions." }]);
  };

  const filteredScreens = screenMap.filter((screen) =>
    screen.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 340, display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Quick Navigate ChatBot</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        <Box sx={{ p: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search screens to navigate..."
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />
            }}
          />
        </Box>

        <List sx={{ flexGrow: 1, overflowY: "auto", px: 2 }}>
          {messages.map((msg, idx) => (
            <ListItem key={idx} sx={{ justifyContent: msg.type === "user" ? "flex-end" : "flex-start" }}>
              <ListItemText
                primary={msg.text}
                sx={{
                  bgcolor: msg.type === "user" ? "primary.light" : "grey.200",
                  borderRadius: 2,
                  px: 1,
                  py: 0.5,
                  maxWidth: "85%"
                }}
              />
            </ListItem>
          ))}
          {loading && (
            <ListItem>
              <CircularProgress size={20} />
              <Typography sx={{ ml: 1 }}>Processing...</Typography>
            </ListItem>
          )}
        </List>

        {filteredScreens.length > 0 && (
          <List sx={{ maxHeight: 150, overflowY: "auto", px: 2 }}>
            {filteredScreens.map((screen, idx) => (
              <ListItemButton key={idx} onClick={() => handleNavigate(screen.path)}>
                <ListItemText primary={screen.name} />
              </ListItemButton>
            ))}
          </List>
        )}

        <Box sx={{ p: 1, display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
          {quickActions.map((action, idx) => (
            <Chip
              key={idx}
              label={action.label}
              clickable
              onClick={() => handleUserMessage(action.action)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>

        <Box sx={{ p: 2, display: "flex", gap: 1 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Type your request..."
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUserMessage()}
          />
          <Button variant="contained" onClick={() => handleUserMessage()} disabled={!input.trim()}>
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default QuickNavigateChatBot;
