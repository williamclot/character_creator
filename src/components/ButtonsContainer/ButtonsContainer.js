import React from 'react'
import cn from 'classnames'

import ImportButton from '../ImportButton'
import Button, { ButtonWithArrow } from './Button'
import ListWithSeparator from './ListWithSeparator'
import Menu from './Menu';

import { ACCEPTED_OBJECT_FILE_EXTENSIONS } from '../../constants';

import sharedStyles from '../../shared-styles/button.module.css'
import styles from './ButtonsContainer.module.css'

const ButtonsContainer = ({ categories, onUpload }) => {

    const addNewPartButton = <ButtonWithArrow> Add new Part </ButtonWithArrow>
    const existingPartTypeButton = <ButtonWithArrow> Existing Part Type </ButtonWithArrow>
    const separator = <div className = { styles.separator } />

    return (
        <div className = {styles.container}>

            <Menu header = { addNewPartButton } >
                <ListWithSeparator separator = { separator } >

                    <Menu header = { existingPartTypeButton } >
                        <ListWithSeparator separator = { separator } >

                            {categories.map( category => (
                                <ImportButton
                                    className = {cn(
                                        sharedStyles.button,
                                        styles.button
                                    )}
                                    key = { category.name }

                                    onFileLoaded = {( filename, objectURL ) =>
                                        onUpload(
                                            category.name,
                                            filename,
                                            objectURL
                                        )
                                    }
                                    accept = { ACCEPTED_OBJECT_FILE_EXTENSIONS.map( extension => `.${extension}` ).join(',') }
                                >
                                    {category.name}
                                </ImportButton>
                            ))}

                        </ListWithSeparator>
                    </Menu>

                    <Button className = { styles.disabled }>
                        New Part Type
                    </Button>

                </ListWithSeparator>
            </Menu>

        </div>
    )
}

export default ButtonsContainer