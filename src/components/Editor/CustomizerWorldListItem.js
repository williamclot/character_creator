import React from 'react'

const CustomizerWorldListItem = ({ customizer, isSelected, onWorldClick, onMarkDeleted, onSaveChanges }) => {
    const classList = [
        customizer.synced ? "" : "italic",
        customizer.deleted ? "line-through" : "",
        isSelected ? "selected" : ""
    ]
    
    return (
        <li
            className = { classList.join(' ') }
            onClick = { onWorldClick }
        >
            {customizer.name}
            <button
                onClick = { onMarkDeleted }
            >
                Delete
            </button>
            {isSelected && !customizer.synced && (
                <button onClick = { onSaveChanges }>Save Changes</button>
            )}
        </li>
    )
}

export default CustomizerWorldListItem