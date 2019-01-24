import {
    Object3D, Bone, Vector3,
    Mesh, MeshStandardMaterial
} from 'three'

import { gltfLoader, stlLoader } from './loaders'


export async function get3DObject( objectData ) {
    switch ( objectData.extension ) {

        case 'stl': {
            const geometry = await stlLoader.load( objectData.download_url )
            const material = new MeshStandardMaterial({
                color: 0x808080
            })
        
            const mesh = new Mesh( geometry, material )
        
            const root = new Object3D

            if ( objectData.metadata ) {
                const { attachPoints, pivotPoint } = objectData.metadata

                if ( attachPoints ) {
                    for ( let [ attachPoint, position ] of Object.entries( attachPoints ) ) {
                        root.add( createBone( attachPoint, position ) )
                    }
                }

                if ( pivotPoint ) {
                    const { x, y, z } = pivotPoint

                    // the pivot point represents the distance to position 0;
                    // the object needs to be added at the inverse position => position needs to be inversed
                    const newPosition = new Vector3( x, y, z )
                        .negate()

                    root.position.copy( newPosition )
                }
            }

            root.add( mesh )

            return root
        }

        case 'gltf': 
        case 'glb': {
            const resource = await gltfLoader.load( objectData.download_url )
            const root = resource.scene.children[ 0 ]

            return root
        }

        default: {
            return null
        }
    }
}


function createBone( name, position ) {
    const { x, y, z } = position

    const bone = new Bone
    bone.name = name
    bone.position.set( x, y, z )
    
    return bone
}
