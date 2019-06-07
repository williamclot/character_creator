import React, { Component } from 'react'
import { Group } from 'three'

import ThreeContainer from '../ThreeContainer'
import UploadWizard from '../UploadWizard'
import Header from '../Header';
import Selector from '../Selector';
import PartTypesView from '../PartTypes'
import LoadingIndicator from '../LoadingIndicator';
import ButtonsContainer from '../ButtonsContainer';

import SceneManager from '../ThreeContainer/sceneManager'

import { fetchObjects, get3DObject, getObjectFromGeometry } from '../../util/objectHelpers';
import {
    getPartTypes, getObjects, getNameAndExtension, objectMap,
} from '../../util/helpers'
import MmfApi from '../../util/api';

import { ACCEPTED_OBJECT_FILE_EXTENSIONS } from '../../constants'

import './App.css'


class App extends Component {

    constructor( props ) {
        super( props )

        const partTypes = getPartTypes( props.worldData )
        const objects = getObjects( props.objects )

        this.state = {
            partTypes,
            objects,

            selectedPartTypeId: partTypes.allIds[ 0 ] || null,
            /**
             * Mapping from part type to threejs object
             */
            loadedObjects: {},

            /** Mapping from partType id to selected object id */
            selectedParts: {},

            uploadedObjectData: null,
            
            // editMode: false,

            isLoading: false,
        }
        
        const container = new Group

        this.sceneManager = new SceneManager( container, this.getPartTypesArray() )

        this.api = new MmfApi( props.env.API_ENDPOINT )
        
        if ( process.env.NODE_ENV === 'development' ) {
            window.x = this
        }
    }

    async componentDidMount() {
        this.showLoader()

        try {
            const oneOfEach = this.state.partTypes.allIds.reduce( (byPartTypeId, partTypeId) => ({
                ...byPartTypeId,
                [partTypeId]: this.getObjectsByPartTypeId( partTypeId )[0]
            }), {} )

            const loadedObjects = await fetchObjects( oneOfEach )
            const selectedParts = objectMap( oneOfEach, object => object.id )

            this.setState({
                loadedObjects,
                selectedParts,
            })

        } catch ( err ) {
            console.error( err )
        }
        
        this.hideLoader()
    }

    componentDidUpdate( prevProps ) {
        if ( prevProps.worldData !== this.props.worldData ) {
            // // need to reset sceneManager
            // const categories = getCategories( this.props.worldData.groups )
            // this.sceneManager.reset( this.props.categories )
        }
    }

    get3dObject = ( key ) => {
        if ( !this.sceneManager ) return null
        
        return this.sceneManager.getObject( key )
    }

    getParent3dObject = ( key ) => {
        if ( !this.sceneManager ) return null
        
        return this.sceneManager.getParentObject( key )
    }

    get3dObjectByAttachPoint = ( attachPointName ) => {
        if ( !this.sceneManager ) return null
        
        return this.sceneManager.getObjectByAttachPoint( attachPointName )
    }

    /* ------------------------------------------------------------------------- */

    getPartTypesArray() {
        const { partTypes } = this.state

        return partTypes.allIds.map( id => partTypes.byId[ id ] )
    }

    getSelectedPartType() {
        const { partTypes, selectedPartTypeId } = this.state

        return partTypes.byId[ selectedPartTypeId ]
    }

    getObjectsByPartTypeId( partTypeId ) {
        const { byId, allIds } = this.state.objects

        const objects = allIds.map( id => byId[ id ] )

        return objects.filter( object => object.partTypeId === partTypeId )
    }

    setSelected3dObject( partTypeId, newObject ) {
        this.setState( state => ({
            loadedObjects: {
                ...state.loadedObjects,
                [partTypeId]: newObject
            }
        }))
    }

    setSelectedObjectId( partTypeId, objectId ) {
        this.setState( state => ({
            selectedParts: {
                ...state.selectedParts,
                [partTypeId]: objectId
            }
        }))
    }

    addObject( objectToAdd ) {
        const addReducer = ( objects, objectToAdd ) => {
            return {
                byId: {
                    ...objects.byId,
                    [ objectToAdd.id ]: objectToAdd
                },
                allIds: [
                    ...objects.allIds,
                    objectToAdd.id
                ]
            }
        }

        this.setState( state => ({
            objects: addReducer( state.objects, objectToAdd )
        }))
    }

    removeObject( objectToDeleteId ) {
        const removeReducer = ( objects, idToRemove ) => {
            const { [idToRemove]: removedItem, ...remainingItems } = objects.byId
            const remainingIds = objects.allIds.filter( objectId => objectId !== idToRemove )

            return {
                byId: remainingItems,
                allIds: remainingIds
            }
        }

        this.setState( state => ({
            objects: removeReducer( state.objects, objectToDeleteId )
        }))
    }

    /* bound methods below */

    showLoader = () => {
        this.setState({
            isLoading: true
        })
    }

    hideLoader = () => {
        this.setState({
            isLoading: false
        })
    }

    handlePartTypeSelected = id => {
        this.setState({
            selectedPartTypeId: id
        })
    }

    handleObjectSelected = async ( partTypeId, objectData ) => {
        this.showLoader()

        try {

            const newObject = await get3DObject( objectData )
            this.setSelected3dObject( partTypeId, newObject )
            this.setSelectedObjectId( partTypeId, objectData.id )

        } catch ( err ) {
            const partType = this.state.partTypes.byId[ partTypeId ]
            console.error(
                `Something went wrong while loading object of type ${partType.name}:\n`
                + err
            )
        }

        this.hideLoader()
    }

    handleDeleteObject = async ( objectId ) => {
        const { csrfToken } = this.props

        try {
            
            await this.api.deleteObject( objectId, csrfToken )
            this.removeObject( objectId )
            
        } catch {
            console.error(`Failed to delete object with id ${objectId}`)
        }
    }

    handleUpload = ( partTypeId, filename, objectURL ) => {
        const partType = this.state.partTypes.byId[ partTypeId ]

        const { name, extension } = getNameAndExtension( filename )

        if ( !ACCEPTED_OBJECT_FILE_EXTENSIONS.includes( extension ) ) {

            console.error( `Unrecognized extension '${extension}'` )
            return

        }

        this.setState({
            uploadedObjectData: {
                partType,
                name,
                filename,
                extension,
                objectURL,
            }
        })
    }

    handleWizardCanceled = () => {
        this.setState({
            uploadedObjectData: null
        })
    }

    handleWizardCompleted = async (partType, { name, objectURL, imageSrc, geometry, metadata }) => {
        const object = getObjectFromGeometry( geometry, metadata )

        const partTypeId = partType.id
        
        this.setSelected3dObject( partTypeId, object )
        this.setState({
            uploadedObjectData: null,
        })
                
        const objectData = {
            name,
            download_url: objectURL,
            img: imageSrc,
            extension: 'stl',
            metadata,
            partTypeId,
        }

        try {
            const id = await this.api.postObject( objectData )
    
            const objectToAdd = {
                ...objectData,
                id,
            }
    
            this.addObject( objectToAdd )
            this.setSelectedObjectId( partTypeId, id )
        } catch {
            console.error(`Failed to upload object '${name}'`)
        }

    }

    render() {
        const {
            worldData: { name },
            poseData,
        } = this.props
        const {
            isLoading,
            selectedPartTypeId,
            loadedObjects,
            uploadedObjectData,
        } = this.state

        const showUploadWizard = Boolean( uploadedObjectData )

        const partTypes = this.getPartTypesArray()
        const selectedPartType = this.getSelectedPartType()

        const selectorData = ( selectedPartType ?
            {
                objects:  this.getObjectsByPartTypeId(selectedPartType.id),
                currentPartType: selectedPartType
            } : null
        )

        return <div className = "app">

            <ThreeContainer
                sceneManager = { this.sceneManager }
                loadedObjects = { loadedObjects }
                poseData = { poseData }
            />

            <Header title = { name } />

            <div className = "editor-panel-container">
                <div className = "editor-panel">
                    <div className = "groups-container">
                        <PartTypesView
                            partTypes = { partTypes }
                            selectedPartTypeId = { selectedPartTypeId }
                            onPartTypeSelected = { this.handlePartTypeSelected }
                        />
                    </div>
                    
                    <div className = "selector-container">
                        <Selector
                            data = { selectorData }
                            onObjectSelected = { this.handleObjectSelected }
                            onDelete = { this.handleDeleteObject }

                            onUpload = { this.handleUpload }
                        />
                    </div>
                </div>

            </div>

            <ButtonsContainer
                partTypes = { partTypes }
                onUpload = { this.handleUpload }
            />

            {showUploadWizard && (
                <UploadWizard
                    getObject = { this.get3dObject }
                    getParentObject = { this.getParent3dObject }
                    getObjectByAttachPoint = { this.get3dObjectByAttachPoint }

                    data = { uploadedObjectData }
                    
                    showLoader = { this.showLoader }
                    hideLoader = { this.hideLoader }
                    onWizardCanceled = { this.handleWizardCanceled }
                    onWizardCompleted = { this.handleWizardCompleted }
                />
            )}

            <LoadingIndicator visible = {isLoading} />
        </div>
    }

}

export default App