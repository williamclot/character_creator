export default function promisifyLoader ( loader, onProgress ) {

  function promiseLoader ( url ) {

    return new Promise( ( resolve, reject ) => {

      loader.load( url, resolve, onProgress, reject );

    } );
  }

  function promiseParser ( data, path ) {

    return new Promise( ( resolve, reject ) => {

      loader.parse( data, path, resolve, reject );

    } );
  }

  return {
    originalLoader: loader,
    load: promiseLoader,
    parse: promiseParser
  };

}