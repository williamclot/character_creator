import React, { Component } from 'react';

const LEFT_MOUSE_BUTTON = 0;

export default class DraggableInput extends Component {
    constructor(props) {
        super(props);

        this.prevPointer = null;
        this.distance = null;
        this.startValue = null;
    }

    componentWillUnmount() {
        // in case component is unmounted during drag
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mousemove', this.onMouseMove);
    }

    onMouseDown = event => {
        if (event.button !== LEFT_MOUSE_BUTTON) return;

        event.preventDefault();

        this.prevPointer = {
            x: event.clientX,
            y: event.clientY,
        };
        this.distance = 0;
        this.startValue = this.props.value;

        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousemove', this.onMouseMove);
    };

    onMouseMove = event => {
        const { step, min, max } = this.props;

        const { clientX, clientY, shiftKey: isShiftPressed } = event;

        const { x: prevX, y: prevY } = this.prevPointer;

        const deltaX = clientX - prevX;
        const deltaY = clientY - prevY;

        this.distance += deltaX - deltaY;

        const dividingFactor = isShiftPressed ? 5 : 50;
        const normalizedDistance = this.distance / dividingFactor;

        const value = this.startValue + normalizedDistance * step;

        const clampedValue = Math.min(max, Math.max(min, value));

        this.props.onChange(clampedValue);

        this.prevPointer = {
            x: clientX,
            y: clientY,
        };
    };

    onMouseUp = () => {
        const totalDistanceMoved = Math.abs(this.distance);

        if (totalDistanceMoved < 2) {
            this.props.onClick();
        }

        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mousemove', this.onMouseMove);
    };

    render() {
        const {
            className,
            value,
            precision,
            // axis,
            // min,
            // max,
            // step,
            formatter,
        } = this.props;

        const formattedValue = formatter.format(value);
        const computedValue = Number(formattedValue).toFixed(precision);

        return (
            <span className={className} onMouseDown={this.onMouseDown}>
                {computedValue}
            </span>
        );
    }
}

/**
 * @typedef { Object } Formatter
 * @property { FormatFunction<number> } format
 * @property { ParseFunction<number> } parse
 */

/**
 * @template T
 * @callback FormatFunction
 * @param { T } value
 * @returns { string }
 */

/**
 * @template T
 * @callback ParseFunction
 * @param { string } value
 * @returns { T }
 */
