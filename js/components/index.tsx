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
  constructor(props: Props & DispatchProps) {
    super(props);
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

    let accessToken;
    let refreshToken;
    const params = getParams(window.location.search);
    if (params.length === 2) {
      accessToken = params[0].slice(13);
      refreshToken = params[1].slice(14);
    }
    // Clean URL from query params
    history.pushState(null, "", window.location.href.split("?")[0]);

    if (accessToken && refreshToken) {
      this.props.authenticate(accessToken, refreshToken);
    } else {
      render(<LandingPage />, document.getElementById("app"));
      return;
    }

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
