import OrbitControls from 'three-orbitcontrols'

import renderer from './renderer'
import canvas from './canvas'
import scene from './scene'
import camera from './camera'

const saveImage = () => new Promise(( resolve, reject ) => {
    canvas.toBlob( blob => resolve(blob), 'image/jpeg' )
})

const renderScene = () => {
    renderer.render( scene, camera )
}

const orbitControls = new OrbitControls( camera, canvas )
orbitControls.addEventListener( 'change', renderScene )
orbitControls.enableKeys = false

export {
    saveImage,
    renderScene,
    scene,
    camera,
    canvas,
}