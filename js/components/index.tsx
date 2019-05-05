import "babel-polyfill";
import "../../css/line-scale.css";
import React from "react";
import { render } from "react-dom";
import { Provider, connect } from "react-redux";
import * as WebampInstance from "../../webamp/built/webamp.bundle";
import App from "./App";
import LandingPage from "../landingpage";
import { authenticate } from "../actions/user";
import { getParams } from "../utils/common";
import { AppState } from "../reducers";
import { UserState } from "../reducers/user";

interface Props {
  user: UserState;
}

interface DispatchProps {
  authenticate: (accessToken: string, refreshToken: string) => void;
}

class Winampify extends React.Component<Props & DispatchProps> {
  constructor(props: Props & DispatchProps) {
    super(props);
  }
  render() {
    if (this.props.user.loading) return <LandingPage loading />;
    /*  if (this.props.user.logged && !this.props.user.ready)
      return <LandingPage loading />; */
    if (this.props.user.logged) return <App />;

    const Webamp: any = WebampInstance;
    if (!Webamp.browserIsSupported()) {
      // eslint-disable-next-line
      alert("Oh no! Webamp does not work!");
      throw new Error("What's the point of anything?");
    }

    if (!window.location.search) return <LandingPage />;

    let accessToken;
    let refreshToken;
    const params = getParams(window.location.search);
    if (params.length === 2) {
      accessToken = params[0].slice(13);
      refreshToken = params[1].slice(14);
    }
    // Clean URL from query params
    history.pushState(null, null, window.location.href.split("?")[0]);

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
  user: state.user
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
  authenticate: (accessToken, refreshToken) =>
    dispatch(authenticate(accessToken, refreshToken))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Winampify);
