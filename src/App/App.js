import React, { useState, useEffect } from 'react';

import SettingsPopup from '../components/SettingsPopup';
import UploadWizard from '../components/UploadWizard';
import Header from '../components/Header';
import Selector from '../components/Selector';
import PartTypesView from '../components/PartTypes';
import LoadingIndicator from '../components/LoadingIndicator';
import ButtonsContainer from '../components/ButtonsContainer';

import { ACCEPTED_OBJECT_FILE_EXTENSIONS, OBJECT_STATUS } from '../constants';
import {
    fetchObjects,
    get3DObject,
    getObjectFromGeometry,
} from '../util/objectHelpers';
import {
    getNameAndExtension,
    objectMap,
    triggerDownloadFromUrl,
} from '../util/helpers';

import useMmfApi from '../hooks/useMmfApi';
import useCustomizerState from '../hooks/useCustomizerState';
import useSceneManager from '../hooks/useSceneManager';

import styles from './App.module.scss';

/**
 * @type {import('react').FunctionComponent<import('../types').AppProps>}
 */
const App = props => {
    const {
        partTypes,
        partTypesArray,
        objects,
        addObject,
        setObjectStatus,

        customizerName,
        tags,
        price,
        description,
        isPrivate,
        imageUrl,
        updateSettings,

        selectedPartTypeId,
        setSelectedPartTypeId,
        selectedPartType,
        selectedParts,
        setSelectedParts,
        selectedPartsIds,
        saveSelection,
        getSavedSelection,

        addCustomizedMeshToCart,
        isSelectionInCart,
        userMustBuySelection,

        getObjectsByPartTypeId,

        computeGlobalPosition,
        getParentAttachPointPosition,
        getChildPartTypeByAttachPoint,
    } = useCustomizerState(props);

    const [uploadedObjectData, setUploadedObjectData] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const api = useMmfApi(props.api);

    const { canvasContainerRef, sceneManager } = useSceneManager(
        partTypesArray,
        props.worldData.container_rotation,
    );

    useEffect(() => {
        sceneManager.setPanEnabled(props.edit_mode);
    }, [props.edit_mode]);

    useEffect(() => {
        sceneManager.renderScene();
    }, []);

    useEffect(
        () =>
            void (async () => {
                setIsLoading(true);

                try {
                    const oneOfEach = {};

                    // check location hash for initial selected parts
                    const hash = window.location.hash.slice(1);
                    if (hash !== '') {
                        /** @type {number[]} */
                        const selectedIds = JSON.parse(hash);

                        for (const partId of selectedIds) {
                            const part = objects.byId[partId];
                            if (part) {
                                oneOfEach[part.partTypeId] = part;
                            }
                        }
                    }

                    // select first part from each part type that hasn't been filled out from the hash
                    for (const partTypeId of partTypes.allIds) {
                        if (!oneOfEach[partTypeId]) {
                            oneOfEach[partTypeId] = getObjectsByPartTypeId(
                                partTypeId,
                            )[0]; // get first if not found in hash
                        }
                    }

                    const objectsToLoad = await fetchObjects(oneOfEach);
                    const newSelectedParts = objectMap(
                        oneOfEach,
                        object => object.id,
                    );

                    {
                        sceneManager.addAll(objectsToLoad);
                        sceneManager.rescaleContainerToFitObjects(4);
                        sceneManager.renderScene();
                        sceneManager.saveCamera();
                    }

                    setSelectedParts(newSelectedParts);
                    saveSelection(newSelectedParts);
                } catch (err) {
                    console.error(err);
                }

                setIsLoading(false);
            })(),
        [],
    );

    const showUploadWizard = Boolean(uploadedObjectData);

    const selectorData = (selectedPartType
        ? {
              selectedParts,
              objects: getObjectsByPartTypeId(selectedPartType.id),
              currentPartType: selectedPartType,
          }
        : null);

    const setSelected3dObject = (partTypeId, newObject) => {
        sceneManager.add(partTypeId, newObject);
        sceneManager.rescaleContainerToFitObjects(4);
        sceneManager.renderScene();
    };

    const setSelectedObjectId = (partTypeId, objectId) => {
        setSelectedParts(currentSelectedParts => ({
            ...currentSelectedParts,
            [partTypeId]: objectId,
        }));
    };

    const handleObjectSelected = async (partTypeId, objectData) => {
        setIsLoading(true);

        try {
            const newObject = await get3DObject(objectData);
            setSelected3dObject(partTypeId, newObject);
            setSelectedObjectId(partTypeId, objectData.id);
        } catch (err) {
            const partType = partTypes.byId[partTypeId];
            console.error(
                `Something went wrong while loading object of type ${partType.name}:\n` +
                    err,
            );
        }

        setIsLoading(false);
    };

    const handleResetSelection = async () => {
        setIsLoading(true);
        const newSelectedParts = getSavedSelection();
        const oneOfEach = objectMap(newSelectedParts, partId => objects.byId[partId]);
        const newParts = await fetchObjects(oneOfEach);
        sceneManager.addAll(newParts);
        sceneManager.rescaleContainerToFitObjects(4);
        sceneManager.renderScene();
        setSelectedParts(newSelectedParts);
        setIsLoading(false);
    };

    const handleResetCamera = () => {
        sceneManager.resetCamera();
    };

    const handleDeleteObject = async objectId => {
        const oldStatus = objects.byId[objectId].status;

        setObjectStatus(objectId, OBJECT_STATUS.LOADING);

        try {
            await api.deletePart(objectId);
            setObjectStatus(objectId, OBJECT_STATUS.DELETED);
        } catch {
            setObjectStatus(objectId, oldStatus);
            console.error(`Failed to delete object with id ${objectId}`);
        }
    };

    const handleUpload = (partTypeId, filename, objectURL) => {
        const partType = partTypes.byId[partTypeId];

        const { name, extension } = getNameAndExtension(filename);

        if (!ACCEPTED_OBJECT_FILE_EXTENSIONS.includes(extension)) {
            console.error(`Unrecognized extension '${extension}'`);
            return;
        }

        setUploadedObjectData({
            partType,
            name,
            filename,
            extension,
            objectURL,
        });
    };

    const addToCartButtonMessage = isSelectionInCart
        ? 'Added to cart'
        : `Add To Cart ($${price})`;
    const downloadButtonMessage = 'Download';

    const handleAddToCart = async () => {
        const customizedMeshData = await api.generateCustomizedMesh(
            selectedPartsIds,
        );
        const data = await api.addToCart(customizedMeshData.id);
        addCustomizedMeshToCart(customizedMeshData);

        window.customEventDispatcher.dispatchEvent('REFRESH_CART_AMOUNT');
        window.customEventDispatcher.dispatchEvent('ITEM_ADDED_TO_CART', data);
    };

    const handleDownload = async () => {
        if (isSelectionInCart) {
            window.alert('item added to cart');
            return;
        }

        try {
            const customizedMeshData = await api.generateCustomizedMesh(
                selectedPartsIds,
            );
            const fullCustomizedMeshData = await api.getCustomizedMesh(
                customizedMeshData.id,
            );

            if (fullCustomizedMeshData.status === 1) {
                // ready for download
                triggerDownloadFromUrl(fullCustomizedMeshData.file_url);
            } else {
                // TODO add popup component

                const message = `You will receive an email when the mesh has finished processing.`;
                window.alert(message);
            }
        } catch (err) {
            console.error(err);

            if (err.response.data.error === 'access_denied') {
                window.customEventDispatcher.dispatchEvent('SHOW_LOGIN');
            }
        }
    };

    const handleSaveChanges = async fields => {
        try {
            const updatedCustomizer = await api.patchCustomizer(fields);
            updateSettings(updatedCustomizer);
        } catch (err) {
            console.error(err);
        }
    };

    const handleWizardCompleted = async (
        partType,
        { name, extension, objectURL, imageSrc, geometry, metadata },
    ) => {
        setIsLoading(true);
        setUploadedObjectData(null);

        const partTypeId = partType.id;

        const object = getObjectFromGeometry(geometry, metadata);

        const objectData = {
            name,
            files: {
                default: {
                    extension,
                    url: objectURL,
                },
            },
            img: imageSrc,
            extension: 'stl',
            metadata,
            partTypeId,
        };

        try {
            const id = await api.postPart(objectData);

            const objectToAdd = {
                ...objectData,
                id,
                status: OBJECT_STATUS.IN_SYNC,
            };

            setSelected3dObject(partTypeId, object);
            setSelectedObjectId(partTypeId, id);
            addObject(objectToAdd);
        } catch {
            console.error(`Failed to upload object '${name}'`);
        }

        setIsLoading(false);
    };

    return (
        <div className={styles.app}>
            <div
                className={styles.canvasContainer}
                ref={canvasContainerRef}
            ></div>

            <Header title={customizerName} user={props.worldData.user} />

            {isLoading && (
                <div className={styles.canvasOverlay}>
                    <LoadingIndicator />
                </div>
            )}

            <div className={styles.editorPanelContainer}>
                <div className={styles.editorPanel}>
                    <div className={styles.partTypesContainer}>
                        <PartTypesView
                            partTypes={partTypesArray}
                            selectedPartTypeId={selectedPartTypeId}
                            onPartTypeSelected={id => setSelectedPartTypeId(id)}
                        />
                    </div>

                    <div className={styles.selectorContainer}>
                        <Selector
                            data={selectorData}
                            onObjectSelected={handleObjectSelected}
                            onDelete={handleDeleteObject}
                            onUpload={handleUpload}
                            edit_mode={props.edit_mode}
                        />
                    </div>
                </div>
            </div>

            <ButtonsContainer
                addToCartButtonMessage={addToCartButtonMessage}
                downloadButtonMessage={downloadButtonMessage}
                userMustBuySelection={userMustBuySelection}
                isSelectionInCart={isSelectionInCart}
                onDownload={handleDownload}
                onAddToCart={handleAddToCart}
                partTypes={partTypesArray}
                onUpload={handleUpload}
                onShowSettings={() => setShowSettings(true)}
                edit_mode={props.edit_mode}
            />

            {showUploadWizard && (
                <UploadWizard
                    getGlobalPosition={computeGlobalPosition}
                    getParentAttachPointPosition={getParentAttachPointPosition}
                    getChildPartTypeByAttachPoint={
                        getChildPartTypeByAttachPoint
                    }
                    data={uploadedObjectData}
                    showLoader={() => setIsLoading(true)}
                    hideLoader={() => setIsLoading(false)}
                    onWizardCanceled={() => setUploadedObjectData(null)}
                    onWizardCompleted={handleWizardCompleted}
                />
            )}

            {showSettings && (
                <SettingsPopup
                    className={styles.settingsPopup}
                    name={customizerName}
                    price={price}
                    tags={tags}
                    description={description}
                    isPrivate={isPrivate}
                    imageUrl={imageUrl}
                    onSave={handleSaveChanges}
                    onCancel={() => setShowSettings(false)}
                    userCanSetPrice={
                        props.canPublishToStore
                    }
                />
            )}
        </div>
    );
};

export default App;
