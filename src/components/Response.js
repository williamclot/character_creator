import React, { Component } from "react";

// Loading Assets (SubComponents & CSS)
import "../css/response.css";

class Response extends Component {
  render() {
    if (this.props.visible) {
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
      return <div />;
    }
  }
}

export default Response;
