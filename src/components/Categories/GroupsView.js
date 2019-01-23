import React from 'react'

import { connect } from 'react-redux'

import { setCurrentGroup } from '../../actions'

const GroupItem = props => {
    const {
        group,
        onClick,
        selected
    } = props

    const classList = [ 'groups-item' ]
    if ( selected ) {
        classList.push( 'selected' )
    }

    return (
        <div
            className = { classList.join(' ') }
            onClick = { onClick }
        >
            <img src = { group.imgPath } alt = { group.name } />
        </div>
    )

}

const GroupsView = props => {
    const { groups, onGroupClick, currentGroupIndex } = props
    
    return (
        <div className = "groups-view">
            {groups.map(
                ( group, index ) => (
                    <GroupItem
                        key = { group.name }
                        group = { group }
                        onClick = { () => onGroupClick( index ) }
                        selected = { index === currentGroupIndex }
                    />
                )
            )}
        </div>
    )
}


const mapStateToProps = state => ({
    currentGroupIndex: state.selectedCategoryPath.groupIndex
})

const mapDispatchToProps = dispatch => ({
    onGroupClick: index => dispatch( setCurrentGroup( index ) ),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)( GroupsView )