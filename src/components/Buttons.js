import React, { Component } from "react";
import ReactGA from "react-ga";

// Loading Assets (SubComponents & CSS)
import "../css/buttons.css";

class Buttons extends Component {
  
  componentDidMount() {
    // Google Analytics for the page
    ReactGA.initialize("UA-41837285-1");
  }

  render() {
    return (
      <div>
        <div
          className="abs buttons"
          id="download"
          onClick={() => {
            window.export(this.props.characterName);
            ReactGA.event({
              category: "MMF-Hero",
              action: "Download as STL"
            });
          }}
        >
          Download
        </div>
        <div
          className="abs buttons"
          id="publish"
          onClick={() => {
            ReactGA.event({
              category: "MMF-Hero",
              action: "Print for £4.99"
            });
          }}
        >
          Print for £4.99
        </div>
      </div>
    );
  }
}

export default Buttons;
