import { PartType, Coord3d, AppProps } from '../../types';
import { POSITION_0_0_0 } from '../../constants';

import { useState, useMemo } from 'react';
import useCustomizerParts from '../useCustomizerParts';
import usePartTypes from '../usePartTypes';
import useCustomizedMeshes from '../useCustomizedMeshes/useCustomizedMeshes';
import useSettingsState from '../useSettingsState';


const useCustomizerState = (props: AppProps) => {
    const { partTypes, partTypesArray } = usePartTypes(props.worldData);
    const { parts, addPart, setPartStatus } = useCustomizerParts(props.objects);

    const {
        customizerName, price, description, isPrivate, imageUrl,
        updateSettings,
    } = useSettingsState(props.worldData);

    const [selectedPartTypeId, setSelectedPartTypeId] = useState(partTypes.allIds[ 0 ] || null);
    const [selectedParts, setSelectedParts] = useState<{[partTypeId: number]: number}>({});
    const selectedPartsIds = Object.keys(selectedParts).map(key => selectedParts[Number(key)]);
    const selectedPartType = partTypes.byId[selectedPartTypeId];

    const {
        addCustomizedMeshToCart,
        isSelectionInCart, userOwnsCurrentSelection
    } = useCustomizedMeshes(
        props.customizedMeshes,
        props.customizedMeshesInCart,
        props.customizedMeshesOwnedByUser,
        selectedPartsIds
    );

    const userMustBuySelection = useMemo(() => {
        if (!props.customizer_pay_per_download_enabled) {
            return false;
        }

        if(props.edit_mode) {
            // edit mode means user can edit, which means he is either the owner or the admin
            return false;
        }

        if(props.worldData.price > 0) {
            return !userOwnsCurrentSelection;
        }

        return false;
    }, [props, userOwnsCurrentSelection]);

    function getObject(partId: number) {
        return parts.byId[partId];
    }

    function getPartType(partTypeId: number) {
        return partTypes.byId[partTypeId];
    }

    function getSelectedObjectId(partTypeId: number) {
        return selectedParts[partTypeId];
    }

    function getSelectedObject(partTypeId: number) {
        const partId = getSelectedObjectId(partTypeId);

        return getObject(partId);
    }

    function getObjectsByPartTypeId(partTypeId: number) {
        const { byId, allIds } = parts;
        return allIds.map(id => byId[id]).filter(object => object.partTypeId === partTypeId);
    }

    function getAttachPoints(partId: number) {
        const object = parts.byId[ partId ]

        if (object.metadata) {
            if (object.metadata.attachPoints) {
                return object.metadata.attachPoints
            }
        }

        return {}
    }

    function getAttachPointPosition(partId: number, attachPointName: string) {
        const attachPoints = getAttachPoints(partId)

        return attachPoints[attachPointName] || POSITION_0_0_0;
    }

    function getPositionInsideParent(partType: PartType) {
        const {
            id: parentPartTypeId,
            attachPoint: parentAttachPoint,
        } = partType.parent

        const parentObjectId = getSelectedObjectId(parentPartTypeId)

        return getAttachPointPosition(parentObjectId, parentAttachPoint)
    }

    function getPosition(partType: PartType) {
        const object = getSelectedObject(partType.id)

        if (!object) {
            // should never happen!
            console.warn(`Object doesn't exist. This shouldn't normally happen`)
            return POSITION_0_0_0
        }

        if (object.metadata) {
            if (object.metadata.position) {
                return object.metadata.position
            }
        }

        return POSITION_0_0_0
    }

    /**
     * Recursively walks through part types until it reaches the root parent and
     * adds up all the attachpoint positions from the root to this partType
     */
    const computeGlobalPosition = (partTypeId: number): Coord3d => {
        const partType = getPartType(partTypeId)

        if (!partType.parent) {
            const pos = getPosition(partType);

            // return negated position to "undo" offset created when origin
            // point was moved to the center of the mesh
            return {
                x: -pos.x,
                y: -pos.y,
                z: -pos.z,
            } as Coord3d;
        }

        const attachPointPosition = getPositionInsideParent(partType)

        const result = computeGlobalPosition(partType.parent.id) // recursive step

        return {
            x: result.x + attachPointPosition.x,
            y: result.y + attachPointPosition.y,
            z: result.z + attachPointPosition.z,
        } as Coord3d;
    }

    const getParentAttachPointPosition = (partType: PartType) => {
        if ( !partType.parent ) {
            return POSITION_0_0_0;
        }
        return getPositionInsideParent(partType);
    }

    const getChildPartTypeByAttachPoint = (attachPointName: string) => {
        return partTypesArray.find(partType => {
            return partType.parent && partType.parent.attachPoint === attachPointName;
        });
    }

    return {
        partTypes, partTypesArray,
        objects: parts, addObject: addPart, setObjectStatus: setPartStatus,

        customizerName, price, description, isPrivate, imageUrl,
        updateSettings,

        selectedPartTypeId, setSelectedPartTypeId,
        selectedPartType,
        selectedParts, setSelectedParts,
        selectedPartsIds,

        addCustomizedMeshToCart,
        isSelectionInCart, userMustBuySelection,

        getObjectsByPartTypeId,

        computeGlobalPosition,
        getParentAttachPointPosition,
        getChildPartTypeByAttachPoint,
    };
}

export default useCustomizerState;