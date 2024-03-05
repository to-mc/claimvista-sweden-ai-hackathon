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
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import config from "../config";
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";

const ClaimOverviewView = () => {
  const sdk = new ChartsEmbedSDK({
    baseUrl: "https://charts.mongodb.com/charts-charts-fixture-tenant-zdvkh",
  });

  // embed a chart
  const chart = sdk.createChart({
    chartId: "48043c78-f1d9-42ab-a2e1-f2d3c088f864",
  });

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
      ></Box>
    </>
  );
};

export default ClaimOverviewView;
