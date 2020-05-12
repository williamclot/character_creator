import { useState, useEffect } from 'react';
import MmfApi from './useMmfApi/api';

const useCommentsState = (api: MmfApi) => {
    const [isLoading, setLoading] = useState(true);

    const [commentsCount, setCommentsCount] = useState(0);
    useEffect(() => {
        async function loadCommentsData() {
            const commentsCount = await api.getCommentsCount();
            setCommentsCount(commentsCount);
            setLoading(false);
        }

        loadCommentsData();
    }, []);

    return {
        isLoading,
        commentsCount,
    };
};

export default useCommentsState;
