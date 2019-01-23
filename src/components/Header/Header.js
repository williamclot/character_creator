import React from 'react'

import './Header.css'
import MMFTitle from './MMFTitle';

const Header = props => {
    return (
        <div className = "header">
            <MMFTitle />
            { props.children }
        </div>
    )
}

export default Header