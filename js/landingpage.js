import React from "react";
import ReactGA from "react-ga";
import Signin from "./signin";
import pkg from "./../package.json";
class LandingPage extends React.Component {
  componentDidMount() {
    ReactGA.initialize("UA-101600795-2");
    ReactGA.pageview("/landingpage");
  }
  render() {
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
  }
}

export default LandingPage;
