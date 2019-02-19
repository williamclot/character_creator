import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Object3D, Group } from 'three'

import ThreeContainer from '../ThreeContainer'
import UploadWizard from '../UploadWizard'
import Header from '../Header';
import Selector from '../Selector';
import { CategoriesView, GroupsView } from '../Categories'

// import { apiEndpoint, accessToken, requestConfig, userName, customizerName } from '../../config'
import SceneManager from '../ThreeContainer/sceneManager'

import { fetchObjects, get3DObject } from '../../util/objectHelpers';
import {
    getCategories, objectMap,
    Dict
} from '../../util/helpers'

import './App.css'


class App extends Component {

    constructor( props ) {
        super( props )

        this.state = {
            /**
             * Mapping from part type to object Id
             * @type { Dict<string> }
             */
            loadedObjectIds: {},

            showUploadWizard: false,
            
            editMode: false
        }

        /**
         * Mapping from object id to object
         * @type { Dict<Object3D> }
         */
        this.loadedObjectsById = {}

        const container = new Group
        const categories = getCategories( props.worldData.groups )

        this.sceneManager = new SceneManager( container, categories )
    }

    async componentDidMount() {
        const { objects } = this.props

        const loadedObjectIds = {}

        const fetchedObjects = await fetchObjects( objects.oneOfEach )

        for ( let key of Object.keys( fetchedObjects ) ) {
            const curr = fetchedObjects[key]

            this.loadedObjectsById[curr.id] = curr
            loadedObjectIds[key] = curr.id
        }

        this.setState({
            loadedObjectIds
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
        let newObject
        
        try {
            newObject = await get3DObject( objectData )
        } catch ( err ) {
            console.error(
                `Something went wrong while loading object of type ${category}:\n`
                + err )
            return
        }
        
        const { loadedObjectIds } = this.state
        const currentObjectId = loadedObjectIds[category]

        // delete previous object to make sure it is garbage collected
        delete this.loadedObjectsById[currentObjectId]

        // store new object
        this.loadedObjectsById[newObject.id] = newObject
        
        // now update the id at the key of the current category
        this.setState( state => ({
            loadedObjectIds: {
                ...state.loadedObjectIds,
                [category]: newObject.id
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
        const { showUploadWizard, loadedObjectIds } = this.state

        const selectedGroup = this.getSelectedGroup()
        const selectedCategory = this.getSelectedCategory()

        const selectorData = ( selectedCategory ?
            {
                objects:  objects.byCategory[ selectedCategory.name ],
                currentCategory: selectedCategory.name
            } : null
        )

        const loadedObjects = objectMap(
            loadedObjectIds,
            id => this.loadedObjectsById[id]
        )

        return <div className = "app">

            <ThreeContainer
                sceneManager = { this.sceneManager }
                loadedObjects = { loadedObjects }
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

            { showUploadWizard && (
                <UploadWizard
                    sceneManager = { this.sceneManager }
                />
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