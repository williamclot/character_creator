import React, { useState, useMemo, ChangeEvent, FormEvent } from 'react';
import ChipInput from 'material-ui-chip-input';
import cn from 'classnames';

import commonStyles from '../../shared-styles/button.module.css';
import styles from './SettingsPopup.module.scss';
import { ImportButtonV2 } from '../ImportButton';
import axios from 'axios';
import { arraysEqual } from '../../util/helpers';

const VISIBILITY_PRIVATE = 'private';
const VISIBILITY_PUBLIC = 'public';

type FiledsToPatch = {
    is_private?: boolean;
    name?: string;
    price?: number;
    tags?: string[];
    description?: string;
    image_path?: string | null;
};

type StateTypes = {
    name: string;
    price: number;
    description: string;
    tags: string[];
    isPrivate: boolean;
    imageUrl: string;
    imagePath: string | null;
};

type PropTypes = {
    className: string;
    onClose: () => void;
    userCanSetPrice: boolean;
    currency: string;
    onSave: (filedsToPatch: FiledsToPatch) => void;
} & StateTypes;

const SettingsPopup: React.FunctionComponent<PropTypes> = props => {
    const [state, setState] = useState<StateTypes>({
        name: props.name,
        price: props.price,
        description: props.description,
        tags: props.tags,
        isPrivate: props.isPrivate,
        imageUrl: props.imageUrl,
        imagePath: null,
    });

    const isInSync = useMemo(() => {
        return (
            state.name === props.name &&
            state.price === props.price &&
            state.description === props.description &&
            state.imageUrl === props.imageUrl &&
            state.isPrivate === props.isPrivate &&
            arraysEqual(state.tags, props.tags)
        );
    }, [props, state]);

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            name: e.target.value,
        });
    };

    const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            price: Number(e.target.value),
        });
    };

    const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setState({
            ...state,
            description: e.target.value,
        });
    };

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }

        const file = e.target.files[0];
        if (!file) {
            return;
        }

        const CDN_URL =
            process.env.NODE_ENV === 'production'
                ? 'https://cdn.myminifactory.com'
                : 'http://cdn.local';

        const formData = new FormData();
        formData.set('fileToUpload', file);

        try {
            const { data } = await axios.post(
                `${CDN_URL}/upload.php`,
                formData,
                {
                    params: {
                        path: 'customizer',
                    },
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );

            const filename = data[0];

            if (filename === 'A') {
                // if upload fails, cdn responds with string 'Are you sure you should be doing this';
                // therefore, if first element is 'A' => Error.
                // if upload succeeds, cdn returns array with filename as first element
                throw new Error('Upload Failed');
            }

            const imagePath = `/uploads/customizer-thumbnails/${filename}`;

            setState({
                ...state,
                imageUrl: `${CDN_URL}${imagePath}`,
                imagePath,
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleVisibilityChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const isPrivate = e.target.value === VISIBILITY_PRIVATE;

        setState({
            ...state,
            isPrivate,
        });
    };

    const handleAddTag = (tag: string) => {
        setState({
            ...state,
            tags: state.tags.concat(tag),
        });
    };

    const handleRemoveTag = (_: string, index: number) => {
        setState({
            ...state,
            tags: state.tags.filter((_, i) => i !== index),
        });
    };

    const handleSaveChanges = async (e: FormEvent) => {
        e.preventDefault();

        const fieldsToPatch: FiledsToPatch = {};

        if (props.isPrivate !== state.isPrivate) {
            const visibility = state.isPrivate ? 'private' : 'public';
            const confirmed = window.confirm(
                `Are you sure you want to make it ${visibility}?`,
            );
            if (!confirmed) {
                setState({
                    ...state,
                    isPrivate: props.isPrivate,
                });
                return;
            }

            fieldsToPatch['is_private'] = state.isPrivate;
        }

        if (props.name !== state.name) {
            fieldsToPatch['name'] = state.name;
        }

        if (props.price !== state.price) {
            fieldsToPatch['price'] = state.price;
        }

        if (props.description !== state.description) {
            fieldsToPatch['description'] = state.description;
        }

        if (props.imageUrl !== state.imageUrl) {
            fieldsToPatch['image_path'] = state.imagePath;
        }

        if (!arraysEqual(props.tags, state.tags)) {
            fieldsToPatch['tags'] = state.tags;
        }

        props.onSave(fieldsToPatch);
    };

    const handleCancel = () => {
        setState({
            name: props.name,
            price: props.price,
            description: props.description,
            tags: props.tags,
            isPrivate: props.isPrivate,
            imageUrl: props.imageUrl,
            imagePath: null,
        });
        props.onClose();
    };

    return (
        <form className={styles.container} onSubmit={handleSaveChanges}>
            <div className={styles.title}>Settings</div>

            <div className={styles.settings}>
                <label htmlFor="label_name" className={styles.label}>
                    Name
                </label>
                <input
                    id="label_name"
                    value={state.name}
                    onChange={handleNameChange}
                    className={cn(styles.input, styles.text)}
                />

                {props.userCanSetPrice && (
                    <>
                        <label htmlFor="label_price" className={styles.label}>
                            Price ({props.currency})
                        </label>
                        <input
                            id="label_price"
                            type="number"
                            step={0.01}
                            min={0}
                            value={state.price}
                            onChange={handlePriceChange}
                            className={cn(
                                styles.input,
                                styles.text,
                                styles.price,
                            )}
                        />
                    </>
                )}

                <label htmlFor="label_tags" className={styles.label}>
                    Tags
                </label>
                <ChipInput
                    id="label_tags"
                    className={cn(styles.input, styles.tags)}
                    classes={{
                        inputRoot: styles.tagInputContainer,
                        input: styles.tagInput,
                    }}
                    value={state.tags}
                    onAdd={handleAddTag}
                    onDelete={handleRemoveTag}
                />

                <label htmlFor="label_desc" className={styles.label}>
                    Description
                </label>
                <textarea
                    id="label_desc"
                    value={state.description}
                    onChange={handleDescriptionChange}
                    className={cn(
                        styles.input,
                        styles.text,
                        styles.description,
                    )}
                />

                <label htmlFor="label_image" className={styles.label}>
                    Thumbnail
                </label>
                <ImportButtonV2
                    id="label_image"
                    className={cn(styles.input, styles.chooseImage)}
                    title="Change Image"
                    accept=".png, .jpg"
                    onChange={handleImageChange}
                >
                    Choose Image
                </ImportButtonV2>
                {state.imageUrl && (
                    <img
                        className={cn(styles.input, styles.imagePreview)}
                        src={state.imageUrl}
                    />
                )}

                <label htmlFor="label_visibility" className={styles.label}>
                    Visibility
                </label>
                <select
                    id="label_visibility"
                    value={
                        state.isPrivate ? VISIBILITY_PRIVATE : VISIBILITY_PUBLIC
                    }
                    onChange={handleVisibilityChange}
                    className={cn(styles.input, styles.text, styles.visibility)}
                >
                    <option value={VISIBILITY_PRIVATE}>Private</option>
                    <option value={VISIBILITY_PUBLIC}>Public</option>
                </select>
            </div>

            <div className={styles.buttons}>
                <input
                    disabled={isInSync}
                    className={cn(commonStyles.button, styles.button)}
                    type="submit"
                    value="Save Changes"
                />
                <button
                    type="button"
                    className={cn(commonStyles.button, styles.button)}
                    onClick={handleCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default SettingsPopup;
