const initialState = {
    groupIndex: 0,
    categoryIndex: 0
}

const selectedCategoryPath = ( state = initialState, action ) => {
    switch( action.type ) {

        case 'SET_CURRENT_GROUP': {
            return {
                groupIndex: action.index,
                categoryIndex: 0
            }
        }
        
        case 'SET_CURRENT_CATEGORY': {
            return {
                ...state,
                categoryIndex: action.index
            }
        }
        
        default: {
            return state
        }
        
    }
}

export default selectedCategoryPath