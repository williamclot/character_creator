import React, { Component } from 'react'

import './Selector.css'

class Selector extends Component {
    constructor( props ) {
        super( props )

        // console.log(props.objects)
    }

    handleClick = object => {
        const {
            onObjectSelected,
            data
        } = this.props

        onObjectSelected( data.currentCategory, object )
    }

    render() {
        const { data } = this.props

        if ( !data ) {
            return (
                <div className = "selector">
                    <p>Select a category!</p>
                </div>
            )
        }

        const { objects } = data

        const elementDiv = objects.map( ( object, index ) => (
			<div
				className = "selector-item"
				key = {object.name}
				onClick = { () => this.handleClick( object ) }
			>
				<div className = "img">
					<img
						src = { null }
						alt = "img"
					/>
				</div>
				<div className = "unselectable item-name">
					{ object.name }
				</div>
			</div>
		))

        return (
            <div className = "selector">
                { elementDiv }
            </div>
        )
    }
}

export default Selector