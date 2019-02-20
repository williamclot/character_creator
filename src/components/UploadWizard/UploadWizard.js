import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import UploadConfirm from './UploadConfirm'
import AdjustTransforms from './AdjustTransforms'
import PlaceAttachPoints from './PlaceAttachPoints'

import './UploadWizard.css'
import { steps, previousStep, nextStep } from '../../actions/steps'


const UploadWizard = props => {
    const {
        step, nextStep, previousStep,
        data
    } = props

    if ( !data ) {
        return null
    }

    const {
        name, filename, extension,
        uploadedObject
    } = data

    console.log(name, filename, extension, uploadedObject)

    return (
        <div className = "wizard-container">

            <UploadConfirm
                visible = { step === steps.UPLOAD_CONFIRM }
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