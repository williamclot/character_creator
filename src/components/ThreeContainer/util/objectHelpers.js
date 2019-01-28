import {
    Object3D, Bone, Vector3,
    Mesh, MeshStandardMaterial
} from 'three'

import { gltfLoader, stlLoader } from './loaders'


export async function get3DObject( objectData, poseData ) {
    switch ( objectData.extension ) {

        case 'stl': {
            const { download_url, metadata } = objectData

            const geometry = await stlLoader.load( download_url )
            const material = new MeshStandardMaterial({
                color: 0x808080
            })
        
            const mesh = new Mesh( geometry, material )
        
            const root = new Object3D

            if ( metadata ) {
                applyMetadata( mesh, metadata )

                const { attachPoints } = metadata
                if ( attachPoints ) {
                    for ( let [ attachPointName, position ] of Object.entries( attachPoints ) ) {
                        const rotation = poseData && poseData[ attachPointName ]
                        root.add( createBone( attachPointName, position, rotation ) )
                    }
                }
            }
            

            root.add( mesh )

            return root
        }

        case 'gltf': 
        case 'glb': {
            const resource = await gltfLoader.load( objectData.download_url )
            const root = resource.scene.children[ 0 ]

            if ( poseData ) {
                root.traverse( bone => {
                    if ( bone.isBone ) {
                        const rotation = poseData[ bone.name ]

                        if ( rotation ) {
                            const { x, y, z } = rotation
                            bone.rotation.set( x, y, z )
                        }
                    }
                } )

            }

            return root
        }

        default: {
            return null
        }
    }
}

function applyMetadata( target, metadata ) {
    const { position, rotation, scale } = metadata

    if ( position ) {
        const { x, y, z } = position
        target.position.set( x, y, z )
    }

    if ( rotation ) {
        const { x, y, z } = rotation
        target.rotation.set( x, y, z )
    }

    if ( scale ) {
        const { x, y, z } = scale
        target.scale.set( x, y, z )
    }
}

function createBone( name, position, rotation ) {
    const { x, y, z } = position

    const bone = new Bone
    bone.name = name
    bone.position.set( x, y, z )

    if ( rotation ) {
        const { x, y, z } = rotation
        bone.rotation.set( x, y, z )
    }
    
    return bone
}
