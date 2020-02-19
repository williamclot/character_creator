import { OBJECT_STATUS } from '../../constants';

export const getObjects = (objects: any) => {
    const { byPartTypeId, allPartTypeIds } = objects

    const byId: {[id: string]: any} = {}
    const allIds = []

    for ( const partTypeId of allPartTypeIds ) { // or Object.keys(byPartTypeId)
        for ( const object of byPartTypeId[ partTypeId ] ) {
            allIds.push( object.id )
            byId[ object.id ] = {
                ...object,
                partTypeId,
                status: OBJECT_STATUS.IN_SYNC,
            }
        }
    }

    return {
        byId,
        allIds
    }
}