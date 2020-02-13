import React, { Component } from 'react'
import { Vector3 } from 'three';

import UploadConfirm from './UploadConfirm'
import GlobalPositioning from './GlobalPositioning'
import PlaceAttachpoint from './PlaceAttachpoint'
import AdjustTransforms from './AdjustTransforms'
import PlaceOtherAttachpoints from './PlaceOtherAttachpoints';
import AdjustAttachpoints from './AdjustAttachPoints';

import { steps } from './wizardSteps'
import { stlLoader } from '../../util/loaders'

import mainSceneManager from '../../scenes/mainSceneManager';

import styles from './index.module.css'

class UploadWizard extends Component {
    constructor( props ) {
        super( props )

        this.state = {
            currentWizardStep: steps.UPLOAD_CONFIRM,

            partType: null,

            // file extension
            extension: null,

            // handled by UploadConfirm
            name: '',
            imageSrc: null,
            uploadedObjectGeometry: null,

            currentObject: null,
            currentObjectParent: null,
            currentObjectChildren: {},

            // handled by AdjustTransforms
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            },
            scale: 1,

            parentAttachPointPosition: {
                x: 0,
                y: 0,
                z: 0
            },

            // handled by PlaceAttachpoint
            attachPointsToPlace: [],
            attachPointsPositions: {} 
        }
    }

    async componentDidMount() {
        const {
            data,
            getParentAttachPointPosition,
            onWizardCanceled,
            showLoader,
            hideLoader,
        } = this.props
        
        const {
            partType,
            name, extension,
            objectURL
        } = data

        showLoader()

        try {
            const geometry = await stlLoader.load( objectURL )

            if ( !geometry.boundingBox ) {
                geometry.computeBoundingBox()
            }

            const center = geometry.boundingBox.getCenter( new Vector3 )

            const computedPosition = {
                x: - center.x,
                y: - center.y,
                z: - center.z,
            }

            const attachPoints = partType.attachPoints
            const initialAttachPointPositions = {}
            for ( let attachPoint of attachPoints ) {
                initialAttachPointPositions[ attachPoint ] = {
                    x: 0,
                    y: 0,
                    z: 0
                }
            }
            
            
            const currentObject = mainSceneManager.getObject( partType.id )
            const currentObjectParent = mainSceneManager.getParentObject( partType.id )
            const currentObjectChildren = {}
            for ( let attachPoint of attachPoints ) {
                currentObjectChildren[ attachPoint ] = mainSceneManager.getObjectByAttachPoint( attachPoint )
            }
            
            const parentAttachPointPosition = getParentAttachPointPosition( partType )

            this.setState({
                partType,
                name,
                extension,
                objectURL,
                uploadedObjectGeometry: geometry,
                position: computedPosition,
                attachPointsToPlace: attachPoints,
                attachPointsPositions: initialAttachPointPositions,
                parentAttachPointPosition,
                currentObject,
                currentObjectParent,
                currentObjectChildren
            })

        } catch ( err ) {

            onWizardCanceled()
            console.error( err )
            return

        } finally {

            // cleanup to prevent memory leaks
            // URL.revokeObjectURL( objectURL )
            hideLoader()
            
        }
    }

    componentDidUpdate() {
        if ( this.state.currentWizardStep === steps.COMPLETED ) {
            const {
                partType,
                name, extension, objectURL, imageSrc,
                uploadedObjectGeometry,
                position, rotation, scale,
                attachPointsPositions
            } = this.state
            
            const metadata = {
                position,
                rotation,
                scale,
                attachPoints: attachPointsPositions
            }
    
            this.props.onWizardCompleted(partType, {
                name,
                extension,
                objectURL,
                imageSrc,
                metadata,
                geometry: uploadedObjectGeometry
            })
        }
    }

    goToStep = step => {
        this.setState({
            currentWizardStep: step
        })
    }


    onNameChange = name => {
        this.setState({
            name
        })
    }

    setImage = src => {
        this.setState({
            imageSrc: src
        })
    }

    setPosition = position => {
        this.setState({
            position
        })
    }

    setRotation = rotation => {
        this.setState({
            rotation
        })
    }

    setScale = scale => {
        this.setState({
            scale
        })
    }

    setAttachPointPosition = ( attachPointName, position ) => {
        this.setState( state => ({
            attachPointsPositions: {
                ...state.attachPointsPositions,
                [attachPointName]: position
            }
        }))
    }

    onNext = () => {
        const {
            currentWizardStep,
            partType, attachPointsToPlace
        } = this.state

        switch(currentWizardStep) {
            case steps.UPLOAD_CONFIRM: {
                const hasParent = Boolean( partType.parent )

                if ( !hasParent ) {
                    this.goToStep( steps.ADJUST )
                } else {
                    this.goToStep( steps.GLOBAL_POSITIONING )
                }

                break
            }
            case steps.GLOBAL_POSITIONING: {
                this.goToStep( steps.PLACE_ATTACHPOINT )
                break
            }
            case steps.PLACE_ATTACHPOINT: {
                this.goToStep( steps.ADJUST )
                break
            }
            case steps.ADJUST: {
                const attachPointsLeftToPlace = ( attachPointsToPlace && attachPointsToPlace.length !== 0 )

                if ( attachPointsLeftToPlace ) {
                    this.goToStep( steps.PLACE_OTHER_ATTACHPOINTS )
                } else {
                    this.goToStep( steps.COMPLETED )
                }

                break
            }
            case steps.PLACE_OTHER_ATTACHPOINTS: {
                this.goToStep( steps.ADJUST_ATTACHPOINTS )
                break
            }
            case steps.ADJUST_ATTACHPOINTS: {
                const placedLastAttachpoint = attachPointsToPlace.length === 1

                if ( placedLastAttachpoint ) {
                    this.goToStep( steps.COMPLETED )
                } else {
                    this.setState( state => ({
                        attachPointsToPlace: state.attachPointsToPlace.slice( 1 )
                    }))
                    this.goToStep( steps.PLACE_OTHER_ATTACHPOINTS )
                }

                break
            }
        }
    }

    onBack = () => {
        const { partType, currentWizardStep } = this.state

        switch(currentWizardStep) {
            case steps.ADJUST_ATTACHPOINTS: {
                this.goToStep( steps.PLACE_OTHER_ATTACHPOINTS )
                break
            }
            case steps.PLACE_OTHER_ATTACHPOINTS: {
                this.goToStep( steps.ADJUST )
                break
            }
            case steps.ADJUST: {
                const hasParent = Boolean( partType.parent )

                if ( !hasParent ) {
                    this.goToStep( steps.UPLOAD_CONFIRM )
                } else {
                    this.goToStep( steps.PLACE_ATTACHPOINT )
                }

                break
            }
            case steps.PLACE_ATTACHPOINT: {
                this.goToStep( steps.GLOBAL_POSITIONING )
                break
            }
            case steps.GLOBAL_POSITIONING: {
                this.goToStep( steps.UPLOAD_CONFIRM )
                break
            }
        }
    }

    handleGlobalPositioningConfirm = () => {
        const { getGlobalPosition } = this.props
        const { attachPointsToPlace, partType } = this.state

        const position = getGlobalPosition( partType.id )

        this.setPosition({
            x: -position.x,
            y: -position.y,
            z: -position.z,
        })
        
        const attachPointsLeftToPlace = ( attachPointsToPlace && attachPointsToPlace.length !== 0 )

        if ( attachPointsLeftToPlace ) {
            this.goToStep( steps.PLACE_OTHER_ATTACHPOINTS )
        } else {
            this.goToStep( steps.COMPLETED )
        }
    }


    render() {
        const hasLoaded = Boolean( this.state.uploadedObjectGeometry )
        const isCompleted = this.state.currentWizardStep === steps.COMPLETED

        if ( !hasLoaded || isCompleted ) return null
    
        return (
            <div className = { styles.wrapper }>
                <div className = { styles.wizardBackground } />
                <div className = { styles.wizardContainer } >
                    {this.renderWizardStep()}
                </div>
            </div>
        )
    }

    renderWizardStep() {
        const {
            onWizardCanceled,
        } = this.props

        const {
            currentWizardStep,
            partType,
            name, uploadedObjectGeometry,
            currentObject, currentObjectParent, currentObjectChildren,
            parentAttachPointPosition,
            position, rotation, scale,
            attachPointsPositions, attachPointsToPlace
        } = this.state

        const currentAttachPoint = attachPointsToPlace.length !== 0 ? attachPointsToPlace[ 0 ] : null
        const currentChildPartType = this.props.getChildPartTypeByAttachPoint(currentAttachPoint);

        switch ( currentWizardStep ) {
            case steps.UPLOAD_CONFIRM: return (
                <UploadConfirm
                    currentCategory = { partType }
                    uploadedObjectGeometry = { uploadedObjectGeometry }

                    name = { name }
                    position = { position }
                    rotation = { rotation }
                    scale = { scale }
                    onNameChange = { this.onNameChange }
                    setImage = { this.setImage }
    
                    onCancel = { onWizardCanceled }
                    onNext = { this.onNext }
                />
            )

            case steps.GLOBAL_POSITIONING: return (
                <GlobalPositioning
                    uploadedObjectGeometry = { uploadedObjectGeometry }
                    currentObject = { currentObject }
                    currentObjectParent = { currentObjectParent }
                    
                    onPositionChange = { this.setPosition }
                    onRotationChange = { this.setRotation }
                    onScaleChange = { this.setScale }

                    previousStep = { this.onBack }
                    nextStep = { this.onNext }
                    onConfirm = { this.handleGlobalPositioningConfirm }
                />
            )

            case steps.PLACE_ATTACHPOINT: return (
                <PlaceAttachpoint
                    currentCategory = { partType }
                    uploadedObjectGeometry = { uploadedObjectGeometry }

                    position = { position }
                    rotation = { rotation }
                    scale = { scale }
                    onPositionChange = { this.setPosition }

                    previousStep = { this.onBack }
                    nextStep = { this.onNext }
                />
            )

            case steps.ADJUST: return (
                <AdjustTransforms
                    currentCategory = { partType }
                    currentObject = { currentObject }
                    currentObjectParent = { currentObjectParent }
                    uploadedObjectGeometry = { uploadedObjectGeometry }

                    position = { position }
                    rotation = { rotation }
                    scale = { scale }
                    parentAttachPointPosition = { parentAttachPointPosition }
                    onPositionChange = { this.setPosition }
                    onRotationChange = { this.setRotation }
                    onScaleChange = { this.setScale }
                    
                    previousStep = { this.onBack }
                    nextStep = { this.onNext }
                />
            )

            case steps.PLACE_OTHER_ATTACHPOINTS: return (
                <PlaceOtherAttachpoints
                    currentCategory = { partType }
                    uploadedObjectGeometry = { uploadedObjectGeometry }

                    position = { position }
                    rotation = { rotation }
                    scale = { scale }
                    
                    currentAttachPoint = { currentAttachPoint }
                    currentChildPartType = { currentChildPartType }
                    attachPointsPositions = { attachPointsPositions }
                    onAttachPointPositionChange = { this.setAttachPointPosition }

                    previousStep = { this.onBack }
                    nextStep = { this.onNext }
                />
            )

            case steps.ADJUST_ATTACHPOINTS: return (
                <AdjustAttachpoints
                    currentCategory = { partType }
                    currentObjectChild = { currentObjectChildren[ currentAttachPoint ] }
                    uploadedObjectGeometry = { uploadedObjectGeometry }

                    position = { position }
                    rotation = { rotation }
                    scale = { scale }

                    currentAttachPoint = { currentAttachPoint }
                    attachPointsPositions = { attachPointsPositions }
                    onAttachPointPositionChange = { this.setAttachPointPosition }

                    previousStep = { this.onBack }
                    nextStep = { this.onNext }
                />
            )
        }
    }
}


export default UploadWizard