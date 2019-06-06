import {
    WebGLRenderer, Scene, PerspectiveCamera, Group,
    Color, Mesh, MeshStandardMaterial, Vector3
} from 'three'
import OrbitControls from 'three-orbitcontrols'
// import { sphereFactory } from '../../../../util/three-helpers'

import { createLights } from '../../../../util/three-helpers';


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


const objectContainer = new Group

scene.add( objectContainer )

// const sphere = sphereFactory.buildSphere()

// scene.add( sphere )

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

    addObject( geometry ) {

        mesh = new Mesh(
            geometry,
            new MeshStandardMaterial({
                color: 0xffffff,
                opacity: .8,
                transparent: true
            })
        )

        objectContainer.add( mesh )
    },

    addParent( currentParentMesh ) {

        const parentGlobalPosition = currentParentMesh.getWorldPosition( new Vector3 )

        parentMesh = currentParentMesh.clone()

        parentMesh.traverse( object => {
            if ( object.isMesh ) {
                object.material = new MeshStandardMaterial({
                    color: 0xffffff,
                    opacity: .8,
                    transparent: true,
                })
            }
        })

        parentMesh.position.copy( parentGlobalPosition )

        scene.add( parentMesh )
    },

    clearObjects() {
        objectContainer.remove( ...objectContainer.children )
        mesh = null

        if ( parentMesh ) {
            scene.remove( parentMesh )
            parentMesh = null
        }
    },

    getCanvas() {
        return canvas
    },

    resetRendererSize() {
        const { width, height } = canvas.getBoundingClientRect()

        renderer.setSize( width, height, false )
        renderer.setPixelRatio( width / height )
    },
}