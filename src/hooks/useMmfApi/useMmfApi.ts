import { useMemo } from 'react';
import { ApiRoutes } from '../../types';
import MmfApi from './api';

const useMmfApi = (apiRoutes: ApiRoutes) => {
    return useMemo(() => new MmfApi(apiRoutes), [apiRoutes]);
};

export default useMmfApi;
