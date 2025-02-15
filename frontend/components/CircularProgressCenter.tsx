import { CircularProgress } from "@mui/material";
import React from "react";

const CircularProgressCenter = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white bg-opacity-10 backdrop-blur-sm">
      <CircularProgress />
    </div>
  );
};

export default CircularProgressCenter;
