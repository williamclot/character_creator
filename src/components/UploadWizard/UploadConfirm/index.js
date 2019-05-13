import React, { Component, createRef } from 'react'
import cn from 'classnames'

import {
    Scene, PerspectiveCamera, WebGLRenderer, PointLight, Color,
    MeshStandardMaterial, Mesh, Group
} from 'three'
import OrbitControls from 'three-orbitcontrols'

import Tutorial from '../Tutorial'
import ImportButton from '../../ImportButton'

import commonStyles from '../index.module.css'
import styles from './index.module.css'
import PreviewText from './PreviewText';
import PreviewFile from './PreviewFile';
import Delimiter from './Delimiter';

class UploadConfirm extends Component {
    constructor( props ) {
        super( props )

        this.canvasRef = createRef()

        this.state = {
            tutorialHidden: true,

            img: null
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

    saveImage = () => new Promise(( resolve, reject ) => {
        this.canvasRef.current.toBlob( blob => resolve(blob), 'image/jpeg' )
    })

    handleCancel = () => {
        this.setState({
            img: null
        })

        this.props.onCancel()
    }

    onNext = async () => {
        this.props.onNext()

        const { img } = this.state

        if ( img ) {

            this.props.setImgDataURL( img.objectURL )

            this.setState({
                img: null
            })
        } else {

            const imgBlob = await this.saveImage()
        
            const objectURL = URL.createObjectURL( imgBlob )
    
            this.props.setImgDataURL( objectURL )

        }
    }

    toggleTutorial = () => {
        this.setState( state => ({
            tutorialHidden: !state.tutorialHidden
        }))
    }

    handleFileLoaded = ( filename, objectURL ) => {
        console.log(filename)

        this.setState({
            img: {
                filename,
                objectURL
            }
        })
    }

    handleRemoveImage = () =>  {
        console.log('image removed')

        const { img } = this.state

        if ( img ) URL.revokeObjectURL( img.objectURL )

        this.setState({
            img: null
        })
    }

    renderPreview() {
        const { img } = this.state

        const showImage = Boolean(img)
        const showCanvas = !showImage

        return (
            <>
                {showImage && (
                    <img
                        className = { styles.img }
                        src = { img.objectURL }
                    />
                )}

                <canvas
                    className = {cn( styles.canvas, showCanvas && styles.visible )}
                    ref = { this.canvasRef }
                />
            </>
        )
    }

    render() {
        const {
            visible: isVisible,

            name,
            onNameChange,
            currentCategory,
        } = this.props
        const { tutorialHidden, img } = this.state

        const showImage = Boolean(img)

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
                            { currentCategory && currentCategory.label }
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
                        </div>

                        <div className = { styles.view }>
                            
                            {showImage ? (
                                <PreviewFile
                                    filename = { img.filename }
                                    onRemove = { this.handleRemoveImage }
                                />
                            ) : (
                                <ImportButton
                                    className = { styles.ImportButton }
                                    onFileLoaded = { this.handleFileLoaded }
                                    accept = "image/png, image/jpeg"
                                >
                                    <PreviewText />
                                </ImportButton>

                            )}
                        </div>

                        {!showImage && (
                            <div className = { styles.view }>
                                <Delimiter />
                            </div>
                        )}

                        <div className = { styles.label }>
                            <p className = { styles.previewInstructions } >
                                (Set the Icon by dragging to rotate the part)
                            </p>
                        </div>
                        <div className = {cn( styles.view, styles.canvasContainer )} >

                            {this.renderPreview()}

                            <div className = { styles.canvasTitle } > { name } </div>
                        </div>
                        
                        <div className = {cn( styles.view, styles.buttonsContainer ) } >
                            <div
                                className = {cn( commonStyles.button, styles.button )}
                                onClick = { this.handleCancel }
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