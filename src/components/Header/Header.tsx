import { User } from '../../types';
import React from 'react';

import styles from './Header.module.scss';

type PropTypes = {
    title: string;
    user: User;
};

const Header: React.FunctionComponent<PropTypes> = props => {
    return (
        <div className={styles.header}>
            <h1 className={styles.title}>{props.title}</h1>

            <h2 className={styles.userSection}>
                <span className={styles.by}>By </span>
                <a className={styles.username} href={props.user.url}>
                    {props.user.username}
                </a>
            </h2>
        </div>
    );
};

export default Header;
