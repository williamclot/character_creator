import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Group } from 'three'
import axios from 'axios'

import ThreeContainer from '../ThreeContainer'
import UploadWizard from '../UploadWizard'
import Header from '../Header';
import Selector from '../Selector';
// import { CategoriesView, GroupsView } from '../Categories'
import PartTypesView from '../PartTypes'
import LoadingIndicator from '../LoadingIndicator';
import ButtonsContainer from '../ButtonsContainer';

import { API_ENDPOINT } from '../../env'
import SceneManager from '../ThreeContainer/sceneManager'

import { fetchObjects, get3DObject, getObjectFromGeometry } from '../../util/objectHelpers';
import {
    getCategories, getNameAndExtension, objectMap,
    Dict,
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
        const oneOfEach = objectMap(
            this.props.objects.byCategory,
            objectList => objectList[ 0 ]
        )

        const loadedObjects = await fetchObjects( oneOfEach )

        this.setState({
            loadedObjects
        })
    }

    async postObject( partTypeId, object ) {
        const authorizedHeaders = {
            'Authorization': "Bearer 123456"
        }

        const fileBlob = (await axios.get(
            object.download_url,
            {
                responseType: 'blob'
            }
        )).data

        const imageBlob = new Blob([object.img])

        console.log('---------')
        console.log(fileBlob, imageBlob)

        const data = {
            "name": object.name,
            "description": "string",
            "visibility": 0,
            // "how_to": "string",
            // "dimensions": "string",
            // "time_to_do_from": 0,
            // "time_to_do_to": 0,
            // "support_free": true,
            // "filament_quantity": "string",
            // "client_url": "string",
            "tags": "customizer",
            "licenses": [],
            // "licenses": [
            //   {
            //     "type": "string",
            //     "value": true
            //   }
            // ],
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
            "brand": null
        }

        const res = await axios.post(
            `${API_ENDPOINT}/object`,
            data,
            {
                headers: authorizedHeaders
            }
        )

        console.log(res.status)

        if ( res.status !== 200 )
            throw new Error('Not OK')

        const { files, images } = res.data

        const file = files[ 0 ]
        const image = images[ 0 ]

        console.log(file)
        console.log(image)
        console.log('-----')

        const [fileRes, imgRes] = await Promise.all([
            axios.post(
                `${API_ENDPOINT}/file`,
                fileBlob,
                {
                    params: {
                        upload_id: file.upload_id
                    },
                    headers: authorizedHeaders
                }
            ),
            axios.post(
                `${API_ENDPOINT}/image`,
                imageBlob,
                {
                    params: {
                        upload_id: image.upload_id
                    },
                    headers: authorizedHeaders
                }
            )
        ])

        console.log('responses:')
        console.log(fileRes)
        console.log(imgRes)
        console.log('----- SUCCESS ------')
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

    onUpload = ( categoryName, filename, objectURL ) => {
        const partType = this.sceneManager.categoriesMap.get( categoryName )

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
            showUploadWizard: false,
            uploadedObjectData: null
        })
    }

    onWizardCompleted = (partType, { name, objectURL, imgDataURL, geometry, metadata }) => {
        console.log('wizard completed')
        console.log(name)
        console.log(metadata)

        const category = partType.name
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

        try {
            this.postObject( partType.id, objectData )
        } catch ( err ) {
            console.error( err )
        }
    }

    getSelectedGroup = () => this.props.worldData.groups[ this.props.selectedGroupIndex ]
    getSelectedCategory = () => {
        const selectedGroup = this.getSelectedGroup()
        return selectedGroup && selectedGroup.categories[ this.props.selectedCategoryIndex ]
    }


    render() {
        const {
            worldData: { name, groups },
            
            poseData,

            isLoading
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

            <Header title = { name } />

            <div className = "editor-panel">

                <div className = "groups-container">
                    <PartTypesView groups = { groups } />
                </div>
                
                <div className = "selector-container">
                    <Selector
                        data = { selectorData }
                        onObjectSelected = { this.onObjectSelected }

                        onUpload = { this.onUpload }
                    />
                </div>
            </div>

            <ButtonsContainer
                categories = { getCategories(groups) }
                onUpload = { this.onUpload }
            />

            <UploadWizard
                visible = { showUploadWizard }

                sceneManager = { this.sceneManager }
                
                data = { uploadedObjectData }
                
                onWizardCanceled = { this.onWizardCanceled }
                onWizardCompleted = { this.onWizardCompleted }
            />

            <LoadingIndicator visible = {isLoading} />
        </div>
    }

}

export default connect(
    state => ({
        selectedGroupIndex: state.selectedCategoryPath.groupIndex,
        selectedCategoryIndex: state.selectedCategoryPath.categoryIndex,
        isLoading: state.isLoading
    })
)( App )