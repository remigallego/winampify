// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { css, jsx, keyframes } from "@emotion/core";
import React from "react";
import { FaCheck } from "react-icons/fa";
import { blueTitleBar, blueTitleBarDark } from "../../../styles/colors";

interface Props {
  title: string;
  check: boolean;
  onClick: () => void;
}

const CheckButton = (props: Props) => {
  const color = props.check ? "white" : "grey";
  return (
    <div
      onClick={() => props.onClick()}
      css={css`
        display: inline-block;
        background-color: ${blueTitleBar};
        color: white;
        position: relative;
        padding: 2px 7px 5px 10px;
        border-radius: 4px;
        transition: background-color 0.1s, transform 0.2s;
        &:hover {
          background-color: ${blueTitleBarDark};
        }
        &:active {
          transform: scale(0.94);
        }
      `}
    >
      <div
        css={css`
          line-height: 2px;
          display: inline-block;
          font-weight: 800;
          font-size: 12px;
          color: ${color};
        `}
      >
        {props.title}
      </div>
    </div>
  );
};

export default CheckButton;
