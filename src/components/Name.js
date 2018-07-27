import React, { Component } from "react";
import ContentEditable from "react-contenteditable";
import "../css/name.css";

class Name extends Component {
  handleChange = evt => {
    this.props.updateCharacterName(evt.target.value);
  };

  render() {
    // Passing throught the name state from the properties
    const characterName = this.props.characterName;

    return (
      <ContentEditable
        className="name abs top left"
        html={characterName}
        onChange={this.handleChange}
      />
    );
  }
}

export default Name;
