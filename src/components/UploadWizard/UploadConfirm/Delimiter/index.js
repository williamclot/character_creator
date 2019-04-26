import React from 'react'

import styles from './index.module.css'

const Delimiter = () => (
    <div className = { styles.wrapper } >
        <span className = { styles.line } />
        <span className = { styles.text } > Or </span>
        <span className = { styles.line } />
    </div>
)

export default Delimiter