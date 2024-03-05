import React, { useEffect } from "react";
import { Box } from "@mui/material";

import config from "../config";
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";

const ClaimOverviewView = () => {
  const sdk = new ChartsEmbedSDK({
    baseUrl: config.CHART_BASE_URL,
  });

  // embed a chart
  const chart = sdk.createChart({
    chartId: config.CHART_ID,
    height: "200px",
    theme: "light",
  });
  const chart1 = sdk.createChart({
    chartId: config.CHART_ID1,
    height: "200px",
    theme: "light",
  });

  const chart2 = sdk.createChart({
    chartId: config.CHART_ID2,
    height: "200px",
    theme: "light",
  });

  useEffect(() => {
    chart.render(document.getElementById("chart"));
    chart1.render(document.getElementById("chart1"));
    chart2.render(document.getElementById("chart2"));
  }, []);

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
        <div id="chart"></div>
        <div id="chart1"></div>
        <div id="chart2"></div>
      </Box>
    </>
  );
};

export default ClaimOverviewView;
