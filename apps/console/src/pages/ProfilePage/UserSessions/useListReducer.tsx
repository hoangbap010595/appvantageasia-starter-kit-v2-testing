import { useReducer } from 'react';

interface State {
    page: number;
    pageSize: number;
}

export interface SetPageAction {
    type: 'setPage';
    page: number;
}

export interface SetPageSizeAction {
    type: 'setPageSize';
    pageSize: number;
}

export type PageAction = SetPageAction | SetPageSizeAction;
export type Action = PageAction;

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'setPage':
            return { ...state, page: action.page };

        case 'setPageSize':
            return { ...state, pageSize: action.pageSize };

        default:
            return state;
    }
};

const useListReducer = () =>
    useReducer(reducer, {
        page: 1,
        pageSize: 10,
    });

export default useListReducer;
