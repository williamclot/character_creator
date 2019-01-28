import React, { PureComponent } from 'react'

import * as THREE from 'three'


import { initCamera, initRenderer, initControls, initLights, initFloor, initGridHelper, initScene } from './util/init';
import { get3DObject } from './util/objectHelpers'

import './ThreeContainer.css'
import Loader from './Loader';
import SceneManager from './sceneManager';

class ThreeContainer extends PureComponent {
    constructor( props ) {
        super( props )

        this.state = {
            loading: false
        }
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

        this.sceneManager = new SceneManager( this.group, this.props.categories )

        if (process.env.NODE_ENV === "development") {
            // expose variable to window in order to be able to use Three.js inspector
            window.scene = this.scene;
            window.sceneManager = this.sceneManager
        }

        this.initGroup()

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
                    this.loadObj( key, loadedObjects[ key ] )
                }
            }
        }
    }

    initGroup = async () => {
        const { categories, loadedObjects } = this.props

        this.setState({
            loading: true
        })

        // const myKeys = ['Torso', 'LegL'] // Object.keys( loadedObjects )
        const myKeys = Object.keys( loadedObjects )
        const objectsData = myKeys.map( key => loadedObjects[ key ] )

        // console.log(myKeys)
        // console.log(objectsData)

        /**
         * list of promises that resolve to Object3D
         * @type { Promise<THREE.Object3D>[] }
         */
        const objectsPromises = objectsData.map( get3DObject )

        for ( const [ index, objectPromise ] of objectsPromises.entries() ) {
            const object3D =  await objectPromise
            const categoryKey = myKeys[ index ]

            this.sceneManager.add( categoryKey, object3D )
            
            console.log('loaded:', categoryKey )
        }
        
        this.setState({
            loading: false
        }, this.renderScene )
    }

    loadObj = async ( categoryKey, objectData ) => {
        this.setState({
            loading: true
        })
        
        try {

            const objectToLoad = await get3DObject( objectData )
            this.sceneManager.add( categoryKey, objectToLoad )

        } catch ( err ) {
            console.error( err )
        }

        this.setState({
            loading: false
        }, this.renderScene )

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