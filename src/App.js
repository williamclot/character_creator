import React, { Component } from 'react';
import {BrowserView, MobileView} from "react-device-detect";
import Typed from 'react-typed';

// Google Analytics
import ReactGA from 'react-ga';

// Loading assets
import './css/master.css'
import logo from "./graphic_assets/mmf_logo.png";


// Loading the data this way for now
import data from './library/category.json';

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
    // Google Analytics startup
    ReactGA.initialize('UA-41837285-1');
    ReactGA.pageview('/mmf-hero');
  }
 
  render() {
    return (
      <div>
        <BrowserView>
        <Name
          characterName = {this.state.characterName}
          updateCharacterName = {this.updateCharacterName}
        />
        <Logo />
        <Buttons
          characterName = {this.state.characterName} 
        />

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
        </BrowserView>
        <MobileView>
          <div className="abs top left smartphone">
            <img src={logo} alt="company logo" />
            <div className="fullScreenMessage">
              <Typed
                strings={[
                  'Sorry, this content is currently unavailable on mobile... ^2000', 
                  'Come back soon for updates!'
                  ]}
                typeSpeed={40}
                showCursor={false}
              />
            </div>
          </div>
        </MobileView>
      </div>
    );
  }
}

export default App;
