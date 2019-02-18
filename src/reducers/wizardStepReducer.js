import {
    actionTypes,
    HIDDEN, UPLOAD_CONFIRM, ADJUST, PLACE_ATTACHPOINTS, COMPLETED
} from '../actions/steps'

const wizardStepReducer = ( step = HIDDEN, action ) => {
    switch( action.type ) {
        case actionTypes.NEXT_STEP: switch( step ) {

            case HIDDEN             : return UPLOAD_CONFIRM
            case UPLOAD_CONFIRM     : return ADJUST
            case ADJUST             : return PLACE_ATTACHPOINTS
            case PLACE_ATTACHPOINTS : return COMPLETED
            default                 : return HIDDEN
            
        }
        
        case actionTypes.PREVIOUS_STEP: switch( step ) {

            case UPLOAD_CONFIRM     : return HIDDEN
            case ADJUST             : return UPLOAD_CONFIRM
            case PLACE_ATTACHPOINTS : return ADJUST
            case COMPLETED          : return PLACE_ATTACHPOINTS
            default                 : return HIDDEN
            
        }
        
        default: {
            return step
        }
        
    }
}

export default wizardStepReducer