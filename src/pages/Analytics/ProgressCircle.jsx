import React from "react";
import { Box } from "@mui/material";

const ProgressCircle = ({ progress = 0.75, size = 40 }) => {
  const angle = progress * 360;

  return (
    <Box
      sx={{
        background: `radial-gradient(#42a5f5 55%, transparent 56%),
                     conic-gradient(transparent 0deg ${angle}deg, #2979ff ${angle}deg 360deg),
                     #4caf50`,
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};

export default ProgressCircle;
