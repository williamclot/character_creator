import { combineReducers } from 'redux'
import selectedCategoryPath from './selectedCategoryPath'
import step from './wizardStepReducer'
import isLoading from './loaderReducer'

export default combineReducers({
    selectedCategoryPath,
    step,
    isLoading
})