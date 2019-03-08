import React, { Component, createRef } from 'react'
import classNames from 'classnames'

import styles from './index.module.css'

const defaultProps = {
    step: 1,
    min: -100,
    max:  100
}

export default class NumberInput extends Component {
    constructor( props ) {
        super( props )

        this.state = {
            isSelected: false,
            localValue: '',

            distance: 0,

            isMouseDown: false,
            onMouseDownValue: 0,

            pointerX: 0,
            pointerY: 0,
            prevPointerX: 0,
            prevPointerY: 0,
        }

        this.inputRef = createRef()
    }

    componentDidMount() {
        document.addEventListener( 'mouseup', this.onMouseUp )
        document.addEventListener( 'mousemove', this.onMouseMove )
    }

    componentWillUnmount() {
        document.removeEventListener( 'mouseup', this.onMouseUp )
        document.removeEventListener( 'mousemove', this.onMouseMove )
    }

    onMouseDown = (e) => {
        if ( e.button !== 0 ) { // if not left click
            return
        }

        e.preventDefault()
        e.stopPropagation()

        const { clientX, clientY } = e

        this.setState({
            isMouseDown: true,

            distance: 0,
            onMouseDownValue: this.props.value,

            prevPointerX: clientX,
            prevPointerY: clientY,
        })
    }

    onMouseMove = e => {
        const { isMouseDown } = this.state

        if ( !isMouseDown ) { return }

        const {
            clientX, clientY,
            shiftKey: isShiftPressed
        } = e

        const { step, min, max } = this.props
        const {
            distance,
            onMouseDownValue,
            pointerX, pointerY,
            prevPointerX, prevPointerY,
        } = this.state

        const newDistance = distance + (
            ( pointerX - prevPointerX ) -
            ( pointerY - prevPointerY )
        )
        const newValue = onMouseDownValue + (
            newDistance / ( isShiftPressed ? 5 : 50 )
        ) * step

        const computedValue = Math.min( max, Math.max( min, newValue ) )

        this.props.onChange( computedValue )

        this.setState({

            pointerX: clientX,
            pointerY: clientY,

            distance: newDistance,

            prevPointerX: pointerX,
            prevPointerY: pointerY

        })
    }

    onMouseUp = () => {
        if ( !this.state.isMouseDown ) {
            return
        }

        this.setState({
            isMouseDown: false,
        })

        this.inputRef.current.focus()
        this.inputRef.current.select()
    }


    onInputChange = e => {
        this.setState({
            localValue: e.target.value
        })
    }

    onFocus = () => {
        this.setState({
            isSelected: true,
            localValue: this.props.value
        })
    }

    onBlur = () => {
        this.setState({
            isSelected: false,
        })
    }

    onDoubleClick = () => {
        this.inputRef.current.focus()
        this.inputRef.current.select()
    }

    onKeyDown = e => {
        if ( e.key === 'Enter' ) {
            const { localValue } = this.state

            if ( !isNaN( localValue ) ) {
                const value = Number.parseFloat( localValue ).toFixed( 3 )
                this.props.onChange( value )
            }

            this.inputRef.current.blur()
        }
    }

    render() {
        const {
            axis
        } = this.props

        const formattedValue = this.state.isSelected
                ? this.state.localValue
                : Number(this.props.value).toFixed(2)

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
                    ref = { this.inputRef }

                    value = { formattedValue }
                    onChange = { this.onInputChange }
                    onDoubleClick = { this.onDoubleClick }
                    onKeyDown = { this.onKeyDown }
    
                    onFocus = { this.onFocus }
                    onBlur = { this.onBlur }

                    onMouseDown = { this.onMouseDown }
                    // onMouseUp = { this.onMouseUp }
                    // onMouseMove = { this.onMouseMove }
                />
            </div>
        )
    }
}

NumberInput.defaultProps = defaultProps
