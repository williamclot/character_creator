import { combineReducers } from 'redux'
import selectedCategoryPath from './selectedCategoryPath'
import isLoading from './loaderReducer'

export default combineReducers({
    selectedCategoryPath,
    isLoading
})