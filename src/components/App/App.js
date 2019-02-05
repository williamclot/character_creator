import React, { Component } from 'react'
import { connect } from 'react-redux'

import ThreeContainer from '../ThreeContainer'
import Header from '../Header';
import Selector from '../Selector';
import { CategoriesView, GroupsView } from '../Categories'

// import { apiEndpoint, accessToken, requestConfig, userName, customizerName } from '../../config'

import { getCategories } from '../../util/helpers'

import * as defaultProps from '../../lib'
import './App.css'


class App extends Component {

    constructor( props ) {
        super( props )

        this.state = {
            loadedObjects: props.objects.oneOfEach,
            
            editMode: false
        }
    }


    componentDidMount = async () => {
        // for ( let [ category, data ] of Object.entries( objects.oneOfEach ) ) {
        //     // do smth
        // }
        
        // const { objects } = this.props
        // this.setState({
        //     loadedObjects: objects.oneOfEach
        // })
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


    getSelectedGroup = () => this.props.worldData.groups[ this.props.selectedGroupIndex ]
    getSelectedCategory = () => {
        const selectedGroup = this.getSelectedGroup()
        return selectedGroup && selectedGroup.categories[ this.props.selectedCategoryIndex ]
    }


    render() {
        const {
            worldData: { name, groups },
            objects,
            poseData
        } = this.props

        const selectedGroup = this.getSelectedGroup()
        const selectedCategory = this.getSelectedCategory()

        const selectorData = ( selectedCategory ?
            {
                objects:  objects.byCategory[ selectedCategory.name ],
                currentCategory: selectedCategory.name
            } : null
        )

        const categories = getCategories( groups )

        return <div className = "app">

            <ThreeContainer
                categories = { categories }
                loadedObjects = { this.state.loadedObjects }
                poseData = { poseData }

                width = { window.innerWidth }
                height = { window.innerHeight }
            />

            <Header>
                <h1>{ name }</h1>
            </Header>

            <div className = "editor-panel">

                <div className = "groups-container">
                    <GroupsView groups = { groups } />
                </div>
                
                <div className = "selector-container">
                    <CategoriesView categories = { selectedGroup.categories } />
                    <Selector
                        data = { selectorData }
                        onObjectSelected = { this.onObjectSelected }
                    />
                </div>
            </div>

        </div>
    }

}

App.defaultProps = defaultProps

export default connect(
    state => ({
        selectedGroupIndex: state.selectedCategoryPath.groupIndex,
        selectedCategoryIndex: state.selectedCategoryPath.categoryIndex
    })
)( App )