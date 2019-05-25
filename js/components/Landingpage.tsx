import React from "react";
import ReactGA from "react-ga";
import { FaExclamationTriangle } from "react-icons/fa";
import Logo from "../../images/winampifylogo.png";
import GithubLogo from "../../images/githublogo.png";
import TwitterLogo from "../../images/twitterlogo.png";
import pkg from "../../package.json";
import { LOADING } from "../reducers/auth";
import { blueTitleBar, orangeLight, redError } from "../styles/colors";
import TitleBar from "./Explorer/TitleBar";
import Toolbar from "./Explorer/Toolbar";
import Signin from "./Reusables/SigninButton";

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
              <div
                className="explorer-handle"
                style={{ position: "absolute", height: "100", width: "100%" }}
              />
              <div
                className={`explorer-wrapper`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 200,
                  width: "100%",
                  boxShadow:
                    "0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.30)"
                }}
              >
                <TitleBar
                  title={`winampify.io ${pkg.version}`}
                  onClose={() => null}
                />
                <Toolbar id="landing-page" />
                <div
                  className="explorer-mainview"
                  style={{
                    display: "flex",
                    backgroundColor: "rgba(249,249,249,1)",
                    height: "100%",
                    width: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                    overflow: "auto",
                    borderBottomLeftRadius: "inherit",
                    borderBottomRightRadius: "inherit"
                  }}
                >
                  <div
                    style={{
                      padding: 30,
                      paddingTop: 30,
                      paddingBottom: 30,
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <div
                      style={{
                        marginBottom: 60,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                      }}
                    >
                      <img key="logo" src={Logo} />
                      <div
                        className="description"
                        style={{
                          color: blueTitleBar,
                          fontWeight: 600,
                          fontFamily: "Doppio One",
                          fontSize: 14
                        }}
                      >
                        An OS-like interface to listen to, browse and interact
                        with Spotify in the browser.
                      </div>
                    </div>
                    <Signin />
                    {this.renderError()}

                    <div
                      style={{
                        margin: "0 auto",
                        display: "inline-block",
                        marginTop: 10
                      }}
                    >
                      <img
                        onClick={() =>
                          window.open(
                            "https://github.com/remigallego/Winampify",
                            "_blank"
                          )
                        }
                        src={GithubLogo}
                        style={{
                          height: 41,
                          objectFit: "contain",
                          cursor: "pointer",
                          width: 100
                        }}
                      />
                      <img
                        onClick={() =>
                          window.open(
                            "https://twitter.com/remigallego",
                            "_blank"
                          )
                        }
                        src={TwitterLogo}
                        style={{
                          marginLeft: 10,
                          height: 41,
                          cursor: "pointer",
                          width: 140,
                          objectFit: "contain"
                        }}
                      />
                    </div>
                  </div>
                </div>
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
