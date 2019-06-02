import React from "react";
import { connect } from "react-redux";
import Rnd, { DraggableData } from "react-rnd";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import {
  closeExplorer,
  goPreviousState,
  updatePosition,
  updateSize
} from "../../actions/explorer";
import { AppState } from "../../reducers";
import { SingleExplorerState } from "../../reducers/explorer";
import "./animations.css";
import ContentWindow from "./ContentWindow";
import styles from "./styles";
import TitleBar from "./TitleBar";
import ExplorerToolbar from "./Toolbar";
import TreeWindow from "./TreeWindow";
import { dragHandleClassName } from "./vars";

interface OwnProps {
  explorer: SingleExplorerState;
}

interface DispatchProps {
  goPreviousState(): void;
  updatePosition(x: number, y: number): void;
  closeExplorer(): void;
  updateSize(width: number, height: number): void;
}

interface State {
  searchText: string;
  isClosing: boolean;
}

type Props = OwnProps & DispatchProps;

class ExplorerWindow extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchText: "",
      isClosing: false
    };
  }

  onDragStop(data: DraggableData) {
    const { clientHeight, clientWidth } = document.documentElement;
    const {
      width: explorerWidth,
      height: explorerHeight
    } = this.props.explorer;
    const rightMostPoint = data.x + this.props.explorer.width;
    const bottomMostPoint = data.y + this.props.explorer.height;

    let x = data.x;
    let y = data.y;

    if (rightMostPoint > clientWidth) x = clientWidth - explorerWidth;
    if (x < 0) x = 0;
    if (bottomMostPoint > clientHeight) y = clientHeight - explorerHeight;
    if (y < 0) y = 0;

    this.props.updatePosition(x, y);
  }

  render() {
    const { explorerWrapper } = styles;

    return (
      <div>
        <Rnd
          enableResizing={{
            top: false,
            right: true,
            bottom: true,
            left: false,
            topRight: false,
            bottomRight: true,
            bottomLeft: false,
            topLeft: false
          }}
          width={this.props.explorer.width}
          height={this.props.explorer.height}
          default={{
            x: 0,
            y: 0,
            width: this.props.explorer.width,
            height: this.props.explorer.height
          }}
          position={{ x: this.props.explorer.x, y: this.props.explorer.y }}
          minWidth={290}
          minHeight={95}
          maxWidth={window.innerWidth - this.props.explorer.x}
          onResizeStop={(e: any, direction: any, ref: HTMLDivElement) => {
            if (ref.style.width && ref.style.height) {
              this.props.updateSize(
                Number(
                  ref.style.width.substring(0, ref.style.width.length - 2)
                ),
                Number(
                  ref.style.height.substring(0, ref.style.height.length - 2)
                )
              );
            }
          }}
          onDragStop={(e: MouseEvent | TouchEvent, data: DraggableData) =>
            this.onDragStop(data)
          }
          enableUserSelectHack
          dragHandleClassName={`.${dragHandleClassName}`}
        >
          <div
            className="explorer-handle"
            style={{ position: "absolute", height: "100", width: "100%" }}
          />
          <div className={`explorer-wrapper`} style={explorerWrapper}>
            <TitleBar
              title={this.props.explorer.title || "Loading..."}
              onClose={() => {
                if (!this.props.explorer.id) return null;
                this.props.closeExplorer();
              }}
            />
            <ExplorerToolbar id={this.props.explorer.id} />
            <div
              style={{
                display: "flex",
                overflow: "auto",
                backgroundColor: "white",
                height: "100%",
                width: "100%"
              }}
            >
              {/* <TreeWindow explorer={this.props.explorer} /> */}
              <ContentWindow
                explorer={this.props.explorer}
                files={this.props.explorer.files}
                selected={this.props.explorer.selected}
              />
            </div>
          </div>
        </Rnd>
      </div>
    );
  }
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<AppState, null, Action>,
  ownProps: OwnProps
): DispatchProps => {
  const { id } = ownProps.explorer;
  return {
    goPreviousState: () => dispatch(goPreviousState()),
    closeExplorer: () => dispatch(closeExplorer(id)),
    updatePosition: (x: number, y: number) =>
      dispatch(updatePosition(x, y, id)),
    updateSize: (width: number, height: number) =>
      dispatch(updateSize(width, height, id))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(ExplorerWindow);
