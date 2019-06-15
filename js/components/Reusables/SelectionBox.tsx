import React from "react";

interface Props {
  selectZoneId: string;
  onSelect: (
    e: any,
    selectionBoxOrigin: number[],
    selectionBoxTarget: number[]
  ) => void;
}

interface State {
  selectionBox: boolean;
  selectionBoxOrigin: number[];
  selectionBoxTarget: number[];
}

export default class SelectionBox extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectionBox: false,
      selectionBoxOrigin: [0, 0],
      selectionBoxTarget: [0, 0]
    };
  }
  handleTransformBox() {
    const { selectionBoxOrigin, selectionBoxTarget } = this.state;
    if (
      selectionBoxOrigin[1] > selectionBoxTarget[1] &&
      selectionBoxOrigin[0] > selectionBoxTarget[0]
    )
      return "scaleY(-1) scaleX(-1)";

    if (selectionBoxOrigin[1] > selectionBoxTarget[1]) return "scaleY(-1)";
    if (selectionBoxOrigin[0] > selectionBoxTarget[0]) return "scaleX(-1)";
    return "";
  }

  render() {
    return (
      <div
        onMouseDown={(e: any) => {
          if (e.target.id.split(" ").indexOf(this.props.selectZoneId) !== -1)
            this.setState({
              selectionBox: true,
              selectionBoxOrigin: [
                e.nativeEvent.offsetX,
                e.nativeEvent.offsetY
              ],
              selectionBoxTarget: [e.nativeEvent.offsetX, e.nativeEvent.offsetY]
            });
        }}
        onMouseLeave={() => this.setState({ selectionBox: false })}
        onMouseUp={() => this.setState({ selectionBox: false })}
        onMouseMove={evt => {
          if (this.state.selectionBox) {
            this.setState({
              selectionBoxTarget: [
                evt.nativeEvent.clientX,
                evt.nativeEvent.clientY
              ]
            });

            this.props.onSelect(
              evt,
              this.state.selectionBoxOrigin,
              this.state.selectionBoxTarget
            );
          }
        }}
      >
        {this.state.selectionBox && (
          <div
            className="selection-box"
            style={{
              zIndex: 7,
              left: this.state.selectionBoxOrigin[0],
              top: this.state.selectionBoxOrigin[1],
              height: Math.abs(
                this.state.selectionBoxTarget[1] -
                  this.state.selectionBoxOrigin[1]
              ),
              width: Math.abs(
                this.state.selectionBoxTarget[0] -
                  this.state.selectionBoxOrigin[0]
              ),
              transformOrigin: "top left",
              transform: this.handleTransformBox()
            }}
          />
        )}
        {this.props.children}
      </div>
    );
  }
}
