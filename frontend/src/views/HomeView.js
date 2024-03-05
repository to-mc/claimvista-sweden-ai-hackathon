import React from "react";
import { Button, Box, Divider } from "@mui/material";

const HomeView = ({ onNavigate }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 2, // Spacing between buttons
    }}
  >
    <Divider style={{ width: "100%" }}>User</Divider>
    <Button
      variant="contained"
      size="large"
      sx={{ width: "100%" }}
      onClick={() => onNavigate("createClaim")}
    >
      Create Claim
    </Button>
    <Button
      variant="contained"
      size="large"
      sx={{ width: "100%" }}
      onClick={() => onNavigate("myClaims")}
    >
      My Claims
    </Button>
    <Divider style={{ width: "100%" }}>Admin</Divider>
    <Button
      variant="contained"
      size="large"
      sx={{ width: "100%" }}
      onClick={() => onNavigate("manageClaim")}
    >
      Handle Claim
    </Button>
    <Button
      variant="contained"
      size="large"
      sx={{ width: "100%" }}
      onClick={() => onNavigate("findClaim")}
    >
      Find Claim
    </Button>
    <Button
      variant="contained"
      size="large"
      sx={{ width: "100%" }}
      onClick={() => onNavigate("claimOverview")}
    >
      Claim overview
    </Button>
  </Box>
);

export default HomeView;
