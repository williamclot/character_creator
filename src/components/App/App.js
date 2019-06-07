import React, { Component } from 'react'
import { Group } from 'three'
import axios from 'axios'

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
    getPartTypes, getObjects, getNameAndExtension,
} from '../../util/helpers'

import { ACCEPTED_OBJECT_FILE_EXTENSIONS } from '../../constants'

import './App.css'


class App extends Component {

    constructor( props ) {
        super( props )

        const partTypes = getPartTypes( props.worldData )
        const objects = getObjects( props.objects )

        const selectedPartTypeId = partTypes.allIds[ 0 ]

        this.state = {
            partTypes,

            selectedPartTypeId,
            /**
             * Mapping from part type to threejs object
             */
            loadedObjects: {},

            objects,

            uploadedObjectData: null,
            
            editMode: false,

            isLoading: false,
        }
        
        const container = new Group

        this.sceneManager = new SceneManager( container, this.getPartTypesArray() )
        
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

            this.setState({
                loadedObjects
            })

        } catch ( err ) {
            console.error( err )
        }
        
        this.hideLoader()
    }

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

    get3dObject = ( key ) => {
        return this.sceneManager.getObject( key )
    }

    getParent3dObject = ( key ) => {
        return this.sceneManager.getParentObject( key )
    }

    get3dObjectByAttachPoint = ( attachPointName ) => {
        return this.sceneManager.getObjectByAttachPoint( attachPointName )
    }

    handleDeleteObject = async ( objectId ) => {
        const { env, csrfToken } = this.props
        const selectedPartType = this.getSelectedPartType()

        try {
            const res = await axios.delete(
                `${env.API_ENDPOINT}/objects/${objectId}`,
                {
                    params: {
                        _csrf_token: csrfToken
                    }
                }
            )

            if ( res.status !== 204 ) {
                throw new Error('Delete Failed')
            }

            this.removeObject( objectId )
            
        } catch {
            console.error(`Failed to delete object with id ${objectId}`)
        }
    }

    async postObject( partTypeId, object ) {
        const { API_ENDPOINT } = this.props.env

        const getBlob = url => axios.get(
            url,
            {
                responseType: 'blob'
            }
        )
        
        const [{ data: fileBlob }, { data: imageBlob }] = await Promise.all([
            getBlob( object.download_url ),
            getBlob( object.img )
        ])

        console.log('---------')
        console.log(fileBlob, imageBlob)

        const data = {
            "name": object.name,
            // "description": "string",
            "visibility": 0,
            // "how_to": "string",
            // "dimensions": "string",
            // "time_to_do_from": 0,
            // "time_to_do_to": 0,
            // "support_free": true,
            // "filament_quantity": "string",
            // "client_url": "string",
            // "tags": "customizer",
            "brand": null,
            "licenses": [],
            
            "files": [
              {
                "filename": `${object.name}.${object.extension}`,
                "size": fileBlob.size
              }
            ],
            "images": [
              {
                "filename": `${object.name}.jpg`,
                "size": imageBlob.size
              }
            ],

            "customizer_part_type_id": partTypeId,
            "customizer_metadata": object.metadata
        }

        const res = await axios.post(
            `${API_ENDPOINT}/object`,
            data
        )

        console.log(res.status)

        if ( res.status !== 200 )
            throw new Error('Not OK')

        const { files, images, id } = res.data

        const file = files[ 0 ]
        const image = images[ 0 ]

        const [fileRes, imgRes] = await Promise.all([
            axios.post(
                `${API_ENDPOINT}/file`,
                fileBlob,
                {
                    params: {
                        upload_id: file.upload_id
                    }
                }
            ),
            axios.post(
                `${API_ENDPOINT}/image`,
                imageBlob,
                {
                    params: {
                        upload_id: image.upload_id
                    }
                }
            )
        ])

        return id
    }

    componentDidUpdate( prevProps ) {
        if ( prevProps.worldData !== this.props.worldData ) {
            // // need to reset sceneManager
            // const categories = getCategories( this.props.worldData.groups )
            // this.sceneManager.reset( this.props.categories )
        }
    }

    onObjectSelected = async ( partTypeId, objectData ) => {
        this.showLoader()

        try {

            const newObject = await get3DObject( objectData )
            this.setSelectedObject( partTypeId, newObject )

        } catch ( err ) {
            const partType = this.state.partTypes.byId[ partTypeId ]
            console.error(
                `Something went wrong while loading object of type ${partType.name}:\n`
                + err
            )
        }

        this.hideLoader()
    }

    setSelectedObject = ( partTypeId, newObject ) => {
        this.setState( state => ({
            loadedObjects: {
                ...state.loadedObjects,
                [partTypeId]: newObject
            }
        }))
    }

    onUpload = ( partTypeId, filename, objectURL ) => {
        const partType = this.state.partTypes.byId[ partTypeId ]

        const { name, extension } = getNameAndExtension( filename )

        console.log(name, extension)

        if ( !ACCEPTED_OBJECT_FILE_EXTENSIONS.includes( extension ) ) {

            console.log( new Error(
                `Unrecognized extension '${extension}'`
            ))
            return

        }

        const defaultRotation = this.sceneManager.computeGlobalRotation(
            this.getSelectedPartType(),
            this.props.poseData
        )

        this.setState({
            uploadedObjectData: {
                partType,
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
            uploadedObjectData: null
        })
    }

    onWizardCompleted = async (partType, { name, objectURL, imageSrc, geometry, metadata }) => {
        console.log('wizard completed')
        console.log(name)
        console.log(metadata)

        const object = getObjectFromGeometry( geometry, metadata )

        const partTypeId = partType.id
        
        this.setSelectedObject( partTypeId, object )
        this.setState({
            uploadedObjectData: null,
        })
                
        const objectData = {
            name,
            download_url: objectURL,
            img: imageSrc,
            extension: 'stl',
            metadata
        }

        const id = await this.postObject( partTypeId, objectData )

        const objectToAdd = {
            ...objectData,
            id,
            partTypeId
        }

        this.addObject( objectToAdd )

    }

    getPartTypesArray = () => {
        const { partTypes } = this.state

        return partTypes.allIds.map( id => partTypes.byId[ id ] )
    }

    getSelectedPartType = () => {
        const { partTypes, selectedPartTypeId } = this.state

        return partTypes.byId[ selectedPartTypeId ]
    }

    addObject = ( objectToAdd ) => {
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

    removeObject = ( objectToDeleteId ) => {
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

    getObjectsByPartTypeId = partTypeId => {
        const { byId, allIds } = this.state.objects

        const objects = allIds.map( id => byId[ id ] )

        return objects.filter( object => object.partTypeId === partTypeId )
    }

    handlePartTypeSelected = id => {
        this.setState({
            selectedPartTypeId: id
        })
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
                            onObjectSelected = { this.onObjectSelected }
                            onDelete = { this.handleDeleteObject }

                            onUpload = { this.onUpload }
                        />
                    </div>
                </div>

            </div>

            <ButtonsContainer
                partTypes = { partTypes }
                onUpload = { this.onUpload }
            />

            {showUploadWizard && (
                <UploadWizard
                    getObject = { this.get3dObject }
                    getParentObject = { this.getParent3dObject }
                    getObjectByAttachPoint = { this.get3dObjectByAttachPoint }

                    data = { uploadedObjectData }
                    
                    showLoader = { this.showLoader }
                    hideLoader = { this.hideLoader }
                    onWizardCanceled = { this.onWizardCanceled }
                    onWizardCompleted = { this.onWizardCompleted }
                />
            )}

            <LoadingIndicator visible = {isLoading} />
        </div>
    }

}

export default App