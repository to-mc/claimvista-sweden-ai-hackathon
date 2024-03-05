import React from "react";
import { Slide, Box, Container } from "@mui/material";

const ViewWrapper = ({ children, in: inProp }) => (
  <Slide direction="right" in={inProp} mountOnEnter unmountOnExit>
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        height: "calc(100vh - 164px)", // Subtract AppBar height
        width: "100%",
        overflow: "auto", // Add scroll if content is larger than the container
      }}
    >
      {/* Use Container for padding and max-width but remove its inherent margin-top */}
      <Container
        sx={{
          mt: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {children}
      </Container>
    </Box>
  </Slide>
);

export default ViewWrapper;
