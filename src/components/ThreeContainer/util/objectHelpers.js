import {
    Object3D,
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
