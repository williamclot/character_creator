import React from 'react'
import classNames from 'classnames'

const PlaceAttachPoints = ({
    visible,
    nextStep, previousStep
}) => {
    return (
        <div
            className = {classNames('wizard-step', 'place-attachpoints', { visible })}
        >
            PLACE ATTACH POINTS <br/>
            <button onClick = { previousStep }>previous</button>
            <button onClick = { nextStep }>next</button>
        </div>
    )
}

export default PlaceAttachPoints