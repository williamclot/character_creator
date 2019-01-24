import React, { Component } from 'react'

import ThreeContainer from '../ThreeContainer'

import Categories from '../Categories'

import { name, groups } from '../../lib/user_my-human-world.json'
import { objects } from '../../lib'

import { getCategories } from '../../util/helpers'

import { apiEndpoint, accessToken, requestConfig, userName, customizerName } from '../../config'

class App extends Component {

    constructor( props ) {
        super( props )

        this.state = {
            customizerName: name,
            groups,
            loadedObjects: {},
            
            editMode: false
        }
    }


    componentDidMount = async () => {
        // for ( let [ category, data ] of Object.entries( objects.oneOfEach ) ) {
        //     // do smth
        // }

        this.setState({
            loadedObjects: objects.oneOfEach
        })
    }

    onObjectSelected = ( category, object ) => {
        const stateReducer = state => ({
            loadedObjects: {
                ...state.loadedObjects,
                [category]: object
            }
        })

        this.setState( stateReducer )
    }


    render() {        
        const { customizerName, groups } = this.state

        return <>
            <h1> {customizerName} </h1>
            
            <div className = "editor-panel">
                <Categories groups = { groups } />
                <Selector />
            </div>

            <ThreeContainer
                categories = { getCategories( groups ) }
                loadedObjects = { this.state.loadedObjects }
                width = { window.innerWidth }
                height = { window.innerHeight }
            />
        </>
    }

}

export default App