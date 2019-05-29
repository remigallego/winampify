import "babel-polyfill";
import React from "react";
import { render } from "react-dom";
import { connect, Provider } from "react-redux";
import "../../css/line-scale.css";
import * as WebampInstance from "../../webamp/built/webamp.bundle";
import { authenticate } from "../actions/auth";
import { AppState } from "../reducers";
import { AuthState, LOADING } from "../reducers/auth";
import { getParams } from "../utils/common";
import App from "./App";
import LandingPage from "./Landingpage";

interface Props {
  auth: AuthState;
}

interface DispatchProps {
  authenticate: (accessToken: string, refreshToken: string) => void;
}

class Winampify extends React.Component<Props & DispatchProps> {
  listener: any;
  constructor(props: Props & DispatchProps) {
    super(props);
    this.state = {
      open: false
    };
    this.listener = (event: MessageEvent) => {
      if (
        (event.data && typeof event.data === "string") ||
        event.data instanceof String
      )
        if (event.data.split(":").length === 2) {
          const tokens = event.data.split(":");
          window.removeEventListener("message", this.listener);
          this.props.authenticate(tokens[0], tokens[1]);
        }
    };
    window.addEventListener("message", this.listener, false);
  }
  render() {
    const { loading, logged } = this.props.auth;
    if (loading !== LOADING.NONE) return <LandingPage loading={loading} />;
    if (logged) return <App />;

    const Webamp: any = WebampInstance;
    if (!Webamp.browserIsSupported()) {
      // eslint-disable-next-line
      alert("Oh no! Webamp does not work!");
      throw new Error("What's the point of anything?");
    }

    if (!window.location.search)
      return <LandingPage errorMessage={this.props.auth.errorMessage} />;

    history.pushState(null, "", window.location.href.split("?")[0]);

    return <LandingPage />;
  }
}

const mapStateToProps = (state: AppState) => ({
  auth: state.auth
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
  authenticate: (accessToken, refreshToken) =>
    dispatch(authenticate(accessToken, refreshToken))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Winampify);
