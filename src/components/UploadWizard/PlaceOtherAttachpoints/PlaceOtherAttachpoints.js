import React, { Component } from 'react'
import cn from 'classnames'

import { fromEvent } from '../../../util/helpers'

import CanvasContainer from '../../CanvasContainer'

import threeUtils from './three'

import commonStyles from '../index.module.css'
import styles from './index.module.css'

export default class PlaceOtherAttachpoints extends Component {
    constructor( props ) {
        super( props )

        const { currentAttachPoint, attachPointsPositions } = props
        const position = attachPointsPositions[ currentAttachPoint ] || { x: 0, y: 0, z: 0 }

        this.state = {
            position,
        }

        this.mouseDownPosition = null
    }

    componentDidMount() {
        const {
            uploadedObjectGeometry,
            position,
            rotation,
            scale,
        } = this.props

        const attachPointPosition = this.state.position

        const options = {
            position,
            rotation,
            scale,
            attachPointPosition
        }

        threeUtils.init( uploadedObjectGeometry, options )

        threeUtils.renderScene()
    }

    componentWillUnmount() {
        threeUtils.clearObjects()
    }

    handleMouseDown = event => {
        this.mouseDownPosition = fromEvent( event )
    }

    handleMouseUp = event => {
        const mouseUpPosition = fromEvent( event )
        
        const deltaX = mouseUpPosition.x - this.mouseDownPosition.x
        const deltaY = mouseUpPosition.y - this.mouseDownPosition.y

        const distance = Math.sqrt( deltaX ** 2 + deltaY ** 2 ) // euclidean distance

        if ( distance < .001 ) { // counts as click
            
            // use value when mouse is pressed (not when released)
            const intersection = threeUtils.rayCast( this.mouseDownPosition )

            if ( intersection ) {
                threeUtils.setSpherePosition( intersection )

                this.setState({
                    position: intersection
                })

                threeUtils.renderScene()
            }
        }
    }

    handleNext = () => {
        const { currentAttachPoint, onAttachPointPositionChange, nextStep } = this.props
        const { position } = this.state

        onAttachPointPositionChange( currentAttachPoint, position )
        nextStep()
    }

    render() {
        const {
            currentCategory,
            currentAttachPoint,
            nextStep, previousStep
        } = this.props
        
        const className = cn(
            commonStyles.wizardStep,
            styles.placeAttachpoint
        )

        return (
            <div
                className = { className }
            >

                <CanvasContainer
                    className = { styles.previewCanvas }
                    domElement = { threeUtils.getCanvas() }
                    onMouseDown = { this.handleMouseDown }
                    onMouseUp = { this.handleMouseUp }
                />

                <div className = { styles.title } >
                    <h4>Place AttachPoint</h4>
                    <p>Click roughly where this part attaches to {currentAttachPoint}</p>
                </div>

                <div className = { styles.info } >
                    <div className = { styles.infoTitle } >
                        Camera Controls
                    </div>
                    <span> Scroll: Zoom </span><br/>
                    <span> Left Click: Rotate </span><br/>
                    <span> Right Click: Pan </span>
                </div>

                <div className = { styles.buttonsContainer } >

                    <div
                        className = {cn( commonStyles.button, styles.button )}
                        onClick = { previousStep }
                    >
                        Back
                    </div>
                    <div
                        className = {cn( commonStyles.button, styles.button )}
                        onClick = { this.handleNext }
                    >
                        Next
                    </div>

                </div>


            </div>
        )
    }
}