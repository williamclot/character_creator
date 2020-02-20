import { useReducer } from 'react';
import { getObjects } from './getObjects';
import { Objects_from_props, CustomizerPartsState, CustomizerPart, CustomizerPart_in_state } from '../../types';

type Action = {
    type: 'ADD' | 'SET_STATUS',
    [param: string]: any,
}

const _objectsReducer = (objects: CustomizerPartsState, action: Action) => {
    switch(action.type) {
        case 'ADD': {
            const objectId = action.objectToAdd.id as number;

            return {
                byId: {
                    ...objects.byId,
                    [objectId.toString()]: action.objectToAdd as CustomizerPart_in_state
                },
                allIds: [
                    ...objects.allIds,
                    objectId
                ]
            };
        }

        case 'SET_STATUS': {
            const objectId = action.objectId as number;

            const { byId, allIds } = objects;
            const modifiedObject = {
                ...byId[objectId.toString()],
                status: action.status as string
            };
        
            return {
                byId: {
                    ...byId,
                    [objectId.toString()]: modifiedObject
                },
                allIds
            };
        }

        default: {
            throw new Error('invalid action');
        }
    }
}


const useCustomizerParts = (initialObjectsFromProps: Objects_from_props) => {
    const [parts, dispatch] = useReducer(_objectsReducer, initialObjectsFromProps, getObjects);
    
    const setPartStatus = (objectId: number, statusCode: number) => {
        dispatch({
            type: 'SET_STATUS',
            objectId,
            status: statusCode
        });
    };
    
    const addPart = (objectToAdd: CustomizerPart_in_state) => {
        dispatch({
            type: 'ADD',
            objectToAdd
        });
    }

    return {
        parts,
        setPartStatus, addPart,
    };
};

export default useCustomizerParts;