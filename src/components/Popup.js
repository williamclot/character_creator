import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Loading Assets (SubComponents & CSS)
import "../css/popup.css";
import logo from "../graphic_assets/mmf_logo.png";

class Popup extends Component {
    
  render() {
    if (this.props.popupDisplayed){
        return (
            <div className="screen abs top left">
                <div className="popup abs">
                    <img className="abs" src={logo} alt="company logo" />   
                    <div className="abs message">{this.props.message}</div>
                    <FontAwesomeIcon className="abs cross" icon="times-circle" onClick={() => {
                        this.props.updatePopup(false);
                    }}/>
                </div>
            </div>
          );
    } else {
        return (
            <div></div>
        );
    }
    
  }
}

export default Popup;
