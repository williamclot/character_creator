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
      accesstoken: ''
    }
  }

  updateVisible = formVisible => {
    this.setState({ formVisible });
  };

  componentDidMount() {
    // Google Analytics for the page
    ReactGA.initialize("UA-41837285-1");
  }

  render() {

    const redirectUri = (process.env.NODE_ENV==="development") ? 'http://localhost:3000' : 'https://www.myminifactory.com/character-creator/';
    const clientKey = (process.env.NODE_ENV==="development") ? 'customizerDev' : 'character-creator';

    const onSuccess = response => {
      console.log(response.access_token)
      this.setState({formVisible: true})
      this.setState({accesstoken: response.access_token})
    }
    const onFailure = response => console.error(response);


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
        <MyMiniFactoryLogin
          className="abs buttons"
          clientKey={clientKey}
          redirectUri={redirectUri}
          buttonText="Share on MyMiniFactory.com"
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
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
