import React, { ReactNode } from "react";

interface Props {
  zIndex: number;
  setOnTop: () => void;
  children: ReactNode;
}

export default (props: Props) => {
  return (
    <div
      className="window-instance---"
      style={{
        backgroundColor: "red",
        zIndex: props.zIndex,
        position: "absolute"
      }}
      onMouseDown={(e: any) => {
        if (e.target.id !== "disallow-on-top") props.setOnTop();
      }}
    >
      {props.children}
    </div>
  );
};
