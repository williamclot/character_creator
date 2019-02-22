import React, { Component, createRef } from 'react'
import classNames from 'classnames'

import {
    Scene, PerspectiveCamera, WebGLRenderer, PointLight, Color
} from 'three'
import OrbitControls from 'three-orbitcontrols'
import * as utils from '../ThreeContainer/util/init'

class UploadConfirm extends Component {
    constructor( props ) {
        super( props )

        this.canvasRef = createRef()
    }
    
    componentDidMount() {
        const canvas = this.canvasRef.current
        const { width, height } = canvas.getBoundingClientRect()


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

        this.scene.add( light1, light2 )

        this.orbitControls = new OrbitControls( this.camera, canvas )
        this.orbitControls.addEventListener( 'change', this.renderScene )

        this.renderScene()

    }

    componentDidUpdate( prevProps ) {
        const { uploadedObject } = this.props
        if ( prevProps.uploadedObject !== uploadedObject ) {

            this.scene.remove( prevProps.uploadedObject )
            this.scene.add( uploadedObject )
            this.renderScene()

        }
    }

    renderScene = () => {
        this.renderer.render( this.scene, this.camera )
    }

    render() {
        const {
            visible,

            name,
            onNameChange,
            currentCategory,
        
            onCancel, onNext
        } = this.props

        return (
            <div
                className = {classNames('wizard-step', 'upload-confirm', { visible })}
            >
                <h2> Add Part </h2>

                <span>
                    Part Name: 
                    <input
                        className = "name-input"
                        type = "text"
                        value = { name }
                        onChange = { onNameChange }
                    />
                </span>

                <h3>
                    Part Type:
                    {currentCategory.label}
                </h3>

                Part Preview: <br />
                <canvas
                    className = "preview-canvas"
                    ref = { this.canvasRef }
                />

                <div
                    className = "button"
                    onClick = { onCancel }
                >
                    Cancel
                </div>

                <div
                    className = "button"
                    onClick = { onNext }
                >
                    Next
                </div>
            </div>
        )
    }
}

export default UploadConfirm