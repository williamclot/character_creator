export const actionTypes = {
    PREVIOUS_STEP: 'PREVIOUS_STEP',
    NEXT_STEP: 'NEXT_STEP'
}

export const previousStep = () => ({
    type: actionTypes.PREVIOUS_STEP
})

export const nextStep = () => ({
    type: actionTypes.NEXT_STEP
})

export const HIDDEN             = 'HIDDEN'
export const UPLOAD_CONFIRM     = 'UPLOAD_CONFIRM'
export const PLACE_ATTACHPOINTS = 'PLACE_ATTACHPOINTS'
export const ADJUST             = 'ADJUST'
export const COMPLETED          = 'COMPLETED'