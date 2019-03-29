import React, { Component } from 'react'

class ImportButton extends Component {
    componentDidMount() {
        this._fileInput = document.createElement( 'input' )
        this._fileInput.type = 'file'
        this._fileInput.addEventListener( 'change', this.handleLoad )
    }

    handleLoad = e => {
        const { onFileLoaded } = this.props

        /** @type {File} */
        const file = e.target.files[ 0 ]

        // first reset the value to recognize if same file is uploaded again
        this._fileInput.value = ''

        if ( !file ) {
            return
        }

        if ( typeof onFileLoaded !== 'function' ) {
            return
        }

        const objectURL = URL.createObjectURL( file )

        onFileLoaded( file.name, objectURL )
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