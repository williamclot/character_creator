import React, { Component } from 'react'
import { connect } from 'react-redux'

import ThreeContainer from '../ThreeContainer'

import Categories from '../Categories'

import { name, groups } from '../../lib/user_my-human-world.json'
import { objects } from '../../lib'

import { getCategories } from '../../util/helpers'

import { apiEndpoint, accessToken, requestConfig, userName, customizerName } from '../../config'
import Header from '../Header';
import Selector from '../Selector';

import './App.css'

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


    getSelectedGroup = () => this.state.groups[ this.props.selectedGroupIndex ]
    getSelectedCategory = () => {
        const selectedGroup = this.getSelectedGroup()
        return selectedGroup && selectedGroup.categories[ this.props.selectedCategoryIndex ]
    }


    render() {
        const { customizerName, groups } = this.state

        const selectedCategory = this.getSelectedCategory()

        const selectorData = ( selectedCategory ?
            {
                objects:  objects.byCategory[ selectedCategory.name ],
                currentCategory: selectedCategory.name
            } : null
        )

        const categories = getCategories( groups )

        return <div className = "app">

            <Header>
                <h1> {customizerName} </h1>
            </Header>

            <div className = "editor-panel">
                <Categories groups = { groups } />
                <Selector
                    data = { selectorData }
                    onObjectSelected = { this.onObjectSelected }
                />
            </div>

            <ThreeContainer
                categories = { categories }
                loadedObjects = { this.state.loadedObjects }
                width = { window.innerWidth }
                height = { window.innerHeight }
            />

        </div>
    }

}

export default connect(
    state => ({
        selectedGroupIndex: state.selectedCategoryPath.groupIndex,
        selectedCategoryIndex: state.selectedCategoryPath.categoryIndex
    })
)( App )