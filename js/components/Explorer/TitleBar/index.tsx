import React from "react";
import close from "../images/close-red.png";
import CloseIcon from "../Icons/CloseIcon";
import { blueTitleBar } from "../../../colors";
import { dragHandleClassName } from "../vars";

interface Props {
  onClose: () => void | null;
  title: string;
}

const TitleBar = (props: Props) => {
  return (
    <div
      className={dragHandleClassName}
      style={{
        backgroundColor: blueTitleBar,
        background: 'linear-gradient("#026bfe", "#1a6cd0")',
        width: "auto",
        height: "auto",
        cursor: "move",
        borderTopLeftRadius: "inherit",
        borderTopRightRadius: "inherit"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            padding: 3,
            fontFamily: "Open Sans",
            fontSize: "16px",
            color: "white",
            fontWeight: 500,
            whiteSpace: "nowrap",
            userSelect: "none",
            overflow: "hidden"
          }}
        >
          {props.title}
        </div>
        {props.onClose && <CloseIcon src={close} onClick={props.onClose} />}
      </div>
    </div>
  );
};

export default TitleBar;
