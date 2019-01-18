import React, { Component } from 'react'


class AttachmentPointsList extends Component {
    constructor( props ) {
        super( props )
    }

    /**
     * @param { string } attachPointName
     * @param { DragEvent } event
     */
    onDragStart = ( attachPointName, event ) => {

        this.props.setCurrentAttachPoint( attachPointName )

        event.dataTransfer.dropEffect = 'move'

    }

    onDragEnd = event => {
        event.preventDefault()
        // console.log('dragend -- list')
    }

    render() {
        return <>
            required attachPoints:
            <ul>
                {this.props.points.map( attachPoint =>
                    <li
                        key = { attachPoint }
                        onClick = { () => this.props.setCurrentAttachPoint( attachPoint ) }
                    >
                        { attachPoint }
                        <img
                            className = "draggable"
                            src = { `${ process.env.PUBLIC_URL }/img/yellow-circle.svg` }
                            draggable
                            onDragStart = { this.onDragStart.bind( null, attachPoint ) }
                            onDragEnd = { this.onDragEnd }
                        />
                    </li>   
                )}
            </ul>
        </>
    }
}

export default AttachmentPointsList