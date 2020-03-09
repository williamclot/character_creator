import React from 'react';
import cn from 'classnames';

import ImportButton from '../ImportButton';
import Button, { ButtonWithArrow } from './Button';
import ListWithSeparator from './ListWithSeparator';
import Menu from './Menu';

import { ACCEPTED_OBJECT_FILE_EXTENSIONS } from '../../constants';

import sharedStyles from '../../shared-styles/button.module.css';
import styles from './ButtonsContainer.module.css';

const ButtonsContainer = ({
    addToCartButtonMessage,
    downloadButtonMessage,
    userMustBuySelection,
    isSelectionInCart,
    onDownload,
    onAddToCart,

    partTypes,
    onUpload,
    onShowSettings,
    edit_mode,
}) => {
    const addNewPartButton = (
        <Button className={styles.iconMinimisableButton} title="Add new Part">
            <span className={styles.word}>Add new Part</span>
            <span className={styles.icon}>
                <i className="fa fa-plus" aria-hidden="true"></i>
            </span>
        </Button>
    );
    const existingPartTypeButton = (
        <Button title="Existing Part Type"> Existing Part Type </Button>
    );

    const menu = (
        <Menu header={addNewPartButton}>
            <Menu header={existingPartTypeButton}>
                {partTypes.map(partType => (
                    <ImportButton
                        key={partType.id}
                        className={cn(sharedStyles.button, styles.button)}
                        title={`Add new ${partType.name}`}
                        onFileLoaded={(filename, objectURL) =>
                            onUpload(partType.id, filename, objectURL)
                        }
                        accept={ACCEPTED_OBJECT_FILE_EXTENSIONS.map(
                            extension => `.${extension}`,
                        ).join(',')}
                    >
                        {partType.name}
                    </ImportButton>
                ))}
            </Menu>
            {/*<Button className = { styles.disabled }>
                New Part Type
            </Button> */}
        </Menu>
    );

    return (
        <div className={styles.container}>
            {userMustBuySelection ? (
                <Button
                    title={addToCartButtonMessage}
                    className={cn(
                        styles.withMargin,
                        styles.iconMinimisableButton,
                    )}
                    onClick={!isSelectionInCart ? onAddToCart : null}
                >
                    <span className={styles.word}>
                        {addToCartButtonMessage}
                    </span>
                    <span className={styles.icon}>
                        <i className="fa fa-arrow-down" aria-hidden="true"></i>
                    </span>
                </Button>
            ) : (
                <Button
                    title={downloadButtonMessage}
                    className={cn(
                        styles.withMargin,
                        styles.iconMinimisableButton,
                    )}
                    onClick={onDownload}
                >
                    <span className={styles.word}>{downloadButtonMessage}</span>
                    <span className={styles.icon}>
                        <i className="fa fa-arrow-down" aria-hidden="true"></i>
                    </span>
                </Button>
            )}

            {edit_mode && (
                <>
                    <Button
                        title="Settings"
                        className={cn(
                            styles.withMargin,
                            styles.iconMinimisableButton,
                        )}
                        onClick={onShowSettings}
                    >
                        <span className={styles.word}>Settings</span>
                        <span className={styles.icon}>
                            <i className="fa fa-cog" aria-hidden="true"></i>
                        </span>
                    </Button>

                    {menu}
                </>
            )}
        </div>
    );
};

export default ButtonsContainer;
