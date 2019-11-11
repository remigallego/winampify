import React from "react";

const ContentLoading = ({ color }: { color: string }) => {
  return (
    <div
      style={{
        color,
        margin: "0 auto",
        paddingTop: "100px"
      }}
      className="la-line-scale la-2x"
    >
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};

export default ContentLoading;
