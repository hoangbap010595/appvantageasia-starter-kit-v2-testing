import { useReducer } from 'react';

interface State {
    stepScanOpen: boolean;
    stepConfirmOpen: boolean;
}

const defaultState = {
    stepScanOpen: false,
    stepConfirmOpen: false,
};

interface GoScan {
    type: 'goScan';
}

interface GoConfirm {
    type: 'goConfirm';
}

interface Reset {
    type: 'reset';
}

interface SetStepScanOpen {
    type: 'setStepScanOpen';
    open: boolean;
}

interface SetStepConfirmOpen {
    type: 'setStepConfirmOpen';
    open: boolean;
}

export type Action = GoScan | GoConfirm | Reset | SetStepScanOpen | SetStepConfirmOpen;

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'setStepScanOpen':
            return { ...state, stepScanOpen: action.open };

        case 'setStepConfirmOpen':
            return { ...state, stepConfirmOpen: action.open };

        case 'goScan':
            return { ...state, stepScanOpen: true, stepConfirmOpen: false };

        case 'goConfirm':
            return { ...state, stepScanOpen: false, stepConfirmOpen: true };

        case 'reset':
            return { ...state, stepScanOpen: false, stepConfirmOpen: false };

        default:
            return state;
    }
};

const useStep = () => useReducer(reducer, defaultState);

export default useStep;
