import React, { Component } from "react";
import NumericInput from 'react-numeric-input';

import "../css/controller.css"

import bones from "../library/bones.json"


class Controller extends Component {
  constructor(props){
    super(props);
    this.state = {
      Torso_Hip : {x:0, y:0, z:0},
      Torso_Spine : {x:0, y:0, z:0},
      Torso_Chest : {x:0, y:0, z:0},
      Head_Neck : {x:0, y:0, z:0},
      Head_Head : {x:0, y:0, z:0},
      Torso_Sholder_L : {x:0, y:0, z:0},
      ArmL_UpperArm_L : {x:0, y:0, z:0},
      ArmL_LowerArm_L : {x:0, y:0, z:0},
      HandL_Hand_L : {x:0, y:0, z:0},
      Torso_Sholder_R : {x:0, y:0, z:0},
      ArmR_UpperArm_R : {x:0, y:0, z:0},
      ArmR_LowerArm_R : {x:0, y:0, z:0},
      HandR_Hand_R : {x:0, y:0, z:0},
      LegL_UpperLeg_L : {x:0, y:0, z:0},
      LegL_LowerLeg_L : {x:0, y:0, z:0},
      FootL_Foot_L : {x:0, y:0, z:0},
      FootL_Toes_L : {x:0, y:0, z:0},
      LegR_UpperLeg_R : {x:0, y:0, z:0},
      LegR_LowerLeg_R : {x:0, y:0, z:0},
      FootR_Foot_R : {x:0, y:0, z:0},
      FootR_Toes_R : {x:0, y:0, z:0}
    }
  }
  
  componentDidMount() {
    for (let i=0; i<bones.length; i++){
      let bone = bones[i].bone;
      // window.getRotation(bone);
      this.setState({[bone]: window.getRotation(bone)})
    }
  }


  

  render() {

    function exportPose(){
      for (let i=0; i<bones.length; i++){
        let bone = bones[i].bone;
        // window.getRotation(bone);
        this.setState({[bone]: window.getRotation(bone)})
      }
    }

    //JSX element to display the HTML
    const controls = [];

    for (let i=0; i<bones.length; i++){
      let bone = bones[i].bone;
      controls.push(  
        <div className="bone-control" key={i}>
          <p>{bones[i].name}</p>
          <div className="flexcontainer">
            <NumericInput 
              min={-3.1} 
              max={3.1} 
              step={0.1} 
              value={this.state[bone].x} 
              onChange={ value => {
                this.setState({ [bone]: {x:value, y:this.state[bone].y, z:this.state[bone].z }})
                window.changeRotation(bone, value, "x")
              }}/>
              <NumericInput 
              min={-3.1} 
              max={3.1} 
              step={0.1} 
              value={this.state[bone].y} 
              onChange={ value => {
                this.setState({ [bone]: {x:this.state[bone].x, y:value, z:this.state[bone].z }}) 
                window.changeRotation(bone, value, "y")
              }}/>
              <NumericInput 
              min={-3.1} 
              max={3.1} 
              step={0.1} 
              value={this.state[bone].z}
              onChange={ value => {
                this.setState({ [bone]: {x:this.state[bone].x, y:this.state[bone].y, z:value }})
                window.changeRotation(bone, value, "z")

              }}/>
          </div>
        </div>
      )
    }
      

    return (
      <div>
        <div className="button">Export</div>  
          {controls}
      </div>
    );
  }
}

export default Controller;
