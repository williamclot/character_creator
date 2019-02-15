import React, { Component } from 'react'
import classNames from 'classnames'

import './UploadWizard.css'
import {
    HIDDEN, UPLOAD_CONFIRM, PLACE_ATTACHPOINTS, ADJUST, COMPLETED,
    nextStep
} from './steps'

const Wizard1 = props => {
    return (
        <div className={ classNames('wizard-1') } onClick = { props.onCompleted }>
            <a className = "changemeagain changeme">
                NGTIORHBNURTHNTDORH
            </a>
        </div>
    )
}

const StepComponent = props => {
    switch( props.step ) {
        case HIDDEN: return null
        case UPLOAD_CONFIRM: return <Wizard1 onCompleted = { props.onCompleted } />

        default: return null
    }
}

class UploadWizard extends Component {
    state = {
        step: UPLOAD_CONFIRM
    }

    onStepCompleted = () => {
        this.setState( state => ({
            step: nextStep( state.step )
        }))
    }

    render() {
        const { visible } = this.props
        const { step } = this.state

        return (
            <div className = { classNames('wizard-wrapper', visible && 'visible') }>
                <StepComponent
                    step = { step }
                    onCompleted = { this.onStepCompleted }
                />
            </div>
        )
    }
}

export default UploadWizard