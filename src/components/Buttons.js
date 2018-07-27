import React, { Component } from "react";
import "../css/buttons.css";

class Buttons extends Component {
  render() {
    return (
      <div>
        <div className="abs buttons" id="download" onClick={() => {
          window.export();
        }}>
          Download
        </div>
        <div className="abs buttons" id="publish">
          Publish
        </div>
      </div>
    );
  }
}

export default Buttons;
