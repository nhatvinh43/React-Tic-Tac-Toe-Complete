import "../index.css";
import React from "react";

const Square = function (props) {
  return (
    <button
      className={props.status ? "winning-square" : "square"}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
};

export default Square;
