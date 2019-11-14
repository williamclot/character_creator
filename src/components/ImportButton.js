import React, { Component } from 'react'
import { uniqueId } from '../util/helpers';


class ImportButton extends Component {
    componentDidMount() {
        this._fileInput = document.createElement( 'input' )
        this._fileInput.type = 'file'
        this._fileInput.addEventListener( 'change', this.handleLoad )

        const { accept } = this.props

        if ( accept ) {
            this._fileInput.accept = accept
        }
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

const ImportButtonV2 = props => {
    const [id] = React.useState(uniqueId);
    const {
        className, title, children, // label props
        ...otherProps
    } = props;

    const idToUse = otherProps.id || id;

    return <>
        <label title={title} className={className} htmlFor={idToUse}>{children}</label>
        <input
            {...otherProps}
            id={idToUse}
            
            // these props should not be overwritten
            type="file"
            style = {{
                opacity: 0,
                position: "absolute",
                zIndex: -1,
            }}
        />
    </>;
}

export default ImportButton
export { ImportButtonV2 }