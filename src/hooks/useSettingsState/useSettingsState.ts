import { WorldData } from '../../types';
import { useState, useCallback } from 'react';

type Settings_from_API = {
    name: string
    price: number
    description: string
    image_url: string
    is_private: boolean
}

const useSettingsState = (worldData: WorldData) => {
    const [customizerName, setName]     = useState(worldData['name'] || '');
    const [price, setPrice]             = useState(worldData['price'] || '');
    const [description, setDescription] = useState(worldData['description'] || '');
    const [isPrivate, setIsPrivate]     = useState(worldData['is_private']);
    const [imageUrl, setImageUrl]       = useState(worldData['image_url'] || null);

    const updateSettings = useCallback((updatedCustomizer: Settings_from_API) => {
        setName(updatedCustomizer['name']);
        setPrice(updatedCustomizer['price']);
        setDescription(updatedCustomizer['description']);
        setImageUrl(updatedCustomizer['image_url']);
        setIsPrivate(updatedCustomizer['is_private']);
    }, []);

    return {
        customizerName, price, description, isPrivate, imageUrl,
        updateSettings,
    };
};

export default useSettingsState;