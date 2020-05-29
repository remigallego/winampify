import React, { useState } from "react";
import { FaTimes, FaMinus } from "react-icons/fa";
import styled from "styled-components";
import {
  redError,
  redErrorDark,
  blueTitleBarDark
} from "../../../styles/colors";

interface Props {
  onClick: () => void | null;
}

export default (props: Props) => {
  const [backgroundColor, setBackgroundColor] = useState("transparent");

  return (
    <Container backgroundColor={backgroundColor} onClick={props.onClick}>
      <FaMinus
        onMouseEnter={() => setBackgroundColor(blueTitleBarDark)}
        onMouseLeave={() => setBackgroundColor("transparent")}
        onMouseDown={() => setBackgroundColor(redErrorDark)}
        onMouseUp={() => setBackgroundColor(redError)}
        id="disallow-on-top"
        style={{ cursor: "pointer" }}
        size={20}
      />
    </Container>
  );
};

const Container = styled.div<{ backgroundColor: string }>`
  color: white;
  width: 26px;
  background-color: ${props => props.backgroundColor};
  transition: background-color 0.21s;
  z-index: 55555;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
