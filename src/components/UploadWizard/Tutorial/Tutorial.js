import React, { Component, createRef } from 'react';
import cn from 'classnames';

import partsImg from './images/parts.png';
import partTypesImg from './images/part-types.png';

import styles from './index.module.css';

const Tutorial = props => (
    <div className={styles.tutorial}>
        <div className={styles.title}>Part Types and Parts</div>

        <div className={styles.sections}>
            <div className={styles.section}>
                <div className={styles.sectionTitle}>Part Types</div>

                <p>
                    Part Types are categories of interchangeable parts which
                    join together to form a 3D print.
                </p>

                <img className={styles.img} src={partTypesImg} />

                <p>These are the part types of an action figure.</p>
            </div>

            <div className={styles.separator} />

            <div className={styles.section}>
                <div className={styles.sectionTitle}>Parts</div>

                <p>
                    Parts are the individual CAD files that are interchanged to
                    make a 3D print customizable.
                </p>

                <img className={styles.img} src={partsImg} />

                <p>
                    Head A and Head B are both parts belonging to the Head part
                    type.
                </p>
            </div>
        </div>
    </div>
);

export default Tutorial;
