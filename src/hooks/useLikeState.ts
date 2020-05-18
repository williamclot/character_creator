import { useState, useEffect } from 'react';
import MmfApi from './useMmfApi/api';

type CurrentUser = {
    username: string;
};

const useLikeState = (api: MmfApi, currentUser?: CurrentUser) => {
    const [isLoading, setLoading] = useState(true);
    const [isLiked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        async function loadLikeData() {
            if (!currentUser) {
                const likeCount = await api.getLikesCount();
                setLikeCount(likeCount);
            } else {
                const [isLiked, likeCount] = await Promise.all([
                    api.isLiked(),
                    api.getLikesCount(),
                ]);
                setLiked(isLiked);
                setLikeCount(likeCount);
            }

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
        if (!currentUser) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            window.customEventDispatcher.dispatchEvent('SHOW_LOGIN');
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
