import React, { Component, createRef } from 'react'
import classNames from 'classnames'

import Input from './Input'

import styles from './index.module.css'

const LEFT_MOUSE_BUTTON = 0

const defaultProps = {
    step: 1,
    min: -100,
    max:  100,
    precision: 3,

    /** @type { Formatter } */
    formatter: {
        format: number => number,
        parse: text => text
    }
}

export default class NumberInput extends Component {
    constructor( props ) {
        super( props )

        this.state = {
            isSelected: false
        }

        this.prevPointer = null
        this.distance = null
        this.startValue = null

    }

    componentWillUnmount() {
        // in case component is unmounted during drag
        document.removeEventListener( 'mouseup', this.onMouseUp )
        document.removeEventListener( 'mousemove', this.onMouseMove )
    }

    onMouseDown = event => {
        if ( event.button !== LEFT_MOUSE_BUTTON ) return

        event.preventDefault()

        this.prevPointer = {
            x: event.clientX,
            y: event.clientY,
        }
        this.distance = 0
        this.startValue = this.props.value

        document.addEventListener( 'mouseup', this.onMouseUp )
        document.addEventListener( 'mousemove', this.onMouseMove )
    }

    onMouseMove = event => {
        const { step, min, max } = this.props

        const {
            clientX, clientY,
            shiftKey: isShiftPressed
        } = event

        const {
            x: prevX,
            y: prevY
        } = this.prevPointer

        const deltaX = clientX - prevX
        const deltaY = clientY - prevY

        this.distance += ( deltaX - deltaY )

        const dividingFactor = isShiftPressed ? 5 : 50
        const normalizedDistance = ( this.distance / dividingFactor )

        const value = this.startValue + normalizedDistance * step
        
        const clampedValue = Math.min( max, Math.max( min, value ) )

        this.props.onChange( clampedValue )

        this.prevPointer = {
            x: clientX,
            y: clientY
        }
    }

    onMouseUp = () => {
        const totalDistanceMoved = Math.abs( this.distance )

        if ( totalDistanceMoved < 2 ) {
            console.log('normal click')
        }

        document.removeEventListener( 'mouseup', this.onMouseUp )
        document.removeEventListener( 'mousemove', this.onMouseMove )
    }


    render() {
        const {
            axis, value,
            precision, min, max, step,
            formatter
        } = this.props

        const formattedValue = formatter.format( value )
        const fixedValue = Number(formattedValue).toFixed( precision )

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

                <span
                    className = { inputClassName }
                    onMouseDown = { this.onMouseDown }
                >
                    {fixedValue}
                </span>

            </div>
        )
    }
}

NumberInput.defaultProps = defaultProps


/**
 * @typedef { Object } Formatter
 * @property { FormatFunction<number> } format
 * @property { ParseFunction<number> } parse
 */

/**
 * @template T
 * @callback FormatFunction
 * @param { T } value
 * @returns { string }
 */

/**
 * @template T
 * @callback ParseFunction
 * @param { string } value
 * @returns { T }
 */