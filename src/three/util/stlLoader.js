import * as THREE from 'three';
import STLLoaderWrapper from 'three-stl-loader';
const STLLoader = STLLoaderWrapper(THREE);


const loader = new STLLoader;

export function loadSTL( url ) {
    return new Promise( ( resolve, reject ) => {

        loader.load( url, resolve, null, reject );

    } );
}
