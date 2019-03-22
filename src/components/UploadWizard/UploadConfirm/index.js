import React, { Component, createRef } from 'react'
import cn from 'classnames'

import {
    Scene, PerspectiveCamera, WebGLRenderer, PointLight, Color,
    MeshStandardMaterial, Mesh, Group
} from 'three'
import OrbitControls from 'three-orbitcontrols'

import Tutorial from '../Tutorial'

import commonStyles from '../index.module.css'
import styles from './index.module.css'

class UploadConfirm extends Component {
    constructor( props ) {
        super( props )

        this.canvasRef = createRef()

        this.state = {
            tutorialHidden: true
        }
    }
    
    componentDidMount() {
        const canvas = this.canvasRef.current

        this.objectContainer = new Group
        this.mesh = null
        this.material = new MeshStandardMaterial({
            color: 0xffffff
        })

        this.scene = new Scene
        this.scene.background = new Color( 0x777777 )
        this.scene.add( this.objectContainer )

        this.camera = new PerspectiveCamera(
            75,
            1,
            0.001,
            1000
        )
        this.camera.position.set( 0, .5, -1 )
        this.camera.lookAt( 0, 0, 0 )

        this.scene.add( this.camera )
        
        this.orbitControls = new OrbitControls( this.camera, canvas )
        this.orbitControls.addEventListener( 'change', this.renderScene )
        this.orbitControls.enableKeys = false

        this.renderer = new WebGLRenderer({
            preserveDrawingBuffer: true,
            antialias: true,
            canvas
        })

        const lightsPositions = [
            [-1, -1, 0],
            [-1,  1, 0],
            [ 1,  1, 0],
            [ 1, -1, 0],
        ]
        for ( let [x, y, z] of lightsPositions ) {
            const light = new PointLight( 0xffffff, .5, 100 )
            light.position.set( x, y, z )
            this.camera.add( light )
        }

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

            this.mesh.position.set( posX, posY, posZ )
            this.objectContainer.rotation.set( rotX, rotY, rotZ )
            this.objectContainer.scale.setScalar( scale )

            this.objectContainer.remove( oldMesh )
            this.objectContainer.add( this.mesh )

            this.renderScene()
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

    onNext = () => {
        const dataURL = this.canvasRef.current.toDataURL( 'image/jpeg' )
        this.props.setImgDataURL( dataURL )

        this.props.onNext()
    }

    toggleTutorial = () => {
        this.setState( state => ({
            tutorialHidden: !state.tutorialHidden
        }))
    }

    render() {
        const {
            visible: isVisible,

            name,
            onNameChange,
            currentCategory,
        
            onCancel, onNext
        } = this.props
        const { tutorialHidden } = this.state

        const className = cn(
            commonStyles.wizardStep,
            isVisible && commonStyles.visible,
            styles.container
        )

        return (
            <div className = { className } >
                <div
                    className = { styles.uploadConfirm }
                >
                    <h2> Add Part </h2>

                    <div className = { styles.gridView } >

                        <span className = { styles.label } >
                            Part Type
                            <span
                                className = { styles.questionMark }
                                onClick = { this.toggleTutorial }
                            >?</span>
                        </span>
                        <span className = { styles.view } >
                            {currentCategory.label}
                        </span>

                        <span className = { styles.label } >
                            Part Name
                        </span>
                        <input
                            className = {cn( styles.view, styles.input )}
                            type = "text"
                            value = { name }
                            onChange = { onNameChange }
                        />

                        <div className = { styles.label }>
                            <span>
                                Part Preview Icon
                            </span>
                            <p className = { styles.previewInstructions } >
                                (Set the Icon by dragging to rotate the part)
                            </p>
                        </div>
                        <canvas
                            className = {cn( styles.view, styles.canvas )}
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
                                onClick = { this.onNext }
                            >
                                Next
                            </div>
                        </div>

                    </div>

                </div>

                <div
                    className = {cn(
                        styles.tutorial,
                        tutorialHidden && styles.hidden
                    )}
                >
                    <Tutorial />
                </div>
            </div>
        )
    }
}

export default UploadConfirm