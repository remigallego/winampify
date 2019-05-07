import React from "react";
import { connect } from "react-redux";
import { AppState } from "../reducers";
import { UserState } from "../reducers/user";
import { logOut, wipeTokens } from "../actions/auth";
import { FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import { greenSpotify } from "../colors";

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

  renderControls() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center"
        }}
      >
        <FaSignOutAlt
          style={{ cursor: "pointer" }}
          color={"white"}
          onClick={this.props.logOut}
          size={12}
        />
      </div>
    );
  }

  render() {
    return (
      <div
        className="infos-bar"
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: greenSpotify,
          borderBottomLeftRadius: 3
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

          <h1 style={{ fontSize: 12, color: "white" }}>
            {this.props.user.display_name}
          </h1>
          <FaChevronDown style={{ marginLeft: 8 }} color={"white"} />
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
