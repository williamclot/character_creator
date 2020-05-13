import { useState, useCallback } from 'react';

const useBooleanState = (initialValue: boolean) => {
    const [value, setValue] = useState(initialValue);

    const setTrue = useCallback(() => {
        setValue(true);
    }, []);
    const setFalse = useCallback(() => {
        setValue(false);
    }, []);

    return [value, setTrue, setFalse] as const;
};

export default useBooleanState;
