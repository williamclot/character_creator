import React, { PureComponent } from 'react'

import * as THREE from 'three'


import { initCamera, initRenderer, initControls, initLights, initFloor, initGridHelper, initScene } from './util/init';

import './ThreeContainer.css'

class ThreeContainer extends PureComponent {
    constructor( props ) {
        super( props )
    }

    componentDidMount() {

        /** This will contain the group and everything else */
        this.scene = initScene();
    
        /** This group will contain all the meshes but not the floor, the lights etc... */
        this.group = new THREE.Group();
        // this.groupManager = new GroupManager( this.group, defaultCategories );
        
        const lights = initLights();
        const floor = initFloor();
        const gridHelper = initGridHelper();
        

        this.camera = initCamera();
        this.renderer = initRenderer(this.canvas);
        this.orbitControls = initControls(this.camera, this.canvas);
        this.orbitControls.addEventListener( 'change', this.renderScene )
        
        this.scene.add(this.group, floor, gridHelper, ...lights);

        if (process.env.NODE_ENV === "development") {
            // expose variable to window in order to be able to use Three.js inspector
            window.scene = this.scene;
        }

        this.renderScene()

    }

    componentDidUpdate( prevProps, prevState ) {
        if ( prevProps.testKey !== this.props.testKey ) {
            console.log('key changed:', this.props.testKey)
            this.renderScene()
        }
    }

    renderScene = () => this.renderer.render( this.scene, this.camera )

    

    render() {
        const { width, height } = this.props

        return (
            <canvas
                className = "three-canvas"
                ref = { el => this.canvas = el }
                width = { width }
                height = { height }
            />
        );
    }
}

export default ThreeContainer