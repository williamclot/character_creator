import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import UploadConfirm from './UploadConfirm'
import AdjustTransforms from './AdjustTransforms'
import PlaceAttachPoints from './PlaceAttachPoints'

import './UploadWizard.css'
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
            position: null,
            rotation: null,
            scale: null,

            // handled by PlaceAttachPoints
            attachPoints: null
        }
    }

    async componentDidMount() {
        const { data } = this.props

        if ( !data ) { return }

        const {
            name, extension,
            objectURL
        } = data

        try {

            const geometry = await stlLoader.load( objectURL )

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

    render() {
        const {
            currentCategory,
            onWizardCanceled, onWizardCompleted,
            defaultRotation,
            step, nextStep, previousStep
        } = this.props

        const {
            name, uploadedObjectGeometry
        } = this.state
    
    
        return <>
            <div className = "wizard-background" />
            <div className = "wizard-container">
    
                <UploadConfirm
                    visible = { step === steps.UPLOAD_CONFIRM }
    
                    currentCategory = { currentCategory }
                    name = { name }
                    onNameChange = { this.onNameChange }
                    uploadedObjectGeometry = { uploadedObjectGeometry }
    
                    onCancel = { onWizardCanceled }
                    onNext = { nextStep }
                />
    
                <AdjustTransforms
                    visible = { step === steps.ADJUST }
                    
                    defaultRotation = { defaultRotation }
                    uploadedObjectGeometry = { uploadedObjectGeometry }

                    previousStep = { previousStep }
                    nextStep = { nextStep }
                />
    
                <PlaceAttachPoints
                    visible = { step === steps.PLACE_ATTACHPOINTS }
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