import React, { Component } from 'react'
import cn from 'classnames'
import { uniqueId } from '../../util/helpers'

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
            description: props.description,
            isPrivate: props.isPrivate,
            image: props.image,
            // tags: props.tags,

            // isSynced: true,
        }
    }

    handleNameChange = e => {
        this.setState({
            name: e.target.value
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

            this.setState({
                image: `${CDN_URL}/uploads/customizer/${filename}`
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

        if(props.name !== state.name) {
            fieldsToPatch.name = state.name
        }

        if(props.description !== state.description) {
            fieldsToPatch.description = state.description
        }

        if(props.image !== state.image) {
            fieldsToPatch.image = state.image
        }

        if(props.isPrivate !== state.isPrivate) {
            const visibility = state.isPrivate ? 'private' : 'public'
            if(!window.confirm(`Are you sure you want to make it ${visibility}?`)) {
                this.setState({
                    isPrivate: props.isPrivate
                })
                return
            }

            fieldsToPatch.is_private = state.isPrivate
        }

        try {
            await this.props.onSave(fieldsToPatch)
            console.log('changes saved successfully')
        } catch (err) {
            console.error(err)
        }
    }

    render() {
        const { className, onCancel } = this.props
        const { name, description, image, visibility } = this.state

        const isInSync = Object.keys(this.state).every(key => {
            return this.state[key] === this.props[key]
        })

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

                        <label htmlFor="label_desc" className={styles.label}>Description</label>
                        <textarea
                            id="label_desc"
                            value={description}
                            onChange={this.handleDescriptionChange}
                            className={cn(styles.input, styles.text, styles.description)}
                        />

                        <label className={styles.label}>Image</label>
                        <ImportButtonV2
                            className={cn(styles.input, styles.chooseImage)}
                            accept=".png, .jpg"
                            onChange = {this.handleImageChange}
                        >
                            Choose Image
                        </ImportButtonV2>
                        {image && (
                            <img className={cn(styles.input, styles.imagePreview)} src={image} />
                        )}
                        

                        
                        <label htmlFor="label_visibility" className={styles.label}>Visibility</label>
                        <select
                            id="label_visibility"
                            value={visibility}
                            onChange={this.handleVisibilityChange}
                            className={cn(styles.input, styles.text, styles.visibility)}
                        >
                            <option value={VISIBILITY_PRIVATE}>Private</option>
                            <option value={VISIBILITY_PUBLIC}>Public</option>
                        </select>
                    </div>

                    <div className={styles.buttons}>
                        <input
                            disabled = {isInSync}
                            className={cn(commonStyles.button, styles.button)}
                            type="submit"
                            value="Save Changes" />
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