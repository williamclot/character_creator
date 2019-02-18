import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Group } from 'three'

import ThreeContainer from '../ThreeContainer'
import UploadWizard from '../UploadWizard'
import Header from '../Header';
import Selector from '../Selector';
import { CategoriesView, GroupsView } from '../Categories'

// import { apiEndpoint, accessToken, requestConfig, userName, customizerName } from '../../config'
import SceneManager from '../ThreeContainer/sceneManager'

import { fetchObjects, get3DObject } from '../../util/objectHelpers';
import { getCategories } from '../../util/helpers'

import './App.css'


class App extends Component {

    constructor( props ) {
        super( props )

        this.state = {
            loadedObjects: {},
            
            editMode: false
        }

        const container = new Group
        const categories = getCategories( props.worldData.groups )

        this.sceneManager = new SceneManager( container, categories )
    }

    async componentDidMount() {
        const { objects } = this.props

        const loadedObjects = await fetchObjects( objects.oneOfEach )

        this.setState({
            loadedObjects
        })
    }

    componentDidUpdate( prevProps ) {
        if ( prevProps.worldData !== this.props.worldData ) {
            // // need to reset sceneManager
            // const categories = getCategories( this.props.worldData.groups )
            // this.sceneManager.reset( this.props.categories )
        }
    }

    onObjectSelected = async ( category, objectData ) => {
        const object = await get3DObject( objectData )
        
        this.setState( state => ({
            loadedObjects: {
                ...state.loadedObjects,
                [category]: object
            }
        }))
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

        const uploadWizardVisible = true

        const selectedGroup = this.getSelectedGroup()
        const selectedCategory = this.getSelectedCategory()

        const selectorData = ( selectedCategory ?
            {
                objects:  objects.byCategory[ selectedCategory.name ],
                currentCategory: selectedCategory.name
            } : null
        )

        return <div className = "app">

            <ThreeContainer
                sceneManager = { this.sceneManager }
                loadedObjects = { this.state.loadedObjects }
                poseData = { poseData }
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

            { uploadWizardVisible && (
                <UploadWizard sceneManager = { this.sceneManager } />
            )}

        </div>
    }

}

export default connect(
    state => ({
        selectedGroupIndex: state.selectedCategoryPath.groupIndex,
        selectedCategoryIndex: state.selectedCategoryPath.categoryIndex
    })
)( App )