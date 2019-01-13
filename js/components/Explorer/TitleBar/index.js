import React from "react";
import "./index.css";
import magnifier from "../images/magnifier.png";
import close from "../images/close-red.png";

const Icon = props => (
  <img {...props} style={{ cursor: "pointer" }} width={20} height={20} />
);

const TitleBar = props => {
  return (
    <div className="title">
      <div className="title-flex">
        <div>
          <img src={magnifier} className="title-img" />
          <p className="title-text">{props.title}</p>
        </div>
        {props.onClose && (
          <Icon
            id="disallow-on-top"
            src={close}
            onClick={props.onClose}
            width={20}
            height={20}
          />
        )}
      </div>
    </div>
  );
};

export default TitleBar;
