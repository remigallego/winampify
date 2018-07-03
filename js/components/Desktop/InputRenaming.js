import React from "react";
import { DesktopFileStyle } from "./styles";

class InputRenaming extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: this.props.initialValue };
  }
  render() {
    return (
      <form onSubmit={this.props.onSubmit}>
        <input
          style={{
            ...DesktopFileStyle.input,
            width: `${this.state.text.length}ch`
          }}
          type="text"
          value={this.state.text}
          onChange={e => this.setState({ text: e.target.value })}
        />
      </form>
    );
  }
}

export default InputRenaming;
