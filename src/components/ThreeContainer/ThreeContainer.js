import React, { PureComponent } from 'react'

import * as THREE from 'three'


import { initCamera, initRenderer, initControls, initLights, initFloor, initGridHelper, initScene } from './util/init';

import './ThreeContainer.css'
import Loader from './Loader';

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
        const { categories, loadedObjects } = this.props
        
        const prevObjects = prevProps.loadedObjects
        if ( prevObjects !== loadedObjects ) {
            const keysToSearch = categories.map( cat => cat.name ) // category names

            for ( const key of keysToSearch ) {
                if ( prevObjects[ key ] !== loadedObjects[ key ] ) {
                    console.log( `key changed: ${key}` )
                }
            }
        }
    }

    renderScene = () => this.renderer.render( this.scene, this.camera )

    

    render() {
        const { width, height } = this.props
        const { loading: isLoading } = this.state

        const className = [
            'canvas-container',
            ... isLoading ? ['loading'] : []
        ].join(' ')

        return (
            <div className = { className }>
                <canvas
                    ref = { el => this.canvas = el }
                    width = { width }
                    height = { height }
                />
                <Loader loading = { isLoading } />
            </div>
        );
    }
}

export default ThreeContainer