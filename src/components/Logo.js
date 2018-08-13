import React, { Component } from "react";
import "../css/logo.css";
import logo from "../graphic_assets/mmf_logo.png";

class Logo extends Component {
  render() {
    return (
      <div className="logo abs bottom left">
        <img src={logo} alt="company logo" />
      </div>
    );
  }
}

export default Logo;
