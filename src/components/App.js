import React, { Component } from 'react'

import ThreeContainer from './ThreeContainer'

import Categories from '../containers/Categories'

import { name, groups } from '../lib/user_my-human-world.json'

import { apiEndpoint, accessToken, requestConfig, userName, customizerName } from '../config'

class App extends Component {

    constructor( props ) {
        super( props )

        this.state = {
            customizerName: name,
            groups,
            
            testKey: 'test',
            
            editMode: false
        }

        window.test = k => this.setState({ testKey: k })
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
        const { customizerName, groups } = this.state

        return <>
            <h1> {customizerName} </h1>
            
            <Categories groups = {groups} />

            <ThreeContainer
                testKey = { this.state.testKey }
                width = { window.innerWidth }
                height = { window.innerHeight }
            />
        </>
    }

}

export default App