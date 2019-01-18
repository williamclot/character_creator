import React from 'react'

import './GizmoModes.css'

const GizmoModes = ({ setMode }) => {
    return <div className = "gizmo-mode-setter">
        <button
            onClick = { () => setMode( 'translate' ) }
        >
            translate
        </button>
        <button
            onClick = { () => setMode( 'rotate' ) }
        >
            rotate
        </button>
        <button
            onClick = { () => setMode( 'scale' ) }
        >
            scale
        </button>
    </div>
}

export default GizmoModes