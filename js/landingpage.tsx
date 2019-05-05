import React from "react";
import ReactGA from "react-ga";
import Signin from "./signin";
import Logo from "../images/winampifylogo.png";
import pkg from "./../package.json";
import { orangeLight } from "./colors";

interface Props {
  loading?: boolean;
}

class LandingPage extends React.Component<Props> {
  componentDidMount() {
    ReactGA.initialize("UA-101600795-2");
    ReactGA.pageview("/landingpage");
  }
  render() {
    return (
      <div>
        <div className="landing-page">
          {this.props.loading ? (
            <div
              style={{
                color: orangeLight,
                margin: "0 auto",
                paddingTop: "100px"
              }}
              className="la-line-scale la-2x"
            >
              <div />
              <div />
              <div />
              <div />
              <div />
            </div>
          ) : (
            <>
              <div style={{ height: 130, marginBottom: 15 }}>
                <img key="logo" src={Logo} />
              </div>
              <Signin />
              <div className="description">
                Note: You need a Spotify Premium account to use Winampify.{" "}
                <br />
                <br />
                Winampify does not collect data about its users.
              </div>
            </>
          )}
        </div>
        <div className="footer">{pkg.version} (pre-alpha)</div>
      </div>
    );
  }
}

export default LandingPage;
