import { useMemo } from 'react';
import { WorldData } from '../../types';
import getPartTypes from './getPartTypes';

const usePartTypes = (worldData: WorldData) => {
    const partTypes = useMemo(() => getPartTypes(worldData), [worldData]);
    const partTypesArray = useMemo(() => partTypes.allIds.map(id => partTypes.byId[id]), [partTypes]);

    return { partTypes, partTypesArray };
};

export default usePartTypes;