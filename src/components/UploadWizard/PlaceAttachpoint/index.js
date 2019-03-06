import React, { Component, createRef } from 'react'
import cn from 'classnames'

import {
    Scene, PerspectiveCamera, WebGLRenderer, PointLight, Color,
    MeshStandardMaterial, Mesh, Raycaster, Group
} from 'three'
import OrbitControls from 'three-orbitcontrols'
import { fromEvent } from '../../../util/helpers'
import { sphereFactory } from '../../../util/three-helpers'

import commonStyles from '../index.module.css'
import styles from './index.module.css'

export default class PlaceAttachpoint extends Component {
    constructor( props ) {
        super( props )

        this.canvasRef = createRef()
    }
    
    componentDidMount() {
        const canvas = this.canvasRef.current

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

        this.renderScene()
    }

    componentDidUpdate( prevProps ) {
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

            const {
                position: { x: posX, y: posY, z: posZ },
                rotation: { x: rotX, y: rotY, z: rotZ },
                scale
            } = this.props

            this.sphere.position.set( 0, 0, 0 )
            this.mesh.position.set( posX, posY, posZ )
            this.objectContainer.rotation.set( rotX, rotY, rotZ )
            this.objectContainer.scale.setScalar( scale )

            this.objectContainer.remove( oldMesh )
            this.objectContainer.add( this.mesh )
            
            this.renderScene()
        }
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
            
            this.sphere.position.copy( point )

            const globalPosition = this.mesh.worldToLocal( point )
            const computedPosition = globalPosition.negate() // invert to make behave as pivot

            const { x, y, z } = computedPosition

            this.props.onPositionChange({ x, y, z })

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

    resetCamera() {
        const { width, height } = this.canvasRef.current.getBoundingClientRect()

        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
    }

    resetRenderer() {
        const { width, height } = this.canvasRef.current.getBoundingClientRect()

        this.renderer.setSize( width, height )
        this.renderer.setPixelRatio( width / height )
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

        const parentName = currentCategory.parent
            ? currentCategory.parent.name
            : 'the scene'

        
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
                    <h4>Place AttachPoint</h4>
                    <p>Click where this part attaches to {parentName}</p>
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