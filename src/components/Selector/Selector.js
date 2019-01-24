import React, { Component } from 'react'

import './Selector.css'

class Selector extends Component {
    constructor( props ) {
        super( props )

        // console.log(props.objects)
    }

    handleClick = object => {
        console.log( 'clicked', object )

        this.props.onObjectSelected( "Head", object )
    }

    render() {
        const { objects } = this.props

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