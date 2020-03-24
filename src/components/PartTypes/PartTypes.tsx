import React from 'react';
import cn from 'classnames';

import styles from './index.module.css';

interface PropTypes {
    partTypes: {
        id: number;
        name: string;
        selected: boolean;
        disabled: boolean;
    }[];
    onPartTypeSelected: (id: number) => void;
}

const PartTypes: React.FunctionComponent<PropTypes> = ({
    partTypes,
    onPartTypeSelected,
}) => {
    return (
        <div className={styles.partTypes}>
            {partTypes.map(partType => (
                <div
                    key={partType.id}
                    className={cn(
                        styles.item,
                        partType.selected && styles.selected,
                        partType.disabled && styles.disabled,
                    )}
                    onClick={() => onPartTypeSelected(partType.id)}
                >
                    <div title={partType.name} className={styles.name}>
                        {partType.name}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PartTypes;
