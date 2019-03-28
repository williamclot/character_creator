import React, { useState } from 'react'
import cn from 'classnames'

import sharedStyles from '../../shared-styles/button.module.css'
import styles from './ButtonsContainer.module.css'

const ButtonWithArrow = ({ className, children, ...props }) => (
    <div
        className = {cn(
            styles.uploadButton,
            sharedStyles.button,
            className
        )}
        { ...props }
    >
        { children }
        <span className = {styles.triangle} />
    </div>
)

export default ButtonWithArrow