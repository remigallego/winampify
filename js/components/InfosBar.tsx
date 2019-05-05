import React from "react";
import { connect } from "react-redux";
import { AppState } from "../reducers";
import { persistor } from "../.";
import { UserState } from "../reducers/user";
import { logOut, wipeTokens } from "../actions/auth";
import { FaSignOutAlt, FaTrash, FaUserTimes } from "react-icons/fa";

interface DispatchProps {
  logOut: () => void;
  wipeTokens: () => void;
}

interface StateProps {
  user: UserState;
}

type Props = DispatchProps & StateProps;

class InfosBar extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  renderProfilePicture() {
    if (
      !this.props.user ||
      !this.props.user.images ||
      !this.props.user.images[0]
    )
      return null;

    return (
      <img
        src={this.props.user.images[0].url}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          marginRight: 10
        }}
      />
    );
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
          {this.renderProfilePicture()}
          <h1 style={{ fontSize: 12 }}>{this.props.user.display_name}</h1>
        </div>
        <div
          style={{
            marginTop: 15,
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <FaSignOutAlt
            onClick={this.props.logOut}
            style={{ marginLeft: 5 }}
            size={15}
          />
          <FaTrash
            onClick={this.props.wipeTokens}
            style={{ marginLeft: 5 }}
            size={15}
          />
          <FaUserTimes
            onClick={persistor.flush}
            style={{ marginLeft: 5 }}
            size={15}
          />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state: AppState) => ({
  user: state.user
});
const mapDispatchToProps = (dispatch: any): DispatchProps => ({
  logOut: () => dispatch(logOut()),
  wipeTokens: () => dispatch(wipeTokens())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InfosBar);
