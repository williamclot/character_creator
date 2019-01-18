import React, { Component } from 'react'

import ImportButton from './ImportButton'
import AttachmentPointsList from './AttachmentPointsList'

import './ObjectLoader.css'

class ObjectLoader extends Component {
    /**
     * @param { Object } props 
     * @param { ( blob, extension: string ) => void } props.onFileLoaded
     */
    constructor( props ) {
        super( props )
    }

    // _handleFileUpload = ( blob, extension ) => {
    //     this.props.onFileLoaded( blob, extension )
        

    // }

    render() {
        const { selectedType } = this.props

        const { id, label, attachmentPoints, parentParentAttachPoint } = selectedType

        return (
            <div className = "object-loader">
                <div>
                    type: { id } <br/>
                    label: { label } <br/>

                    { (attachmentPoints.size > 0) && (
                        <AttachmentPointsList
                            setCurrentAttachPoint = { this.props.setCurrentAttachPoint }
                            points = { Array.from( attachmentPoints ) }
                        />
                    )} <br/>

                    { parentParentAttachPoint ?  
                        `Objects of this type will be attached to ${ parentParentAttachPoint.typeId }
                        at the ${ parentParentAttachPoint.attachPointName } attach point.`
                        :
                        `Objects of this type will not be attached to another object`
                    }
                    
                    
                </div>
                <ImportButton onFileLoaded = { this.props.onFileLoaded } />
            </div>
        )
    }
}

export default ObjectLoader