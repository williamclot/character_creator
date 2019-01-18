import React from 'react'

const FormWithText = ({
    onSubmit,
    textValue,
    onTextChange,
    placeholder = "",
    submitValue
}) => (
    <form onSubmit = { onSubmit }>
        <input
            type = "text"
            value = { textValue }
            onChange = { onTextChange }
            placeholder = { placeholder }
        />
        <input type = "submit" value = { submitValue } />
    </form>
)

export default FormWithText