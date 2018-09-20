import React, { Component } from "react";

// Loading Assets (SubComponents & CSS)
import "../css/response.css";

class Response extends Component {
  render() {
    if (this.props.visible) {
      if (this.props.status) {
        return (
          <div className="screen abs top left">
            <div className="abs check_mark">
              <div className="sa-icon sa-success animate">
                <span className="sa-line sa-tip animateSuccessTip" />
                <span className="sa-line sa-long animateSuccessLong" />
                <div className="sa-placeholder" />
                <div className="sa-fix" />
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="screen abs top left">
            <div className="abs check_mark">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                <circle className="path circle" fill="none" stroke="#D06079" cx="65.1" cy="65.1" r="62.1"/>
                <line className="path line" fill="none" stroke="#D06079" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>
                <line className="path line" fill="none" stroke="#D06079" x1="95.8" y1="38" x2="34.4" y2="92.2"/>
              </svg>
            </div>
          </div>
        );
      }
    } else {
      return <div />;
    }
  }
}

export default Response;
