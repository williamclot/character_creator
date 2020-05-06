import React from 'react';
import cn from 'classnames';

import sharedStyles from '../../shared-styles/button.module.scss';
import styles from './ButtonsContainer.module.css';

const Button = ({ className, children, ...props }) => (
    <div
        className={cn(sharedStyles.button, styles.button, className)}
        {...props}
    >
        {children}
    </div>
);

const ButtonWithArrow = ({ children, ...props }) => (
    <Button {...props}>
        {children}
        <span className={styles.triangle} />
    </Button>
);

export default Button;
export { Button, ButtonWithArrow };
