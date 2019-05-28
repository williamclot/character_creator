import React, { Component } from 'react'
import cn from 'classnames'

import NormalInput from './NormalInput'
import DraggableInput from './DraggableInput';

import styles from './index.module.css'

/**
 * @type { Props }
 */
const defaultProps = {
    step: 1,
    min: -100,
    max:  100,
    precision: 3,

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
    }

    handleClick = () => {
        this.setState({
            isSelected: true
        })
    }

    handleBlur = () => {
        this.setState({
            isSelected: false
        })
    }

    render() {
        const {
            axis,
            value, onChange,
            precision, min, max, step, formatter
        } = this.props


        const hasAxis = Boolean( axis )
        const inputClassName = cn(
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

                {this.state.isSelected ?
                    <NormalInput
                        className = {cn( inputClassName, styles.normalInput )}
                        onBlur = { this.handleBlur }
        
                        value = { value }
                        onChange = { onChange }
                        formatter = { formatter }
                        min = { min }
                        max = { max }
                        precision = { precision }
                    />
                    :
                    <DraggableInput
                        className = {cn( inputClassName, styles.draggableInput )}
                        onClick = { this.handleClick }

                        value = { value }
                        onChange = { onChange }
                        formatter = { formatter }
                        min = { min }
                        max = { max }
                        step = { step }
                        precision = { precision }
                    />
                }

            </div>
        )
    }
}

NumberInput.defaultProps = defaultProps

/**
 * @typedef { Object } Props
 * @property { Formatter<number, number> } formatter
 * @property { number } step
 * @property { number } min
 * @property { number } max
 * @property { number } precision
 */

/**
 * @template A, B
 * @typedef { Object } Formatter
 * @property { FormatFunction<A, B> } format
 * @property { ParseFunction<B, A> } parse
 */

/**
 * @template T, S
 * @callback FormatFunction
 * @param { T } value
 * @returns { S }
 */

/**
 * @template T, S
 * @callback ParseFunction
 * @param { S } value
 * @returns { T }
 */