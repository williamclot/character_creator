import { PointLight } from 'three'

const lightsPositions = [
    [-1, -1, 0],
    [-1,  1, 0],
    [ 1,  1, 0],
    [ 1, -1, 0],
]
const lights = lightsPositions.map( ([x, y, z]) => {
    const light = new PointLight( 0xffffff, .5, 100 )
    light.position.set( x, y, z )
    return light
})

export default lights