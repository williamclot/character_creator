import React, { Component } from 'react'
import classNames from 'classnames'

import './MyInput.css'

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
        const value = Number.parseFloat( e.target.value )

        this.props.onChange( value )
    }

    render() {
        const {
            value,
            axis
        } = this.props

        return (
            <div className = "input-with-axis" >
                <div className = "axis" >
                    { axis }
                </div>
                <input
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