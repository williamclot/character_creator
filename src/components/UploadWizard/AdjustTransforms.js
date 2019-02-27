import React from 'react'
import classNames from 'classnames'

export default ({
    visible,
    nextStep, previousStep
}) => {
    return (
        <div
            className = {classNames('wizard-step', 'adjust-transforms', { visible })}
        >
            Adjust :) <br/>
            <button onClick = { previousStep }>previous</button>
            <button onClick = { nextStep }>next</button>
        </div>
    )
}