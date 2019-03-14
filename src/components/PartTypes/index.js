import React from 'react'
import cn from 'classnames'
import { connect } from 'react-redux'

import { setCurrentGroup, setCurrentCategory } from '../../actions'

import styles from './index.module.css'

const PartType = props => {
    const {
        partType,
        onClick,
        selected: isSelected
    } = props

    const className = cn(
        styles.item,
        isSelected && styles.selected
    )

    return (
        <div
            className = { className }
            onClick = { onClick }
        >
            <div className = { styles.name } > { partType.name } </div>
        </div>
    )

}

const PartTypes = ({
    groups,
    currentGroupIndex, currentCategoryIndex,
    onGroupClick, onCategoryClick,
}) => {

    const partTypes = groups.reduce( ( partTypes, group, groupIndex ) => (
        partTypes.concat( group.categories.map( ( partType, categoryIndex ) => {
            const isSelected = (
                groupIndex === currentGroupIndex &&
                categoryIndex === currentCategoryIndex
            )
            const onClick = () => {
                onGroupClick( groupIndex )
                onCategoryClick( categoryIndex )
            }

            return <PartType
                key = { partType.name }
                partType = { partType }
                onClick = { onClick }
                selected = { isSelected }
            />
        }))
    ), [])

    return (
        <div className = {styles.partTypes}>
            {partTypes}
        </div>
    )
}


const mapStateToProps = state => ({
    currentGroupIndex: state.selectedCategoryPath.groupIndex,
    currentCategoryIndex: state.selectedCategoryPath.categoryIndex
})

const mapDispatchToProps = {
    onGroupClick: setCurrentGroup,
    onCategoryClick: setCurrentCategory
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)( PartTypes )