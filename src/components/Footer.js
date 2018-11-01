import React, { Component } from "react";
import Popup from './Popup';

import "../css/footer.css";

import { LIVE_MMF_ENDPOINT } from '../config';

class Footer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      message: "",
      popup: false
    };
  }

  updatePopup = popup => {
    this.setState({ popup });
  };

  render() {
    return (
      <div>
        <Popup
            popupDisplayed={this.state.popup}
            message={this.state.message}
            updatePopup={this.updatePopup}
        />
        <div className="licence abs bottom">
          <a onClick={ () => {
            const content = <span className="a-licence">Licensing associated with files download from Character Creator (beta):
              <a href={`${LIVE_MMF_ENDPOINT}/pages/object-licensing`}>Credit Designer</a>,
              <a href={`${LIVE_MMF_ENDPOINT}/pages/object-licensing`}>Remixing Allowed</a>,
              <a href={`${LIVE_MMF_ENDPOINT}/pages/object-licensing`}>Commercial Use Not Allowed</a></span>
            this.setState({popup: true, message: content});
          }}>Licence Information</a> | 
          <a onClick={() => {
            const content = <span>If you are a Designer or a Brand who would like to create their own custom Creator tool, or if you have any other questions, please get in touch via our <a href={`${LIVE_MMF_ENDPOINT}/contact_us/`}>contact form.</a></span>
            this.setState({popup: true, message: content});
          }}> Want to create you're own customizer or contact us?</a>
        </div>
      </div>
    );
  }
}

export default Footer;
