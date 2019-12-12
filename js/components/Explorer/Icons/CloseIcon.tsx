import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { redError, redErrorDark } from "../../../styles/colors";
import styled from "styled-components";

interface Props {
  onClick: () => void | null;
}

export default (props: Props) => {
  const [backgroundColor, setBackgroundColor] = useState("transparent");

  return (
    <Container backgroundColor={backgroundColor} onClick={props.onClick}>
      <FaTimes
        onMouseEnter={() => setBackgroundColor(redError)}
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
  background-color: ${props => props.backgroundColor};
  transition: background-color 0.21s;
  z-index: 55555;
`;
