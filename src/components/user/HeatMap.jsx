import React, { useState, useEffect } from "react";
import HeatMap from "@uiw/react-heat-map";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
// GitHub-like color levels (can be customized)
const panelColors = {
  0: "#ebedf0",     // light gray for 0 commits
  1: "#c6e48b",     // light green
  2: "#7bc96f",     // medium green
  3: "#239a3b",     // dark green
  4: "#196127",     // darkest green
};

// Helper to map commit counts to color levels (1-4)
const normalizeCount = (count) => {
  if (count === 0) return 0;
  if (count <= 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
};

const HeatMapProfile = () => {
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/daily-commits`);
        console.log("📦 Raw response:", response.data);

        if (!Array.isArray(response.data)) {
          throw new Error("Invalid response format. Expected an array.");
        }

        // Normalize commit counts to color scale (0–4)
        const normalizedData = response.data.map((entry) => ({
          date: entry.date,
          count: normalizeCount(entry.count),
        }));

        console.log("🎯 Normalized Heatmap Data:", normalizedData);
        setActivityData(normalizedData);
      } catch (error) {
        console.error("❌ Error fetching commit activity:", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h4 style={{ marginBottom: "10px" }}>Recent Contributions</h4>
      <HeatMap
        className="HeatMapProfile"
        style={{
          display: "block",
          width: "90%",
          color: "black",
          padding: "10px",
          border: "1px solid black",
        }}
        value={activityData}
        startDate={new Date("2025-01-01")}
        endDate={new Date()} // Optional, defaults to today
        weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
        rectSize={15}
        space={2}
        rectProps={{ rx: 2 }}
        panelColors={panelColors}
      />
    </div>
  );
};

export default HeatMapProfile;
