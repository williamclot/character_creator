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

import commonStyles from '../index.module.css'
import styles from './index.module.css'

export default class PlaceOtherAttachpoints extends Component {
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
        this.sphere.material.color.set( 0xffff00 ) // yellow
        
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

    getAttachpoint = () => this.props.attachPointsToPlace[ 0 ]
    getPosition = () => {
        const { attachPointsToPlace, attachPointsPositions } = this.props

        if ( attachPointsToPlace.length === 0 ) {
            return { x: 0, y: 0, z: 0 }
        }

        const currentAttachPoint = attachPointsToPlace[ 0 ]

        return attachPointsPositions[ currentAttachPoint ]
    }

    onClick = ev => {
        ev.preventDefault()

        const mouseCoords = fromEvent( ev )

        const raycaster = new Raycaster
        raycaster.setFromCamera( mouseCoords, this.camera )

        const intersects = raycaster.intersectObject( this.objectContainer, true )

        const intersection = intersects.find( intersect => intersect.object.isMesh )

        if( intersection ) {
            const { point, face } = intersection

            console.log( point, face.normal )

            this.sphere.position.copy( point )

            const { x, y, z } = point
            const attachPointName = this.getAttachpoint()
            this.props.onAttachPointPositionChange( attachPointName, { x, y, z })

            // this.sphere.lookAt( face.normal )
            // this.sphere.up.copy( face.normal )

            this.renderScene()
            
        } else {
            // if ( this.transformControls.object ) {
            //     this.transformControls.detach();
            // }
            console.log('nothing clicked')
        }

    }

    renderScene = () => {
        this.renderer.render( this.scene, this.camera )
    }

    render() {
        const {
            visible: isVisible,
            currentCategory,
            nextStep, previousStep
        } = this.props

        const attachPointName = this.getAttachpoint()


        
        const className = cn(
            commonStyles.wizardStep,
            isVisible && commonStyles.visible,
            styles.placeAttachpoint
        )

        return (
            <div
                className = { className }
            >

                <canvas
                    className = { styles.previewCanvas }
                    ref = { this.canvasRef }
                    onClick = { this.onClick }
                />

                <div className = { styles.title } >
                    <h4>Place AttachPoint "{attachPointName}" </h4>
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
                        onClick = { nextStep }
                    >
                        Next
                    </div>

                </div>


            </div>
        )
    }
}