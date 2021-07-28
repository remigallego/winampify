import React, { useState } from "react";
import styled from "styled-components";
import {
  SingleExplorerState,
  ToolbarParameter
} from "../../../reducers/explorer";
import { useDispatch } from "react-redux";
import { Rnd } from "react-rnd";
import {
  commitOffsetParameter,
  updateOffsetParameter
} from "../../../actions/explorer";

interface Props {
  explorer: SingleExplorerState;
}

const RESIZER_WIDTH = 5;

const ExplorerParameters = (props: Props) => {
  const [isResizing, setIsResizing] = useState<string>();
  const parameters = props.explorer.toolbarParams;
  const dispatch = useDispatch();

  const explorerWidth = props.explorer.width;
  let toolbarWidth = (() => {
    let width = 0;
    Object.values(parameters).forEach(par => {
      width += par.width + par.offset;
    });
    return width + 22;
  })();

  return (
    <Bar
      onMouseUp={e => {
        if (isResizing) {
          dispatch(commitOffsetParameter(props.explorer.id, isResizing));
          setIsResizing(null);
        }
      }}
      onMouseMove={e => {
        if (!isResizing) return;
        const positionOfParameter = parameters[isResizing].position;
        let widthToSubstract = 0;
        if (positionOfParameter === 0) {
        } else {
          for (let i = 0; i < positionOfParameter; i++) {
            widthToSubstract +=
              Object.values(parameters).find(val => val.position === i).width +
              Object.values(parameters).find(val => val.position === i).offset +
              RESIZER_WIDTH * 2;
          }
        }

        if (
          toolbarWidth +
            e.clientX -
            parameters[isResizing].width -
            parameters[isResizing].offset -
            widthToSubstract >=
          explorerWidth
        )
          return;

        const newOffset =
          e.clientX - parameters[isResizing].width - widthToSubstract;
        if (parameters[isResizing].width + newOffset < 80) return;
        dispatch(
          updateOffsetParameter(
            props.explorer.id,
            isResizing,
            e.clientX - parameters[isResizing].width - widthToSubstract - 11
          )
        );
      }}
    >
      <ParameterContainer>
        {Object.values(parameters).map((param: ToolbarParameter) => {
          return (
            <InlineBlock
              style={{
                width: param.width + param.offset
              }}
            >
              <div
                style={{
                  flexDirection: "row",
                  display: "flex"
                }}
              >
                <div
                  id={"title-parameter"}
                  style={{
                    height: 20,
                    backgroundColor: isResizing
                      ? "rgba(0,0,0,0.2)"
                      : "transparent",
                    //  width: param.width + param.offset,
                    width: param.width + param.offset - RESIZER_WIDTH
                  }}
                >
                  {param.title}
                </div>
                <InlineBlock
                  onMouseOver={e => {}}
                  onMouseDown={e => {
                    setIsResizing(param.title);
                  }}
                  id={"resizer-parameter"}
                  style={{
                    height: 20,
                    width: RESIZER_WIDTH,
                    cursor: "col-resize"
                  }}
                >
                  <div
                    style={{
                      height: 20,
                      width: 3,
                      backgroundColor: "rgba(0,0,0,0.3)"
                    }}
                  />
                </InlineBlock>
              </div>
            </InlineBlock>
          );
        })}
      </ParameterContainer>
    </Bar>
  );
};

export default ExplorerParameters;

const Bar = styled.div`
  background-color: ${props => props.theme.explorer.toolbar.bg};
  border-top: 0.5px solid rgba(0, 0, 0, 0.1);
  transition: all 0.5s;
  width: 100%;
  height: auto;
`;

const ParameterContainer = styled.div`
  padding: 5px 0px 5px 22px;
  display: inline-block;
`;

const InlineBlock = styled.div`
  display: inline-block;
`;

const FlexRowContainer = styled.div``;

const Parameter = styled.div<{ width: number }>`
  color: black;
  width: ${props => `${props.width}px`};
`;
