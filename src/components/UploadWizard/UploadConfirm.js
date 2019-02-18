import React from 'react'
import classNames from 'classnames'

const UploadConfirm = ({
    visible,
    nextStep, previousStep
}) => {
    return (
        <div
            className = {classNames('wizard-step', 'upload-confirm', { visible })}
        >
            CONFIRM UPLOAD <br/>
            <button onClick = { previousStep }>previous</button>
            <button onClick = { nextStep }>next</button>
        </div>
    )
}

export default UploadConfirm