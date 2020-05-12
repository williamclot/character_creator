import React from 'react';
import cn from 'classnames';
import styles from './LikeIcon.module.scss';

const LikeIcon: React.FC<{ liked?: boolean }> = props => (
    <i
        className={cn('fa', 'fa-heart', props.liked && styles.liked)}
        aria-hidden="true"
    ></i>
);

export default LikeIcon;
