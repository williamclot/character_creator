import React, { Component } from "react";
import "../css/buttons.css";
// Google Analytics
import ReactGA from 'react-ga';
ReactGA.initialize('UA-41837285-1');

class Buttons extends Component {
  

  render() {
    return (
      <div>
        <div className="abs buttons" id="download" onClick={() => {
          window.export(this.props.characterName);
        }}>
          Download
        </div>
        <div className="abs buttons" id="publish" onClick={() => {
          ReactGA.event({
            category: 'MMF-Hero',
            action: 'Print for £4.99!'
          });
        }}>
          Print for £4.99
        </div>
      </div>
    );
  }
}

export default Buttons;
