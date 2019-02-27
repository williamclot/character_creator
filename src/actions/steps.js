export const actionTypes = {
    PREVIOUS_STEP: 'PREVIOUS_STEP',
    NEXT_STEP    : 'NEXT_STEP',
    RESET_WIZARD : 'RESET_WIZARD',
    GO_TO_STEP   : 'GO_TO_STEP'
}

export const steps = {
    NOT_STARTED        : 'NOT_STARTED',
    UPLOAD_CONFIRM     : 'UPLOAD_CONFIRM',
    PLACE_ATTACHPOINT : 'PLACE_ATTACHPOINT',
    ADJUST             : 'ADJUST',
    COMPLETED          : 'COMPLETED'
}


export const previousStep = () => ({
    type: actionTypes.PREVIOUS_STEP
})

export const nextStep = () => ({
    type: actionTypes.NEXT_STEP
})

export const resetWizard = () => ({
    type: actionTypes.RESET_WIZARD
})

export const goToStep = step => ({
    type: actionTypes.GO_TO_STEP,
    step
})
