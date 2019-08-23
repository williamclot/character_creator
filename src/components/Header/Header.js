import React from 'react'

import MMFTitle from './MMFTitle';

import styles from './Header.module.scss'

const Header = props => {
    return (
        <div className = {styles.header}>
            <h1 className = {styles.title}>
                { props.title }
            </h1>

            <h2 className={styles.userSection}>
                <span className={styles.by}>By </span>
                <a className={styles.username} href={props.userUrl}>{props.userName}</a>
            </h2>
        </div>
    )
}

export default Header