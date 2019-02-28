import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import UploadConfirm from './UploadConfirm'
import AdjustTransforms from './AdjustTransforms'
import PlaceAttachpoint from './PlaceAttachpoint'

import styles from './index.module.css'

import { steps, previousStep, nextStep } from '../../actions/steps'

import { stlLoader } from '../../util/loaders'

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
            attachPoints: null
        }
    }

    async componentDidMount() {
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

            this.setState({
                name,
                uploadedObjectGeometry: geometry
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

    render() {
        const {
            currentCategory, data,
            onWizardCanceled, onWizardCompleted,
            step, nextStep, previousStep
        } = this.props
        const { defaultRotation } = data


        const {
            name, uploadedObjectGeometry,
            position, rotation, scale
        } = this.state
    
    
        return <>
            <div className = { styles.wizardBackground } />
            <div className = { styles.wizardContainer } >
    
                <UploadConfirm
                    visible = { step === steps.UPLOAD_CONFIRM }
    
                    currentCategory = { currentCategory }
                    name = { name }
                    onNameChange = { this.onNameChange }
                    uploadedObjectGeometry = { uploadedObjectGeometry }
    
                    onCancel = { onWizardCanceled }
                    onNext = { nextStep }
                />
    
                <PlaceAttachpoint
                    visible = { step === steps.PLACE_ATTACHPOINT }
                    
                    currentCategory = { currentCategory }
                    defaultRotation = { defaultRotation }
                    uploadedObjectGeometry = { uploadedObjectGeometry }
                    onPositionChange = { this.setPosition }

                    previousStep = { previousStep }
                    nextStep = { nextStep }
                />
    
                <AdjustTransforms
                    visible = { step === steps.ADJUST }

                    position = { position }
                    rotation = { rotation }
                    scale = { scale }
                    onPositionChange = { this.setPosition }
                    onRotationChange = { this.setRotation }
                    onScaleChange = { this.setScale }
                    uploadedObjectGeometry = { uploadedObjectGeometry }

                    previousStep = { previousStep }
                    nextStep = { nextStep }
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
    previousStep
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)( UploadWizard )