import GLTFLoader from 'three-gltf-loader';

const loader = new GLTFLoader();

export function loadMeshFromURL( url ) {
  return new Promise( ( resolve, reject ) => {

    loader.load( url, resolve, null, reject );

  } );
}

export function parseMesh( data, path ) {
  return new Promise( ( resolve, reject ) => {

    loader.parse( data, path, resolve, reject );

  } )
}