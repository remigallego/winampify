import React from "react";
import "../../css/react-context-menu.css";
import "../../css/winamp.css";

interface Props {}

interface State {}

interface MyInterface {
  myBoolean: boolean;
  myNumber: number;
}

class Test extends React.Component<Props, State> {
  test() {
    const kikoo: MyInterface = {
      myNumber: 1234,
      myBoolean: true
    };
  }
  render() {
    return <div>Hello</div>;
  }
}

export default Test;
