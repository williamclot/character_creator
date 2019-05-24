import React, { Component } from 'react'
import cn from 'classnames'
import { Vector3 } from 'three'

import CanvasContainer from '../../CanvasContainer'

import threeUtils from './three'

import styles from './index.module.css'
import commonStyles from '../index.module.css'

export default class GlobalPositioning extends Component {
    constructor( props ) {
        super( props )

        this.state = {
            currentObjectGlobalPosition: null,
        }
    }

    componentDidMount() {
        const {
            currentObjectParent,
            currentObject,
            uploadedObjectGeometry,
        } = this.props

        if ( currentObject ) {
            const globalPosition = currentObject.getWorldPosition( new Vector3 )
            
            this.setState({
                currentObjectGlobalPosition: globalPosition
            })
        }


        threeUtils.resetRendererSize()

        threeUtils.addObject( uploadedObjectGeometry )


        const hasParent = Boolean( currentObjectParent )

        if ( hasParent ) {
            /**
             * TODO: get directly from sceneManager
             * 
             * Assumption: first child is the group containing the mesh,
             * other children are bones and need to be filtered out
             */
            const parentMesh = currentObjectParent.children[0]

            threeUtils.addParent( parentMesh )
        }

        threeUtils.renderScene()
    }

    componentWillUnmount() {
        threeUtils.clearObjects()
    }

    handleConfirm = () => {
        const {
            onPositionChange,
            onRotationChange,
            onScaleChange,
            nextStep, onConfirm,
        } = this.props
        const { currentObjectGlobalPosition } = this.state

        if ( currentObjectGlobalPosition ) {
            const { x, y, z } = currentObjectGlobalPosition
            
            // to get the position of the child relative to the parent,
            // we need to subtract the position of the parent from the child;
            // since the position of the child is { 0, 0, 0 } (we placed it there),
            // then the final computed position will be the parent position, but negated
            onPositionChange({
                x: -x,
                y: -y,
                z: -z,
            })
            
            // also reset rotation and scale to initial values
            onRotationChange({
                x: 0,
                y: 0,
                z: 0,
            })
            onScaleChange( 1 )

            // onConfirm will might call the onWizardCompleted function
            // which takes everything from the wizard state and 
            // uses those values to generate the metadata;
            // we need to wait for state to be updated before calling onConfirm
            setTimeout(() => {
                onConfirm()
            })
        } else {
            nextStep()
        }
    }

    handleReject = () => {
        this.props.nextStep()
    }

    handleBack = () => {
        this.props.previousStep()
    }

    render() {
        return (
            <div className = {cn( commonStyles.wizardStep, styles.container )}>

                <CanvasContainer
                    className = { styles.canvas }
                    domElement = { threeUtils.getCanvas() }
                />

                <div className = { styles.title }>
                    Does this look alright to you?
                </div>

                <div className = { styles.buttonsContainer } >

                    <div
                        className = {cn( commonStyles.button, styles.button )}
                        onClick = { this.handleBack }
                    >
                        Back
                    </div>

                    <div
                        className = {cn(
                            commonStyles.button,
                            styles.button,
                            styles.cancellationMark
                        )}
                        onClick = { this.handleReject }
                    >
                        No 🗙
                    </div>

                    <div
                        className = {cn(
                            commonStyles.button,
                            styles.button,
                            styles.confirmationMark
                        )}
                        onClick = { this.handleConfirm }
                    >
                        Yes 🗸
                    </div>

                </div>
            </div>
        )
    }
}