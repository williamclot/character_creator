import React, { Component } from 'react';
import { uniqueId } from '../util/helpers';

type ImportButtonPropTypes = {
    className: string;
    title: string;
    id: string;
    accept: string;
    onFileLoaded: (filename: string, objectUrl: string) => void;
};

class ImportButton extends Component<ImportButtonPropTypes> {
    private _fileInput: HTMLInputElement;

    componentDidMount() {
        this._fileInput = document.createElement('input');
        this._fileInput.type = 'file';
        this._fileInput.addEventListener('change', this.handleLoad);

        const { accept } = this.props;

        if (accept) {
            this._fileInput.accept = accept;
        }
    }

    handleLoad = (e: Event) => {
        const { onFileLoaded } = this.props;

        if (!e.target) {
            return;
        }

        const files = this._fileInput.files;

        if (!files || !files[0]) {
            return;
        }

        const file = files[0];

        // first reset the value to recognize if same file is uploaded again
        this._fileInput.value = '';

        if (!file) {
            return;
        }

        const objectURL = URL.createObjectURL(file);

        onFileLoaded(file.name, objectURL);
    };

    onClick = () => {
        this._fileInput.dispatchEvent(new MouseEvent('click'));
    };

    render() {
        const { children, className } = this.props;

        return (
            <div className={className} onClick={this.onClick}>
                {children}
            </div>
        );
    }
}

const ImportButtonV2: React.FunctionComponent<ImportButtonPropTypes> = props => {
    const [id] = React.useState(uniqueId);
    const {
        className,
        title,
        children, // label props
        ...otherProps
    } = props;

    const idToUse = otherProps.id || id;

    return (
        <>
            <label title={title} className={className} htmlFor={idToUse}>
                {children}
            </label>
            <input
                {...otherProps}
                id={idToUse}
                // these props should not be overwritten
                type="file"
                style={{
                    opacity: 0,
                    position: 'absolute',
                    zIndex: -1,
                }}
            />
        </>
    );
};

export default ImportButton;
export { ImportButtonV2 };
