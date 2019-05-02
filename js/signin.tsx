import React from "react";

const server =
  process.env.NODE_ENV === "production"
    ? "https://spotifyauth.now.sh"
    : "https://spotifyauthdev.now.sh";

const Signin = () => {
  return (
    <div className="signin-btn-wrapper">
      <div className="signin-btn-flex">
        <div
          className="signin-btn"
          onClick={() => (window.location.href = `${server}/login`)}
        >
          SIGN IN WITH SPOTIFY
        </div>
      </div>
    </div>
  );
};

export default Signin;
