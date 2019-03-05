import React, { Component, createRef } from 'react'
import cn from 'classnames'

import {
    Scene, PerspectiveCamera, WebGLRenderer, PointLight, Color,
    MeshStandardMaterial, Mesh, Raycaster, Group
} from 'three'
import OrbitControls from 'three-orbitcontrols'
import * as utils from '../../ThreeContainer/util/init'
import { fromEvent } from '../../../util/helpers'
import { sphereFactory } from '../../../util/three-helpers'

import NumberInput from '../../MyInput'
import commonStyles from '../index.module.css'
import styles from './index.module.css'

export default class AdjustTransforms extends Component {
    constructor( props ) {
        super( props )

        this.canvasRef = createRef()
    }
    
    componentDidMount() {
        const canvas = this.canvasRef.current
        const { width, height } = canvas.getBoundingClientRect()

        this.objectContainer = new Group
        this.mesh = null
        this.material = new MeshStandardMaterial({
            color: 0xffffff,
            opacity: .8,
            transparent: true
        })

        this.sphere = sphereFactory.buildSphere()

        this.scene = new Scene
        this.scene.background = new Color( 0xeeeeee )
        this.scene.add( this.objectContainer, this.sphere )

        this.camera = new PerspectiveCamera(
            75,
            (width / height),
            0.001,
            1000
        )
        this.camera.position.set( 0, .5, -1 )
        this.camera.lookAt( 0, 3, 0 )
        

        this.renderer = utils.initRenderer( canvas, { width, height }, window.devicePixelRatio )

        const light1 = new PointLight( 0xc1c1c1, 1, 100 )
        light1.position.set( -7, -1, -7 )

        const light2 = new PointLight( 0xc1c1c1, 1, 100 )
        light2.position.set( 7, -1, -7 )

        this.scene.add( light1, light2 )

        this.orbitControls = new OrbitControls( this.camera, canvas )
        this.orbitControls.addEventListener( 'change', this.renderScene )
        this.orbitControls.enableKeys = false

        this.renderScene()
    }

    componentDidUpdate( prevProps ) {
        let shouldRender = false

        const prevGeometry = prevProps.uploadedObjectGeometry
        const currGeometry = this.props.uploadedObjectGeometry

        if ( prevGeometry !== currGeometry ) {
            const oldMesh = this.mesh

            this.mesh = new Mesh(
                currGeometry,
                this.material
            )

            const {
                position: { x: posX, y: posY, z: posZ },
                rotation: { x: rotX, y: rotY, z: rotZ },
                scale
            } = this.props

            this.mesh.position.set( posX, posY, posZ )
            this.objectContainer.rotation.set( rotX, rotY, rotZ )
            this.objectContainer.scale.setScalar( scale )

            this.objectContainer.remove( oldMesh )
            this.objectContainer.add( this.mesh )
            
            shouldRender = true
        }

        const prevPosition = prevProps.position
        const thisPosition = this.props.position

        if ( prevPosition !== thisPosition ) {

            const { x, y, z } = thisPosition
            this.mesh.position.set( x, y, z )

            shouldRender = true
        }

        const prevRotation = prevProps.rotation
        const thisRotation = this.props.rotation
        
        if ( prevRotation !== thisRotation ) {

            const { x, y, z } = thisRotation
            this.objectContainer.rotation.set( x, y, z )

            shouldRender = true
        }

        const prevScale = prevProps.scale
        const thisScale = this.props.scale


        if ( prevScale !== thisScale ) {

            this.objectContainer.scale.setScalar( thisScale )

            shouldRender = true
        }

        if ( shouldRender ) {
            this.renderScene()
        }
    }

    renderScene = () => {
        this.renderer.render( this.scene, this.camera )
    }

    onPositionXChange = value => {
        const { position, onPositionChange } = this.props

        onPositionChange({
            ...position,
            x: value
        })
    }

    onPositionYChange = value => {
        const { position, onPositionChange } = this.props

        onPositionChange({
            ...position,
            y: value
        })
    }

    onPositionZChange = value => {
        const { position, onPositionChange } = this.props

        onPositionChange({
            ...position,
            z: value
        })
    }

    onRotationXChange = value => {
        const { rotation, onRotationChange } = this.props

        onRotationChange({
            ...rotation,
            x: value
        })
    }

    onRotationYChange = value => {
        const { rotation, onRotationChange } = this.props

        onRotationChange({
            ...rotation,
            y: value
        })
    }

    onRotationZChange = value => {
        const { rotation, onRotationChange } = this.props

        onRotationChange({
            ...rotation,
            z: value
        })
    }

    onScaleChange = value => {
        this.props.onScaleChange( value )
    }

    render() {
        const {
            visible: isVisible,
            currentCategory,

            position, rotation, scale,

            nextStep, previousStep
        } = this.props

        const className = cn(
            commonStyles.wizardStep,
            isVisible && commonStyles.visible,
            styles.adjustTransforms
        )


        return (
            <div
                className = { className }
            >

                <canvas
                    className = { styles.previewCanvas}
                    ref = { this.canvasRef }
                    onClick = { this.onClick }
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
                                    value = { position.x }
                                    onChange = { this.onPositionXChange }
                                />
                                <NumberInput
                                    axis = {'Y'}
                                    value = { position.y }
                                    onChange = { this.onPositionYChange }
                                />
                                <NumberInput
                                    axis = {'Z'}
                                    value = { position.z }
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
                                    value = { rotation.x }
                                    onChange = { this.onRotationXChange }
                                />
                                <NumberInput
                                    axis = {'Y'}
                                    value = { rotation.y }
                                    onChange = { this.onRotationYChange }
                                />
                                <NumberInput
                                    axis = {'Z'}
                                    value = { rotation.z }
                                    onChange = { this.onRotationZChange }
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
                            onClick = { nextStep }
                        >
                            Next
                        </div>
                    </div>

                </div>

            </div>
        )
    }
}