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
        const { uploadedObject, name, filename } = this.props

        const canvas = this.canvasRef.current
        const { height, width } = canvas.getBoundingClientRect()


        this.scene = new Scene
        this.scene.background = new Color( 0xeeeeee );

        this.camera = new PerspectiveCamera(
            75,
            (window.innerWidth / window.innerHeight),
            0.001,
            1000
        );
        this.camera.position.set( 0, 1, -1 )
        this.camera.lookAt( 0, 3, 0 )
        

        this.renderer = utils.initRenderer( canvas, { width, height }, window.devicePixelRatio )

        const light = new PointLight( 0xc1c1c1, 1, 100 )
        light.position.set( 0, 3, -3 )

        this.scene.add( light )

        this.orbitControls = new OrbitControls( this.camera, canvas )
        this.orbitControls.addEventListener( 'change', this.renderScene )

        if ( uploadedObject ) {
            this.scene.add( uploadedObject )
        }

        this.renderScene()
    }

    componentDidUpdate( prevProps ) {
        // const { uploadedObject } = this.props
        // if ( prevProps.uploadedObject !== uploadedObject ) {
        //     this.scene.remove( prevProps.uploadedObject )
        //     this.scene.add( uploadedObject )
        //     this.renderScene()
        // }
    }

    onNextStep = () => {
        const { nextStep } = this.props

        console.log( 'next step...' )
        // logic here...

        if ( typeof nextStep === 'function' ) {
            nextStep()
        }
    }

    renderScene = () => {
        this.renderer.render( this.scene, this.camera )
    }

    render() {
        const {
            visible,

            name,
            currentCategory,
        
            nextStep, previousStep
        } = this.props

        return (
            <div
                className = {classNames('wizard-step', 'upload-confirm', { visible })}
            >
                CONFIRM UPLOAD <br/>
                <h1> {name} </h1>
                <h3> {currentCategory.label} </h3>

                <canvas ref = { this.canvasRef } />

                <button onClick = { previousStep }>previous</button>
                <button onClick = { this.onNextStep }>next</button>
            </div>
        )
    }
}

export default UploadConfirm