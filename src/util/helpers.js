/**
 * gets the extension of a file or null if it can't find anything
 * @param { string } filename 
 */

function getExtension( filename ) {
    const dotIndex = filename.lastIndexOf('.') + 1
    return filename.substring( dotIndex )
}

/**
 * 
 * get normalized mouse coordinates
 * @param { Event } event 
 */
function fromEvent( event ) {
    const { left, top, width, height } = event.target.getBoundingClientRect()

    return {
        x: ( event.clientX - left ) / width * 2 - 1,
        y: - ( event.clientY - top ) / height * 2 + 1            
    }
}


/**
 * just runs event.preventDefault()
 * @param { Event } event
 */
function defaultEventPreventer ( event ) {
    event.preventDefault()
}

export { getExtension, fromEvent, defaultEventPreventer }