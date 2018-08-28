import React, { Component } from 'react';
import $ from "jquery";

import logo from './../graphic_assets/logo.jpg';
import '../css/loader.css'

class PageLoader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        $('.graybackground').css('visibility', 'hidden')
        this.check = setInterval(() => {
            if (window.loaded) {
                clearInterval(this.check)
                this.setState({ loading: false })
                return;
            }
        }, 1000);
    }


    render() {
        if (this.state.loading) {
            return (
                <div className="blackscreen abs top left">
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
export default PageLoader;
