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
          Download STL file
        </div>
        <div
          className="abs buttons"
          id="buy"
          onClick={() => {
            ReactGA.event({
              category: "MMF-Hero",
              action: "Print for £4.99"
            });
            this.props.updatePopup(true)
          }}
        >
          Get it printed for 5.99$
        </div>
        <div
          className="abs buttons"
          id="share"
          onClick={() => {
            ReactGA.event({
              category: "MMF-Hero",
              action: "Share on MyMiniFactory.com"
            });
            this.props.updatePopup(true)
          }}
        >
          Share on MyMiniFactory.com
        </div>
      </div>
    );
  }
}

export default Buttons;
