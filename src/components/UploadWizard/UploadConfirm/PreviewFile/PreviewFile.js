import React from 'react'

import styles from './index.module.css'

const PreviewFile = ({ filename, onRemove }) => {
    return (
        <div className = { styles.wrapper } >
            <span className = { styles.filename } >
                { filename }
            </span>
            <span className = { styles.xButton } onClick = { onRemove } />
        </div>
    )
}

export default PreviewFile