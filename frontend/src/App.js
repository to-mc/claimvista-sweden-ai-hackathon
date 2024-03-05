import React, { useState } from "react";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  IconButton,
  Box,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import HomeView from "./views/HomeView";
import CreateClaimView from "./views/CreateClaimView";
import ViewWrapper from "./views/ViewWrapper"; // Import the ViewWrapper
import HomeIcon from "@mui/icons-material/Home"; // Import the Home icon for the button
import ManageClaimView from "./views/ManageClaimView";
import FindClaimView from "./views/FindClaimView";

// Custom theme for overall app styling
const theme = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgb(108, 232, 117)",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        body {
          background-image: url('/background.png');
          background-size: cover;
          background-position: center;
          background-attachment: fixed; // Make the background image fixed
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "rgb(108, 232, 117)", // AppBar background color
          borderRadius: "20px", // Heavy rounded corners
          color: "#000", // Text color
          "&:hover": {
            backgroundColor: "rgb(98, 222, 107)", // Slightly darker on hover
          },
        },
      },
    },
  },
});

function App() {
  const [view, setView] = useState("home");

  const handleChangeView = (viewName) => {
    setView(viewName);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          {/* Home Button */}
          <IconButton
            edge="start"
            color="#000"
            aria-label="home"
            sx={{ mr: -4 }} // Adds some margin if you have other items in the AppBar
            onClick={() => handleChangeView("home")}
          >
            <HomeIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center", color: "black" }}
          >
            ClaimVista
          </Typography>
        </Toolbar>
      </AppBar>

      <ViewWrapper in={view === "home"}>
        <HomeView onNavigate={handleChangeView} />
      </ViewWrapper>

      <ViewWrapper in={view === "createClaim"}>
        <CreateClaimView />
      </ViewWrapper>
      <ViewWrapper in={view === "myClaims"}>
        <CreateClaimView />
      </ViewWrapper>

      <ViewWrapper in={view === "manageClaim"}>
        <ManageClaimView />
      </ViewWrapper>
      <ViewWrapper in={view === "findClaim"}>
        <FindClaimView />
      </ViewWrapper>
      <ViewWrapper in={view === "claimOverview"}>
        <FindClaimView />
      </ViewWrapper>
    </ThemeProvider>
  );
}

export default App;
