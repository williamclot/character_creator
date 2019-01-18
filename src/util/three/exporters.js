import { fromMesh, mimeType } from 'threejs-export-stl'
import GltfExporter from 'three-gltf-exporter'

const _gltfExporter = new GltfExporter

export function exportGltf( obj ) {
    return new Promise( ( resolve, reject ) => {
        _gltfExporter.parse( obj, resolve )
    } )
}

export function exportSTL( mesh ) {
    return Promise.resolve( fromMesh( mesh ) )
}

export const STL_MIME_TYPE = mimeType