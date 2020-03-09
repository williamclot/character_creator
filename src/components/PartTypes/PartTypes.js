import React from 'react';
import cn from 'classnames';

import styles from './index.module.css';

const PartType = props => {
    const { partType, onClick, selected: isSelected } = props;

    const className = cn(styles.item, isSelected && styles.selected);

    return (
        <div className={className} onClick={onClick}>
            <div title={partType.name} className={styles.name}>
                {' '}
                {partType.name}{' '}
            </div>
        </div>
    );
};

const PartTypes = ({ partTypes, selectedPartTypeId, onPartTypeSelected }) => {
    return (
        <div className={styles.partTypes}>
            {partTypes.map(partType => (
                <PartType
                    key={partType.id}
                    partType={partType}
                    onClick={() => onPartTypeSelected(partType.id)}
                    selected={partType.id === selectedPartTypeId}
                />
            ))}
        </div>
    );
};

export default PartTypes;
