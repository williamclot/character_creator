import React, { Component } from 'react';

const ENTER_KEY = 'Enter';

class NormalInput extends Component {
    constructor(props) {
        super(props);

        const formattedValue = props.formatter.format(props.value);
        const computedValue = Number(formattedValue).toFixed(props.precision);

        this.state = {
            value: computedValue,
        };
    }

    submitValue = () => {
        const { min, max } = this.props;
        const rawValue = this.state.value;

        const value = this.props.formatter.parse(rawValue);
        const clampedValue = Math.min(max, Math.max(min, value));

        if (!isNaN(clampedValue)) {
            this.props.onChange(clampedValue);
        }
        this.props.onBlur();
    };

    handleChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    handleKeyDown = e => {
        if (e.key === ENTER_KEY) {
            this.submitValue();
        }
    };

    handleBlur = () => {
        this.submitValue();
    };

    render() {
        const { className } = this.props;
        const { value } = this.state;

        return (
            <input
                className={className}
                type="text"
                value={value}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                onBlur={this.handleBlur}
            />
        );
    }
}

export default NormalInput;
