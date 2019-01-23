import React, { Component } from 'react'
import { connect } from 'react-redux'

import { setCurrentGroup, setCurrentCategory } from '../../actions'

import './Categories.css'
import GroupsView from './GroupsView';
import CategoriesView from './CategoriesView';

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

        <GroupsView 
            groups = { groups }
        />

        {selectedGroup && (
            <CategoriesView
                categories = { selectedGroup.categories }
            />
        )}

    </div>
}


const mapStateToProps = state => ({
    selectedGroupIndex: state.selectedCategoryPath.groupIndex,
    selectedCategoryIndex: state.selectedCategoryPath.categoryIndex
})

export default connect(
    mapStateToProps
)( Categories )