import { useState, useEffect } from 'react';
import MmfApi from './useMmfApi/api';

const useLikeState = (api: MmfApi) => {
    const [isLiked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    useEffect(() => {
        api.isLiked().then(setLiked);
        api.getLikesCount().then(setLikeCount);
    }, [api]);
    const like = async () => {
        try {
            await api.likeCustomizer();
            setLiked(true);
        } catch (err) {
            console.error(err);
        }
    };
    const unlike = async () => {
        try {
            await api.unlikeCustomizer();
            setLiked(false);
        } catch (err) {
            console.error(err);
        }
    };

    return {
        isLiked,
        likeCount,
        like,
        unlike,
    };
};

export default useLikeState;
