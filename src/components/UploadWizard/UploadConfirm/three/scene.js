import { Scene, Color } from 'three'
import camera from './camera'

const scene = new Scene
scene.background = new Color( 0x777777 )

scene.add( camera )

export default scene