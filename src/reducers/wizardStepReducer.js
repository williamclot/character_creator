import { actionTypes, steps } from '../actions/steps'

const { NOT_STARTED, UPLOAD_CONFIRM, ADJUST, PLACE_ATTACHPOINTS, COMPLETED } = steps

const initialStep = UPLOAD_CONFIRM

export default ( step = initialStep, action ) => {
    switch( action.type ) {
        case actionTypes.NEXT_STEP: switch( step ) {

            case NOT_STARTED        : return UPLOAD_CONFIRM
            case UPLOAD_CONFIRM     : return ADJUST
            case ADJUST             : return PLACE_ATTACHPOINTS
            case PLACE_ATTACHPOINTS : return COMPLETED
            
            default                 : return NOT_STARTED
        }
        
        case actionTypes.PREVIOUS_STEP: switch( step ) {

            case UPLOAD_CONFIRM     : return NOT_STARTED
            case ADJUST             : return UPLOAD_CONFIRM
            case PLACE_ATTACHPOINTS : return ADJUST
            case COMPLETED          : return PLACE_ATTACHPOINTS
            
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
