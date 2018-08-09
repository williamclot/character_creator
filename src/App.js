import React, { Component } from 'react';
import './css/master.css'

// Loading the data this way for now
import data from './library/category.json';
import defaultMeshes from './library/defaultMeshes.json'

// Loading the different components
import Name from './components/Name';
import Logo from './components/Logo';
import Category from './components/Category';
import Buttons from './components/Buttons';

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      category: data,
      currentCategory: "head",
      characterName: "give it a name",
      currentPose: undefined,
      UIDisplayed: true
    }
    this.updateCategory = this.updateCategory
    this.updateCharacterName = this.updateCharacterName
    this.updatePose = this.updatePose
  }

  // Update the state of parent App from child Component
  updateCategory = (currentCategory) => {this.setState({currentCategory})}
  updateCharacterName = (characterName) => {this.setState({characterName})}
  updatePose = (currentPose) => {this.setState({currentPose})}


  componentDidMount(){
    // Load the base model
    window.loadDefaultMeshes(defaultMeshes)
  }

  render() {
    return (
      <div>
        <Name
          characterName = {this.state.characterName}
          updateCharacterName = {this.updateCharacterName}
        />
        <Logo />
        <Buttons />

        <div className="abs top right panel">
          <Category
            category = {this.state.category}
            currentCategory = {this.state.currentCategory}
            updateCategory = {this.updateCategory}
            currentPose = {this.state.currentPose}
            updatePose = {this.updatePose}
            UIDisplayed = {this.state.UIDisplayed}
          />
        </div>
      </div>
    );
  }
}

export default App;
