import { connect } from 'react-redux'

import { setCurrentGroup, setCurrentCategory } from '../actions'

import Categories from '../components/Categories'

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
)( Categories )