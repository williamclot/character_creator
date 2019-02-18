import { combineReducers } from 'redux'
import selectedCategoryPath from './selectedCategoryPath'
import step from './wizardStepReducer'

export default combineReducers({
    selectedCategoryPath,
    step
})