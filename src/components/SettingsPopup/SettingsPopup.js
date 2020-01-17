import React, { Component } from 'react'
import cn from 'classnames'

import commonStyles from '../../shared-styles/button.module.css'
import styles from './SettingsPopup.module.scss'
import { ImportButtonV2 } from '../ImportButton';
import axios from 'axios';

const VISIBILITY_PRIVATE = 'private'
const VISIBILITY_PUBLIC = 'public'

class SettingsPopup extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: props.name,
            price: props.price,
            description: props.description,
            isPrivate: props.isPrivate,
            imageUrl: props.imageUrl,
            imagePath: null,
        }
    }

    isInSync() {
        const { state, props } = this

        return (
            state.name === props.name &&
            state.price === props.price &&
            state.description === props.description &&
            state.imageUrl === props.imageUrl &&
            state.isPrivate === props.isPrivate
        )
    }

    handleNameChange = e => {
        this.setState({
            name: e.target.value
        })
    }

    handlePriceChange = e => {
        this.setState({
            price: Number(e.target.value)
        })
    }

    handleDescriptionChange = e => {
        this.setState({
            description: e.target.value
        })
    }

    handleImageChange = async e => {        
        const file = e.target.files[0]
        if(!file) {
            return
        }

        const CDN_URL = process.env.NODE_ENV === 'production' ? 'https://cdn.myminifactory.com' : 'http://cdn.local'

        const formData = new FormData
        formData.set('fileToUpload', file)

        try {
            const { data } = await axios.post(
                `${CDN_URL}/upload.php`,
                formData,
                {
                    params: {
                        path: 'customizer'
                    },
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )

            const filename = data[0]

            if(filename === 'A') {
                // if upload fails, cdn responds with string 'Are you sure you should be doing this';
                // therefore, if first element is 'A' => Error.
                // if upload succeeds, cdn returns array with filename as first element
                throw new Error('Upload Failed')
            }

            const imagePath = `/uploads/customizer-thumbnails/${filename}`

            this.setState({
                imageUrl: `${CDN_URL}${imagePath}`,
                imagePath,
            })

        } catch (err) {
            console.error(err)
        }
    }

    handleVisibilityChange = e => {
        const isPrivate = e.target.value === VISIBILITY_PRIVATE

        this.setState({
            isPrivate
        })
    }

    handleSaveChanges = async e => {
        e.preventDefault()

        const { props, state } = this

        const fieldsToPatch = {}

        if(props.isPrivate !== state.isPrivate) {
            const visibility = state.isPrivate ? 'private' : 'public'
            const confirmed = window.confirm(`Are you sure you want to make it ${visibility}?`)
            if(!confirmed) {
                this.setState({
                    isPrivate: props.isPrivate
                })
                return
            }

            fieldsToPatch['is_private'] = state.isPrivate
        }

        if(props.name !== state.name) {
            fieldsToPatch['name'] = state.name
        }

        if(props.price !== state.price) {
            fieldsToPatch['price'] = state.price
        }

        if(props.description !== state.description) {
            fieldsToPatch['description'] = state.description
        }

        if(props.imageUrl !== state.imageUrl) {
            fieldsToPatch['image_path'] = state.imagePath
        }

        this.props.onSave(fieldsToPatch)
    }

    render() {
        const { className, onCancel } = this.props
        const { name, price, description, imageUrl, isPrivate } = this.state

        return (
            <div className = {cn(className, styles.background)}>
                <form className = {styles.container} onSubmit = {this.handleSaveChanges}>
                    <div className = {styles.title}>Settings</div>

                    <div className={styles.settings}>
                        <label htmlFor="label_name" className={styles.label}>Name</label>
                        <input
                            id="label_name"
                            value={name}
                            onChange={this.handleNameChange}
                            className={cn(styles.input, styles.text)}
                        />

                        <label htmlFor="label_price" className={styles.label}>Price</label>
                        <input
                            id="label_price"
                            type="number"
                            value={price}
                            onChange={this.handlePriceChange}
                            className={cn(styles.input, styles.text, styles.price)}
                        />

                        <label htmlFor="label_desc" className={styles.label}>Description</label>
                        <textarea
                            id="label_desc"
                            value={description}
                            onChange={this.handleDescriptionChange}
                            className={cn(styles.input, styles.text, styles.description)}
                        />

                        <label htmlFor="label_image" className={styles.label}>Thumbnail</label>
                        <ImportButtonV2
                            id="label_image"
                            className={cn(styles.input, styles.chooseImage)}
                            accept=".png, .jpg"
                            onChange = {this.handleImageChange}
                        >
                            Choose Image
                        </ImportButtonV2>
                        {imageUrl && (
                            <img className={cn(styles.input, styles.imagePreview)} src={imageUrl} />
                        )}
                        

                        
                        <label htmlFor="label_visibility" className={styles.label}>Visibility</label>
                        <select
                            id="label_visibility"
                            value={isPrivate ? VISIBILITY_PRIVATE : VISIBILITY_PUBLIC}
                            onChange={this.handleVisibilityChange}
                            className={cn(styles.input, styles.text, styles.visibility)}
                        >
                            <option value={VISIBILITY_PRIVATE}>Private</option>
                            <option value={VISIBILITY_PUBLIC}>Public</option>
                        </select>
                    </div>

                    <div className={styles.buttons}>
                        <input
                            disabled = {this.isInSync()}
                            className={cn(commonStyles.button, styles.button)}
                            type="submit"
                            value="Save Changes"
                        />
                        <button
                            className={cn(commonStyles.button, styles.button)}
                            onClick={onCancel}
                        >
                                Cancel
                        </button>
                    </div>
                </form>

            </div>
        )
    }
}

export default SettingsPopup