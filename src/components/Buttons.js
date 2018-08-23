import React, { Component } from "react";
import ReactGA from "react-ga";
import axios from "axios";
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
    this.updateVisible = this.updateVisible;
  }

  updateVisible = formVisible => {
    this.setState({ formVisible });
  };

  componentDidMount() {
    // Google Analytics for the page
    ReactGA.initialize("UA-41837285-1");
  }


  render() {

    const onSuccess = response => {
      this.setState({formVisible: true, accesstoken:response.access_token})
      axios({
        method:'get',
        url:'https://www.myminifactory.com/api/v2/user',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+response.access_token
        },
      })
        .then(function(response) {
          console.log(response.data);
      });
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
            // for (var key in this.props.loadedMeshes) {
            //   // check if the property/key is defined in the object itself, not in parent
            //   if (this.props.loadedMeshes.hasOwnProperty(key)) {           
            //       // console.log(key, this.props.loadedMeshes[key]);
            //       ReactGA.event({
            //         category: "MMF-Hero",
            //         action: key,
            //         label: this.props.loadedMeshes[key]
            //       });
            //   }
            // }
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
          }}
        >
          Get it printed for $4.99
        </div>
        <MyMiniFactoryLogin
          className="abs buttons"
          clientKey="character-creator"
          redirectUri="http://localhost:3000"
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
