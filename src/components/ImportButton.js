import React, { Component } from 'react'

class ImportButton extends Component {
    componentDidMount() {
        this._fileInput = document.createElement( 'input' )
        this._fileInput.type = 'file'
        this._fileInput.addEventListener( 'change', this.handleLoad )
    }

    handleLoad = e => {
        const { onFileLoaded } = this.props

        if ( typeof onFileLoaded !== 'function' ) {
            return
        }

        /** @type {File} */
        const file = e.target.files[ 0 ]

        if ( !file ) {
            return
        }

        const objectURL = URL.createObjectURL( file )

        onFileLoaded( objectURL, file.name )
    }

    onClick = () => {
        this._fileInput.dispatchEvent( new MouseEvent( 'click' ) )
    }

    render() {
        const { children, className } = this.props

        return (
            <div
                className = { className }
                onClick = { this.onClick }
            >
                { children }
            </div>
        )
    }
}

export default ImportButton