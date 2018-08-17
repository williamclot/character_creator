import React, { Component } from "react";
import Editor from "./Editor";
import axios from "axios";

import "../css/selector.css";

import defaultMeshes from '../library/defaultMeshes.json';

import headElements from "../library/heads.json";
import handElements from "../library/hands.json";
import armElements from "../library/arm.json";
import torsoElements from "../library/torso.json";
import footElements from "../library/foot.json";
import legElements from "../library/leg.json";
import standElements from "../library/stands.json";
import poseElements from "../library/poses.json";
import bones from "../library/bones.json"

class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editor: false,
      pose: undefined
    }
  }

  componentDidMount() {
    // Load the base model with defaultMeshes and defaultPose
    axios.get('models/poses/default.json')
      .then(res => {
        this.setState({ currentPose: res.data })
        this.props.updatePose(res.data)
        window.loadDefaultMeshes(defaultMeshes, bones, res.data)
      });
  }

  applyPose(file) {
    let poseData;
    //Ajax in react
    axios.get('models/poses/' + file + '.json')
      .then(res => {
        poseData = res.data
        this.setState({ pose: poseData })
        this.props.updatePose(poseData)
        window.loadPose(poseData, bones)
      });
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
      case "stand":
        library = standElements;
        sideIdencator = false;
        break;
      default:
        library = headElements;
        sideIdencator = false;
    }

    //JSX element to display the HTML
    const elementDiv = [];
    const settingsDiv = [];

    for (let i = 0; i < library.length; i++) {
      elementDiv.push(
        <div
          className="el"
          key={i}
          onClick={() => {
            let meshType;
            switch (category) {
              case "torso":
                meshType = "Torso";
                break;
              case "head":
                meshType = "Head";
                break;
              case "hand":
                meshType = (isLeft) ? "HandL" : "HandR";
                break;
              case "arm":
                meshType = (isLeft) ? "ArmL" : "ArmR";
                break;
              case "foot":
                meshType = (isLeft) ?  "FootL" : "FootR";
                break;
              case "leg":
                meshType = (isLeft) ?  "LegL" : "LegR";
                break;
              default:
                meshType = undefined;
            }
            if (category === "pose") {
              this.applyPose(library[i].file);
            } else if (category === "stand") {
              window.changeStand(library[i].file);
            } else {
              window.changeMesh(category, library[i], isLeft, bones, this.state.pose);
              let loadedMeshes = this.props.loadedMeshes;
              loadedMeshes[meshType] = library[i].file;
              this.props.updateMeshes(loadedMeshes);
            }
          }}
        >
          <div className="img">
            <img
              src={"img/library/" + category + "/" + library[i].img}
              alt={library[i].img}
            />
          </div>
          <div className="unselectable el-name">{library[i].name}</div>
        </div>
      );
    }
    elementDiv.push(
      <div
        className="el"
        key="add"
        onClick={() => {
          this.props.updatePopup(true)
        }}
      >
        <div className="img" >
          <img
            className="plus"
            src="img/library/plus.svg"
            alt="plus sign"
          />
        </div>
        <div className="unselectable el-name">Add your designs</div>
      </div>
    );

    const buttons = (
      <div className="abs switch">
        <div
          className={"unselectable abs left side L " + (isLeft ? "side-selected" : "")}
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
          className={"unselectable abs right side R " + (isLeft ? "" : "side-selected")}
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
          className={"unselectable abs left side L " + (this.state.editor ? "" : "side-selected")}
          onClick={() => { this.setState({ editor: false }) }}
        >Poses</div>
        <div
          className={"unselectable abs right side R " + (this.state.editor ? "side-selected" : "")}
          onClick={() => { this.setState({ editor: true }) }}
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
          {(category === "pose" && this.state.editor) ? <Editor /> : elementDiv}
        </div>
      </div>
    );
  }
}

export default Selector;
