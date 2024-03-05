import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Modal,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import config from "../config";

const FindClaimView = () => {
  const [claims, setClaims] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [similarClaims, setSimilarClaims] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async () => {
    // Validate input
    if (!searchTerm.trim()) return;

    const requestBody = { searchTerm }; // Adjust based on the expected request body format

    try {
      const response = await fetch(`${config.API_BASE_URL}/findClaim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const fetchedClaims = await response.json();
      setClaims(fetchedClaims); // Assuming the response directly contains the array of claims
    } catch (error) {
      console.error("Failed to fetch claims:", error);
      // Optionally, update UI to reflect that the search failed
    }
  };

  const handleApplyEstimate = () => {
    handleClose(); // Assuming this function closes the modal
    setOpenSnackbar(true); // Opens the Snackbar for the toast message
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleOpen = async (claim) => {
    // Define the request body, assuming `claim.embeddings` exists and is the correct format
    const requestBody = { embedding: claim.embedding, skip: 1, limit: 4 };

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
      setSimilarClaims(similarClaimsData.result); // Assume the response is in the correct format

      // After successfully fetching similar claims, open the modal with the selected claim
      setSelectedClaim(claim);
      setOpen(true);
    } catch (error) {
      console.error("Failed to fetch similar claims:", error);
      // Handle error, e.g., show an error message or log it
      // Consider whether you still want to open the modal without similar claims
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          width: "90vw",
          height: "calc(100vh - 200px)",
          display: "flex",
          flexDirection: "column",
          overflow: "scroll",
          backgroundColor: "#f0f2f5",
          borderRadius: "10px",
          margin: "auto",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          padding: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <TextField
            id="search-field"
            label="Search Claims"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ marginRight: 1, width: "100%" }}
          />
          <IconButton aria-label="search" onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        </Box>
        <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
          Claims
        </Typography>

        {claims.map((claim) => (
          <Card
            key={claim._id.$oid}
            sx={{
              display: "flex",
              mb: 2,
              minHeight: "150px",
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
        </Box>
      </Modal>
    </>
  );
};

export default FindClaimView;
