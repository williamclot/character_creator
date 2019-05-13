import React, { Component } from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'

import { showLoader, hideLoader } from '../../actions/loader'

import UploadConfirm from './UploadConfirm'
import AdjustTransforms from './AdjustTransforms'
import PlaceAttachpoint from './PlaceAttachpoint'

import styles from './index.module.css'

import { steps, previousStep, nextStep, goToStep, resetWizard } from '../../actions/steps'

import { stlLoader } from '../../util/loaders'
import PlaceOtherAttachpoints from './PlaceOtherAttachpoints';
import AdjustAttachpoints from './AdjustAttachPoints';

class UploadWizard extends Component {
    constructor( props ) {
        super( props )

        this.state = {
            partType: null,

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

            // handled by PlaceAttachpoint
            attachPointsToPlace: [],
            attachPointsPositions: {} 
        }
    }

    componentDidUpdate( prevProps ) {
        const { data } = this.props
        if ( prevProps.data !== data ) {
            if ( data ) {
                this.load( data )
            }
        }
    }

    componentDidMount() {
        const { data } = this.props

        if ( !data ) { return }

        this.load( data )
    }

    load = async uploadData => {
        const {
            partType,
            name, extension,
            objectURL
        } = uploadData

        this.props.showLoader()

        try {
            const { sceneManager } = this.props

            const geometry = await stlLoader.load( objectURL )

            if ( !geometry.boundingBox ) {
                geometry.computeBoundingBox()
            }

            const { min, max } = geometry.boundingBox

            const computedScale = 1 / ( max.y - min.y )

            const computedPosition = {
                x: - ( max.x + min.x ) / 2,
                y: - ( max.y + min.y ) / 2,
                z: - ( max.z + min.z ) / 2,
            }

            const computedRotation = { x: 0, y: 0, z: 0 } // cannot make assumptions for rotation

            const attachPoints = partType.attachPoints
            const initialAttachPointPositions = {}
            for ( let attachPoint of attachPoints ) {
                initialAttachPointPositions[ attachPoint ] = {
                    x: 0,
                    y: 0,
                    z: 0
                }
            }
            
            const currentObject = sceneManager.getObject( partType.name )
            const currentObjectParent = sceneManager.getParentObject( partType.name )
            const currentObjectChildren = {}
            for ( let attachPoint of attachPoints ) {
                currentObjectChildren[ attachPoint ] = sceneManager.getObjectByAttachPoint( attachPoint )
            }
            

            this.setState({
                partType,
                name,
                objectURL,
                uploadedObjectGeometry: geometry,
                position: computedPosition,
                rotation: computedRotation,
                scale: computedScale,
                attachPointsToPlace: attachPoints,
                attachPointsPositions: initialAttachPointPositions,
                currentObject,
                currentObjectParent,
                currentObjectChildren
            })

        } catch ( err ) {

            console.error( err )
            return

        } finally {

            // cleanup to prevent memory leaks
            // URL.revokeObjectURL( objectURL )
            this.props.hideLoader()
            
        }
    }

    onNameChange = e => {
        this.setState({
            name: e.target.value
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

    onCompleted = () => {
        const {
            partType,
            name, objectURL, imageSrc,
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
            objectURL,
            imageSrc,
            metadata,
            geometry: uploadedObjectGeometry
        })
        this.props.resetWizard()
    }

    onNext = () => {
        const {
            step,
            nextStep, resetWizard, goToStep
        } = this.props
        const { partType, attachPointsToPlace } = this.state

        if ( step === steps.UPLOAD_CONFIRM ) {

            if ( !partType.parent ) {
                goToStep( steps.ADJUST )
            } else {
                nextStep()
            }

        } else if ( step === steps.ADJUST ) {

            const isCompleted = (
                !attachPointsToPlace ||
                attachPointsToPlace.length === 0
            )

            if ( isCompleted ) {
                this.onCompleted()
            } else {
                nextStep()
            }

        } else if ( step === steps.ADJUST_ATTACHPOINTS ) {

            const isCompleted = attachPointsToPlace.length === 1 // placed last AP
            if ( isCompleted ) {
                this.onCompleted()
            } else {
                
                goToStep( steps.PLACE_OTHER_ATTACHPOINTS )
                this.setState( state => ({
                    attachPointsToPlace: state.attachPointsToPlace.slice( 1 )
                }))

            }
        } else {

            nextStep()

        }
    }

    onBack = () => {
        const {
            step,
            previousStep, goToStep
        } = this.props
        const { partType } = this.state

        if ( step === steps.ADJUST ) {

            if ( !partType.parent ) {
                goToStep( steps.UPLOAD_CONFIRM )
            } else {
                previousStep()
            }

        } else {
            previousStep()
        }
    }

    render() {
        const {
            visible: isVisible,
            sceneManager,
            onWizardCanceled,
            step, nextStep, previousStep
        } = this.props

        const {
            partType,
            name, uploadedObjectGeometry,
            currentObject, currentObjectParent, currentObjectChildren,
            position, rotation, scale,
            attachPointsPositions, attachPointsToPlace
        } = this.state

        const className = cn(
            styles.wrapper,
            isVisible && styles.visible
        )
    
        return <div className = { className }>
            <div className = { styles.wizardBackground } />
            <div className = { styles.wizardContainer } >
    
                <UploadConfirm
                    visible = { step === steps.UPLOAD_CONFIRM }

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
    
                <PlaceAttachpoint
                    visible = { step === steps.PLACE_ATTACHPOINT }
                    
                    currentCategory = { partType }
                    uploadedObjectGeometry = { uploadedObjectGeometry }

                    position = { position }
                    rotation = { rotation }
                    scale = { scale }
                    onPositionChange = { this.setPosition }

                    previousStep = { this.onBack }
                    nextStep = { this.onNext }
                />
    
                <AdjustTransforms
                    visible = { step === steps.ADJUST }
                    
                    currentCategory = { partType }
                    currentObject = { currentObject }
                    currentObjectParent = { currentObjectParent }
                    uploadedObjectGeometry = { uploadedObjectGeometry }

                    position = { position }
                    rotation = { rotation }
                    scale = { scale }
                    onPositionChange = { this.setPosition }
                    onRotationChange = { this.setRotation }
                    onScaleChange = { this.setScale }

                    attachPointsPositions = { attachPointsPositions }
                    attachPointsToPlace = { attachPointsToPlace }
                    
                    previousStep = { this.onBack }
                    nextStep = { this.onNext }
                />
    
                <PlaceOtherAttachpoints
                    visible = { step === steps.PLACE_OTHER_ATTACHPOINTS }
                                        
                    currentCategory = { partType }
                    uploadedObjectGeometry = { uploadedObjectGeometry }

                    position = { position }
                    rotation = { rotation }
                    scale = { scale }
                    
                    attachPointsPositions = { attachPointsPositions }
                    attachPointsToPlace = { attachPointsToPlace }
                    onAttachPointPositionChange = { this.setAttachPointPosition }

                    previousStep = { this.onBack }
                    nextStep = { this.onNext }
                />

                <AdjustAttachpoints
                    visible = { step === steps.ADJUST_ATTACHPOINTS }

                    currentCategory = { partType }
                    currentObjectChildren = { currentObjectChildren }
                    uploadedObjectGeometry = { uploadedObjectGeometry }

                    position = { position }
                    rotation = { rotation }
                    scale = { scale }

                    attachPointsPositions = { attachPointsPositions }
                    attachPointsToPlace = { attachPointsToPlace }
                    onAttachPointPositionChange = { this.setAttachPointPosition }

                    previousStep = { this.onBack }
                    nextStep = { this.onNext }
                />

            </div>
        </div>
    }
}

const mapStateToProps = state => ({
    step: state.step
})

const mapDispatchToProps = {
    nextStep,
    previousStep,
    goToStep,
    resetWizard,
    showLoader,
    hideLoader
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)( UploadWizard )