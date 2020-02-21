import { useRef, useEffect } from 'react';

import mainSceneManager from '../../scenes/mainSceneManager';

/**
 * @param {import('../../types').PartType[]} partTypesArray
 * @param {import('../../types').Coord3d} [initialRotation]
 */
const useSceneManager = (partTypesArray, initialRotation) => {
    /** @type {import('react').MutableRefObject<HTMLElement>} */
    const canvasContainerRef = useRef(null);

    useEffect(() => {
        const canvas = mainSceneManager.getCanvas();
        canvasContainerRef.current.appendChild(canvas);
        return () => canvasContainerRef.current.removeChild(canvas);
    }, []);

    useEffect(() => {
        mainSceneManager.init(partTypesArray);
    }, []);

    useEffect(() => {
        if(initialRotation) {
            mainSceneManager.setContainerRotation(initialRotation);
        };
    }, [initialRotation]);

    return {
        canvasContainerRef,

        sceneManager: mainSceneManager,
    };
};

export default useSceneManager;
