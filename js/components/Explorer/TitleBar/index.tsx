import React from "react";
import "./index.css";
import magnifier from "../images/magnifier.png";
import close from "../images/close-red.png";
import Icon from "./Icon";

interface Props {
  onClose: () => void | null;
  title: string;
}

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
