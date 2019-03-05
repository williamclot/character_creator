import React, { Component, createRef } from 'react'
import cn from 'classnames'

import {
    Scene, PerspectiveCamera, WebGLRenderer, PointLight, Color,
    MeshStandardMaterial, Mesh, Group
} from 'three'
import OrbitControls from 'three-orbitcontrols'
import * as utils from '../../ThreeContainer/util/init'

import commonStyles from '../index.module.css'
import styles from './index.module.css'

class UploadConfirm extends Component {
    constructor( props ) {
        super( props )

        this.canvasRef = createRef()
    }
    
    componentDidMount() {
        const canvas = this.canvasRef.current
        const { width, height } = canvas.getBoundingClientRect()

        this.objectContainer = new Group
        this.mesh = null
        this.material = new MeshStandardMaterial

        this.scene = new Scene
        this.scene.background = new Color( 0xeeeeee )
        this.scene.add( this.objectContainer )

        this.camera = new PerspectiveCamera(
            75,
            (width / height),
            0.001,
            1000
        )
        this.camera.position.set( 0, .5, -1 )
        this.camera.lookAt( 0, 3, 0 )
        
        this.orbitControls = new OrbitControls( this.camera, canvas )
        this.orbitControls.addEventListener( 'change', this.renderScene )
        this.orbitControls.enableKeys = false

        this.renderer = utils.initRenderer( canvas, { width, height }, window.devicePixelRatio )


        const light1 = new PointLight( 0xc1c1c1, 1, 100 )
        light1.position.set( -7, -1, -7 )

        const light2 = new PointLight( 0xc1c1c1, 1, 100 )
        light2.position.set( 7, -1, -7 )
        
        this.scene.add( light1, light2 )

        this.renderScene()
    }

    componentDidUpdate( prevProps ) {
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

            this.renderScene()
        }
    }

    renderScene = () => {
        this.renderer.render( this.scene, this.camera )
    }

    render() {
        const {
            visible: isVisible,

            name,
            onNameChange,
            currentCategory,
        
            onCancel, onNext
        } = this.props

        const className = cn(
            commonStyles.wizardStep,
            isVisible && commonStyles.visible,
            styles.uploadConfirm
        )

        return (
            <div
                className = { className }
            >
                <h2> Add Part </h2>

                <div className = { styles.gridView } >

                    <span className = { styles.label } >
                        Part Name: 
                    </span>
                    <input
                        className = { styles.view }
                        type = "text"
                        value = { name }
                        onChange = { onNameChange }
                    />


                    <h3 className = { styles.label } >
                        Part Type:
                    </h3>
                    <span className = { styles.view } >
                        {currentCategory.label}
                    </span>

                    <span className = { styles.label } >
                        Part Preview:
                    </span>
                    <canvas
                        className = { styles.view }
                        ref = { this.canvasRef }
                    />
                    
                    <div className = {cn( styles.view, styles.buttonsContainer ) } >
                        <div
                            className = {cn( commonStyles.button, styles.button )}
                            onClick = { onCancel }
                        >
                            Cancel
                        </div>

                        <div
                            className = {cn( commonStyles.button, styles.button )}
                            onClick = { onNext }
                        >
                            Next
                        </div>
                    </div>

                </div>

            </div>
        )
    }
}

export default UploadConfirm