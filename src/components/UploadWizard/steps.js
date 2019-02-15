
export const HIDDEN = 'HIDDEN'
export const UPLOAD_CONFIRM = 'UPLOAD_CONFIRM'
export const PLACE_ATTACHPOINTS = 'PLACE_ATTACHPOINTS'
export const ADJUST = 'ADJUST'
export const COMPLETED = 'COMPLETED'


export const nextStep = currentStep => {
    switch( currentStep ) {
        case HIDDEN: return UPLOAD_CONFIRM
        case UPLOAD_CONFIRM: return PLACE_ATTACHPOINTS
        case PLACE_ATTACHPOINTS: return ADJUST
        case ADJUST: return COMPLETED
        case COMPLETED: return HIDDEN

        default: return HIDDEN
    }
}