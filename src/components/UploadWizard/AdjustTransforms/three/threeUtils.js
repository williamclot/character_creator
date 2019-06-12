import {
    WebGLRenderer, Scene, PerspectiveCamera, EventDispatcher, Group,
    Color, Mesh, MeshStandardMaterial, Box3, Vector3
} from 'three'
import OrbitControls from 'three-orbitcontrols'
import TransformControls from '../../../../util/transform-controls'
import { sphereFactory, createLights, moveCameraToFitObject } from '../../../../util/three-helpers'
import { POSITION_0_0_0 } from '../../../../constants'


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
let _parentMesh = null

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

    init( geometry, options, parentMesh ) {
        const {
            position: { x: posX, y: posY, z: posZ },
            rotation: { x: rotX, y: rotY, z: rotZ },
            scale,
            parentAttachPointPosition = POSITION_0_0_0,
        } = options

        mesh = new Mesh(
            geometry,
            new MeshStandardMaterial({
                color: 0xffffff,
                opacity: .8,
                transparent: true
            })
        )

        objectContainer.add( mesh )

        mesh.position.set( posX, posY, posZ )
        objectContainer.rotation.set( rotX, rotY, rotZ )
        objectContainer.scale.setScalar( scale )

        objectContainer.position.set(
            parentAttachPointPosition.x,
            parentAttachPointPosition.y,
            parentAttachPointPosition.z,
        )

        const boundingBox = new Box3().setFromObject( objectContainer )

        if ( parentMesh ) {
            boundingBox.expandByObject( parentMesh )

            _parentMesh = parentMesh.clone()
            _parentMesh.traverse( object => {
                if ( object.isMesh ) {
                    object.material = new MeshStandardMaterial({
                        color: 0xffffff,
                        opacity: .8,
                        transparent: true,
                    })
                }
            })

            scene.add( _parentMesh )
        }


        sphere.position.set(
            parentAttachPointPosition.x,
            parentAttachPointPosition.y,
            parentAttachPointPosition.z,
        )

        const size = boundingBox.getSize( new Vector3 )
        const maxDimension = Math.max( size.x, size.y )

        sphere.scale.setScalar( maxDimension )

        transformControls.attach( objectContainer )
        transformControls.setMode( 'rotate' )

        
        orbitControls.reset()
        moveCameraToFitObject( camera, orbitControls, boundingBox )


        // reset renderer size
        const { width, height } = canvas.getBoundingClientRect()

        renderer.setSize( width, height, false )
        renderer.setPixelRatio( width / height )
    },

    setControlsEnabled( enabled ) {
        orbitControls.enableRotate = enabled
        orbitControls.enablePan = enabled
    },

    setPosition({ x, y, z }) {
        mesh.position.set( x, y, z )
    },

    clearObjects() {
        objectContainer.remove( mesh )
        mesh = null

        if ( _parentMesh ) {
            scene.remove( _parentMesh )
            _parentMesh = null
        }
    },

    setRotation({ x, y, z }) {
        objectContainer.rotation.set( x, y, z )
    },

    setScale( scale ) {
        objectContainer.scale.setScalar( scale )
    },

    setGizmoModeTranslate() {
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
}