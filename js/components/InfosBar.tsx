import React from "react";
import { connect } from "react-redux";
import { setUserInfos, logOut, wipeTokens } from "../actions/user";
import { AppState } from "../reducers";

interface DispatchProps {
  setUserInfos: () => void;
  logOut: () => void;
  wipeTokens: () => void;
}

interface StateProps {
  image: string;
  name: string;
}

type Props = DispatchProps & StateProps;

class InfosBar extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }
  componentWillMount() {
    // this.props.setUserInfos();
  }

  render() {
    return (
      <div
        className="infos-bar"
        style={{
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {this.props.image && (
            <img
              src={this.props.image}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                marginRight: 10
              }}
            />
          )}
          <h1 style={{ fontSize: 12 }}>{this.props.name}</h1>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row"
          }}
        >
          <p onClick={() => this.props.logOut()}>Logout</p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row"
          }}
        >
          <p onClick={() => this.props.wipeTokens()}>Wipe tokens</p>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state: AppState) => ({
  name: state.user.name,
  image: state.user.image,
  uri: state.user.uri
});
const mapDispatchToProps = (dispatch: any): DispatchProps => ({
  setUserInfos: () => dispatch(setUserInfos()),
  logOut: () => dispatch(logOut()),
  wipeTokens: () => dispatch(wipeTokens())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InfosBar);
