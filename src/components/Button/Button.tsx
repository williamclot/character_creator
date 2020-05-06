import React, { FunctionComponent, ButtonHTMLAttributes } from 'react';
import cn from 'classnames';

import sharedStyles from '../../shared-styles/basic-button.module.scss';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FunctionComponent<Props> = props => {
    const { className, children, ...rest } = props;

    return (
        <button className={cn(sharedStyles.button, className)} {...rest}>
            {children}
        </button>
    );
};

export default Button;
