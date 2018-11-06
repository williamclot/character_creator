import React, { Component } from 'react';

class AddYourDesignForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rotation: {
                x: 0,
                y: 0,
                z: 0
            }
        };
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNumberInput = this.handleNumberInput.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const file = e.target.file_upload.files[0];

        if(!file) {
            return;
        }
        
        const reader = new FileReader();
        reader.onload = () => {
            window.changeMesh(
                null,
                {
                    meshType: this.props.meshType,
                    file: file.name,
                    rotation: this.state.rotation,
                    poseData: this.props.pose,
                    shouldParse: true,
                    data: reader.result
                }
            )            
        };
        reader.readAsArrayBuffer(file);


    }

    handleNumberInput(e) {
        const { name, value } = e.target;
        this.setState({
            rotation: {
                ...this.state.rotation,
                [name]: Number.parseFloat(value),
            }
        })
    }

    renderNumericInput(axis) {
        return <input
            type = "number"
            // accept = "[0-9]*(\.[0-9]*)"
            name = {axis}
            value = {this.state.rotation[axis]}
            onInput = {this.handleNumberInput}
            style = {{ width: "30px", margin: "0 5px" }}
        />
    }

    render() {
        return (
            <form onSubmit = {this.handleSubmit} >
                <input type="file" name = "file_upload" />
                <br/>
                Choose rotation:
                <div>
                    x:{this.renderNumericInput("x") }
                    y:{this.renderNumericInput("y") }
                    z:{this.renderNumericInput("z") }
                </div>
                <br/>
                <input type = "submit" value = "Submit" ></input>
            </form>
        );
    }
}

export default AddYourDesignForm;