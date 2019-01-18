import React, { Component } from 'react'

import './Popup.css'

class Popup extends Component {
    constructor( props ) {
        super( props )
    }

    render() {
        const { children, visible, onAccept, onDecline, onClose } = this.props

        const classList = [
            'popup',
            visible ? '' : 'hidden'
        ]
        
        return (
            <div className = { classList.join(' ') }>
                {children}
                <button onClick = { onAccept }>Accept</button>
                <button onClick = { onDecline }>Cancel</button>
                <button onClick = { onClose }>Close</button>
            </div>
        )
    }
}

export default Popup