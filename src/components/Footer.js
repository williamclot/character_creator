import React, { Component } from "react";
import "../css/footer.css";

class Footer extends Component {
  render() {
    return (
      <div className="licence abs bottom">
        <a href="licence">Licence</a> | <a href="https://myminifactory.com"> MyMiniFactory</a> © | <a href='mailto:contact@myminifactory.com'>Want to create you're own customizer?</a>
      </div>
    );
  }
}

export default Footer;
