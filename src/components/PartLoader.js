import React, { Component } from 'react';

import logo from './../graphic_assets/logo.jpg';
import '../css/loader.css'

class PartLoader extends Component {

    componentDidUpdate() {
        this.check = setInterval(() => {
            if (window.partloaded) {
                clearInterval(this.check)
                this.props.updateLoading(false)
                return;
            }
        }, 200);
    }

    componentWillUpdate() {
        clearInterval(this.check)
    }

    render() {
        if (this.props.loading) {
            return (
                <div className="screen abs top left">
                    <div className="abs circle">
                        <img src={logo} alt="logo" />
                    </div>
                </div>
            );
        } else {
            return (
                <div />
            );
        }

    }
}
export default PartLoader;
