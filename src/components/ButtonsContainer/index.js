import React, { useState } from 'react'
import cn from 'classnames'

import ButtonWithArrow from './ButtonWithArrow'

import styles from './ButtonsContainer.module.css'


const ButtonsContainer = (props) => {
    // const [visible, setVisible] = useState(false)

    return <div className = {styles.container}>
        <ButtonWithArrow
            onClick = { () => {window.alert('asd')} }
        >
            Add new Part
        </ButtonWithArrow>
    </div>
}

export default ButtonsContainer