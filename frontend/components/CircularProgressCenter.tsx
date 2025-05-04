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
        <CircularProgress size={30} />
      </div>
    );

  return (
    <div className="m-auto flex items-center justify-center bg-white/50">
      <CircularProgress size={30} />
    </div>
  );
};

export default CircularProgressCenter;
