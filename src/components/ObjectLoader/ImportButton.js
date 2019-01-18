import React, { Component } from 'react';
import { getExtension } from '../../util/helpers';

class ImportButton extends Component {
    constructor(props) {
        super(props);
        
        this.handleLoad = this.handleLoad.bind( this );
    }

    componentDidMount() {
        this._fileInput = document.createElement( 'input' );
        this._fileInput.type = 'file';
        this._fileInput.addEventListener( 'change', this.handleLoad );


        this._fileReader = new FileReader;
    }

    handleLoad( e ) {
        const file = e.target.files[ 0 ];

        if ( ! file ) {
            return;
        }
        
        console.log('reading')

        this._fileReader.onload = event => {
            this.props.onFileLoaded( event.target.result, getExtension( file.name ) )
        }
        
        this._fileReader.readAsArrayBuffer( file );
    }


    render() {
        return (
            <button
                className = "import-button"
                onClick = { () => this._fileInput.dispatchEvent( new MouseEvent( 'click' ) )  } 
            >
                Import file
            </button>
        );
    }
}

export default ImportButton;