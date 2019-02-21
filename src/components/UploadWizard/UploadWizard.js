import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import UploadConfirm from './UploadConfirm'
import AdjustTransforms from './AdjustTransforms'
import PlaceAttachPoints from './PlaceAttachPoints'

import './UploadWizard.css'
import { steps, previousStep, nextStep } from '../../actions/steps'

import { get3DObject } from '../../util/objectHelpers'

class UploadWizard extends Component {
    constructor( props ) {
        super( props )

        this.state = {
            uploadedObject: null
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

            const object = await get3DObject({
                download_url: objectURL,
                name,
                extension
            })

            this.setState({
                uploadedObject: object
            })

        } catch ( err ) {

            console.error( err )
            return

        } finally {

            // cleanup to prevent memory leaks
            URL.revokeObjectURL( objectURL )

        }
    }

    render() {
        const {
            currentCategory,
            step, nextStep, previousStep,
            data
        } = this.props
    
        if ( !data ) {
            return null
        }

        const { uploadedObject } = this.state
    
        const {
            name, filename, extension,
        } = data
    
        return (
            <div className = "wizard-container">
    
                <UploadConfirm
                    visible = { step === steps.UPLOAD_CONFIRM }
    
                    currentCategory = { currentCategory }
                    name = { name }
                    extension = { extension }
                    uploadedObject = { uploadedObject }
    
                    previousStep = { previousStep }
                    nextStep = { nextStep }
                />
    
                <AdjustTransforms
                    visible = { step === steps.ADJUST }
                    previousStep = { previousStep }
                    nextStep = { nextStep }
                />
    
                <PlaceAttachPoints
                    visible = { step === steps.PLACE_ATTACHPOINTS }
                    previousStep = { previousStep }
                    nextStep = { nextStep }
                />
    
            </div>
        )
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