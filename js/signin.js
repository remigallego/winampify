import React from "react";
import { render } from "react-dom";

const server = "http://remigallego.com:8888";

const Signin = () => {
  return (
    <div className="signin-btn-wrapper">
      <div
        className="signin-btn"
        onClick={() => (window.location = `${server}/login?dev=true`)}
      >
        SIGN IN TO SPOTIFY
      </div>
    </div>
  );
};

export default Signin;