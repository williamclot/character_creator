import React, { Component } from 'react'
import cn from 'classnames'

import styles from './ContextMenu.module.css'

class ContextMenu extends Component {
    constructor( props ) {
        super( props )

        this.state = {
            menuShown: false,
            top: 0,
            left: 0
        }
    }

    handleContextMenu = e => {
        if ( this.props.disabled ) return

        e.preventDefault()

        this.setState({
            menuShown: true,
            left: e.clientX,
            top: e.clientY
        })

        document.addEventListener( 'mousedown', this.handleOutsideMouseDown )
    }

    handleOutsideMouseDown = e => {
        e.preventDefault() // ???

        this.setState({
            menuShown: false
        })

        document.removeEventListener( 'mousedown', this.handleOutsideMouseDown )
    }

    render() {
        const {
            menuItems,
            className,
            children,
            ...props
        } = this.props
        const { menuShown, top, left } = this.state

        return (
            <div
                className = {cn(
                    styles.menu,
                    className
                )}
                onContextMenu = { this.handleContextMenu }
                { ...props }
            >
            
                { children }

                <div
                    className = {cn(
                        styles.menuBody,
                        menuShown && styles.visible
                    )}
                    style = {{
                        top,
                        left
                    }}
                >
                    { menuItems }
                </div>

            </div>
        )
    }
}

export default ContextMenu