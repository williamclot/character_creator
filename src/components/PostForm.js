import React, { Component } from "react";
import axios from "axios";

// Loading Assets (SubComponents & CSS)
import "../css/postform.css";
import Loader from './Loader';

class PostForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'My Character',
            loader: false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        this.props.updateVisible(false);
        this.setState({ loader: true })
        const accesstoken = this.props.accesstoken
        const stlData = window.export();
        axios({
            method: 'post',
            url: 'https://www.myminifactory.com/api/v2/object',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accesstoken
            },
            data: {
                'name': this.state.name,
                'description': 'This is a file generated by the Character Customizer (beta) of MyMiniFactory. Give it a try at the following link: www.myminifactory.com/character-creator/',
                'tags': "customizer",
                'files': [
                    {
                        'filename': "mytest.stl",
                        'size': 0
                    }
                ]
            }
        })
            .then((response) => {
                const uploadID = response.data.files[0].upload_id;
                // console.log(uploadID)
                axios({
                    method: 'post',
                    url: 'https://www.myminifactory.com/api/v2/file?upload_id=' + uploadID,
                    headers: {
                        'Authorization': 'Bearer ' + accesstoken
                    },
                    data: stlData
                })
                    .then((response) => {
                        this.setState({loader: false})
                    })
            });
    }

    handleInputChange(event) {
        this.setState({
            name: event.value
        });
    }

    renderForm() {
        if (this.props.visible) {
            return (
                <div className="screen abs top left">
                    <div className='abs form'>
                            <div className="title"><h2>Upload to MyMiniFactory</h2></div>
                            <label>
                                Name:
                                    <input
                                    name="name"
                                    type="text"
                                    value={this.state.name}
                                    onChange={this.handleInputChange}
                                />
                            </label>
                            <div className="buttons" value="Submit" onClick={this.handleSubmit}>Submit</div>
                    </div>
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                { this.renderForm() }
                <Loader
                    visible={this.state.loader}
                />
            </div>

        );
    }
}

export default PostForm;
