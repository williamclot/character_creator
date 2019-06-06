import {
    WebGLRenderer, Scene, PerspectiveCamera, EventDispatcher, Group,
    Color, Mesh, MeshStandardMaterial
} from 'three'
import OrbitControls from 'three-orbitcontrols'
import TransformControls from '../../../../util/transform-controls'
import { sphereFactory } from '../../../../util/three-helpers'

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
camera.position.set( 0, .5, -1 )
camera.lookAt( 0, 3, 0 )
camera.add( ...createLights() )

scene.add( camera )


const objectContainer = new Group

scene.add( objectContainer )

const sphere = sphereFactory.buildSphere()

scene.add( sphere )

const renderScene = () => {
    renderer.render( scene, camera )
}

const orbitControls = new OrbitControls( camera, canvas )
orbitControls.addEventListener( 'change', renderScene )
orbitControls.enableKeys = false


let mesh = null
let parentMesh = null

const transformControls = new TransformControls( camera, canvas )

const transformsEventDispatcher = new EventDispatcher()

const onTransformMouseDown = () => {
    orbitControls.enabled = false
}

const onTransformMouseUp = () => {
    orbitControls.enabled = true

    switch( transformControls.getMode() ) {
        case 'translate': {
            const { x, y, z } = mesh.position
            transformsEventDispatcher.dispatchEvent({ type: 'translate', position: { x, y, z } })
            break
        }
        case 'rotate': {
            const { x, y, z } = objectContainer.rotation
            transformsEventDispatcher.dispatchEvent({ type: 'rotate', rotation: { x, y, z } })
            break
        }
        case 'scale': {
            const scale = objectContainer.scale.x // assume scale x, y and z are same
            transformsEventDispatcher.dispatchEvent({ type: 'scale', scale })
            break
        }
    }
}

transformControls.addEventListener( 'change', renderScene )

transformControls.addEventListener( 'mouseDown', onTransformMouseDown )
transformControls.addEventListener( 'mouseUp', onTransformMouseUp )

scene.add( transformControls )

export default {
    renderScene,

    addObject( geometry, options ) {
        const {
            position: { x: posX, y: posY, z: posZ },
            rotation: { x: rotX, y: rotY, z: rotZ },
            scale
        } = options

        mesh = new Mesh(
            geometry,
            new MeshStandardMaterial({
                color: 0xffffff,
                opacity: .8,
                transparent: true
            })
        )

        mesh.position.set( posX, posY, posZ )
        objectContainer.rotation.set( rotX, rotY, rotZ )
        objectContainer.scale.setScalar( scale )

        transformControls.attach( objectContainer )
        transformControls.setMode( 'rotate' )

        objectContainer.add( mesh )
    },

    addParent( currentParentMesh, position ) {

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

        // needs to be negated
        parentMesh.position.set(
            -position.x,
            -position.y,
            -position.z
        )

        scene.add( parentMesh )
    },

    setControlsEnabled( enabled ) {
        orbitControls.enableRotate = enabled
        orbitControls.enablePan = enabled
    },

    setPosition({ x, y, z }) {
        // TODO - mesh variable
        mesh.position.set( x, y, z )
    },

    clearObjects() {
        objectContainer.remove( ...objectContainer.children )
        mesh = null

        if ( parentMesh ) {
            scene.remove( parentMesh )
            parentMesh = null
        }
    },

    setRotation({ x, y, z }) {
        objectContainer.rotation.set( x, y, z )
    },

    setScale( scale ) {
        objectContainer.scale.setScalar( scale )
    },

    setGizmoModeTranslate() {
        // TODO - mesh variable
        transformControls.attach( mesh )
        transformControls.setMode( 'translate' )
    },

    setGizmoModeRotate() {
        transformControls.attach( objectContainer )
        transformControls.setMode( 'rotate' )
    },

    setGizmoModeScale() {
        transformControls.attach( objectContainer )
        transformControls.setMode( 'scale' )
    },

    addEventListener( type, listener ) {
        transformsEventDispatcher.addEventListener( type, listener )
    },

    removeEventListener( type, listener ) {
        transformsEventDispatcher.removeEventListener( type, listener )
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