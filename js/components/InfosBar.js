import React from "react";
import { connect } from "react-redux";
import { setUserInfos } from "../actions/infosbar";

class InfosBar extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.setUserInfos();
  }

  render() {
    return (
      <div
        className="infos-bar"
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
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
          />
        )}
        <h1 style={{ fontSize: 12 }}>{this.props.name}</h1>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  name: state.user.name,
  image: state.user.image,
  uri: state.user.uri
});
const mapDispatchToProps = dispatch => ({
  setUserInfos: () => dispatch(setUserInfos())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InfosBar);
