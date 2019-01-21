const selectedCategoryPath = ( state = {}, action ) => {
    switch( action.type ) {

        case 'SET_CURRENT_GROUP':
            return {
                groupIndex: action.index
            }

        case 'SET_CURRENT_CATEGORY':
            return {
                ...state,
                categoryIndex: action.index
            }

        default: 
            return state

    }
}

export default selectedCategoryPath