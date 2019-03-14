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
            // handled by UploadConfirm
            name: '',
            imgDataURL: null,
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
            name, extension,
            objectURL
        } = uploadData

        this.props.showLoader()

        try {
            const { sceneManager, currentCategory } = this.props

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

            const attachPoints = currentCategory.attachPoints
            const initialAttachPointPositions = {}
            for ( let attachPoint of attachPoints ) {
                initialAttachPointPositions[ attachPoint ] = {
                    x: 0,
                    y: 0,
                    z: 0
                }
            }
            
            const currentObject = sceneManager.getObject( currentCategory.name )
            const currentObjectParent = sceneManager.getParentObject( currentCategory.name )
            const currentObjectChildren = {}
            for ( let attachPoint of attachPoints ) {
                currentObjectChildren[ attachPoint ] = sceneManager.getObjectByAttachPoint( attachPoint )
            }
            

            this.setState({
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

    setImgDataURL = dataURL => {
        this.setState({
            imgDataURL: dataURL
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
            name, objectURL, imgDataURL,
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

        this.props.onWizardCompleted({
            name,
            objectURL,
            imgDataURL,
            metadata,
            geometry: uploadedObjectGeometry
        })
        this.props.resetWizard()
    }

    onNext = () => {
        const {
            step,
            nextStep, resetWizard, goToStep,
            currentCategory
        } = this.props
        const { attachPointsToPlace } = this.state

        if ( step === steps.UPLOAD_CONFIRM ) {

            if ( !currentCategory.parent ) {
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
            previousStep, goToStep,
            currentCategory
        } = this.props
        // const { attachPointsToPlace } = this.state

        if ( step === steps.ADJUST ) {

            if ( !currentCategory.parent ) {
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
            sceneManager, currentCategory,
            onWizardCanceled,
            step, nextStep, previousStep
        } = this.props

        const {
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

                    currentCategory = { currentCategory }
                    uploadedObjectGeometry = { uploadedObjectGeometry }

                    name = { name }
                    position = { position }
                    rotation = { rotation }
                    scale = { scale }
                    onNameChange = { this.onNameChange }
                    setImgDataURL = { this.setImgDataURL }
    
                    onCancel = { onWizardCanceled }
                    onNext = { this.onNext }
                />
    
                <PlaceAttachpoint
                    visible = { step === steps.PLACE_ATTACHPOINT }
                    
                    currentCategory = { currentCategory }
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
                    
                    currentCategory = { currentCategory }
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
                                        
                    currentCategory = { currentCategory }
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

                    currentCategory = { currentCategory }
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