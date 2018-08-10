import React, { Component } from "react";
import axios from "axios";

import "../../css/selector.css";

import defaultMeshes from '../../library/defaultMeshes.json';

import library from "../../library/heads.json";
import bones from "../../library/bones.json"

class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pose: undefined
    }
  }

  componentDidMount(){
    // Load the base model with defaultMeshes and defaultPose
    axios.get('../../models/poses/default.json')
      .then(res => {
        this.setState({currentPose: res.data})
        this.props.updatePose(res.data)
        window.loadDefaultMeshes(defaultMeshes, bones, res.data)
        // window.loadPose(res.data, bones)
      });
  }

  render() {
    // Passing throught the state from the properties
    const category = "head"
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
