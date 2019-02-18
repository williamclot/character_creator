import React from 'react'
import classNames from 'classnames'

const AdjustTransforms = ({
    visible,
    nextStep, previousStep
}) => {
    return (
        <div
            className = {classNames('wizard-step', { visible })}
        >
            ADJUST POSITION, ROTATION AND SCALE <br/>
            <button onClick = { previousStep }>previous</button>
            <button onClick = { nextStep }>next</button>
        </div>
    )
}

export default AdjustTransforms