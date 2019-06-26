import React from "react";
import environments from "../../environments";

const server =
  process.env.NODE_ENV === "production"
    ? environments.prod.authServer
    : environments.dev.authServer;

const Signin = () => {
  return (
    <div className="signin-btn-wrapper">
      <div className="signin-btn-flex">
        <div
          className="signin-btn"
          // onClick={() => (window.location.href = `${server}/login`)}
          onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            window.open(
              `${server}/login`,
              "PopupWindow",
              `width=500,height=700,left=${e.screenX - 250},top=${e.screenY -
                350}`
            );
          }}
        >
          SIGN IN WITH SPOTIFY PREMIUM
        </div>
      </div>
    </div>
  );
};

export default Signin;
