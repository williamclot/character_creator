import React from 'react';
import cn from 'classnames';

import logo from './logo.jpg';
import './index.css';

const LoadingIndicator = ({ visible: isVisible }) => (
    <div className={cn('container', isVisible && 'visible')}>
        <div className="logo">
            <div className="circle">
                <img className="img" src={logo} alt="logo" />
            </div>
        </div>
    </div>
);

export default LoadingIndicator;
