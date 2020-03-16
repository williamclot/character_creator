import { PartType, Coord3d } from '../../types';
import { useRef, useEffect } from 'react';
import { throttle } from 'throttle-debounce';

import mainSceneManager from '../../scenes/mainSceneManager';

const useSceneManager = (
    partTypesArray: PartType[],
    initialRotation: Coord3d,
) => {
    const canvasContainerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const canvas = mainSceneManager.getCanvas();

        const canvasContainerElement = canvasContainerRef.current;

        if (canvasContainerElement) {
            canvasContainerElement.appendChild(canvas);
        }

        return () => {
            if (canvasContainerElement) {
                canvasContainerElement.removeChild(canvas);
            }
        };
    }, []);

    useEffect(() => {
        mainSceneManager.init(partTypesArray);
    }, [partTypesArray]);

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
