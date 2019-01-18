import * as THREE from 'three';

import STLLoaderWrapper from 'three-stl-loader';
import GLTFLoader from 'three-gltf-loader';
const STLLoader = STLLoaderWrapper( THREE );

const _gltfLoader = new GLTFLoader
const _stlLoader = new STLLoader


const promisified_gltfLoader = {
    load: function( url ) {
        return new Promise( ( resolve, reject ) => _gltfLoader.load( url, resolve, null, reject ) )
    },
    parse: function( data, path ) {
        return new Promise( ( resolve, reject ) => _gltfLoader.parse( data, path, resolve, reject ) )
    }
}

const promisified_stlLoader = {
    load: function( url ) {
        return new Promise( ( resolve, reject ) => _stlLoader.load( url, resolve, null, reject ) )
    },
    parse: function( data ) {
        return Promise.resolve( _stlLoader.parse( data ) )
    }
}

export {
    promisified_gltfLoader as gltfLoader,
    promisified_stlLoader as stlLoader
}
