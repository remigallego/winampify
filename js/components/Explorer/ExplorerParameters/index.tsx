import React from "react";
import styled from "styled-components";
import { SingleExplorerState } from "../../../reducers/explorer";
import { useDispatch } from "react-redux";
import Rnd from "react-rnd";
import { commitOffsetParameter } from "../../../actions/explorer";

interface Props {
  explorer: SingleExplorerState;
}

const ExplorerParameters = (props: Props) => {
  const parameters = props.explorer.toolbarParams;
  const dispatch = useDispatch();

  return (
    <Bar>
      <FlexRowContainer>
        {Object.values(parameters).map(param => {
          return (
            <div
              style={{
                height: 20,
                width: param.width + param.offset,
                border: "1px solid #adadad",
                borderBottomWidth: 0,
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 1.2
              }}
            >
              <Rnd
                width={param.width + param.offset}
                default={{
                  x: 0,
                  y: 0,
                  width: param.width + param.offset,
                  height: 100
                }}
                minWidth={60}
                style={{
                  zIndex: param.title === "Name" ? 2222 : 1
                }}
                onResize={() => {
                  /*  dispatch(
                    updateOffsetParameter(
                      props.explorer.id,
                      param.title,
                      d.width
                    )
                  ); */
                }}
                onResizeStop={() => {
                  dispatch(
                    commitOffsetParameter(props.explorer.id, param.title)
                  );
                }}
                enableResizing={{
                  right: true
                }}
                disableDragging={true}
              >
                <Parameter width={param.width + param.offset}>
                  <div
                    style={{
                      paddingLeft: 5,
                      overflow: "auto",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {param.title}
                  </div>
                </Parameter>
              </Rnd>
            </div>
          );
        })}
      </FlexRowContainer>
    </Bar>
  );
};

export default ExplorerParameters;

const Bar = styled.div`
  background-color: ${props => props.theme.explorer.toolbar.bg};
  border-top: 0.5px solid rgba(0, 0, 0, 0.1);
  transition: all 0.5s;
  width: auto;
  height: auto;
  padding: 5px 0px 5px 22px;
`;

const FlexRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
  overflow: hidden;
`;

const Parameter = styled.div<{ width: number }>`
  color: black;
  width: ${props => `${props.width}px`};
`;
