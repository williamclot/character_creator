import React, { Component } from 'react'
import { connect } from 'react-redux'

import { setCurrentGroup, setCurrentCategory } from '../../actions'

import './Categories.css'

const Categories = props => {
    const {
        groups,
        selectedGroupIndex, selectedCategoryIndex,
        onGroupClick, onCategoryClick
    } = props

    const getSelectedGroup = () => groups[ selectedGroupIndex ]
    const getSelectedCategory = () => {
        const selectedGroup = getSelectedGroup()
        return selectedGroup && selectedGroup.categories[ selectedCategoryIndex ]
    }

    const selectedGroup = getSelectedGroup()

    return <div className = "groups-container">
        <div className = "groups-view">
            {groups.map(
                ( group, index ) => (
                    <div
                        className = { 'groups-item' + (index === selectedGroupIndex ? ' selected' : '') }
                        key = { group.name }
                        onClick = { () => onGroupClick( index ) }
                    >
                        <img src = { group.imgPath } alt = { group.name } />
                    </div>
                )
            )}
        </div>


        <div className = "categories-view">
            {selectedGroup && (
                <ul>
                    {selectedGroup.categories.map(
                        ( category, index ) => (
                            <li
                                key = { category.id }
                                onClick = { () => onCategoryClick( index ) }
                                selected = { index === selectedCategoryIndex }
                            >
                                { category.name }
                            </li>
                        )
                    )}
                </ul>
            )}
        </div>
    </div>
}


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