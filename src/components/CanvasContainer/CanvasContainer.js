import React, { Component, createRef } from 'react';
import cn from 'classnames';

import styles from './index.module.css';

class CanvasContainer extends Component {
    constructor(props) {
        super(props);

        this.canvasContainerRef = createRef();
    }

    componentDidMount() {
        const { domElement } = this.props;

        this.canvasContainerRef.current.appendChild(domElement);
    }

    componentWillUnmount() {
        // remove child ????
    }

    render() {
        const {
            className,
            domElement, // this is ignored
            ...otherProps
        } = this.props;

        return (
            <div
                className={cn(styles.canvasContainer, className)}
                ref={this.canvasContainerRef}
                {...otherProps}
            />
        );
    }
}

export default CanvasContainer;
