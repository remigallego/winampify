import React from "react";
import { connect } from "react-redux";
import Rnd, { DraggableData } from "react-rnd";
import {
  closeExplorer,
  updatePosition,
  updateSize,
  goPreviousState
} from "../../actions/explorer";
import { ExplorerWindowStyle } from "./styles";
import ExplorerTree from "./ExplorerTree";
import ExplorerContent from "./ExplorerContent";
import TitleBar from "./TitleBar";

import { FaChevronLeft } from "react-icons/fa";
import "./index.css";
import { SingleExplorerState } from "../../reducers/explorer";
import { Action } from "redux";
import { AppState } from "../../reducers";
import { ThunkDispatch } from "redux-thunk";
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
    const {
      explorerToolbar,
      explorerWrapper,
      searchbox,
      mainView
    } = ExplorerWindowStyle;

    return (
      <div>
        <Rnd /* types are outdated? */
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
          minWidth={400}
          minHeight={200}
          onResizeStop={(e: any, direction: any, ref: HTMLDivElement) => {
            if (ref.style.width && ref.style.height)
              this.props.updateSize(
                Number(
                  ref.style.width.substring(0, ref.style.width.length - 2)
                ),
                Number(
                  ref.style.height.substring(0, ref.style.height.length - 2)
                )
              );
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
              title={this.props.explorer.title}
              onClose={() => {
                if (!this.props.explorer.id) return null;
                this.props.closeExplorer();
              }}
            />
            <div className="explorer-toolbar" style={explorerToolbar}>
              <FaChevronLeft
                onClick={() => {
                  if (this.props.explorer.previousStates.length > 1) {
                    this.props.goPreviousState();
                  }
                }}
              />
              <form
                className="explorer-toolbar-searchbox"
                style={searchbox}
                onSubmit={e => {
                  e.preventDefault();
                }}
              >
                <input
                  type="text"
                  value={this.state.searchText}
                  onChange={e => this.setState({ searchText: e.target.value })}
                />
              </form>
            </div>
            <div className="explorer-mainview" style={mainView}>
              <ExplorerTree explorer={this.props.explorer} />
              <ExplorerContent
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
    goPreviousState: () => dispatch(goPreviousState(id)),
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
