import React, { Component } from 'react'
import axios from 'axios'

import { name, groups } from './lib/user_my-human-world.json'

import { apiEndpoint, accessToken, requestConfig, userName, customizerName } from './config'

class App extends Component {

    constructor( props ) {
        super( props )

        this.state = {
            customizerName: name,
            groups
        }
    }

    /*
    async componentDidMount() {
        const res = await axios.get(
            `${apiEndpoint}/users/${userName}/customizers/${customizerName}`
        )

        const { name, groups } = res.data

        this.setState({
            customizerName: name,
            groups
        })
    }
    */

    render() {
        return <h1> HELLO </h1>
    }

}

export default App