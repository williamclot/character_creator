import {
    Object3D,
    Geometry, SphereGeometry, CylinderBufferGeometry,
    LineBasicMaterial, MeshStandardMaterial,
    Mesh, Line,
    Vector3,
    PointLight,
} from 'three'



/**
 * @template T
 * @callback Predicate
 * @param { T } value
 * @returns { boolean }
 */

/**
 * 
 * @param { Object3D } object3D 
 * @param { Predicate<Object3D> } predicate 
 */
export const object3dFind = ( object3D, predicate ) => {
    if ( predicate( object3D ) ) {
        return object3D
    }

    for ( const child of object3D.children ) {
        /** @type { Object3D } */
        const foundChild = object3dFind( child, predicate )
        if ( foundChild ) {
            return foundChild
        }
    }

    return null
}

export const sphereFactory = {
    buildSphere( withArrow = false ) {
        const color = 0xff0000 // red
        const material = new MeshStandardMaterial({ color })

        const sphere = new Mesh(
            new SphereGeometry( .05, 32, 32 ),
            material
        )

        if ( withArrow ) {
    
            const arrowTopPos = new Vector3( 0, .05, 0 )
    
            const lineGeometry = new Geometry
            lineGeometry.vertices.push(
                new Vector3( 0, 0, 0 ),
                arrowTopPos
            )
    
            const line = new Line(
                lineGeometry,
                new LineBasicMaterial({ color })
            )
            const arrowTop = new Mesh(
                new CylinderBufferGeometry( 0, .03, .03, 32, 14, false ),
                material
            )
    
            arrowTop.position.copy( arrowTopPos )
            line.add( arrowTop )
    
            sphere.add( line )

        }

        return sphere
    }
}

const defaultLightPositions = [
    [-1, -1, 0],
    [-1,  1, 0],
    [ 1,  1, 0],
    [ 1, -1, 0],
]

export const createLights = ( lightPositions = defaultLightPositions ) => {
    return lightPositions.map( ([x, y, z]) => {
        const light = new PointLight( 0xffffff, .3 )
        light.position.set( x, y, z )
        return light
    })
}

/**
 * Copied and adjusted from https://github.com/mrdoob/three.js/pull/14526#issuecomment-497254491
 * @param {*} camera 
 * @param {*} controls 
 * @param {*} size 
 * @param {*} fitOffset 
 */
export const moveCameraToFitObject = ( camera, controls, boundingBox, fitOffset = 1.2 ) => {
    const size = boundingBox.getSize( new Vector3 )
    const center = boundingBox.getCenter( new Vector3 )

    const maxSize = Math.max( size.x, size.y )

    const fitHeightDistance = maxSize / ( 2 * Math.atan( Math.PI * camera.fov / 360 ) )
    const fitWidthDistance = fitHeightDistance / camera.aspect
    
    const distance = fitOffset * Math.max( fitHeightDistance, fitWidthDistance )
    
    const direction = controls.target.clone()
        .sub( camera.position )
        .normalize()
        .multiplyScalar( distance )

    controls.target.copy( center )
    
    camera.near = distance / 100
    camera.far = distance * 100
    camera.updateProjectionMatrix()

    camera.position.copy( controls.target ).sub(direction)
    
    controls.update()
}
