import React, { useState } from "react";

interface Props {
  initialValue: string;
  confirmRenameFile: (e: any) => void;
}

const InputRenaming = (props: Props) => {
  const [text, setText] = useState(props.initialValue);

  return (
    <form onSubmit={props.confirmRenameFile}>
      <input
        style={{
          fontSize: "14px",
          textAlign: "center",
          backgroundColor: "white",
          textShadow: "none",
          color: "black",
          border: "1px dotted transparent",
          borderStyle: "dotted",
          boxSizing: "border-box",
          outline: "none",
          margin: 0,
          padding: 0
        }}
        onChange={val => setText(val.target.value)}
        value={text}
      />
    </form>
  );
};

export default InputRenaming;
