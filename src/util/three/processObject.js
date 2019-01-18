import {
    Object3D,
    Mesh, MeshStandardMaterial
} from 'three'

import { gltfLoader, stlLoader } from './loaders'
import { findAttachPoints } from './helpers'


/**
 * @param { ArrayBuffer } blob - the loaded file
 * @param { string } extension - the extension of the loaded file (used to determine which loader to use)
 * @returns { Promise<{ object: Object3D, attachPoints: Object<string, Vector3> }> }
 */
async function getProcessedObject( blob, extension, requiredAttachmentPoints ) {
    switch ( extension ) {
        case "stl": {

            const geometry = await stlLoader.parse( blob )
            const material = new MeshStandardMaterial({
                color: 0x808080
            })
        
            const mesh = new Mesh( geometry, material )
        
            const root = new Object3D

            root.add( mesh )

            return {
                object: root,
                attachPoints: {}
            }
            
        }
        case "gltf": // fall through to "glb" case
        case "glb": {

            const resource = await gltfLoader.parse( blob )
            const root = resource.scene.children[ 0 ]

            return {
                object: root,
                attachPoints: findAttachPoints( root, requiredAttachmentPoints )
            }
        }
        default: {
            return null
        }
    }
}

export default getProcessedObject