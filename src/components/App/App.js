import React, { Component, createRef } from 'react'
import { Group } from 'three'

import SettingsPopup from '../SettingsPopup'
import UploadWizard from '../UploadWizard'
import Header from '../Header';
import Selector from '../Selector';
import PartTypesView from '../PartTypes'
import LoadingIndicator from '../LoadingIndicator';
import ButtonsContainer from '../ButtonsContainer';

import mainSceneManager from '../../scenes/mainSceneManager';

import {
    ACCEPTED_OBJECT_FILE_EXTENSIONS,
    POSITION_0_0_0,
    OBJECT_STATUS
} from '../../constants'
import { fetchObjects, get3DObject, getObjectFromGeometry } from '../../util/objectHelpers';
import {
    getPartTypes, getObjects, getNameAndExtension, objectMap,
} from '../../util/helpers'
import MmfApi from '../../util/api';


import styles from './App.module.scss'


class App extends Component {

    constructor( props ) {
        super( props )

        this.canvasContainerRef = createRef();

        const partTypes = getPartTypes( props.worldData )
        const objects = getObjects( props.objects )

        this.state = {
            name: props.worldData['name'] || '',
            price: props.worldData['price'] || '',
            description: props.worldData['description'] || '',
            isPrivate: props.worldData['is_private'],
            imageUrl: props.worldData['image_url'] || null,
            // tags: props.worldData['tags'] || [],
            
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

            customizedMeshes: props.customizedMeshes,
            customizedMeshesInCart: props.customizedMeshesInCart,
            
            // editMode: false,

            isLoading: false,

            showSettings: false,
        }
        
        const container = new Group

        const initialRotation = props.worldData['container_rotation'];
        if(initialRotation) {
            container.rotation.set(initialRotation.x, initialRotation.y, initialRotation.z);
        };

        mainSceneManager.init(this.getPartTypesArray())
        

        this.api = new MmfApi( props.api )

        if ( process.env.NODE_ENV === 'development' ) {
            window.x = this
        }
    }

    async componentDidMount() {
        this.canvasContainerRef.current.appendChild(mainSceneManager.getCanvas());

        mainSceneManager.renderScene();
        this.showLoader()

        try {
            let oneOfEach = {};
            
            // check location hash for initial selected parts
            const hash = window.location.hash.slice(1);
            if (hash !== '') {
                /** @type {number[]} */
                const selectedIds = JSON.parse(hash);

                for (const partId of selectedIds) {
                    const part = this.state.objects.byId[partId];
                    if (part) {
                        oneOfEach[part.partTypeId] = part;
                    }
                }
            }

            // select first part from each part type that hasn't been filled out from the hash
            for (const partTypeId of this.state.partTypes.allIds) {
                if (!oneOfEach[partTypeId]) {
                    oneOfEach[partTypeId] = this.getObjectsByPartTypeId(partTypeId)[0]; // get first if not found in hash
                }
            }


            const loadedObjects = await fetchObjects( oneOfEach )
            const selectedParts = objectMap( oneOfEach, object => object.id )

            
            {
                mainSceneManager.addAll(loadedObjects);
                mainSceneManager.rescaleContainerToFitObjects();
                mainSceneManager.renderScene();
            }


            this.setState({
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
        }
    }

    hashSelectedPartIds(selectedPartIds) {
        return selectedPartIds
            .sort((p1, p2) => p2 - p1) // sort because different order should produce the same hash
            .join(':');
    }

    userOwnsCurrentSelection() {
        let selectedPartsMap = {};
        for(const customizedMeshId of this.props.customizedMeshesOwnedByUser) {
            const customizedMesh = this.state.customizedMeshes[customizedMeshId];
            const ownedMeshHash = this.hashSelectedPartIds(customizedMesh.selectedPartIds);
            selectedPartsMap[ownedMeshHash] = true;
        }

        const selectedObjectsHash = this.hashSelectedPartIds(this.getSelectedObjectIds());
        return Boolean(selectedPartsMap[selectedObjectsHash]);
    }

    isSelectionInCart() {
        let selectedPartsMap = {};
        for(const customizedMeshId of this.state.customizedMeshesInCart) {
            const customizedMesh = this.state.customizedMeshes[customizedMeshId];
            const meshInCartHash = this.hashSelectedPartIds(customizedMesh.selectedPartIds);
            selectedPartsMap[meshInCartHash] = true;
        }

        const selectedObjectsHash = this.hashSelectedPartIds(this.getSelectedObjectIds());
        return Boolean(selectedPartsMap[selectedObjectsHash]);
    }

    userMustPurchaseSelection() {
        if (!this.props.customizer_pay_per_download_enabled) {
            return false;
        }

        if(this.props.edit_mode) {
            // edit mode means user can edit, which means he is either the owner or the admin
            return false;
        }

        if(this.props.worldData.price > 0) {
            return !this.userOwnsCurrentSelection()
        }

        return false;
    }

    getSelectedObjectIds() {
        const { selectedParts } = this.state;
        return Object.keys(selectedParts).map(key => selectedParts[key]);
    }

    /* ------------------------------------------------------------------------- */

    getObject( objectId ) {
        return this.state.objects.byId[ objectId ]
    }

    getPartType( partTypeId ) {
        return this.state.partTypes.byId[ partTypeId ]
    }

    getPartTypesArray() {
        const { partTypes } = this.state

        return partTypes.allIds.map( id => partTypes.byId[ id ] )
    }

    getSelectedPartType() {
        const { partTypes, selectedPartTypeId } = this.state

        return partTypes.byId[ selectedPartTypeId ]
    }

    getSelectedObjectId( partTypeId ) {
        return this.state.selectedParts[ partTypeId ]
    }

    getSelectedObject( partTypeId ) {
        const objectId = this.getSelectedObjectId( partTypeId )

        return this.getObject( objectId )
    }

    getObjectsByPartTypeId( partTypeId ) {
        const { byId, allIds } = this.state.objects

        const objects = allIds.map( id => byId[ id ] )

        return objects.filter( object => object.partTypeId === partTypeId )
    }

    getParentPartType( partTypeId ) {
        const { partTypes } = this.state

        const { parent } = partTypes.byId[ partTypeId ]

        if ( parent ) {
            return partTypes.byId[ parent.id ]
        }

        return null
    }

    getObjectPartType( objectId ) {
        const { objects, partTypes } = this.state
        const partTypeId = objects.byId[ objectId ].partTypeId

        return partTypes.byId[ partTypeId ]
    }

    getAttachPoints( objectId ) {
        const object = this.state.objects.byId[ objectId ]

        if ( object.metadata ) {
            if ( object.metadata.attachPoints ) {
                return object.metadata.attachPoints
            }
        }

        return {}
    }

    getAttachPointPosition( objectId, attachPointName ) {
        const attachPoints = this.getAttachPoints( objectId )

        return attachPoints[ attachPointName ] || { x: 0, y: 0, z: 0 }
    }

    getPositionInsideParent( partType ) {
        const {
            id: parentPartTypeId,
            attachPoint: parentAttachPoint,
        } = partType.parent

        const parentObjectId = this.getSelectedObjectId( parentPartTypeId )

        return this.getAttachPointPosition( parentObjectId, parentAttachPoint )
    }

    getPosition( partType ) {
        const object = this.getSelectedObject( partType.id )

        if ( !object ) {
            // should never happen!
            console.warn( `Object doesn't exist. This shouldn't normally happen` )
            return POSITION_0_0_0
        }

        if ( object.metadata ) {
            if ( object.metadata.position ) {
                return object.metadata.position
            }
        }

        return POSITION_0_0_0
    }

    /**
     * Recursively walks through part types until it reaches the root parent and
     * adds up all the attachpoint positions from the root to this partType
     * @param { string|number } partTypeId 
     */
    computeGlobalPosition( partTypeId ) {
        const partType = this.getPartType( partTypeId )

        if ( !partType.parent ) {
            const pos = this.getPosition( partType )

            // return negated position to "undo" offset created when origin
            // point was moved to the center of the mesh
            return {
                x: -pos.x,
                y: -pos.y,
                z: -pos.z,
            }
        }

        const attachPointPosition = this.getPositionInsideParent( partType )

        const result = this.computeGlobalPosition( partType.parent.id ) // recursive step

        return {
            x: result.x + attachPointPosition.x,
            y: result.y + attachPointPosition.y,
            z: result.z + attachPointPosition.z,
        }
    }

    setSelected3dObject( partTypeId, newObject ) {
        mainSceneManager.add(partTypeId, newObject);
        mainSceneManager.rescaleContainerToFitObjects( 4 )
        mainSceneManager.renderScene()
    }

    setSelectedObjectId( partTypeId, objectId ) {
        this.setState( state => ({
            selectedParts: {
                ...state.selectedParts,
                [partTypeId]: objectId
            }
        }))
    }


    setObjectStatus( objectId, statusCode ) {
        const statusReducer = ( objects, objectId, status ) => {
            const { byId, allIds } = objects
            const modifiedObject = {
                ...byId[ objectId ],
                status
            }

            return {
                byId: {
                    ...byId,
                    [ objectId ]: modifiedObject
                },
                allIds
            }
        }

        this.setState( state => ({
            objects: statusReducer( state.objects, objectId, statusCode )
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

    /*
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
    /*

    /* bound methods below */

    getGlobalPosition = partTypeId => {
        return this.computeGlobalPosition( partTypeId )
    }

    getParentAttachPointPosition = partType => {
        if ( !partType.parent ) {
            return { x: 0, y: 0, z: 0 }
        }
        return this.getPositionInsideParent( partType )
    }

    getChildPartTypeByAttachPoint = attachPoint => {
        const partTypesArray = this.getPartTypesArray();
        return partTypesArray.find(partType => {
            return partType.parent && partType.parent.attachPoint === attachPoint;
        });
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
        const oldStatus = this.getObject( objectId ).status

        this.setObjectStatus( objectId, OBJECT_STATUS.LOADING )

        try {
            
            await this.api.deletePart(objectId)
            this.setObjectStatus( objectId, OBJECT_STATUS.DELETED )
            
        } catch {
            this.setObjectStatus( objectId, oldStatus )
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

    handleDownload = async () => {
        if(this.isSelectionInCart()) {
            window.alert('item added to cart')
            return;
        }

        const objectIds = this.getSelectedObjectIds();

        try {
            const customizedMeshData = await this.api.generateCustomizedMesh(objectIds);

            if(!this.userMustPurchaseSelection()) {
                if ( customizedMeshData.status === 1 ) { // ready for download
                    const fullCustomizedMeshData = await this.api.getCustomizedMesh(customizedMeshData.id)
                    window.open( fullCustomizedMeshData.file_url )
                } else {
                    // TODO add popup component
        
                    const message = `You will receive an email when the mesh has finished processing.`
                    window.alert( message )
                }
            } else {
                const data = await this.api.addToCart(customizedMeshData.id);
                this.setState(state => ({
                    customizedMeshesInCart: state.customizedMeshesInCart.concat(customizedMeshData.id),
                    customizedMeshes: {
                        ...state.customizedMeshes,
                        [customizedMeshData.id]: customizedMeshData
                    }
                }));
                window.customEventDispatcher.dispatchEvent('REFRESH_CART_AMOUNT');
                window.customEventDispatcher.dispatchEvent('ITEM_ADDED_TO_CART', data);
            }


            
        } catch (err) {
            console.error(err)

            if(err.response.data.error === "access_denied") {
                window.customEventDispatcher.dispatchEvent('SHOW_LOGIN');
            }
        }
    }

    handleShowSettings = () => {
        this.setState({
            showSettings: true
        })
    }

    handleWizardCanceled = () => {
        this.setState({
            uploadedObjectData: null
        })
    }

    handleWizardCompleted = async (partType, { name, extension, objectURL, imageSrc, geometry, metadata }) => {
        this.showLoader()
        
        this.setState({
            uploadedObjectData: null,
        })

        const partTypeId = partType.id
        
        const object = getObjectFromGeometry( geometry, metadata )
                
        const objectData = {
            name,
            files: {
                default: {
                    extension,
                    url: objectURL,
                }
            },
            img: imageSrc,
            extension: 'stl',
            metadata,
            partTypeId,
        }

        try {
            const id = await this.api.postPart(objectData)
    
            const objectToAdd = {
                ...objectData,
                id,
                status: OBJECT_STATUS.IN_SYNC
            }
    
            this.setSelected3dObject( partTypeId, object )
            this.setSelectedObjectId( partTypeId, id )
            this.addObject( objectToAdd )
        } catch {
            console.error(`Failed to upload object '${name}'`)
        }

        this.hideLoader()
    }

    handleSaveChanges = async fields => {
        try {
            const updatedCustomizer = await this.api.patchCustomizer(fields)
            this.setState({
                name: updatedCustomizer['name'],
                price: updatedCustomizer['price'],
                description: updatedCustomizer['description'],
                imageUrl: updatedCustomizer['image_url'],
                isPrivate: updatedCustomizer['is_private'],
            })

        } catch (err) {
            console.error(err)
        }
    }

    render() {
        const {
            edit_mode,
            poseData,
            worldData,
        } = this.props
        const {
            name: customizerName,
            price,
            description,
            imageUrl,
            isPrivate,
            isLoading, showSettings,
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

        const userMustBuySelection = this.userMustPurchaseSelection();
        const isSelectionInCart = this.isSelectionInCart();

        let downloadButtonMessage;
        if (userMustBuySelection) {
            if(isSelectionInCart) {
                downloadButtonMessage = 'Item already in cart';
            } else {
                downloadButtonMessage = `Add To Cart ($${price})`;
            }
        } else {
            downloadButtonMessage = `Download`;
        }



        return <div className = {styles.app}>

            <div className={styles.canvasContainer} ref={this.canvasContainerRef}>
            </div>

            <Header
                title = { customizerName }
                userName = {worldData['user_name']}
                userUrl = {worldData['user_url']}
            />

            <div className = {styles.editorPanelContainer}>
                <div className = {styles.editorPanel}>
                    <div className = {styles.partTypesContainer}>
                        <PartTypesView
                            partTypes = { partTypes }
                            selectedPartTypeId = { selectedPartTypeId }
                            onPartTypeSelected = { this.handlePartTypeSelected }
                        />
                    </div>
                    
                    <div className = {styles.selectorContainer}>
                        <Selector
                            data = { selectorData }
                            onObjectSelected = { this.handleObjectSelected }
                            onDelete = { this.handleDeleteObject }
                            onUpload = { this.handleUpload }
                            edit_mode = { edit_mode }
                        />
                    </div>
                </div>

            </div>

            <ButtonsContainer
                partTypes = { partTypes }
                onUpload = { this.handleUpload }
                onDownload = { this.handleDownload }
                downloadButtonMessage = {downloadButtonMessage}
                onShowSettings = { this.handleShowSettings }
                edit_mode = { edit_mode }
            />

            {showUploadWizard && (
                <UploadWizard
                    getGlobalPosition = { this.getGlobalPosition }
                    getParentAttachPointPosition = { this.getParentAttachPointPosition }
                    getChildPartTypeByAttachPoint = {this.getChildPartTypeByAttachPoint}

                    data = { uploadedObjectData }
                    
                    showLoader = { this.showLoader }
                    hideLoader = { this.hideLoader }
                    onWizardCanceled = { this.handleWizardCanceled }
                    onWizardCompleted = { this.handleWizardCompleted }
                />
            )}

            {showSettings && (
                <SettingsPopup
                    className = {styles.settingsPopup}
                    
                    name = {customizerName}
                    price = {price}
                    description = {description}
                    isPrivate = {isPrivate}
                    imageUrl = {imageUrl}

                    onSave = {this.handleSaveChanges}
                    onCancel = {() => this.setState({showSettings: false})}

                    customizer_pay_per_download_enabled = {this.props.customizer_pay_per_download_enabled}
                />
            )}

            <LoadingIndicator visible = {isLoading} />
        </div>
    }

}

export default App