import { useState, useEffect } from 'react';
import MmfApi from './useMmfApi/api';

type CurrentUser = {
    username: string;
};

const useFollowState = (api: MmfApi, currentUser?: CurrentUser) => {
    const [isFollowing, setFollowing] = useState(false);

    useEffect(() => {
        async function loadFollowData() {
            const isFollowing = await api.isFollowed();
            setFollowing(isFollowing);
        }

        if (currentUser) {
            loadFollowData();
        }
    }, []);

    const follow = async () => {
        await api.follow();
        setFollowing(true);
    };

    const unfollow = async () => {
        await api.unfollow();
        setFollowing(false);
    };

    const handleFollow = () => {
        if (!currentUser) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            window.customEventDispatcher.dispatchEvent('SHOW_LOGIN');
            return;
        }

        if (isFollowing) {
            unfollow();
        } else {
            follow();
        }
    };

    return {
        isFollowing,
        handleFollow,
    };
};

export default useFollowState;
