import React from "react";
import Signin from "./signin";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="landing-text">Winampify ⚡️</div>
      <Signin />

      <div className="footer">
        Not affiliated with either Spotify or Winamp.
      </div>
    </div>
  );
};

export default LandingPage;
