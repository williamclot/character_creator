import React, { Component } from 'react'
import classNames from 'classnames'

import styles from './index.module.css'

export default class NumberInput extends Component {
    constructor( props ) {
        super( props )

        this.state = {
            isMouseDown: false
        }
    }

    onMouseDown = () => {
        console.log('mouse down')
        this.setState({
            isMouseDown: true
        })
    }

    onMouseUp = () => {
        console.log('mouse up')
        this.setState({
            isMouseDown: false
        })
    }

    onMouseMove = e => {

        const { isMouseDown } = this.state

        if ( isMouseDown ) {
            console.log('sliding...')
        }
    }

    onInputChange = e => {
        const value = e.target.value

        const computedValue = ( value === '' )
            ? 0
            : Number.parseFloat( value )
        
        console.log(computedValue)
        if ( !Number.isNaN( computedValue ) ) {
            this.props.onChange( computedValue )
        }
    }

    render() {
        const {
            value,
            axis
        } = this.props

        const hasAxis = Boolean( axis )
        const inputClassName = classNames(
            styles.input,
            !hasAxis && styles.noAxis
        )

        return (
            <div className = { styles.container } >

                {hasAxis && (
                    <div className = { styles.axis } >
                        { axis }
                    </div>
                )}

                <input
                    className = { inputClassName }
                    type = "text"

                    value = { value }
                    onChange = { this.onInputChange }
    
                    onMouseDown = { this.onMouseDown }
                    onMouseUp = { this.onMouseUp }
                    onMouseMove = { this.onMouseMove }
                />
            </div>
        )
    }
}