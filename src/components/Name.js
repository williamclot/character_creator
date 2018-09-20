import React, { Component } from "react";

// Loading Assets (SubComponents & CSS)
import "../css/name.css";

class Name extends Component {
  render() {
    return (
      <div className="name unselectable abs top left">
       <span className="my">Character</span>Creator
        <span className="beta">(Beta)</span>
      </div>
    );
  }
}

export default Name;
