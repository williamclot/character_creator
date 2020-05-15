import { User } from '../../types';
import React from 'react';
import cn from "classnames";

import styles from './Header.module.scss';

type PropTypes = {
    className: string;
    title: string;
    user: User;
};

const Header: React.FunctionComponent<PropTypes> = props => {
    return (
        <div className={cn(styles.header, props.className)}>
            <h1 className={styles.title}>{props.title}</h1>

            <a className={styles.userSection} href={props.user.url}>
                <img
                    className={styles.userPic}
                    src={props.user.avatar}
                    alt={props.user.name}
                />
                <span className={styles.username}>
                    {props.user.name}, @{props.user.username}
                </span>
            </a>
        </div>
    );
};

export default Header;
