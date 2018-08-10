import React, { Component } from "react";

import "../../css/selector.css";

import library from "../../library/heads.json";
import bones from "../../library/bones.json"

class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pose: undefined
    }
  }

  render() {
    // Passing throught the state from the properties
    const category = "torso"
    const isLeft = undefined;

    //JSX element to display the HTML
    const elementDiv = [];

    for (let i = 0; i < library.length; i++) {
      elementDiv.push(
        <div
          className="el"
          key={i}
          onClick={() => {
            window.changeMesh(category, library[i], isLeft, bones, this.state.pose);
          }}
        >
          <div className="img">
            <img
              src={"img/library/" + category + "/" + library[i].img}
              alt={library[i].img}
            />
          </div>
          <div className="el-name">{library[i].name}</div>
        </div>
      );
    }

    return (
      <div className="abs top right right-side">
        <div className="box"></div>
        <div className="abs top left selector">
          {elementDiv}
        </div>
      </div>
    );
  }
}

export default Selector;
