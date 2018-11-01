import React, { Component } from "react";
import ReactGA from "react-ga";
import PostForm from './PostForm';

import MyMiniFactoryLogin from 'myminifactory-login';

import * as env from '../config.js';

// Loading Assets (SubComponents & CSS)
import "../css/buttons.css";

class Buttons extends Component {
  constructor(props){
    super(props);

    /**
     * @type {string | undefined}
     * global initialized outside this project.
     * it can have one of the following values:
     * - undefined -- this project is running independently;
     * - "" -- the value was initialized outside this project, but user not logged in
     * - "<valid-token>" -- user is logged in (unless the token is invalid or expired)
     */
    const accesstoken = window.accessToken;

    this.state = {
      formVisible: false,
      isLoggedIn: Boolean(accesstoken), // true only if it is defined and not the empty string
      accesstoken
    }
  }

  updateVisible = formVisible => {
    this.setState({ formVisible });
  };

  componentDidMount() {
    // Google Analytics for the page
    ReactGA.initialize("UA-41837285-1");
  }
  
  renderAuthButton(message) {
    if (env.isIntegrated) { // when integrated, the login popup from MMF site can be accessed
      return <div
        className = "abs buttons"
        onClick = {() => {
          // the following jQuery command will reveal the login popup
          try {
            // eslint-disable-next-line no-undef
            $('#loginscreen').foundation('reveal', 'open');
          } catch (err) {
            console.error(err);
          }
        }}
      >
        {message}
      </div>;
    } else { // when stand-alone, MyMiniFactoryLogin will be used
      return <MyMiniFactoryLogin
        className="abs buttons"
        clientKey={env.CLIENT_KEY}
        redirectUri={env.REDIRECT_URI}
        buttonText={message}
        onSuccess={response => this.setState({
          formVisible: true,
          accesstoken: response.access_token,
          isLoggedIn: true
        })}
        onFailure={response => console.error(response)}
      />;
    }
  }

  render() {
    const { isLoggedIn } = this.state;

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
        { !isLoggedIn ? 
          this.renderAuthButton("Share on MyMiniFactory.com") 
          :
          <div
            className="abs buttons"
            onClick={() => this.setState({ formVisible: true })}
          >
            Upload to MyMiniFactory
          </div>
        }
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
