import React from 'react';
import { makeStyles, Backdrop, BackdropProps } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: 0,
        backgroundColor: 'rgba(0, 0, 0, .8)',
    },
}));

export default function MyBackDrop(props: BackdropProps) {
    const classes = useStyles();

    return (
        <Backdrop className={classes.backdrop} {...props}>
            {props.children}
        </Backdrop>
    );
}
