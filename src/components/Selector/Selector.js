import React, { Component } from 'react'

import ImportButton from '../ImportButton'

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

    handleUpload = ( fileName, objectURL ) => {
        const { data, onUpload } = this.props

        if ( typeof onUpload === 'function' ) {
            onUpload( data.currentCategory, fileName, objectURL )
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

        const { objects, currentCategory } = data

        const elementDiv = objects.map( ( object, index ) => (

			<div
				className = "selector-item"
				key = {object.name}
				onClick = { () => this.handleClick( object ) }
			>
				<div
                    className = "img"
                    style = {{ backgroundImage: `url(${object.img})` }}
                />
				<div className = "unselectable item-name">
					{ object.name }
				</div>
			</div>

		))

        return <>
            <div className = "selector">
                { elementDiv }
            </div>


            <ImportButton
                className = "import-button"
                key = "__add__button__"
                onFileLoaded = { this.handleUpload }
            >
                Add new { currentCategory }
            </ImportButton>
        </>
    }
}

export default Selector