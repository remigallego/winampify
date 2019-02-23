import React from "react";
import "./index.css";
import magnifier from "../images/magnifier.png";
import close from "../images/close-red.png";

interface Props {
  onClose: () => void | null;
  title: string;
}

interface IconProps {
  src: string;
  onClick: () => void | null;
}

const Icon = (props: IconProps) => (
  <div onClick={props.onClick}>
    <img
      id="disallow-on-top"
      src={props.src}
      style={{ cursor: "pointer" }}
      width={20}
      height={20}
    />
  </div>
);

const TitleBar = (props: Props) => {
  return (
    <div className="title">
      <div className="title-flex">
        <div>
          <img src={magnifier} className="title-img" />
          <p className="title-text">{props.title}</p>
        </div>
        {props.onClose && <Icon src={close} onClick={props.onClose} />}
      </div>
    </div>
  );
};

export default TitleBar;
