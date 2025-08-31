import { useReducer } from 'react';

interface State {
    stepChangeOpen: boolean;
    stepVerifyOpen: boolean;
    stepConfirmOpen: boolean;
    newEmail: string;
}
const defaultState = {
    stepChangeOpen: false,
    stepVerifyOpen: false,
    stepConfirmOpen: false,
    newEmail: '',
};

interface GoBackChange {
    type: 'goBackChange';
    email: string;
}

interface GoChange {
    type: 'goChange';
}

interface GoVerify {
    type: 'goVerify';
    email: string;
}

interface GoConfirm {
    type: 'goConfirm';
}

interface Reset {
    type: 'reset';
}

interface SetStepChangeOpen {
    type: 'setStepChangeOpen';
    open: boolean;
}

interface SetStepVerifyOpen {
    type: 'setStepVerifyOpen';
    open: boolean;
}

interface SetStepConfirmOpen {
    type: 'setStepConfirmOpen';
    open: boolean;
}

export type Action =
    | GoChange
    | GoBackChange
    | GoVerify
    | GoConfirm
    | Reset
    | SetStepChangeOpen
    | SetStepVerifyOpen
    | SetStepConfirmOpen;

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'setStepChangeOpen':
            return { ...state, stepChangeOpen: action.open };

        case 'setStepVerifyOpen':
            return { ...state, stepVerifyOpen: action.open };

        case 'setStepConfirmOpen':
            return { ...state, stepConfirmOpen: action.open };

        case 'goChange':
            return { ...state, stepChangeOpen: true, stepVerifyOpen: false, stepConfirmOpen: false, newEmail: '' };

        case 'goBackChange':
            return {
                ...state,
                stepChangeOpen: true,
                stepVerifyOpen: false,
                stepConfirmOpen: false,
                newEmail: action.email,
            };

        case 'goVerify':
            return {
                ...state,
                stepChangeOpen: false,
                stepVerifyOpen: true,
                stepConfirmOpen: false,
                newEmail: action.email,
            };

        case 'goConfirm':
            return { ...state, stepChangeOpen: false, stepVerifyOpen: false, stepConfirmOpen: true };

        case 'reset':
            return { ...state, stepChangeOpen: false, stepVerifyOpen: false, stepConfirmOpen: false, newEmail: '' };

        default:
            return state;
    }
};

const useStep = () => useReducer(reducer, defaultState);

export default useStep;
