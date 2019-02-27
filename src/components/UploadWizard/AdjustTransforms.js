import React, { Component, createRef } from 'react'
import classNames from 'classnames'

import {
    Scene, PerspectiveCamera, WebGLRenderer, PointLight, Color,
    MeshStandardMaterial, Mesh, Raycaster, Group
} from 'three'
import OrbitControls from 'three-orbitcontrols'
import * as utils from '../ThreeContainer/util/init'
import { fromEvent } from '../../util/helpers'
import { sphereFactory } from '../../util/three-helpers'

import NumberInput from './MyInput'

export default class extends Component {
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

    }

    componentDidUpdate( prevProps ) {
        const prevGeometry = prevProps.uploadedObjectGeometry
        const currGeometry = this.props.uploadedObjectGeometry

        if ( prevGeometry !== currGeometry ) {

            const mesh = new Mesh(
                currGeometry,
                this.defaultMaterial
            )

            this.objectsGroup.add( mesh )
            this.renderScene()

        }
    }

    renderScene = () => {
        this.renderer.render( this.scene, this.camera )
    }

    render() {
        const {
            visible,
            currentCategory,
            nextStep, previousStep
        } = this.props

        return (
            <div
                className = {classNames('wizard-step', 'adjust-transforms', { visible })}
            >

                <canvas
                    className = "preview-canvas"
                    ref = { this.canvasRef }
                    onClick = { this.onClick }
                />
                
                <div className = "side-view">

                    <div className = "inputs-container">
                        <div className = "input-group position">
                            <div className = "label">
                                Position
                            </div>
                            <div className = "axes" >
                                <NumberInput
                                    axis = {'X'}
                                    value = { 999.99 }
                                    onChange = { console.log }
                                />
                                <NumberInput
                                    axis = {'Y'}
                                    value = { 999.99 }
                                    onChange = { console.log }
                                />
                                <NumberInput
                                    axis = {'Z'}
                                    value = { 999.99 }
                                    onChange = { console.log }
                                />
                            </div>
                        </div>
                        <div className = "input-group rotation">
                            ROTATION
                            <input />
                        </div>
                        <div className = "input-group scale">
                            SCALE
                        </div>
                    </div>
                    
                    <div className = "buttons-container">
                        <div
                            className = "button"
                            onClick = { previousStep }
                        >
                            Back
                        </div>
                        <div
                            className = "button"
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