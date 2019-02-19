export const getCategories = groups => {
    return groups.reduce(
        ( categories, group ) => categories.concat( group.categories ),
        []
    )
}

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