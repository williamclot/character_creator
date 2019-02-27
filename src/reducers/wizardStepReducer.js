import { actionTypes, steps } from '../actions/steps'

const { NOT_STARTED, UPLOAD_CONFIRM, ADJUST, PLACE_ATTACHPOINT, COMPLETED } = steps

const initialStep = UPLOAD_CONFIRM

export default ( step = initialStep, action ) => {
    switch( action.type ) {
        case actionTypes.NEXT_STEP: switch( step ) {

            case NOT_STARTED        : return UPLOAD_CONFIRM
            case UPLOAD_CONFIRM     : return PLACE_ATTACHPOINT
            case PLACE_ATTACHPOINT  : return ADJUST
            case ADJUST             : return COMPLETED
            
            default                 : return NOT_STARTED
        }
        
        case actionTypes.PREVIOUS_STEP: switch( step ) {

            case UPLOAD_CONFIRM     : return NOT_STARTED
            case PLACE_ATTACHPOINT  : return UPLOAD_CONFIRM
            case ADJUST             : return PLACE_ATTACHPOINT
            case COMPLETED          : return ADJUST
            
            default                 : return NOT_STARTED
        }

        case actionTypes.RESET_WIZARD: {
            return initialStep
        }

        case actionTypes.GO_TO_STEP: {
            return ( action.step in steps )
                ? action.step
                : step
        }
        
        default: {
            return step
        }
        
    }
}
