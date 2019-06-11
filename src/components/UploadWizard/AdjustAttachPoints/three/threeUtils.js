import {
    Scene, PerspectiveCamera, WebGLRenderer, Color,
    MeshStandardMaterial, Mesh, Group, EventDispatcher,
    Box3, Vector3,
} from 'three'
import OrbitControls from 'three-orbitcontrols'

import TransformControls from '../../../../util/transform-controls'
import { sphereFactory, moveCameraToFitObject, createLights } from '../../../../util/three-helpers'

const objectContainer = new Group
const attachPointContainer = new Group

let mesh = null
let _childMesh = null

const sphere = sphereFactory.buildSphere()
sphere.material.color.set( 0xffff00 ) // yellow

attachPointContainer.add( sphere )

const scene = new Scene
scene.background = new Color( 0xeeeeee )
scene.add( objectContainer, attachPointContainer )

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

transformControls.attach( attachPointContainer )
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

    init( geometry, options, childMesh ) {
        const {
            position: { x: posX, y: posY, z: posZ },
            rotation: { x: rotX, y: rotY, z: rotZ },
            scale,
            attachPointPosition,
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

        attachPointContainer.position.set(
            attachPointPosition.x,
            attachPointPosition.y,
            attachPointPosition.z,
        )

        const boundingBox = new Box3().setFromObject( objectContainer )

        if ( childMesh ) {
            boundingBox.expandByObject( childMesh )

            _childMesh = childMesh.clone()
    
            _childMesh.traverse( object => {
                if ( object.isMesh ) {
                    object.material = new MeshStandardMaterial({
                        color: 0xffffff,
                        opacity: .8,
                        transparent: true,
                    })
                }
            })
    

            attachPointContainer.add( _childMesh )
        }


        const size = boundingBox.getSize( new Vector3 )
        const maxDimension = Math.max( size.x, size.y )

        sphere.scale.setScalar( maxDimension )

        orbitControls.reset()
        moveCameraToFitObject( camera, orbitControls, boundingBox )

        // reset renderer size
        const { width, height } = canvas.getBoundingClientRect()

        renderer.setSize( width, height, false )
        renderer.setPixelRatio( width / height )
    },

    clearObjects() {
        objectContainer.remove( mesh )
        mesh = null

        if ( _childMesh ) {
            attachPointContainer.remove( _childMesh )
            _childMesh = null
        }
    },

    setPosition({ x, y, z }) {
        mesh.position.set( x, y, z )
    },

    setRotation({ x, y, z }) {
        objectContainer.rotation.set( x, y, z )
    },

    setScale( scale ) {
        objectContainer.scale.setScalar( scale )
    },

    setSpherePosition({ x, y, z }) {
        attachPointContainer.position.set( x, y, z )
    },

    addEventListener( type, listener ) {
        transformsEventDispatcher.addEventListener( type, listener )
    },

    removeEventListener( type, listener ) {
        transformsEventDispatcher.removeEventListener( type, listener )
    },
}