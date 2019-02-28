import React, { Component } from 'react'

import ImportButton from './ImportButton'

import './Selector.css'

class Selector extends Component {
    constructor( props ) {
        super( props )
    }

    handleClick = object => {
        const {
            onObjectSelected,
            data
        } = this.props

        onObjectSelected( data.currentCategory, object )
    }

    handleUpload = ( objectURL, fileName ) => {
        const { onUpload } = this.props

        if ( typeof onUpload === 'function' ) {
            onUpload( objectURL, fileName )
        }
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
		)).concat(
            <ImportButton
                className = "selector-item"
                key = "__add__button__"
                onFileLoaded = { this.handleUpload }
            >
                <div className = "img">
                    <img
                        src = { null } // TODO plus button img
                        alt = "+"
                    />
                </div>
                <div className = "unselectable item-name">
                    Upload File
                </div>
            </ImportButton>
        )

        return (
            <div className = "selector">
                { elementDiv }
            </div>
        )
    }
}

export default Selector