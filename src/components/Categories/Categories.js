import React, { Component } from 'react'

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

    return <>
        <div>
            <ul>
                {groups.map(
                    ( group, index ) => (
                        <li
                            key = { group.name }
                            onClick = { () => onGroupClick( index ) }
                            selected = { index === selectedGroupIndex }
                        >
                            { group.name }
                        </li>
                    )
                )}
            </ul>
        </div>


        <div>
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
    </>
}

export default Categories