import React from "react";
import Signin from "./signin";
import pkg from "./../package.json";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="landing-text">Winampify ⚡️</div>
      <Signin />
      <div className="description">
        Note: You need a Spotify Premium account to use Winampify. <br />
        <br />
        Winampify does not collect data about its users.
      </div>
      <div className="footer">{pkg.version} (pre-alpha)</div>
    </div>
  );
};

export default LandingPage;
