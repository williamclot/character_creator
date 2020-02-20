import { CustomizedMeshesMap, CustomizedMesh } from '../../types';
import { useState, useMemo, useCallback } from 'react';

const hashSelectedPartIds = (selectedPartIds: number[]) => {
    return selectedPartIds
        .sort((p1, p2) => p2 - p1) // sort because different order should produce the same hash
        .join(':');
}

const useCustomizedMeshes = (
    initialCustomizedMeshes: CustomizedMeshesMap,
    initialCustomizedMeshesInCart: number[],
    initialCustomizedMeshesOwnedByUser: number[],
    selectedPartsIds: number[],
) => {
    const [customizedMeshes, setCustomizedMeshes] = useState(initialCustomizedMeshes);
    const [customizedMeshesInCart, setCustomizedMeshesInCart] = useState(initialCustomizedMeshesInCart);

    const meshesOwnedByUserMap = useMemo(() => {
        let selectedPartsMap: {[hash: string]: boolean} = {};
        for(const customizedMeshId of initialCustomizedMeshesOwnedByUser) {
            const customizedMesh = customizedMeshes[customizedMeshId];
            const ownedMeshHash = hashSelectedPartIds(customizedMesh.selectedPartIds);
            selectedPartsMap[ownedMeshHash] = true;
        }
        return selectedPartsMap;
    }, [initialCustomizedMeshesOwnedByUser, customizedMeshes]);

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

    const addCustomizedMeshToCart = useCallback((customizedMesh: CustomizedMesh) => {
        setCustomizedMeshesInCart(currenctCustomizedMeshesInCart => currenctCustomizedMeshesInCart.concat(customizedMesh.id));
        setCustomizedMeshes(currentCustomizedMeshes => ({
            ...currentCustomizedMeshes,
            [customizedMesh.id]: customizedMesh
        }));
    }, []);

    return {
        userOwnsCurrentSelection, isSelectionInCart,
        addCustomizedMeshToCart,
    };
};

export default useCustomizedMeshes;