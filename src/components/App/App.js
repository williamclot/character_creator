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

import { fetchObjects, get3DObject, getObjectFromGeometry } from '../../util/objectHelpers';
import {
    getCategories, getNameAndExtension,
    Dict
} from '../../util/helpers'

import './App.css'


class App extends Component {

    constructor( props ) {
        super( props )

        this.state = {
            /**
             * Mapping from part type to threejs object
             * @type { Dict<Object3D> }
             */
            loadedObjects: {},

            objectsByCategory: props.objects.byCategory,

            showUploadWizard: false,
            uploadedObjectData: null,
            
            editMode: false
        }
        
        const container = new Group
        const categories = getCategories( props.worldData.groups )

        this.sceneManager = new SceneManager( container, categories )
        
        if ( process.env.NODE_ENV === 'development' ) {
            window.x = this
        }
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
        try {

            const newObject = await get3DObject( objectData )
            this.setSelectedObject( category, newObject )

        } catch ( err ) {
            console.error(
                `Something went wrong while loading object of type ${category}:\n`
                + err
            )
        }
    }

    setSelectedObject = ( category, newObject ) => {
        this.setState( state => ({
            loadedObjects: {
                ...state.loadedObjects,
                [category]: newObject
            }
        }))
    }

    onUpload = ( objectURL, filename ) => {
        const { name, extension } = getNameAndExtension( filename )

        console.log(name, extension)

        const ACCEPTED_EXTENSIONS = [ "stl" ]

        if ( !ACCEPTED_EXTENSIONS.includes( extension ) ) {

            console.log( new Error(
                `Unrecognized extension '${extension}'`
            ))
            return

        }

        const defaultRotation = this.sceneManager.computeGlobalRotation(
            this.getSelectedCategory(),
            this.props.poseData
        )

        this.setState({
            showUploadWizard: true,
            uploadedObjectData: {
                name,
                filename,
                extension,
                objectURL,
                defaultRotation
            }
        })
    }

    onWizardCanceled = () => {
        console.log('wizard canceled')

        this.setState({
            showUploadWizard: false,
            uploadedObjectData: null
        })
    }

    onWizardCompleted = ({ name, objectURL, imgDataURL, geometry, metadata }) => {
        console.log('wizard completed')
        console.log(name)
        console.log(metadata)

        const category = this.getSelectedCategory().name
        const object = getObjectFromGeometry( geometry, metadata )
        
        this.setSelectedObject( category, object )
        
        const objectData = {
            name,
            download_url: objectURL,
            img: imgDataURL,
            extension: 'stl',
            metadata
        }
        
        this.setState( state => ({
            showUploadWizard: false,
            uploadedObjectData: null,

            objectsByCategory: {
                ...state.objectsByCategory,
                [category]: [
                    ...state.objectsByCategory[category],
                    objectData
                ]
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
            
            poseData
        } = this.props
        const {
            loadedObjects,
            objectsByCategory,
            showUploadWizard, uploadedObjectData
        } = this.state

        const selectedGroup = this.getSelectedGroup()
        const selectedCategory = this.getSelectedCategory()

        const selectorData = ( selectedCategory ?
            {
                objects:  objectsByCategory[ selectedCategory.name ],
                currentCategory: selectedCategory.name
            } : null
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

                        onUpload = { this.onUpload }
                    />
                </div>
            </div>

            <UploadWizard
                visible = { showUploadWizard }

                sceneManager = { this.sceneManager }

                currentCategory = { selectedCategory }
                
                data = { uploadedObjectData }
                
                onWizardCanceled = { this.onWizardCanceled }
                onWizardCompleted = { this.onWizardCompleted }
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