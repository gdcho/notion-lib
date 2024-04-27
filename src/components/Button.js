import React, { useState } from "react";
import "./Button.css";

const Button = ({ pressFunction, text, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`button ${isHovered ? "hovered" : ""}`}
      style={{ backgroundColor: color }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={pressFunction}
    >
      <b>{text}</b>
    </button>
  );
};

export default Button;
