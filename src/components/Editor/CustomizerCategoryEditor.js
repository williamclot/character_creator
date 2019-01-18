import React, { Component } from 'react'

import FormWithText from './FormWithText'

class CustomizerCategoryEditor extends Component {
    constructor( props ) {
        super( props )

        this.state = {
            newAttachPointName: ''
        }
    }

    onNewAttachPointNameChange = e => {
        this.setState({
            newAttachPointName: e.target.value
        })
    }

    onAddNewAttachPoint = e => {
        e.preventDefault()

        const { category, onEditCategory } = this.props
        const { newAttachPointName } = this.state

        category.attachPoints.push( newAttachPointName )

        onEditCategory( category )

        this.setState({
            newAttachPointName: ''
        })
    }

    onLabelChange = e => {
        const { category, onEditCategory } = this.props

        const processedCategory = {
            ...category,
            label: e.target.value
        }

        onEditCategory( processedCategory )
    }

    onNameChange = e => {
        
        const { category, onEditCategory } = this.props

        const processedCategory = {
            ...category,
            name: e.target.value
        }

        onEditCategory( processedCategory )
    }

    onSelectParentCategory = e => {
        const { category, onEditCategory } = this.props

        const { value } = e.target

        const newParent = value === "none" ? null : {
            ...category.parent,
            name: value
        }

        const processedCategory = {
            ...category,
            parent: newParent
        }

        onEditCategory( processedCategory )
    }

    render() {
        const { category, allCategories } = this.props


        if ( ! category ) {
            return <p>No Category selected</p>
        }

        const { name, label, attachPoints, parent } = category

        const attachPointsView = [
            ...attachPoints.map(
                ( attachPoint, index ) => (
                    <li key = {attachPoint}>
                        {attachPoint}
                    </li>
                )
            ),
            
            <li key="add-attach-point">
                <FormWithText
                    onSubmit = { this.onAddNewAttachPoint }
                    textValue = { this.state.newAttachPointName }
                    onTextChange = { this.onNewAttachPointNameChange }
                    placeholder = "Name"
                    submitValue = "Add attach point"
                />
            </li>
        ]

        return (
            <div>
                <span>
                    Name:
                    <input
                        type = "text"
                        value = { name }
                        onChange = { this.onNameChange }
                    />
                </span>
                <br/>
                <span>
                    Label:
                    <input
                        type = "text"
                        value = { label }
                        onChange = { this.onLabelChange }
                    />
                </span>

                <ul>
                    {attachPointsView}
                </ul>

                <span>
                    Parent Category:
                    {allCategories && 
                        <select
                            value = {parent ? parent.name : "none"}
                            onChange = { this.onSelectParentCategory }
                        >
                            {allCategories.map(
                                category => (
                                    <option
                                        key = { category.name }
                                        value = { category.name }
                                    >
                                        {category.name}
                                    </option>
                                )
                            ).concat(
                                <option
                                    key = "none"
                                    value = "none"
                                >
                                    No Parent
                                </option>
                            )}
                        </select>
                    }
                </span>
            </div>
        )
    }
}

export default CustomizerCategoryEditor