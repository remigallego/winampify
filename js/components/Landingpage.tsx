import React from "react";
import ReactGA from "react-ga";
import Signin from "./Reusables/SigninButton";
import Logo from "../../images/winampifylogo.png";
import pkg from "../../package.json";
import { orangeLight, redError } from "../styles/colors";
import { FaExclamationTriangle } from "react-icons/fa";
import { LOADING } from "../reducers/auth";
import Explorer from "./Explorer";
import SearchInput from "./Explorer/Toolbar/SearchInput";
import Toolbar from "./Explorer/Toolbar";

interface Props {
  loading?: LOADING;
  errorMessage?: string;
}

class LandingPage extends React.Component<Props> {
  componentDidMount() {
    ReactGA.initialize("UA-101600795-2");
    ReactGA.pageview("/landingpage");
  }

  renderLoading() {
    return (
      <div
        style={{
          margin: "0 auto",
          paddingTop: "100px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <div
          style={{
            color: orangeLight
          }}
          className="la-line-scale la-2x"
        >
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
        <div style={{ marginTop: 20, color: "white" }}>
          {this.props.loading === LOADING.LOGGING_IN && "Logging in..."}
          {this.props.loading === LOADING.LOGGING_OUT && "Logging out.."}
        </div>
      </div>
    );
  }

  renderError() {
    if (!this.props.errorMessage) return null;
    return (
      <div
        style={{
          backgroundColor: redError,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 12,
          paddingRight: 12,
          paddingTop: 4,
          paddingBottom: 4,
          borderRadius: 8,
          marginBottom: 15
        }}
      >
        <FaExclamationTriangle size={30} color={"white"} />
        <p
          style={{
            marginLeft: 12,
            color: "white",
            fontSize: 13
          }}
          dangerouslySetInnerHTML={{ __html: this.props.errorMessage }}
        />
      </div>
    );
  }
  render() {
    return (
      <div>
        <div className="landing-page">
          {this.props.loading ? (
            this.renderLoading()
          ) : (
            <>
              <div style={{ marginBottom: 60 }}>
                <img key="logo" src={Logo} />
                <Toolbar />
                <div className="description">
                  A fun OS-like interface to listen to, browse and interact with
                  Spotify in the browser.
                </div>
              </div>
              <Signin />
              {this.renderError()}
            </>
          )}
        </div>
        <div className="footer">{pkg.version} (pre-alpha)</div>
      </div>
    );
  }
}

export default LandingPage;
