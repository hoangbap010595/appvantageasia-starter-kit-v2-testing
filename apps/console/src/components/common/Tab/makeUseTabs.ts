import type { Reducer } from 'react';
import { useRef, useReducer, useEffect, useCallback } from 'react';

export interface TabItem {
    name: string;
    key: string;
    href?: string;
}

export type TabItemWithState = TabItem & { current: boolean };

interface State {
    tabs: TabItemWithState[];
    activeTab: string;
}

type Action = { type: 'updateTabs'; tabs: TabItem[] } | { type: 'setActiveTab'; activeTab: string };

const reducer: Reducer<State, Action> = (state, action) => {
    switch (action.type) {
        case 'updateTabs': {
            let hasAssignedActiveTab = false;
            let { activeTab } = state;
            const newTabs = action.tabs.map(tab => {
                const current = tab.key === activeTab;

                if (current) {
                    hasAssignedActiveTab = true;
                }

                return { ...tab, current };
            });

            if (!hasAssignedActiveTab) {
                newTabs[0].current = true;
                activeTab = newTabs[0].key;
            }

            return { tabs: newTabs, activeTab };
        }

        case 'setActiveTab': {
            let hasSpecificTab = false;
            const nextState = {
                tabs: state.tabs.map(tab => {
                    const current = tab.key === action.activeTab;

                    if (current) {
                        hasSpecificTab = true;
                    }

                    return { ...tab, current };
                }),
                activeTab: action.activeTab,
            };

            return hasSpecificTab ? nextState : state;
        }

        default:
            return state;
    }
};

const makeUseTabs =
    <Args extends any[]>(getTabItemHook: (...args: Args) => TabItem[], watchTabItems = false) =>
    (...args: Args) => {
        // we expect to get either a function or a hook to be invoked here to get the latest tab list
        // that way memoization can be done on the tab list itself
        const tabs = getTabItemHook(...args);

        if (tabs.length === 0) {
            throw new Error('Tabs are required');
        }

        const [state, dispatch] = useReducer(reducer, null, () => ({
            tabs: tabs.map((tab, index) => ({ ...tab, current: index === 0 })),
            activeTab: tabs[0].key,
        }));

        // use a reference to track two things outside of the traditional react state
        // first, if we initially watch the tab list for refresh
        // second, if we already went by the first initialization
        const watchTabItemsRef = useRef({ active: false, initialState: watchTabItems });

        if (watchTabItems) {
            if (!watchTabItemsRef.current.initialState) {
                throw new Error('watchTabItems cannot be changed after the first render');
            }

            useEffect(() => {
                // we only want to update the tabs if the effect has already been invoked once
                if (watchTabItemsRef.current.active) {
                    dispatch({ type: 'updateTabs', tabs });
                }

                // we want to set the active flag to true after the first render
                watchTabItemsRef.current.active = true;
            }, [tabs, watchTabItemsRef, dispatch]);
        }

        const onTabChange = useCallback(
            (key: string) => {
                dispatch({ type: 'setActiveTab', activeTab: key });
            },
            [dispatch]
        );

        return { ...state, onTabChange };
    };

export default makeUseTabs;

/** useTabs hooks to be used in a specific context * */
