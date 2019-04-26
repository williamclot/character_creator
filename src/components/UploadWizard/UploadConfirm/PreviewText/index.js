import React from 'react'

import styles from './index.module.css'

const PreviewText = props => {
    return (
        <div className = { styles.wrapper } >
            <span className = { styles.description } >
                Browse Preview Icon
            </span>
            <span className = { styles.main } >
                Browse
            </span>
        </div>
    )
}

export default PreviewText