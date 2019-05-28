import OrbitControls from 'three-orbitcontrols'
import { Group, MeshStandardMaterial, Mesh } from 'three'

import renderer from './renderer'
import canvas from './canvas'
import scene from './scene'
import camera from './camera'


const objectContainer = new Group

scene.add( objectContainer )


const threeUtils = {
    saveImage() {
        return new Promise(( resolve, reject ) => {
            canvas.toBlob( blob => resolve(blob), 'image/jpeg' )
        })
    },

    renderScene() {
        renderer.render( scene, camera )
    },

    getCanvas() {
        return canvas
    },

    addObject( geometry, options ) {
        const {
            position: { x: posX, y: posY, z: posZ },
            rotation: { x: rotX, y: rotY, z: rotZ },
            scale
        } = options

        const mesh = new Mesh(
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

    clearObjects() {
        objectContainer.remove( ...objectContainer.children )
    },

    resetRendererSize() {
        const { width, height } = canvas.getBoundingClientRect()

        renderer.setSize( width, height, false )
        renderer.setPixelRatio( width / height )
    },

    setSize({ width, height }) {
        renderer.setSize( width, height )
        renderer.setPixelRatio( width / height )
    }
}

const orbitControls = new OrbitControls( camera, canvas )
orbitControls.addEventListener( 'change', threeUtils.renderScene )
orbitControls.enableKeys = false

export default threeUtils
