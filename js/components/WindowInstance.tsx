import React, { ReactNode } from "react";

interface Props {
  zIndex: number;
  setOnTop: () => void;
  children: ReactNode;
}

interface State {
  animation: string;
}

class WindowInstance extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div
        className="window-instance---"
        style={{ backgroundColor: "red", zIndex: this.props.zIndex }}
        onMouseDown={(e: any) => {
          if (e.target.id !== "disallow-on-top") this.props.setOnTop();
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default WindowInstance;
