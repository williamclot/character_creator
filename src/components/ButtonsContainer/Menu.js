import React, { Component, createRef } from 'react'
import cn from 'classnames'

import styles from './ButtonsContainer.module.css'

class Menu extends Component {
    constructor( props ) {
        super( props )

        this.state = {
            menuShown: false
        }

        this.menuDivRef = createRef()
    }

    handleClick = () => {
        this.setState({
            menuShown: true
        })
        document.addEventListener( 'click', this.handleOustsideClick )
    }

    handleOustsideClick = e => {
        e.preventDefault() // ???

        if ( !this.menuDivRef.current.contains( e.target ) ) {
            this.setState({
                menuShown: false
            })
            document.removeEventListener( 'click', this.handleOustsideClick )
        }
    }

    render() {
        const {
            header,
            className,
            children,
            ...props
        } = this.props
        const { menuShown } = this.state

        return (
            <div
                className = {cn(
                    styles.menu,
                    className
                )}
                ref = { this.menuDivRef }
                onClick = { this.handleClick }
                { ...props }
            >
            
                <div className = {styles.menuHeader} >
                    { header }
                </div>

                <div
                    className = {cn(
                        styles.menuBody,
                        menuShown && styles.visible
                    )}
                >
                    { children }
                </div>

            </div>
        )
    }
}

export default Menu