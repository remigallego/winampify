import React from "react";

interface Props {
  initialValue: string;
  confirmRenameFile: (e: any) => void;
}

interface State {
  text: string;
}

class InputRenaming extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { text: this.props.initialValue };
  }
  render() {
    return (
      <form onSubmit={this.props.confirmRenameFile}>
        <input
          style={{
            fontSize: "14px",
            textAlign: "center",
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
