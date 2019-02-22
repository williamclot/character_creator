import React, { Component } from 'react'
import classNames from 'classnames'

class AdjustTransforms extends Component {
    render() {
        const {
            visible,
            nextStep, previousStep
        } = this.props

        return (
            <div
                className = {classNames('wizard-step', 'adjust-transforms', { visible })}
            >
                ADJUST POSITION, ROTATION AND SCALE <br/>
                <button onClick = { previousStep }>previous</button>
                <button onClick = { nextStep }>next</button>
            </div>
        )
    }
}

export default AdjustTransforms