import {
    Scene, PerspectiveCamera, WebGLRenderer, Color,
    MeshStandardMaterial, Mesh, Group, EventDispatcher
} from 'three'
import OrbitControls from 'three-orbitcontrols'

import TransformControls from '../../../../util/transform-controls'
import { sphereFactory } from '../../../../util/three-helpers'

import { createLights } from '../../../../util/three-helpers';

const objectContainer = new Group

let mesh = null
let childMesh = null

const sphere = sphereFactory.buildSphere()
sphere.material.color.set( 0xffff00 ) // yellow

const scene = new Scene
scene.background = new Color( 0xeeeeee )
scene.add( objectContainer, sphere )

const camera = new PerspectiveCamera(
    75,
    1,
    0.001,
    1000
)
camera.position.set( 0, .5, -1 )
camera.lookAt( 0, 3, 0 )
camera.add( ...createLights() )

scene.add( camera )

const renderer = new WebGLRenderer({
    antialias: true
})

const canvas = renderer.domElement

function renderScene() {
    renderer.render( scene, camera )
}

const orbitControls = new OrbitControls( camera, canvas )
orbitControls.addEventListener( 'change', renderScene )
orbitControls.enableKeys = false


const transformControls = new TransformControls( camera, canvas )

const transformsEventDispatcher = new EventDispatcher()

transformControls.attach( sphere )
transformControls.setMode( 'translate' )


// const onTransformChange = throttle( 250, () => {

//     const { x, y, z } = mesh.position
//     transformsEventDispatcher.dispatchEvent({ type: 'translate', position: { x, y, z } })
// })

const onTransformMouseDown = () => {
    orbitControls.enabled = false
}

const onTransformMouseUp = () => {
    orbitControls.enabled = true

    const { x, y, z } = mesh.position
    transformsEventDispatcher.dispatchEvent({ type: 'translate', position: { x, y, z } })
}

transformControls.addEventListener( 'change', renderScene )
// transformControls.addEventListener( 'objectChange', onTransformChange )

transformControls.addEventListener( 'mouseDown', onTransformMouseDown )
transformControls.addEventListener( 'mouseUp', onTransformMouseUp )

scene.add( transformControls )

export default {
    renderScene,

    getCanvas() {
        return canvas
    },

    addObject( geometry, options ) {
        const {
            position: { x: posX, y: posY, z: posZ },
            rotation: { x: rotX, y: rotY, z: rotZ },
            scale
        } = options

        mesh = new Mesh(
            geometry,
            new MeshStandardMaterial({
                color: 0xffffff
            })
        )

        mesh.position.set( posX, posY, posZ )
        objectContainer.rotation.set( rotX, rotY, rotZ )
        objectContainer.scale.setScalar( scale )

        objectContainer.add( mesh )
    },

    addChildObject( currentChildMesh, position ) {

        childMesh = currentChildMesh.clone()

        childMesh.traverse( object => {
            if ( object.isMesh ) {
                object.material = new MeshStandardMaterial({
                    color: 0xffffff,
                    opacity: .8,
                    transparent: true,
                })
            }
        })

        sphere.position.set( position.x, position.y, position.z )
        sphere.add( childMesh )
    },

    clearObjects() {
        objectContainer.remove( ...objectContainer.children )
        mesh = null

        if ( childMesh ) {
            sphere.remove( childMesh )
            childMesh = null
        }
    },

    setPosition({ x, y, z }) {
        // TODO - mesh variable
        mesh.position.set( x, y, z )
    },

    setRotation({ x, y, z }) {
        objectContainer.rotation.set( x, y, z )
    },

    setScale( scale ) {
        objectContainer.scale.setScalar( scale )
    },

    setSpherePosition({ x, y, z }) {
        sphere.position.set( x, y, z )
    },

    resetRendererSize() {
        const { width, height } = canvas.getBoundingClientRect()

        renderer.setSize( width, height, false )
        renderer.setPixelRatio( width / height )
    },

    addEventListener( type, listener ) {
        transformsEventDispatcher.addEventListener( type, listener )
    },

    removeEventListener( type, listener ) {
        transformsEventDispatcher.removeEventListener( type, listener )
    },
}