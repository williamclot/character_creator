import { useState, useEffect } from 'react';
import MmfApi from './useMmfApi/api';

const useLikeState = (api: MmfApi) => {
    const [isLoading, setLoading] = useState(true);
    const [isLiked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        async function loadLikeData() {
            const [isLiked, likeCount] = await Promise.all([
                api.isLiked(),
                api.getLikesCount(),
            ]);
            setLiked(isLiked);
            setLikeCount(likeCount);
            setLoading(false);
        }
        loadLikeData();
    }, []);

    const like = async () => {
        setLoading(true);
        try {
            await api.likeCustomizer();
            setLiked(true);
            setLikeCount(likeCount => likeCount + 1);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };
    const unlike = async () => {
        setLoading(true);
        try {
            await api.unlikeCustomizer();
            setLiked(false);
            setLikeCount(likeCount => likeCount - 1);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleLike = () => {
        if (isLoading) {
            return;
        }
        if (isLiked) {
            unlike();
        } else {
            like();
        }
    };

    return {
        isLiked,
        likeCount,
        isLoading,
        handleLike,
    };
};

export default useLikeState;
