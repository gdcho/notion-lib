import React from "react";
import "./Button.css";

const Button = ({ pressFunction, text, color, disabled }) => {
  return (
    <button
      className="button"
      style={{ backgroundColor: color }}
      onClick={pressFunction}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
