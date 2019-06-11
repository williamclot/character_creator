import {
    Scene, PerspectiveCamera, WebGLRenderer, Color,
    MeshStandardMaterial, Mesh, Raycaster, Group, Box3
} from 'three'
import OrbitControls from 'three-orbitcontrols'

import { sphereFactory, createLights, moveCameraToFitObject } from '../../../../util/three-helpers'

const objectContainer = new Group

let mesh = null

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

export default {
    renderScene,

    getCanvas() {
        return canvas
    },

    init( geometry, options ) {
        const {
            position: { x: posX, y: posY, z: posZ },
            rotation: { x: rotX, y: rotY, z: rotZ },
            scale,
            attachPointPosition,
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

        objectContainer.add( mesh )


        sphere.position.set(
            attachPointPosition.x,
            attachPointPosition.y,
            attachPointPosition.z,
        )

        const boundingBox = new Box3().setFromObject( objectContainer )

        const size = boundingBox.getSize()
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

    rayCast( mouseCoords ) {

        const raycaster = new Raycaster
        raycaster.setFromCamera( mouseCoords, camera )

        const intersects = raycaster.intersectObject( mesh, true )

        const intersection = intersects.find( intersect => intersect.object.isMesh )

        if( intersection ) {
            const { point, face } = intersection

            const { x, y, z } = point
            
            return { x, y, z }

        }

        return null
    },
}