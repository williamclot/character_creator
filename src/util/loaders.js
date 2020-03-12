import * as THREE from 'three';
import axios from 'axios';

import PLYLoader from '../vendor/three/loaders/PLYLoader';

import STLLoaderWrapper from 'three-stl-loader';
// import GLTFLoader from 'three-gltf-loader';
const STLLoader = STLLoaderWrapper(THREE);

const TIMEOUT = 120000;

// const _gltfLoader = new GLTFLoader
const _stlLoader = new STLLoader();
const _plyLoader = new PLYLoader();

// const promisified_gltfLoader = {
//     async load( url ) {
//         const { data } = await axios.get( url, {
//             timeout: TIMEOUT,
//             responseType: 'arraybuffer'
//         })

//         return this.parse( data )
//     },
//     async parse( data, path ) {
//         return new Promise( ( resolve, reject ) => _gltfLoader.parse( data, path, resolve, reject ) )
//     },
// }

const promisified_stlLoader = {
    async load(url) {
        const { data } = await axios.get(url, {
            timeout: TIMEOUT,
            responseType: 'arraybuffer',
        });

        return this.parse(data);
    },
    async parse(data) {
        return _stlLoader.parse(data);
    },
};

const promisified_plyLoader = {
    async load(url) {
        const { data } = await axios.get(url, {
            timeout: TIMEOUT,
            responseType: 'arraybuffer',
        });

        return this.parse(data);
    },
    async parse(data) {
        return _plyLoader.parse(data);
        // return _stlLoader.parse( data )
    },
};

export {
    // promisified_gltfLoader as gltfLoader,
    promisified_stlLoader as stlLoader,
    promisified_plyLoader as plyLoader,
};
