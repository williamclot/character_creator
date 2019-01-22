
import { connect } from 'react-redux'
import axios from 'axios'

import { setCurrentGroup, setCurrentCategory } from '../actions'

import App from '../components/App'


const mapStateToProps = state => ({
    selectedGroupIndex: state.selectedCategoryPath.groupIndex,
    selectedCategoryIndex: state.selectedCategoryPath.categoryIndex
})

const mapDispatchToProps = dispatch => ({
    onGroupClick: index => dispatch( setCurrentGroup( index ) ),
    onCategoryClick: index => dispatch( setCurrentCategory( index ) )
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)( App )