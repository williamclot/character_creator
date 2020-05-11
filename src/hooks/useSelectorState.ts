import { useState } from 'react';

export enum Tabs {
    SELECTOR,
    COMMENTS,
}

const useSelectorState = () => {
    const [currentTab, setCurrentTab] = useState<Tabs>(Tabs.SELECTOR);

    const goToSelector = () => {
        setCurrentTab(Tabs.SELECTOR);
    }

    const goToComments = () => {
        setCurrentTab(Tabs.COMMENTS);
    }

    return {
        currentTab,
        goToComments,
        goToSelector,
    };
};

export default useSelectorState;
