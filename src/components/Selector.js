import React, { Component } from "react";
import Controller from "./Controller";

import "../css/selector.css";

import headElements from "../library/heads.json";
import handElements from "../library/hands.json";
import armElements from "../library/arm.json";
import torsoElements from "../library/torso.json";
import footElements from "../library/foot.json";
import legElements from "../library/leg.json";
import poseElements from "../library/poses.json";

class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editor: false,
    }
  }

  render() {
    // Passing throught the state from the properties
    const category = this.props.currentCategory;
    const isLeft = this.props.isLeft;
    var library;
    var sideIdencator;

    switch (category) {
      case "head":
        library = headElements;
        sideIdencator = false;
        break;
      case "hand":
        library = handElements;
        sideIdencator = true;
        break;
      case "arm":
        library = armElements;
        sideIdencator = true;
        break;
      case "torso":
        library = torsoElements;
        sideIdencator = false;
        break;
      case "foot":
        library = footElements;
        sideIdencator = true;
        break;
      case "leg":
        library = legElements;
        sideIdencator = true;
        break;
      case "pose":
        library = poseElements;
        sideIdencator = false;
        break;
      default:
        library = headElements;
        sideIdencator = false;
    }

    //JSX element to display the HTML
    const elementDiv = [];

    for (let i = 0; i < library.length; i++) {
      elementDiv.push(
        <div
          className="el"
          key={i}
          onClick={() => {
            if (category==="pose"){
              console.log("this is a pose...")
            } else {
              window.changeMesh(category, library[i], isLeft);
            }
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

    const buttons = (
      <div className="abs switch">
        <div
          className={"abs left side L " + (isLeft ? "side-selected" : "")}
          onClick={() => {
            this.props.updateLeft(true);
            var MeshType;
            switch (category) {
              case "head":
                MeshType = "Head";
                break;
              case "hand":
                MeshType = "HandL";
                break;
              case "arm":
                MeshType = "ArmL";
                break;
              case "torso":
                MeshType = "Torso";
                break;
              case "foot":
                MeshType = "FootL";
                break;
              case "leg":
                MeshType = "LegL";
                break;
              default:
                MeshType = undefined;
            }
            if (MeshType) {
              window.selectedMesh(MeshType);
            }
          }}
        >
          Left
        </div>
        <div
          className={"abs right side R " + (isLeft ? "" : "side-selected")}
          onClick={() => {
            this.props.updateLeft(false);
            var MeshType;
            switch (category) {
              case "head":
                MeshType = "Head";
                break;
              case "hand":
                MeshType = "HandR";
                break;
              case "arm":
                MeshType = "ArmR";
                break;
              case "torso":
                MeshType = "Torso";
                break;
              case "foot":
                MeshType = "FootR";
                break;
              case "leg":
                MeshType = "LegR";
                break;
              default:
                MeshType = undefined;
            }
            if (MeshType) {
              window.selectedMesh(MeshType);
            }
          }}
        >
          Right
        </div>
      </div>
    );

    const editorButtons = (
      <div className="abs switch">
        <div 
          className={"abs left side L " + (this.state.editor ? "" : "side-selected")}
          onClick={() => {this.setState({editor: false})}}
          >Poses</div>
        <div 
          className={"abs right side R " + (this.state.editor ? "side-selected" : "")}
          onClick={() => {this.setState({editor: true})}}
          >Editor</div>
      </div>
    );


    return (
      <div className="abs top right right-side">
        <div className="box">
          {sideIdencator ? buttons : ""}
          {(category === 'pose') ? editorButtons : ""}
        </div>
        <div
          className={
            "abs top left " +
            ((category === "pose" && this.state.editor) ? " selector-full" : "selector") +
            ((sideIdencator || category === 'pose') ? " selector-full" : "")
          }
        >
          {(category === "pose" && this.state.editor) ? <Controller /> : elementDiv}
        </div>
      </div>
    );
  }
}

export default Selector;
