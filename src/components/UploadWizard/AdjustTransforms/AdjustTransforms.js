import React, { Component, createRef } from 'react'
import cn from 'classnames'

import { radiansToDegreesFormatter } from '../../../util/helpers'

import CanvasContainer from '../../CanvasContainer'

import threeUtils from './three'

import NumberInput from '../../MyInput'
import commonStyles from '../index.module.css'
import styles from './index.module.css'

export default class AdjustTransforms extends Component {
    constructor( props ) {
        super( props )

        this.canvasRef = createRef()

        const {
            position,
            rotation,
            scale
        } = props

        this.state = {
            isUsingGizmos: false,

            posX: position.x,
            posY: position.y,
            posZ: position.z,

            rotX: rotation.x,
            rotY: rotation.y,
            rotZ: rotation.z,

            scale,
        }
    }
    
    componentDidMount() {
        const {
            currentCategory,
            currentObjectParent,
            uploadedObjectGeometry,
            position,
            rotation,
            scale,
            parentAttachPointPosition,
        } = this.props

        const options = {
            position,
            rotation,
            scale,
            parentAttachPointPosition,
        }

        /**
         * Assumption: actual mesh is the first child; the other children
         * are the attachpoints which are not needed in this view
         */
        const parentMesh = currentObjectParent && currentObjectParent.children[0]

        threeUtils.init( uploadedObjectGeometry, options, parentMesh )


        const hasParent = Boolean( currentCategory.parent && currentObjectParent )

        threeUtils.setControlsEnabled( hasParent )

        threeUtils.renderScene()
        

        document.addEventListener( 'keydown', this.onKeyDown )

        threeUtils.addEventListener( 'translate', this.handleGizmoPositionChange )
        threeUtils.addEventListener( 'rotate', this.handleGizmoRotationChange )
        threeUtils.addEventListener( 'scale', this.handleGizmoScaleChange )
        
    }

    componentWillUnmount() {
        document.removeEventListener( 'keydown', this.onKeyDown )

        threeUtils.removeEventListener( 'translate', this.handleGizmoPositionChange )
        threeUtils.removeEventListener( 'rotate', this.handleGizmoRotationChange )
        threeUtils.removeEventListener( 'scale', this.handleGizmoScaleChange )

        threeUtils.clearObjects()
    }

    /*
    componentDidUpdate( prevProps, prevState ) {
        console.log('updateeeee')
        let shouldRender = false
        let positionChanged = false
        let rotationChanged = false
        let scaleChanged = false

        if ( prevState.posX !== this.state.posX ) {
            positionChanged = true
        }

        if ( prevState.posY !== this.state.posY ) {
            positionChanged = true
        }

        if ( prevState.posZ !== this.state.posZ ) {
            positionChanged = true
        }

        if ( prevState.rotX !== this.state.rotX ) {
            rotationChanged = true
        }

        if ( prevState.rotY !== this.state.rotY ) {
            rotationChanged = true
        }

        if ( prevState.rotZ !== this.state.rotZ ) {
            rotationChanged = true
        }

        if ( prevState.scale !== this.state.scale ) {
            scaleChanged = true
        }

        if ( positionChanged ) {
            shouldRender = true
            threeUtils.setPosition({
                x: this.state.posX,
                y: this.state.posY,
                z: this.state.posZ,
            })
        }
        
        if ( rotationChanged ) {
            shouldRender = true
            threeUtils.setRotation({
                x: this.state.rotX,
                y: this.state.rotY,
                z: this.state.rotZ,
            })
        }

        if ( scaleChanged ) {
            shouldRender = true
            threeUtils.setScale( this.state.scale )
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

    handleGizmoRotationChange = ({ rotation: { x: rotX, y: rotY, z: rotZ } }) => {
        this.setState({
            rotX,
            rotY,
            rotZ
        })
    }

    handleGizmoScaleChange = ({ scale }) => {
        this.setState({
            scale
        })
    }

    onPositionXChange = value => {
        this.setState({
            posX: value
        })

        threeUtils.setPosition({
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

        threeUtils.setPosition({
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

        threeUtils.setPosition({
            x: this.state.posX,
            y: this.state.posY,
            z: value,
        })

        threeUtils.renderScene()
    }

    onRotationXChange = value => {
        this.setState({
            rotX: value
        })

        threeUtils.setRotation({
            x: value,
            y: this.state.rotY,
            z: this.state.rotZ,
        })

        threeUtils.renderScene()
    }

    onRotationYChange = value => {
        this.setState({
            rotY: value
        })

        threeUtils.setRotation({
            x: this.state.rotX,
            y: value,
            z: this.state.rotZ,
        })

        threeUtils.renderScene()
    }

    onRotationZChange = value => {
        this.setState({
            rotZ: value
        })

        threeUtils.setRotation({
            x: this.state.rotX,
            y: this.state.rotY,
            z: value,
        })

        threeUtils.renderScene()
    }

    onScaleChange = value => {
        this.setState({
            scale: value
        })

        threeUtils.setScale( value )

        threeUtils.renderScene()
    }

    handleIncrementScale = () => {
        const currentScale = this.state.scale
        const step = currentScale / 30
        const scale = currentScale + step
        
        this.setState({
            scale
        })

        threeUtils.setScale( scale )
        threeUtils.renderScene()
    }

    handleDecrementScale = () => {
        const currentScale = this.state.scale
        const step = currentScale / 30
        const scale = currentScale - step
        
        this.setState({
            scale
        })

        threeUtils.setScale( scale )
        threeUtils.renderScene()
    }

    onModeTranslate = () => {
        threeUtils.setGizmoModeTranslate()
    }

    onModeRotate = () => {
        threeUtils.setGizmoModeRotate()
    }

    onModeScale = () => {
        threeUtils.setGizmoModeScale()
    }

    onKeyDown = (e) => {
        switch( e.key ) {
            case 'p': {
                this.onModeTranslate()
                break
            }
            case 'r': {
                this.onModeRotate()
                break
            }
        }
    }

    handleNext = () => {
        const {
            onPositionChange,
            onRotationChange,
            onScaleChange,
            nextStep,
        } = this.props
        const {
            posX, posY, posZ,
            rotX, rotY, rotZ,
            scale,
        } = this.state

        onPositionChange({
            x: posX,
            y: posY,
            z: posZ,
        })
        onRotationChange({
            x: rotX,
            y: rotY,
            z: rotZ,
        })        
        onScaleChange( scale )

        nextStep()
    }

    render() {
        const {
            currentCategory,

            nextStep, previousStep
        } = this.props
        const {
            posX, posY, posZ,
            rotX, rotY, rotZ,
            scale,
        } = this.state

        const className = cn(
            commonStyles.wizardStep,
            styles.adjustTransforms
        )

        return (
            <div
                className = { className }
            >

                <CanvasContainer
                    className = { styles.previewCanvas }
                    domElement = { threeUtils.getCanvas() }
                    onKeyDown = { this.onKeyDown }
                />

                <div className = { styles.title } >
                    <h2>
                        Position and Resize
                    </h2>
                    <p>
                        Rotate Part to face the camera.
                    </p>
                </div>

                <div className = { styles.shortcutButtons } >
                    <div
                        className = {cn( commonStyles.button, styles.button )}
                        onClick = { this.onModeTranslate }
                    >
                        Position
                    </div>

                    <div
                        className = {cn( commonStyles.button, styles.button )}
                        onClick = { this.onModeRotate }
                    >
                        Rotation
                    </div>

                    <div className = { styles.scaleButton } >
                        Scale
                        <span
                            className = {cn( commonStyles.button, styles.inlineButton )}
                            onClick = { this.handleIncrementScale }
                        >
                            +
                        </span>
                        <span
                            className = {cn( commonStyles.button, styles.inlineButton )}
                            onClick = { this.handleDecrementScale }
                        >
                            -
                        </span>
                    </div>

                </div>
                
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
                        <div className = {cn( styles.inputGroup, styles.rotation )} >
                            <div className = { styles.label } >
                                Rotation
                            </div>
                            <div className = { styles.axes } >
                                <NumberInput
                                    axis = {'X'}
                                    value = { rotX }
                                    onChange = { this.onRotationXChange }
                                    formatter = { radiansToDegreesFormatter }
                                    min = { -Infinity }
                                    max = { Infinity }
                                    precision = { 0 }
                                />
                                <NumberInput
                                    axis = {'Y'}
                                    value = { rotY }
                                    onChange = { this.onRotationYChange }
                                    formatter = { radiansToDegreesFormatter }
                                    min = { -Infinity }
                                    max = { Infinity }
                                    precision = { 0 }
                                />
                                <NumberInput
                                    axis = {'Z'}
                                    value = { rotZ }
                                    onChange = { this.onRotationZChange }
                                    formatter = { radiansToDegreesFormatter }
                                    min = { -Infinity }
                                    max = { Infinity }
                                    precision = { 0 }
                                />
                            </div>
                        </div>
                        <div className = {cn( styles.inputGroup, styles.scale )} >
                        <div className = { styles.label } >
                                Scale
                            </div>
                            <div className = { styles.axes } >
                                <NumberInput
                                    axis = { null }
                                    value = { scale }
                                    step = { scale / 30 }
                                    min = { 0 }
                                    precision = { 4 }
                                    onChange = { this.onScaleChange }
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

            </div>
        )
    }
}