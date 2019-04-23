import React, { Component } from 'react'

import ContextMenu from './ContextMenu'
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

    handleDelete = object => {
        const { onDelete } = this.props

        const answer = window.confirm( `Are you sure you want to delete ${object.name}?` )

        if ( answer && typeof onDelete === 'function' ) {
            onDelete( object.id )
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

        const elementDiv = objects.map( ( object, index ) => {
            const menuItems = (
                <div
                    className = "selector-item-menu"
                    onMouseDown = { () => this.handleDelete( object ) }
                >
                    Delete Object
                </div>
            )

            return (
                <ContextMenu
                    className = "selector-item"
                    onClick = { () => this.handleClick( object ) }

                    menuItems = { menuItems }
                    key = { object.id || object.name }
                >
                    <div
                        className = "img"
                        style = {{ backgroundImage: `url(${object.img})` }}
                    />
                    <div className = "unselectable item-name">
                        { object.name }
                    </div>
                </ContextMenu>
            )
        })


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