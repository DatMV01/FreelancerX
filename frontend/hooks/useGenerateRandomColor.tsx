import { useState } from "react";

const useGenerateRandomColor = () => {
  const [color, setColor] = useState("#000000");

  const generateColor = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
    setColor(randomColor);
  };

  return { color, generateColor };
};

export default useGenerateRandomColor;
