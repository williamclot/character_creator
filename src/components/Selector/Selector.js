import React, { Component } from 'react';
import cn from 'classnames';

import ContextMenu from './ContextMenu';
import ImportButton from '../ImportButton';

import {
    ACCEPTED_OBJECT_FILE_EXTENSIONS,
    OBJECT_STATUS,
} from '../../constants';

import './Selector.css';

class Selector extends Component {
    constructor(props) {
        super(props);
    }

    handleClick = object => {
        const { onObjectSelected, data } = this.props;

        onObjectSelected(data.currentPartType.id, object);
    };

    handleUpload = (fileName, objectURL) => {
        const { data, onUpload } = this.props;

        if (typeof onUpload === 'function') {
            onUpload(data.currentPartType.id, fileName, objectURL);
        }
    };

    handleDelete = (object, isLastElement) => {
        const { onDelete } = this.props;

        const messages = [`Are you sure you want to delete ${object.name}?`];

        if (isLastElement) {
            messages.push(
                'This is the only part left for this part type.',
                'If you delete this part, your model might not load next time!',
            );
        }

        const answer = window.confirm(messages.join('\n'));

        if (answer && typeof onDelete === 'function') {
            onDelete(object.id);
        }
    };

    render() {
        const { data, edit_mode } = this.props;

        if (!data) {
            return (
                <div className="selector">
                    <p>Select a category!</p>
                </div>
            );
        }

        const { objects, currentPartType, selectedParts } = data;

        const elementDiv = objects.map((object, index, objectsArray) => {
            const menuItems = (
                <div
                    className="selector-item-menu"
                    onMouseDown={() =>
                        this.handleDelete(object, objectsArray.length === 1)
                    }
                >
                    Delete Part
                </div>
            );

            const isDeleted = object.status === OBJECT_STATUS.DELETED;
            const isSelected = selectedParts[currentPartType.id] === object.id;

            const clickHandler = () => {
                if (isDeleted) return;

                this.handleClick(object);
            };

            const className = cn(
                'selector-item',
                isSelected && 'selected',
                isDeleted && 'deleted',
            );

            return (
                <ContextMenu
                    title={object.name}
                    className={className}
                    onClick={clickHandler}
                    disabled={!edit_mode || isDeleted}
                    menuItems={menuItems}
                    key={object.id || object.name}
                >
                    <div
                        className="img"
                        style={{ backgroundImage: `url('${object.img}')` }}
                    />
                    <div className="unselectable item-name">{object.name}</div>
                </ContextMenu>
            );
        });

        const text = `Add new ${currentPartType.name}`;

        return (
            <div className="selector-container">
                {/* <div className = "anti-scrollbar-box"> */}
                <div className="selector">{elementDiv}</div>
                {/* </div> */}

                {edit_mode && (
                    <ImportButton
                        title={text}
                        className="import-button"
                        key="__add__button__"
                        onFileLoaded={this.handleUpload}
                        accept={ACCEPTED_OBJECT_FILE_EXTENSIONS.map(
                            extension => `.${extension}`,
                        ).join(',')}
                    >
                        <span className="word">{text}</span>
                        <span className="icon">
                            <i className="fa fa-plus" aria-hidden="true"></i>
                        </span>
                    </ImportButton>
                )}
            </div>
        );
    }
}

export default Selector;
