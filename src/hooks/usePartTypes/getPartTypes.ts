import { PartType, WorldData } from '../../types';

const getCategories = (world: WorldData) => {
    const partTypesArray: PartType[] = [];

    for (const group of world.groups) {
        partTypesArray.push(...group.categories);
    }

    return partTypesArray;
}

const getPartTypes = (world: WorldData) => {
    const categories = getCategories(world);

    const partTypesById: {[id: string]: PartType} = {};

    for (const partType of categories) {
        partTypesById[partType.id] = partType;
    }

    const allPartTypeIds = categories.map( partType => partType.id )

    return {
        byId: partTypesById,
        allIds: allPartTypeIds
    }
}

export default getPartTypes;