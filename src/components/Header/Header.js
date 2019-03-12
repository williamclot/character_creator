import React from 'react'

import './Header.css'
import MMFTitle from './MMFTitle';

const Header = props => {
    return (
        <div className = "header">
            {/* <MMFTitle /> */}
            <div className = "title">
                { props.title }
            </div>
        </div>
    )
}

export default Header