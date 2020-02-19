import { useRef, useEffect } from 'react';
import { ApiRoutes } from './ApiRoutes';
import MmfApi from './api';


const useMmfApi = (apiRoutes: ApiRoutes) => {
    const apiRef = useRef<MmfApi>(null);
    useEffect(() => {
        apiRef.current = new MmfApi(apiRoutes);
    }, [apiRoutes]);

    return apiRef.current;
}

export default useMmfApi;