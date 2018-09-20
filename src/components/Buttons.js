import React, { Component } from "react";
import ReactGA from "react-ga";
import PostForm from './PostForm';

import MyMiniFactoryLogin from 'myminifactory-login';

// Loading Assets (SubComponents & CSS)
import "../css/buttons.css";

class Buttons extends Component {
  constructor(props){
    super(props);
    this.state = {
      formVisible: false,
      accesstoken: '', 
      dev: true
    }
    this.updateVisible = this.updateVisible;
  }

  updateVisible = formVisible => {
    this.setState({ formVisible });
  };

  componentDidMount() {
    // Google Analytics for the page
    ReactGA.initialize("UA-41837285-1");
  }

  
  
  onSuccess = response => {
    this.setState({ formVisible: true })
    this.setState({ accesstoken: response.access_token })
  }
  onFailure = response => console.error(response);
  
  
  
  renderAuthButton() {
    this.redirectUri = (this.state.dev) ? 'http://localhost:3000' : 'https://www.myminifactory.com/character-creator/';
    this.clientKey = (this.state.dev) ? 'customizerDev' : 'character-creator';
    this.mmfAccessToken = accessToken; // Global initialized outside the project
    // this.mmfAccessToken = "test-token"; // Global initialized outside the project
    if (this.mmfAccessToken == null) {
      return (<MyMiniFactoryLogin
        className="abs buttons"
        clientKey={this.clientKey}
        redirectUri={this.redirectUri}
        buttonText="Share on MyMiniFactory.com"
        onSuccess={this.onSuccess}
        onFailure={this.onFailure}
      />);
    } else {
      return (<div
        className="abs buttons"
        id="buy"
        onClick={() => {
          console.log("Click")
          this.setState({ formVisible: true })
        }}
      >
        Get it printed for $4.99
        </div>);
    }
  }

  render() {

    return (
      <div>
        <div
          className="abs buttons"
          id="download"
          onClick={() => {
            window.export(this.props.characterName);
            ReactGA.event({
              category: "MMF-Hero",
              action: "Download as STL"
            });
            for (var key in this.props.loadedMeshes) {
              // check if the property/key is defined in the object itself, not in parent
              if (this.props.loadedMeshes.hasOwnProperty(key)) {           
                  // console.log(key, this.props.loadedMeshes[key]);
                  ReactGA.event({
                    category: "MMF-Hero",
                    action: key,
                    label: this.props.loadedMeshes[key]
                  });
              }
            }
          }}
        >
          Download STL file
        </div>
        <div
          className="abs buttons"
          id="buy"
          onClick={() => {
            ReactGA.event({
              category: "MMF-Hero",
              action: "Get it printed for £4.99!"  
            });
            this.props.updatePopup(true)
            this.props.updatePopupMessage("Sorry this feature is still in development...")
          }}
        >
          Get it printed for $4.99
        </div>
        {/* <div
          className="abs buttons"
          onClick={() => {
            this.props.updatePopup(true)
            this.props.updatePopupMessage("Sorry this feature is still in development...")
          }}
        >
          Share on MyMiniFactory.com
        </div> */}
        {/* <MyMiniFactoryLogin
          className="abs buttons"
          clientKey={clientKey}
          redirectUri={redirectUri}
          buttonText="Share on MyMiniFactory.com"
          onSuccess={onSuccess}
          onFailure={onFailure}
        /> */}
        { this.renderAuthButton() }
        <PostForm
          visible={this.state.formVisible}
          updateVisible={this.updateVisible}
          accesstoken={this.state.accesstoken}
         />
      </div>
    );
  }
}

export default Buttons;
