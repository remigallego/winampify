import React, { useState } from "react";

interface Props {
  selectZoneId: string;
  onSelect: (
    origin: { x: number; y: number },
    target: { x: number; y: number }
  ) => void;
  children: JSX.Element[];
}

export default (props: Props) => {
  const [isActive, toggle] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [target, setTarget] = useState({ x: 0, y: 0 });

  const handleTransformBox = () => {
    if (origin.y > target.y && origin.x > target.x)
      return "scaleY(-1) scaleX(-1)";
    if (origin.y > target.y) return "scaleY(-1)";
    if (origin.x > target.x) return "scaleX(-1)";
    return "";
  };

  return (
    <div
      onMouseDown={e => {
        // Scope it to left click and targeted to the desktop zone
        if (
          e.button === 0 &&
          e.target?.id?.split(" ").indexOf(props.selectZoneId) !== -1
        ) {
          toggle(true);
          setOrigin({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
          setTarget({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
        }
      }}
      onMouseLeave={() => toggle(false)}
      onMouseUp={() => toggle(false)}
      onMouseMove={evt => {
        if (isActive) {
          setTarget({ x: evt.nativeEvent.clientX, y: evt.nativeEvent.clientY });
          props.onSelect(origin, target);
        }
      }}
    >
      {isActive && (
        <div
          className="selection-box"
          style={{
            zIndex: 7,
            left: origin.x,
            top: origin.y,
            height: Math.abs(target.y - origin.y),
            width: Math.abs(target.x - origin.x),
            transformOrigin: "top left",
            transform: handleTransformBox()
          }}
        />
      )}
      {props.children}
    </div>
  );
};
