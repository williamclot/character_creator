import React, { Component } from 'react'
import classNames from 'classnames'

import styles from './index.module.css'

const defaultProps = {
    precision: 2,
    step: 1,
    unit: '',
    min: -100,
    max:  100
}

export default class NumberInput extends Component {
    constructor( props ) {
        super( props )

        this.state = {
            value: 0,
            // displayValue: '0.00',

            distance: 0,

            isMouseDown: false,
            onMouseDownValue: 0,

            pointerX: 0,
            pointerY: 0,
            prevPointerX: 0,
            prevPointerY: 0,
        }
    }

    componentDidMount() {
        console.log('mounted')

        document.addEventListener( 'mouseup', this.onMouseUp )
        document.addEventListener( 'mousemove', this.onMouseMove )
    }

    componentWillUnmount() {
        console.log('unmounted')

        document.removeEventListener( 'mouseup', this.onMouseUp )
        document.removeEventListener( 'mousemove', this.onMouseMove )
    }

    onMouseDown = (e) => {
        e.preventDefault()
        e.stopPropagation()

        const { clientX, clientY, button } = e

        if ( button !== 0 ) { // if not left click
            return
        }

        const { value } = this.state

        this.setState({
            isMouseDown: true,

            distance: 0,
            onMouseDownValue: value,

            prevPointerX: clientX,
            prevPointerY: clientY,
        })

        // remove mousemove and mouseup event listeners
    }

    onMouseMove = e => {
        const { isMouseDown } = this.state

        if ( !isMouseDown ) { return }

        const {
            clientX, clientY,
            shiftKey: isShiftPressed
        } = e


        this.setState( state => {
            const { step, min, max } = this.props
            const {
                distance,
                onMouseDownValue,
                pointerX, pointerY,
                prevPointerX, prevPointerY,
            } = state

            const newDistance = distance + (
                ( pointerX - prevPointerX ) -
                ( pointerY - prevPointerY )
            )
            const newValue = onMouseDownValue + (
                newDistance / ( isShiftPressed ? 5 : 50 )
            ) * step

            const computedValue = Math.min( max, Math.max( min, newValue ) )

            return {
    
                pointerX: clientX,
                pointerY: clientY,
    
                distance: newDistance,

                value: computedValue,

                prevPointerX: pointerX,
                prevPointerY: pointerY

            }
        }, () => {
            this.props.onChange( this.state.value )
        })
    }

    onMouseUp = () => {
        if ( !this.state.isMouseDown ) {
            return
        }

        this.setState({
            isMouseDown: false,
        })
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
            // value,
            axis
        } = this.props
        const { value } = this.state

        const formattedValue = Number(value).toFixed(2)

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

                    value = { formattedValue }
                    onChange = { this.onInputChange }
    
                    onMouseDown = { this.onMouseDown }
                    // onMouseUp = { this.onMouseUp }
                    // onMouseMove = { this.onMouseMove }
                />
            </div>
        )
    }
}

NumberInput.defaultProps = defaultProps
