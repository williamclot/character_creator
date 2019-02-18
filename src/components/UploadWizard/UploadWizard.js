import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import UploadConfirm from './UploadConfirm'
import AdjustTransforms from './AdjustTransforms'
import PlaceAttachPoints from './PlaceAttachPoints'

import './UploadWizard.css'
import {
    previousStep, nextStep,
    HIDDEN, UPLOAD_CONFIRM, PLACE_ATTACHPOINTS, ADJUST, COMPLETED
} from '../../actions/steps'


const UploadWizard = props => {
    const { step, nextStep, previousStep } = props

    return (
        <div className = "wizard-container">

            <UploadConfirm
                visible = { step === UPLOAD_CONFIRM }
                previousStep = { previousStep }
                nextStep = { nextStep }
            />

            <AdjustTransforms
                visible = { step === ADJUST }
                previousStep = { previousStep }
                nextStep = { nextStep }
            />

            <PlaceAttachPoints
                visible = { step === PLACE_ATTACHPOINTS }
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