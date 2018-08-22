import React, { Component } from "react";
import axios from "axios";

// Loading Assets (SubComponents & CSS)
import "../css/postform.css";

class PostForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: ''
        }
    }


    render() {
        return (
            <div className='abs form'>

            </div>
        );
    }
}

export default PostForm;
