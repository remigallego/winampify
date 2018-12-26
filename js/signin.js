import React from "react";

const server = "https://spotifyauth.now.sh";

const Signin = () => {
  return (
    <div className="signin-btn-wrapper">
      <div
        className="signin-btn"
        onClick={() => (window.location = `${server}/login?dev=true`)}
      >
        SIGN IN TO SPOTIFY
      </div>
    </div>
  );
};

export default Signin;
