import { Objects_from_props, CustomizerPart } from '../../types';
import { OBJECT_STATUS } from '../../constants';

type CustomizerPart_in_state = CustomizerPart & {
    status: string
    partTypeId: number
}

export const getObjects = (objects: Objects_from_props) => {
    const { byPartTypeId, allPartTypeIds } = objects;

    const byId: {[id: string]: CustomizerPart_in_state} = {};
    const allIds: number[] = [];

    for (const partTypeId of allPartTypeIds) { // or Object.keys(byPartTypeId)
        for (const object of byPartTypeId[partTypeId]) {
            allIds.push(object.id)
            byId[object.id] = {
                ...object,
                partTypeId,
                status: OBJECT_STATUS.IN_SYNC,
            };
        }
    }

    return {
        byId,
        allIds
    };
}