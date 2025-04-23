import { CircularProgress } from "@mui/material";
import React from "react";

const CircularProgressCenter = ({
  fullScreen = false,
}: {
  fullScreen?: boolean;
}) => {
  if (fullScreen)
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-xs">
        <CircularProgress />
      </div>
    );

  return (
    <div className="absolute inset-0  flex items-center justify-center bg-white/10">
      <CircularProgress />
    </div>
  );
};

export default CircularProgressCenter;
