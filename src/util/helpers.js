let _id = 0;
export const uniqueId = (prefix = '') => {
    return `${prefix}_${_id++}`
};



/**
 * Calls a defined callback function on each property of an object,
 * and returns a new object that contains the results.
 * @template T, S
 * @param { Dict<T> } object 
 * @param { Mapper<T, S> } mapFn 
 * @returns { Dict<S> }
 */
export const objectMap = ( object, mapFn ) => 
    Object.keys( object ).reduce( ( result, key ) => {
        result[key] = mapFn( object[key], key )
        return result
    }, {})


/**
 * @param { string } filename 
 */
export const getNameAndExtension = filename => {
    const dotIndex = filename.lastIndexOf('.')
    const hasDot = dotIndex !== -1

    const name = hasDot ? filename.slice( 0, dotIndex )  : filename
    const extension = filename.slice( dotIndex + 1 )

    return { name, extension }
}

/**
 * 
 * get normalized mouse coordinates
 * @param { Event } event 
 */
export function fromEvent( event ) {
    const { left, top, width, height } = event.target.getBoundingClientRect()

    return {
        x: ( event.clientX - left ) / width * 2 - 1,
        y: - ( event.clientY - top ) / height * 2 + 1
    }
}

export const radiansToDegreesFormatter = {
    format: number => {
        // const degreeSign = String.fromCharCode(176)
        // return `${value}${degreeSign}`
        
        return number * ( 180 / Math.PI )
    },
    parse: text => {
        const number = Number.parseFloat( text )
        return number / ( 180 / Math.PI )
    }
}

/**
 * @template T, S
 * @callback Mapper
 * @param { T } value
 * @param { string } key
 * @returns { S }
 */


/**
 * @template T
 * @typedef { {[key: string]: T} } Dict
 */