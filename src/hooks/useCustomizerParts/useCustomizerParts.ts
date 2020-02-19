import { useReducer } from 'react';
import { getObjects } from './getObjects';

type Action = {
    type: 'ADD' | 'SET_STATUS',
    [param: string]: any,
}

const _objectsReducer = (objects: any, action: Action) => {
    switch(action.type) {
        case 'ADD': {
            return {
                byId: {
                    ...objects.byId,
                    [ action.objectToAdd.id ]: action.objectToAdd
                },
                allIds: [
                    ...objects.allIds,
                    action.objectToAdd.id
                ]
            }
        }

        case 'SET_STATUS': {
            const { byId, allIds } = objects;
            const modifiedObject = {
                ...byId[action.objectId],
                status: action.status
            };
        
            return {
                byId: {
                    ...byId,
                    [action.objectId]: modifiedObject
                },
                allIds
            };
        }

        default: {
            throw new Error('invalid action');
        }
    }
}


const useCustomizerParts = (initialObjectsFromProps: any) => {
    const [parts, dispatch] = useReducer(_objectsReducer, initialObjectsFromProps, getObjects);
    
    const setObjectStatus = (objectId: number, statusCode: number) => {
        dispatch({
            type: 'SET_STATUS',
            objectId,
            status: statusCode
        });
    };
    
    const addObject = (objectToAdd: any) => {
        dispatch({
            type: 'ADD',
            objectToAdd
        })
    }

    return [parts, { setObjectStatus, addObject }];
};

export default useCustomizerParts;