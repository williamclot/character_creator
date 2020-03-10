import { useRef, useEffect } from 'react';
import { throttle } from 'throttle-debounce';

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
        if (initialRotation) {
            mainSceneManager.setContainerRotation(initialRotation);
        }
    }, [initialRotation]);

    useEffect(() => {
        const listener = throttle(100, () => {
            mainSceneManager.handleResize();
            mainSceneManager.renderScene();
        });

        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, []);

    return {
        canvasContainerRef,

        sceneManager: mainSceneManager,
    };
};

export default useSceneManager;
