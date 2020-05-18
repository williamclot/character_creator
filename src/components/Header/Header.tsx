import { User } from '../../types';
import React from 'react';
import cn from 'classnames';

import styles from './Header.module.scss';
import sharedStyles from '../../shared-styles/basic-button.module.scss';

type PropTypes = {
    className: string;
    title: string;
    user: User;
    currentUser?: {
        username: string;
    };
    isFollowing: boolean;
    handleFollow: () => void;
    comments_enabled: boolean;
};

const Header: React.FunctionComponent<PropTypes> = props => {
    const isOwner =
        props.currentUser && props.currentUser.username === props.user.username;

    let followButton = null;
    if (props.comments_enabled && !isOwner) {
        followButton = (
            <button
                title={
                    props.isFollowing ? 'Click to unfollow' : 'Click to follow'
                }
                className={cn(styles.followButton, sharedStyles.button)}
                onClick={props.handleFollow}
            >
                {props.isFollowing ? 'Following' : 'Follow Designer'}
            </button>
        );
    }

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
            {followButton}
        </div>
    );
};

export default Header;
