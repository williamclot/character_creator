import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import './UploadWizard.css'
import {
    previousStep, nextStep,
    HIDDEN, UPLOAD_CONFIRM, PLACE_ATTACHPOINTS, ADJUST, COMPLETED
} from '../../actions/steps'


const StepComponent = props => {
    const { step, onCompleted } = props

    return <>
        <div
            onClick = { onCompleted }
            className = { classNames('wizard-step', step === HIDDEN && 'visible' ) }
        >
            <h1>Step 1</h1>
        </div>
        <div
            onClick = { onCompleted }
            className = { classNames('wizard-step', step === UPLOAD_CONFIRM && 'visible' ) }
        >
            <h1>Step 2</h1>
        </div>
        <div
            onClick = { onCompleted }
            className = { classNames('wizard-step', step === PLACE_ATTACHPOINTS && 'visible' ) }
        >
            <h1>Step 3</h1>
        </div>
        <div
            onClick = { onCompleted }
            className = { classNames('wizard-step', step === ADJUST && 'visible' ) }
        >
            <h1>Step 4</h1>
        </div>
        <div
            onClick = { onCompleted }
            className = { classNames('wizard-step', step === COMPLETED && 'visible' ) }
        >
            <h1>Step 5</h1>
        </div>
    </>
}

class UploadWizard extends Component {
    render() {
        const {
            step,                   // state
            nextStep, previousStep  // dispatch
        } = this.props

        return (
            <div className = "wizard-wrapper">
                <StepComponent
                    step = { step }
                    onCompleted = { nextStep }
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