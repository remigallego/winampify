import React from "react";
import { blueTitleBar } from "../../../styles/colors";
import CloseIcon from "../Icons/CloseIcon";
import { dragHandleClassName } from "../vars";

interface Props {
  onClose?: () => void | null;
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
          alignItems: "flex-end",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            padding: 3,
            paddingLeft: 10,
            fontFamily: "Open Sans",
            fontSize: "16px",
            color: "white",
            fontWeight: 500,
            whiteSpace: "nowrap",
            userSelect: "none",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {props.title}
        </div>
        {props.onClose && <CloseIcon onClick={props.onClose} />}
      </div>
    </div>
  );
};

export default TitleBar;
