import React from "react";
import { DesktopFileStyle } from "./styles";

class InputRenaming extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: this.props.initialValue };
  }
  render() {
    return (
      <form onSubmit={this.props.confirmRenameFile}>
        <input
          style={{
            ...DesktopFileStyle.fileName,
            backgroundColor: "white",
            textShadow: "none",
            color: "black",
            border: "1px dotted transparent",
            borderStyle: "dotted",
            boxSizing: "border-box",
            outline: "none",
            margin: 0,
            padding: 0
          }}
          ref={`test`}
          onChange={text => this.setState({ text: text.target.value })}
          value={this.state.text}
        />
      </form>
    );
  }
}

export default InputRenaming;
