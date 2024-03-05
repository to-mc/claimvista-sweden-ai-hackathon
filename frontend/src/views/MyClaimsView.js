import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Modal,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import config from "../config";

const MyClaimsView = () => {
  const [claims, setClaims] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);

  const handleOpen = async (claim) => {
    // Open the modal with the selected claim
    setSelectedClaim(claim);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // Fetch unhandled claims from the endpoint
    const fetchClaims = async () => {
      const response = await fetch(`${config.API_BASE_URL}/unhandledClaims`);
      const data = await response.json();

      // Assuming the response is an array of claims
      setClaims(data);
    };

    fetchClaims().catch(console.error); // Log errors to console
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <>
      <Box
        sx={{
          width: "90vw",
          height: "calc(100vh - 200px)",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          backgroundColor: "#f0f2f5",
          borderRadius: "10px",
          margin: "auto",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          padding: 2,
        }}
      >
        <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
          My Claims
        </Typography>

        {claims.map((claim) => (
          <Card
            key={claim._id.$oid}
            sx={{
              display: "flex",
              mb: 2,
              maxWidth: 600,
              bgcolor: "background.paper",
              cursor: "pointer",
            }}
            onClick={() => handleOpen(claim)} // Open modal on click
          >
            <CardMedia
              component="img"
              sx={{ width: 151 }}
              image={`data:image/jpeg;base64,${claim.image_base64}`}
              alt={claim.title}
            />
            <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography component="div" variant="h5">
                  {claim.title}
                </Typography>
                <Typography component="div" variant="h5">
                  {claim.handled}
                </Typography>
              </CardContent>
            </Box>
          </Card>
        ))}
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            outline: "none",
            overflowY: "auto", // Ensure modal content is scrollable if it overflows
            maxHeight: "90vh", // Limit modal height to avoid going off screen
          }}
        >
          {/* Close Icon */}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

          {selectedClaim && (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {selectedClaim.title}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Description: {selectedClaim.description}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Severity: {selectedClaim.severity}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Cost estimate: ${Math.round(selectedClaim.cost_estimate)}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Approved: {selectedClaim.handled ? "Yes" : "No"}
              </Typography>
              <Box
                component="img"
                sx={{ mt: 2, maxWidth: "100%", height: "auto" }}
                src={`data:image/jpeg;base64,${selectedClaim.image_base64}`}
                alt="Claim Image"
              />
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default MyClaimsView;
