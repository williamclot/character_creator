import { PerspectiveCamera } from 'three'
import lights from './lights'

const camera = new PerspectiveCamera(
    75,
    1,
    0.001,
    1000
)
camera.position.set( 0, .5, -1 )
camera.lookAt( 0, 0, 0 )

camera.add( ...lights )

export default camera