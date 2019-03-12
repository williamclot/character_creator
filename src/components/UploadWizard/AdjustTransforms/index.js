import React, { Component, createRef } from 'react'
import cn from 'classnames'

import {
    Scene, PerspectiveCamera, WebGLRenderer, PointLight, Color,
    MeshStandardMaterial, Mesh, Raycaster, Group
} from 'three'
import OrbitControls from 'three-orbitcontrols'
import { fromEvent } from '../../../util/helpers'
import { sphereFactory } from '../../../util/three-helpers'

import TransformControls from 'three-transformcontrols'
import { throttle } from 'throttle-debounce'

import NumberInput from '../../MyInput'
import commonStyles from '../index.module.css'
import styles from './index.module.css'

export default class AdjustTransforms extends Component {
    constructor( props ) {
        super( props )

        this.canvasRef = createRef()

        this.state = {
            isUsingGizmos: false
        }
    }
    
    componentDidMount() {
        const canvas = this.canvasRef.current

        this.objectContainer = new Group
        this.mesh = null
        this.parentMesh = null
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
            1,
            0.001,
            1000
        )
        this.camera.position.set( 0, .5, -1 )
        this.camera.lookAt( 0, 3, 0 )
        

        this.renderer = new WebGLRenderer({
            antialias: true,
            canvas
        })

        const light1 = new PointLight( 0xc1c1c1, 1, 100 )
        light1.position.set( -7, -1, -7 )

        const light2 = new PointLight( 0xc1c1c1, 1, 100 )
        light2.position.set( 7, -1, -7 )

        this.scene.add( light1, light2 )

        this.orbitControls = new OrbitControls( this.camera, canvas )
        this.orbitControls.addEventListener( 'change', this.renderScene )
        this.orbitControls.enableKeys = false

        this.transformControls = new TransformControls( this.camera, canvas )
        this.transformControls.addEventListener( 'change', this.renderScene )
        this.transformControls.addEventListener( 'objectChange', this.onTransformChange )

        this.transformControls.addEventListener( 'mouseDown', this.onTransformMouseDown )
        this.transformControls.addEventListener( 'mouseUp', this.onTransformMouseUp )

        this.scene.add( this.transformControls )

        this.renderScene()
    }

    onTransformMouseDown = () => {
        this.setState({
            isUsingGizmos: true
        })
    }

    onTransformMouseUp = () => {
        this.setState({
            isUsingGizmos: false
        })
    }

    onTransformChange = throttle( 250, () => {
        const { onPositionChange, onRotationChange, onScaleChange } = this.props

        switch( this.transformControls.getMode() ) {
            case 'translate': {
                const { x, y, z } = this.mesh.position
                onPositionChange({ x, y, z })
                break
            }
            case 'rotate': {
                const { x, y, z } = this.objectContainer.rotation
                onRotationChange({ x, y, z })
                break
            }
            case 'scale': {
                const scale = this.objectContainer.scale.x // assume scale x, y and z are same
                onScaleChange( scale )
                break
            }
        }
    })

    componentDidUpdate( prevProps ) {
        let shouldRender = false

        const { isUsingGizmos } = this.state

        const prevGeometry = prevProps.uploadedObjectGeometry
        const currGeometry = this.props.uploadedObjectGeometry

        if ( prevGeometry !== currGeometry ) {
            this.resetCamera()
            this.resetRenderer()
            
            const oldMesh = this.mesh

            this.mesh = new Mesh(
                currGeometry,
                this.material
            )
            this.transformControls.attach( this.mesh )
            this.transformControls.setMode( 'translate' )

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

        const prevParentObject = prevProps.currentObjectParent
        const thisParentObject = this.props.currentObjectParent

        if ( prevParentObject !== thisParentObject ) {
            const oldParent = this.parentMesh
            
            this.scene.remove( oldParent )

            if ( thisParentObject ) {
                /**
                 * Assumption: first child is the mesh,
                 * other children are bones and need to be filtered out
                 */
                const firstChild = thisParentObject.children[0]

                this.parentMesh = firstChild.clone()

                const attachPoint = this.props.currentCategory.parent.attachPoint
                const attachPoints = thisParentObject.userData.metadata.attachPoints

                const { x, y, z } = attachPoints[ attachPoint ]
                this.parentMesh.position.set( x, y, z ).negate()

                this.scene.add( this.parentMesh )

            }

            shouldRender = true
        }

        const prevPosition = prevProps.position
        const thisPosition = this.props.position

        if ( prevPosition !== thisPosition && !isUsingGizmos ) {

            const { x, y, z } = thisPosition
            this.mesh.position.set( x, y, z )

            shouldRender = true
        }

        const prevRotation = prevProps.rotation
        const thisRotation = this.props.rotation
        
        if ( prevRotation !== thisRotation && !isUsingGizmos ) {

            const { x, y, z } = thisRotation
            this.objectContainer.rotation.set( x, y, z )

            shouldRender = true
        }

        const prevScale = prevProps.scale
        const thisScale = this.props.scale


        if ( prevScale !== thisScale && !isUsingGizmos ) {

            this.objectContainer.scale.setScalar( thisScale )

            shouldRender = true
        }

        if ( shouldRender ) {
            this.renderScene()
        }
    }

    resetRenderer() {
        const { width, height } = this.canvasRef.current.getBoundingClientRect()

        this.renderer.setSize( width, height )
        this.renderer.setPixelRatio( width / height )
    }

    resetCamera() {
        const { width, height } = this.canvasRef.current.getBoundingClientRect()

        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
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

    onModeTranslate = () => {
        this.transformControls.attach( this.mesh )
        this.transformControls.setMode( 'translate' )
    }

    onModeRotate = () => {
        this.transformControls.attach( this.objectContainer )
        this.transformControls.setMode( 'rotate' )
    }

    onModeScale = () => {
        this.transformControls.attach( this.objectContainer )
        this.transformControls.setMode( 'scale' )
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