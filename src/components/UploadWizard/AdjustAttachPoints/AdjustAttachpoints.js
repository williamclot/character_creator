import React, { Component } from 'react'
import cn from 'classnames'

import CanvasContainer from '../../CanvasContainer'

import threeUtils from './three'

import NumberInput from '../../MyInput'
import commonStyles from '../index.module.css'
import styles from './index.module.css'

export default class AdjustAttachpoints extends Component {
    constructor( props ) {
        super( props )

        const { currentAttachPoint, attachPointsPositions } = props
        const { x: posX, y: posY, z: posZ } = attachPointsPositions[ currentAttachPoint ] || { x: 0, y: 0, z: 0 }

        this.state = {
            posX,
            posY,
            posZ,
        }
    }
    
    componentDidMount() {
        const {
            currentObjectChild,
            uploadedObjectGeometry,
            position,
            rotation,
            scale,
        } = this.props
        const { posX, posY, posZ } = this.state

        const options = {
            position,
            rotation,
            scale,
            attachPointPosition: {
                x: posX,
                y: posY,
                z: posZ,
            }
        }

        /**
         * Assumption: actual mesh is the first child; the other children
         * are the attachpoints which are not needed in this view
         */
        const childMesh = currentObjectChild && currentObjectChild.children[0]

        threeUtils.init( uploadedObjectGeometry, options, childMesh )

        threeUtils.renderScene()

        threeUtils.addEventListener( 'translate', this.handleGizmoPositionChange )
    }

    componentWillUnmount() {
        threeUtils.clearObjects()

        threeUtils.removeEventListener( 'translate', this.handleGizmoPositionChange )
    }
    
    /*
    componentDidUpdate( prevProps, prevState ) {
        console.log('updateeeee')
        let shouldRender = false
        let positionChanged = false

        if ( prevState.posX !== this.state.posX ) {
            positionChanged = true
        }

        if ( prevState.posY !== this.state.posY ) {
            positionChanged = true
        }

        if ( prevState.posZ !== this.state.posZ ) {
            positionChanged = true
        }


        if ( positionChanged ) {
            shouldRender = true
            threeUtils.setPosition({
                x: this.state.posX,
                y: this.state.posY,
                z: this.state.posZ,
            })
        }
        
        if ( shouldRender ) {
            threeUtils.renderScene()
        }
    }
    */

    handleGizmoPositionChange = ({ position: { x: posX, y: posY, z: posZ } }) => {
        this.setState({
            posX,
            posY,
            posZ
        })
    }

    onPositionXChange = value => {
        this.setState({
            posX: value
        })

        threeUtils.setSpherePosition({
            x: value,
            y: this.state.posY,
            z: this.state.posZ,
        })

        threeUtils.renderScene()
    }

    onPositionYChange = value => {
        this.setState({
            posY: value
        })

        threeUtils.setSpherePosition({
            x: this.state.posX,
            y: value,
            z: this.state.posZ,
        })

        threeUtils.renderScene()
    }

    onPositionZChange = value => {
        this.setState({
            posZ: value
        })

        threeUtils.setSpherePosition({
            x: this.state.posX,
            y: this.state.posY,
            z: value,
        })

        threeUtils.renderScene()
    }

    handleNext = () => {
        const {
            currentAttachPoint,
            onAttachPointPositionChange,
            nextStep,
        } = this.props
        const {
            posX, posY, posZ,
        } = this.state

        onAttachPointPositionChange( currentAttachPoint, {
            x: posX,
            y: posY,
            z: posZ,
        })

        nextStep()
    }

    render() {
        const {
            // currentCategory,

            previousStep
        } = this.props
        const { posX, posY, posZ } = this.state

        const className = cn(
            commonStyles.wizardStep,
            styles.adjustTransforms
        )

        return (
            <div
                className = { className }
            >

                <CanvasContainer
                    className = { styles.previewCanvas}
                    domElement = { threeUtils.getCanvas() }
                />
                
                <div className = { styles.sideView } >

                    <div className = { styles.inputsContainer } >
                        <div className = {cn( styles.inputGroup, styles.position )} >
                            <div className = { styles.label } >
                                Position
                            </div>
                            <div className = { styles.axes } >
                                <NumberInput
                                    axis = {'X'}
                                    value = { posX }
                                    onChange = { this.onPositionXChange }
                                />
                                <NumberInput
                                    axis = {'Y'}
                                    value = { posY }
                                    onChange = { this.onPositionYChange }
                                />
                                <NumberInput
                                    axis = {'Z'}
                                    value = { posZ }
                                    onChange = { this.onPositionZChange }
                                />
                            </div>
                        </div>
                        
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

                <div className = { styles.title } >
                    <h4>
                        Position and Resize
                    </h4>
                </div>

            </div>
        )
    }
}