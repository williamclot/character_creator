import { PartType, WorldData, PartTypeParent } from '../../types';
import topologicalSort from 'toposort';

const getCategories = (world: WorldData) => {
    const partTypesArray: PartType[] = [];

    for (const group of world.groups) {
        partTypesArray.push(...group.categories);
    }

    return partTypesArray;
};

const getPartTypes = (world: WorldData) => {
    const categories = getCategories(world);

    const categoriesWithParent = categories.filter(cat => cat.parent);
    const edges = categoriesWithParent.map(({ id, parent }) => {
        const parentId = (parent as PartTypeParent).id;

        return [parentId, id];
    }) as ReadonlyArray<[number, number]>;

    /**
     * this will sort the categories in the correct order they have to be added;
     * since the categories are defined by the designer, they will be loaded via an api call
     * and thus could be sorted when uploading them instead of sorting them here
     */
    const sortedPartTypeIds = topologicalSort(edges);

    const partTypesById: Record<number, PartType> = {};

    for (const partType of categories) {
        partTypesById[partType.id] = partType;
    }

    const allPartTypeIds = categories.map(partType => partType.id);

    return {
        byId: partTypesById,
        allIds: allPartTypeIds,
        sortedIds: sortedPartTypeIds,
    };
};

export default getPartTypes;
