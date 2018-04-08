import React from "react";
import Signin from "./signin";

const LandingPage = () => {
  return (
    <div>
      <div className="landing-wrapper">
        <div className="landing-text">
          Spotify <div className="landing-text--black">x</div> Winamp
        </div>
        <Signin />
      </div>
      <div className="footer">
        Not affiliated with either Spotify or Winamp.
      </div>
    </div>
  );
};

export default LandingPage;
