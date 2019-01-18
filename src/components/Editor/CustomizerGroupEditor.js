import React, { Component } from 'react'

import FormWithText from './FormWithText'

class CustomizerGroupEditor extends Component {
    constructor( props ) {
        super( props )

        this.state = {
            newCategoryName: ''
        }
    }

    onNewCategoryNameChange = e => {
        this.setState({
            newCategoryName: e.target.value
        })
    }

    onAddNewCategory = e => {
        e.preventDefault()

        const { newCategoryName } = this.state

        const newCategory = {
            name: newCategoryName,
            label: newCategoryName,
            attachPoints: [],
            parent: null
        }

        this.props.onAddCategory( newCategory )

        this.setState({
            newCategoryName: ''
        })
    }

    onNameChange = e => {
        const { group, onEditGroup } = this.props

        const processedGroup = {
            ...group,
            name: e.target.value
        }

        onEditGroup( processedGroup )
    }

    render() {
        const { group, onCategoryClick } = this.props

        if ( ! group ) {
            return <p>No Group selected</p>
        }

        const { name, categories } = group

        const categoryViews = [
            ...categories.map(
                ( category, index ) => (
                    <li
                        key = { category.name }
                        onClick = { onCategoryClick.bind( null, index ) }
                    >
                        {category.name}
                    </li>
                )
            ),
            <li key="add-category">
                <FormWithText
                    onSubmit = { this.onAddNewCategory }
                    textValue = { this.state.newCategoryName }
                    onTextChange = { this.onNewCategoryNameChange }
                    placeholder = "Name"
                    submitValue = "Add Category"
                />
            </li>
        ]

        return <div>
            <span>
                Name:
                <input
                    type = "text"
                    value = { name }
                    onChange = { this.onNameChange }
                />
            </span>

            <br/>
            categories:
            <ul>
                {categoryViews}
            </ul>
        </div>
    }
}

export default CustomizerGroupEditor