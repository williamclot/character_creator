import React from 'react';

import logo from './logo.png';
import './index.css';

const LoadingIndicator = () => (
    <div className="container">
        <div className="logo">
            <div className="circle">
                <img className="img" src={logo} alt="logo" />
            </div>
        </div>
    </div>
);

export default LoadingIndicator;
