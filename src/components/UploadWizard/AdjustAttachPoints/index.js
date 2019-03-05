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

export default class AdjustAttachpoints extends Component {
    constructor( props ) {
        super( props )

        this.canvasRef = createRef()
    }
    
    componentDidMount() {
        const canvas = this.canvasRef.current
        const { width, height } = canvas.getBoundingClientRect()

        this.defaultMaterial = new MeshStandardMaterial({
            color: 0xffffff,
            opacity: .8,
            transparent: true
        })

        this.sphere = sphereFactory.buildSphere()
        this.sphere.material.color.set( 0xffff00 ) // yellow

        // this.sphere = sphereFactory.buildSphere( true )
        // this.sphere.rotation.setFromVector3( this.props.defaultRotation )

        this.scene = new Scene
        this.scene.background = new Color( 0xeeeeee );

        this.camera = new PerspectiveCamera(
            75,
            (width / height),
            0.001,
            1000
        );
        this.camera.position.set( 0, .5, -1 )
        this.camera.lookAt( 0, 3, 0 )
        

        this.renderer = utils.initRenderer( canvas, { width, height }, window.devicePixelRatio )

        const light1 = new PointLight( 0xc1c1c1, 1, 100 )
        light1.position.set( -7, -1, -7 )

        const light2 = new PointLight( 0xc1c1c1, 1, 100 )
        light2.position.set( 7, -1, -7 )

        this.objectsGroup = new Group

        this.scene.add( light1, light2, this.objectsGroup )

        this.orbitControls = new OrbitControls( this.camera, canvas )
        this.orbitControls.addEventListener( 'change', this.renderScene )

        this.scene.add( this.sphere )

        this.renderScene()

        this.mesh = null
    }

    componentDidUpdate( prevProps ) {
        let shouldRender = false

        const prevGeometry = prevProps.uploadedObjectGeometry
        const currGeometry = this.props.uploadedObjectGeometry

        if ( prevGeometry !== currGeometry ) {

            this.mesh = new Mesh(
                currGeometry,
                this.defaultMaterial
            )

            const { attachPointsToPlace, attachPointsPositions } = this.props
            const position = attachPointsPositions[ attachPointsToPlace[ 0 ] ]

            this.objectsGroup.add( this.mesh )
            
            shouldRender = true
        }

        const prevAttachpoints = prevProps.attachPointsPositions
        const thisAttachPoints = this.props.attachPointsPositions

        if ( prevAttachpoints !== thisAttachPoints ) {
            for ( let key of Object.keys( thisAttachPoints ) ) {
                if ( prevAttachpoints[ key ] !== thisAttachPoints[ key ] ) {
                    const { x, y, z } = thisAttachPoints[ key ]
                    this.sphere.position.set( x, y, z )
                    shouldRender = true
                }
            }
        }

        if ( prevProps.attachPointsToPlace !== this.props.attachPointsToPlace ) {
            const { x, y, z } = this.getPosition()
            this.sphere.position.set( x, y, z )
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
            this.objectsGroup.rotation.set( x, y, z )

            shouldRender = true
        }

        const prevScale = prevProps.scale
        const thisScale = this.props.scale


        if ( prevScale !== thisScale ) {

            this.mesh.scale.setScalar( thisScale )

            shouldRender = true
        }

        if ( shouldRender ) {
            this.renderScene()
        }
    }

    getAttachpoint = () => this.props.attachPointsToPlace[ 0 ]
    getPosition = () => {
        const { attachPointsToPlace, attachPointsPositions } = this.props

        if ( attachPointsToPlace.length === 0 ) {
            return { x: 0, y: 0, z: 0 }
        }

        const currentAttachPoint = attachPointsToPlace[ 0 ]

        return attachPointsPositions[ currentAttachPoint ]
    }

    renderScene = () => {
        this.renderer.render( this.scene, this.camera )
    }

    onPositionXChange = value => {
        const position = this.getPosition()
        const attachPointName = this.getAttachpoint()

        this.props.onAttachPointPositionChange( attachPointName, {
            ...position,
            x: value
        })
    }

    onPositionYChange = value => {
        const position = this.getPosition()
        const attachPointName = this.getAttachpoint()

        this.props.onAttachPointPositionChange( attachPointName, {
            ...position,
            y: value
        })
    }

    onPositionZChange = value => {
        const position = this.getPosition()
        const attachPointName = this.getAttachpoint()

        this.props.onAttachPointPositionChange( attachPointName, {
            ...position,
            z: value
        })
    }

    render() {
        const {
            visible: isVisible,
            currentCategory,

            nextStep, previousStep
        } = this.props

        const position = this.getPosition()

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