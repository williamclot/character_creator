import OrbitControls from 'three-orbitcontrols'
import { Group, MeshStandardMaterial, Mesh } from 'three'

import renderer from './renderer'
import canvas from './canvas'
import scene from './scene'
import camera from './camera'

import { moveCameraToFitObject } from '../../../../util/three-helpers';

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

    init( geometry ) {
        const mesh = new Mesh(
            geometry,
            new MeshStandardMaterial({
                color: 0xffffff
            })
        )

        objectContainer.add( mesh )

        orbitControls.reset()
        moveCameraToFitObject( camera, orbitControls, geometry.boundingBox )

        // reset renderer size
        const { width, height } = canvas.getBoundingClientRect()

        renderer.setSize( width, height, false )
        renderer.setPixelRatio( width / height )
    },

    clearObjects() {
        objectContainer.remove( ...objectContainer.children )
    },
}

const orbitControls = new OrbitControls( camera, canvas )
orbitControls.addEventListener( 'change', threeUtils.renderScene )
orbitControls.enableKeys = false

export default threeUtils
