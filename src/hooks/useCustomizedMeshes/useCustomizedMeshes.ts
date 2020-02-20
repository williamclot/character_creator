import { CustomizedMeshesMap } from '../../types';
import { useMemo } from 'react';

const hashSelectedPartIds = (selectedPartIds: number[]) => {
    return selectedPartIds
        .sort((p1, p2) => p2 - p1) // sort because different order should produce the same hash
        .join(':');
}

const useCustomizedMeshes = (
    customizedMeshes: CustomizedMeshesMap,
    customizedMeshesInCart: number[],
    customizedMeshesOwnedByUser: number[],
    selectedPartsIds: number[],
) => {
    const meshesOwnedByUserMap = useMemo(() => {
        let selectedPartsMap: {[hash: string]: boolean} = {};
        for(const customizedMeshId of customizedMeshesOwnedByUser) {
            const customizedMesh = customizedMeshes[customizedMeshId];
            const ownedMeshHash = hashSelectedPartIds(customizedMesh.selectedPartIds);
            selectedPartsMap[ownedMeshHash] = true;
        }
        return selectedPartsMap;
    }, [customizedMeshesOwnedByUser, customizedMeshes]);

    const userOwnsCurrentSelection = useMemo(() => {
        const selectedObjectsHash = hashSelectedPartIds(selectedPartsIds);
        return selectedObjectsHash in meshesOwnedByUserMap;
    }, [selectedPartsIds, meshesOwnedByUserMap]);

    const meshesInCartMap = useMemo(() => {
        let selectedPartsMap: {[hash: string]: boolean} = {};
        for(const customizedMeshId of customizedMeshesInCart) {
            const customizedMesh = customizedMeshes[customizedMeshId];
            const meshInCartHash = hashSelectedPartIds(customizedMesh.selectedPartIds);
            selectedPartsMap[meshInCartHash] = true;
        }

        return selectedPartsMap;
    }, [customizedMeshesInCart, customizedMeshes]);

    const isSelectionInCart = useMemo(() => {
        const selectedObjectsHash = hashSelectedPartIds(selectedPartsIds);
        return selectedObjectsHash in meshesInCartMap;
    }, [selectedPartsIds, meshesInCartMap]);

    return { userOwnsCurrentSelection, isSelectionInCart };
};

export default useCustomizedMeshes;