import {
    Object3D, Mesh, Box3, Vector3, Ray, Raycaster,
    SphereGeometry, MeshStandardMaterial, Material, DoubleSide
} from 'three'

/**
 * combines multiple callbacks into one; useful to pass a combined function to
 * traverse (or forEach) instead of traversing multiple times for each callback
 * @param { ( ( object: Object3D ) => void )[] } functions - the functions to combine
 * @returns { ( object: Object3D ) => void } - the combined function
 */
function combine( ...functions ) {
    return function( object ) {
        for ( const fn of functions ) {
            fn.call( null, object )
        }
    }
}

function center( object ) {
    if ( object instanceof Mesh ) {
        object.geometry.center()
    }
}

function scaleTo1( object ) {
    if ( object instanceof Mesh ) {
            
        const boundingBox = ( new Box3 ).setFromObject( object )
    
        const size = boundingBox.getSize();
    
        const maxDim = Math.max( size.x, size.y, size.z )
    
        const oldScale = object.scale.clone()
    
        const { x, y, z } = oldScale.divideScalar( maxDim )
    
        object.geometry.scale( x, y, z )

    }
}

function makeTransparent( object3d ) {
    if ( object3d instanceof Mesh && object3d.material instanceof Material ) {
        object3d.material.transparent = true
        object3d.material.opacity = 0.6

        object3d.material.depthWrite = false
        // object3d.material.side = DoubleSide
    }
}

class SurfaceFinder {
    constructor( camera, targetObject ) {
        this.raycaster = new Raycaster
        this.camera = camera
        this.targetObject = targetObject
    }

    /**
     * finds a point on a mesh in 3d space using the mouse coordinates; if no mesh
     * is found, then a point at the defaultDistance in that direction is selected
     * @param { { x: number, y: number } } mouseCoords 
     * @param { number } defaultDistance 
     */
    find( mouseCoords, defaultDistance ) {
        this.raycaster.setFromCamera( mouseCoords, this.camera )

        const intersects = this.raycaster.intersectObject( this.targetObject, true )
        
        const firstIntersect = intersects.find( i => i.object instanceof Mesh )

        return firstIntersect ?
            firstIntersect.point :
            this.raycaster.ray.at( defaultDistance, new Vector3 )
    }
}


/**
 * returns a map from boneId to Bone containing only the registered bones
 * @param { Object3D } object3d
 * @param { Set< string > } pointsToFind
 */
function findAttachPoints( object3d, pointsToFind ) {

    const extractedAttachPoints = {}

    object3d.updateMatrixWorld()
    
    object3d.traverse( element => {
        if ( element.isBone && pointsToFind.has( element.name ) ) {

            const objPosition = object3d.position.clone()

            extractedAttachPoints[ element.name ] = element.localToWorld( objPosition )

        }
    } )

    return extractedAttachPoints
}

class SphereFactory {
    constructor( radius, color ) {
        this.geometry = new SphereGeometry( radius, 10, 10 )
        this.material = new MeshStandardMaterial( { color } )
    }

    buildSphere( position = new Vector3 ) {
        const mesh = new Mesh( this.geometry, this.material )

        mesh.position.copy( position )

        return mesh
    }
}

const sphereFactory = {
    yellow: new SphereFactory( .05, 0xffff00 ),
    green: new SphereFactory( .05, 0x00ff00 ),
    red: new SphereFactory( .05, 0xff0000 )
}

function createRayFromCamera( coords, camera ) {
    const origin = ( new Vector3 ).setFromMatrixPosition( camera.matrixWorld )
    const direction = ( new Vector3 )
        .set( coords.x, coords.y, 0.5 )
        .unproject( camera )
        .sub( origin )
        .normalize()

    return new Ray( origin, direction )
}


export {
    combine,
    makeTransparent, center, scaleTo1,
    findAttachPoints,

    sphereFactory,
    SurfaceFinder
}