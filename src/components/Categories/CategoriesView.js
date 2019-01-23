import React from 'react'

import { connect } from 'react-redux'

import { setCurrentCategory } from '../../actions'

const CategoryItem = props => {
    const {
        category,
        onClick,
        selected
    } = props

    return (
        <div
            onClick = { onClick }
            className = { 'categories-item' + (selected ? ' selected' : '') }
        >
            { category.label }
        </div>
    )
}

const CategoriesView = props => {
    const { categories, onCategoryClick, currentCategoryIndex } = props
    
    return (
        <div className = "categories-view">
            {categories.map(
                ( category, index ) => (
                    <CategoryItem
                        key = { category.name }
                        category = { category }
                        onClick = { () => onCategoryClick( index ) }
                        selected = { index === currentCategoryIndex }
                    />
                )
            )}
        </div>
    )
}


const mapStateToProps = state => ({
    currentCategoryIndex: state.selectedCategoryPath.categoryIndex
})

const mapDispatchToProps = dispatch => ({
    onCategoryClick: index => dispatch( setCurrentCategory( index ) )
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)( CategoriesView )