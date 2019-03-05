import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

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
            uploadedObjectGeometry: null,

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
            attachPointsToPlace: props.currentCategory.attachPoints,
            attachPointsPositions: props.currentCategory.attachPoints.reduce(
                ( acc, curr ) => {
                    acc[ curr ] = {
                        x: 0,
                        y: 0,
                        z: 0
                    }
                    return acc
                },
                {}
            ),
        }
    }

    componentDidUpdate( prevProps ) {
        if ( prevProps.data !== this.props.data ) {
            this.load( this.props.data )
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

        try {

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


            this.setState({
                name,
                uploadedObjectGeometry: geometry,
                scale: computedScale,
                position: computedPosition
            })

        } catch ( err ) {

            console.error( err )
            return

        } finally {

            // cleanup to prevent memory leaks
            URL.revokeObjectURL( objectURL )

        }
    }

    onNameChange = e => {
        this.setState({
            name: e.target.value
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

        this.props.onWizardCompleted( uploadedObjectGeometry, metadata )
        this.props.resetWizard()
    }

    onNext = () => {
        const {
            step,
            nextStep, resetWizard, goToStep,
            onWizardCompleted
        } = this.props
        const { attachPointsToPlace } = this.state

        if ( step === steps.ADJUST ) {

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

    render() {
        const {
            currentCategory, data,
            onWizardCanceled, onWizardCompleted,
            step, nextStep, previousStep
        } = this.props
        const { defaultRotation } = data


        const {
            name, uploadedObjectGeometry,
            position, rotation, scale,
            attachPointsPositions, attachPointsToPlace
        } = this.state
    
    
        return <>
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

                    defaultRotation = { defaultRotation }

                    previousStep = { previousStep }
                    nextStep = { this.onNext }
                />
    
                <AdjustTransforms
                    visible = { step === steps.ADJUST }
                    
                    currentCategory = { currentCategory }
                    uploadedObjectGeometry = { uploadedObjectGeometry }

                    position = { position }
                    rotation = { rotation }
                    scale = { scale }
                    onPositionChange = { this.setPosition }
                    onRotationChange = { this.setRotation }
                    onScaleChange = { this.setScale }

                    attachPointsPositions = { attachPointsPositions }
                    attachPointsToPlace = { attachPointsToPlace }
                    
                    previousStep = { previousStep }
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

                    previousStep = { previousStep }
                    nextStep = { this.onNext }
                />

                <AdjustAttachpoints
                    visible = { step === steps.ADJUST_ATTACHPOINTS }

                    uploadedObjectGeometry = { uploadedObjectGeometry }

                    position = { position }
                    rotation = { rotation }
                    scale = { scale }

                    attachPointsPositions = { attachPointsPositions }
                    attachPointsToPlace = { attachPointsToPlace }
                    onAttachPointPositionChange = { this.setAttachPointPosition }

                    previousStep = { previousStep }
                    nextStep = { this.onNext }
                />

            </div>
        </>
    }
}

const mapStateToProps = state => ({
    step: state.step
})

const mapDispatchToProps = {
    nextStep,
    previousStep,
    goToStep,
    resetWizard
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)( UploadWizard )