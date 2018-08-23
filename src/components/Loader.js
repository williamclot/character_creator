import React, { Component } from 'react';

import logo from './../graphic_assets/logo.jpg';
import '../css/loader.css'

class Loader extends Component {

    render() {
        if (this.props.visible) {
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
export default Loader;
