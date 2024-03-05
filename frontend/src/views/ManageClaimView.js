import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Modal,
  IconButton,
  Button,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import config from "../config";

const ManageClaimView = () => {
  const [claims, setClaims] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [similarClaims, setSimilarClaims] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleApplyEstimate = async () => {
    handleClose();

    try {
      const response = await fetch(`${config.API_BASE_URL}/updateClaim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedClaim._id }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Claim updated successfully:", data);
      setClaims([]);

      setOpenSnackbar(true); // Opens the Snackbar with a success message
    } catch (error) {
      console.error("Error updating the claim:", error);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleOpen = async (claim) => {
    const requestBody = { embedding: claim.embedding, skip: 0, limit: 3 };

    try {
      const response = await fetch(`${config.API_BASE_URL}/similarClaims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const similarClaimsData = await response.json();
      console.log(similarClaimsData.result);
      setSimilarClaims(similarClaimsData.result);
      // After successfully fetching similar claims, open the modal with the selected claim
      setSelectedClaim(claim);
      setOpen(true);
    } catch (error) {
      console.error("Failed to fetch similar claims:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // Fetch unhandled claims from the endpoint
    const fetchClaims = async () => {
      const response = await fetch(`${config.API_BASE_URL}/unhandledClaims`);
      const data = await response.json();

      // Filter to only include claims where handled === false
      const unhandledClaims = data.filter((claim) => claim.handled === false);

      // Update state with the filtered list of unhandled claims
      setClaims(unhandledClaims);
    };

    fetchClaims().catch(console.error); // Log errors to console
  }, []); // Empty dependency array means this effect runs once on mount

  let averageCostEstimate = 0;
  if (similarClaims.length > 0) {
    averageCostEstimate =
      similarClaims.reduce((acc, claim) => acc + claim.cost_estimate, 0) /
      similarClaims.length;
  }

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
          Unhandled Claims
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
              <Box
                component="img"
                sx={{ mt: 2, maxWidth: "100%", height: "auto" }}
                src={`data:image/jpeg;base64,${selectedClaim.image_base64}`}
                alt="Claim Image"
              />
            </>
          )}
          {/* Similar Claims Section */}
          <Typography variant="h6" sx={{ mt: 4 }}>
            Similar Claims
          </Typography>
          {similarClaims && (
            <>
              {similarClaims.map((claim, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", mt: 2, alignItems: "center" }}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: 88, height: 88, mr: 2 }}
                    image={`data:image/jpeg;base64,${claim.image_base64}`}
                    alt="Similar claim thumbnail"
                  />
                  <Box>
                    <Typography variant="subtitle1">{claim.title}</Typography>
                    <Typography variant="body2">
                      Cost Estimate: ${claim.cost_estimate}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </>
          )}
          {/* Average Cost Estimate Section */}
          <Typography variant="h6" sx={{ mt: 4 }}>
            Suggested Cost Estimate
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Based on similar claims, the average cost estimate is: $
            {averageCostEstimate.toFixed(0)}
          </Typography>
          {/* Apply Estimate Button */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              sx={{ width: "100%" }} // Makes the button wide
              onClick={handleApplyEstimate} // Closes the modal
            >
              Apply Estimate
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar for the toast message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000} // Duration in milliseconds
        onClose={handleSnackbarClose}
        message="Estimate saved"
        action={
          <Button color="inherit" size="small" onClick={handleSnackbarClose}>
            Close
          </Button>
        }
      />
    </>
  );
};

export default ManageClaimView;
