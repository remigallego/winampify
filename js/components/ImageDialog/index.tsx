import React, { useLayoutEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { ImageDialogType } from "../../types";
import TitleBar from "../Explorer/TitleBar";
import { toggleMinimize } from "../../actions/windows";
import { useDispatch } from "react-redux";
import { onDragStop, onDragStart } from "../../actions/images";
import Rnd, { DraggableData } from "react-rnd";

interface Props {
  image: ImageDialogType;
  key: string;
  onDismiss: () => void;
}

export default (props: Props) => {
  const [animation, setAnimation] = useState<"grow" | "shrink" | "">("");

  /*   useLayoutEffect(() => {
    setAnimation("grow");
    setTimeout(() => setAnimation(""), 250);
  }, []);
 */
  const dispatch = useDispatch();

  const handleDragStop = (data: DraggableData) => {
    const { clientHeight, clientWidth } = document.documentElement;
    const width = 400;
    const height = 400;
    const rightMostPoint = data.x + width;
    const bottomMostPoint = data.y + height;

    let x = data.x;
    let y = data.y;

    if (rightMostPoint > clientWidth) x = clientWidth - width;
    if (x < 0) x = 0;
    if (bottomMostPoint > clientHeight) y = clientHeight - height;
    if (y < 0) y = 0;

    /*     if (x === explorer.x && y === explorer.y) return; */
    dispatch(onDragStop(props.image.id, x, y));
  };

  console.log(props.image.x);

  return (
    <>
      <Rnd
        key={props.key}
        position={{
          x: props.image.x,
          y: props.image.y
        }}
        onDragStart={e => {
          dispatch(onDragStart(props.image.id));
        }}
        onDragStop={(e: any, data: DraggableData) => handleDragStop(data)}
      >
        <Container enableShadow={animation.length === 0}>
          <Animated animation={animation}>
            <TitleBar
              title={props.image.title}
              onMinimize={() => {
                dispatch(toggleMinimize(props.image.id));
              }}
              onClose={() => {
                setAnimation("shrink");
                setTimeout(() => props.onDismiss(), 250);
              }}
            ></TitleBar>
            <Image
              draggable={false}
              src={props.image.source}
              className={"unselectable-image"}
              onMouseDown={e => e.preventDefault()}
              height={400}
              width={400}
              hidden={animation === "grow"}
            />
          </Animated>
        </Container>
      </Rnd>
    </>
  );
};

const Container = styled.div<{ enableShadow: boolean }>`
  position: absolute;
  width: 400px;
  border-top-left-radius: 4px;
  resize: both;
  overflow: auto;
  ${props =>
    props.enableShadow &&
    css`
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
        0 6px 20px 0 rgba(0, 0, 0, 0.19);
    `}
`;

const Image = styled.img`
  display: block;
  height: 400;
  width: 400;
`;

const Animated = styled.div<{ animation: "grow" | "shrink" | "" }>`
  ${props =>
    props.animation === "grow" &&
    css`
      animation: ${growBox} 0.26s;
      animation-timing-function: ease-out;
    `}
  ${props =>
    props.animation === "shrink" &&
    css`
      animation: ${growBox} 0.17s forwards;
      animation-timing-function: ease-out;
      animation-direction: reverse;
    `}
`;

const growBox = keyframes`
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;
