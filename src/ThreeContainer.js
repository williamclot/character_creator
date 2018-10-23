import React from 'react';

import initialize from './skeleton';

/**
 * This class is just a wrapper for the canvas but it only runs the code from skeleton.js
 * after it is mounted
 */
class ThreeContainer extends React.Component {
    componentDidMount() {
        initialize();
    }

    render() {
        return <div id = "canvas" />;
    }
}

export default ThreeContainer;
