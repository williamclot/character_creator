import {
    WebGLRenderer, Scene, PerspectiveCamera,
    Color, Mesh, MeshStandardMaterial, Box3
} from 'three'
import OrbitControls from 'three-orbitcontrols'

import { createLights, moveCameraToFitObject } from '../../../../util/three-helpers';


const scene = new Scene
scene.background = new Color( 0xeeeeee )

const renderer = new WebGLRenderer({
    antialias: true,
})
const canvas = renderer.domElement


const camera = new PerspectiveCamera(
    75,
    1,
    0.001,
    1000
)
camera.position.set( 0, .5, 1 )
camera.lookAt( 0, 3, 0 )
camera.add( ...createLights() )

scene.add( camera )

const renderScene = () => {
    renderer.render( scene, camera )
}

const orbitControls = new OrbitControls( camera, canvas )
orbitControls.addEventListener( 'change', renderScene )
orbitControls.enableKeys = false


let mesh = null
let parentMesh = null

export default {
    renderScene,

    init( geometry, parentGeometry ) {
        mesh = new Mesh(
            geometry,
            new MeshStandardMaterial({
                color: 0xffffff,
                opacity: .8,
                transparent: true
            })
        )

        scene.add( mesh )

        const boundingBox = new Box3().copy( geometry.boundingBox )

        if ( parentGeometry ) {
            if ( !parentGeometry.boundingBox ) {
                parentGeometry.computeBoundingBox()
            }

            boundingBox.union( parentGeometry.boundingBox )

            parentMesh = new Mesh(
                parentGeometry,
                new MeshStandardMaterial({
                    color: 0xffffff,
                    opacity: .8,
                    transparent: true
                })
            )

            scene.add( parentMesh )
        }

        orbitControls.reset()
        moveCameraToFitObject( camera, orbitControls, boundingBox )

        // reset renderer size
        const { width, height } = canvas.getBoundingClientRect()

        renderer.setSize( width, height, false )
        renderer.setPixelRatio( width / height )
    },

    clearObjects() {
        scene.remove( mesh )
        mesh = null

        if ( parentMesh ) {
            scene.remove( parentMesh )
            parentMesh = null
        }
    },

    getCanvas() {
        return canvas
    },
}