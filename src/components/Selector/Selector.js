import React, { Component } from 'react'

import './Selector.css'

class Selector extends Component {
    constructor( props ) {
        super( props )

        // console.log(props.objects)
    }

    handleClick = index => {
        console.log( 'clicked', index )
    }

    render() {
        const { objects } = this.props

        const elementDiv = objects.map( ( objUrl, index ) => (
			<div
				className = "selector-item"
				key = {objUrl}
				onClick = { () => this.handleClick( objUrl ) }
			>
				<div className = "img">
					<img
						src = { null }
						alt = "img"
					/>
				</div>
				<div className = "unselectable item-name">
					{ objUrl.slice( 29, -4 ) }
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