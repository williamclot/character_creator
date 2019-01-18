import React, { Component } from 'react'

import FormWithText from './FormWithText'


const CategoryView = category => {
    return (
        <li key = {category.name}>
            name: {category.label} <br/>
            no. of attach points: {category.attachPoints.length}
        </li>
    )
}

const GroupView = ({ group, onGroupClick }) => {
    return (
        <li
            className = "groups-item"
            onClick = { onGroupClick }
        >
            name: {group.name} <br/>
        </li>
    )
}

class CustomizerWorldEditor extends Component {
    constructor( props ) {
        super( props )

        this.state = {
            newGroupName: ''
        }
    }

    onNewGroupNameChange = e => {
        this.setState({
            newGroupName: e.target.value
        })
    }

    onAddNewGroup = e => {
        e.preventDefault()

        const { newGroupName } = this.state

        const newGroup = {
            name: newGroupName,
            imgPath: '',
            categories: []
        }

        this.props.onAddGroup( newGroup )

        this.setState({
            newGroupName: ''
        })
    }

    render() {
        const {
            customizer,
            onGroupClick,
            onRemoveGroup,
            onEditGroup,
            onNameChange,
            onSave
        } = this.props
        const { newGroupName } = this.state

        if ( ! customizer ) {
            return <p>No Customizer selected</p>
        }

        const { name, groups } = customizer

        const addGroupForm = (
            <li key="add-group">
                <FormWithText
                    onSubmit = { this.onAddNewGroup }
                    textValue = { newGroupName }
                    onTextChange = { this.onNewGroupNameChange }
                    placeholder = "Name"
                    submitValue = "Add Group"
                />
            </li>
        )

        const groupViews = [
            ...groups.map( ( group, index) => (
                <GroupView
                    key = { group.name }
                    group = { group }
                    onGroupClick = { onGroupClick.bind( null,  index ) }
                />
            ) ),
            addGroupForm
        ]
        
        return (
            <div className = "customizer-editor">
                <span>
                    Name:
                    <input
                        type = "text"
                        value = { name }
                        onChange = { onNameChange }
                    />
                </span>
                
                <ul className = "groups-list">
                    {groupViews}
                </ul>
            </div>
        );
    }
}

export default CustomizerWorldEditor