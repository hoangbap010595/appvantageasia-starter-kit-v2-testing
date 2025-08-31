import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export interface RedirectToProps {
    to: string;
    replace?: boolean;
    state?: object;
}

const RedirectTo = ({ to, replace = true, state }: RedirectToProps) => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate(to, { replace, state });
    }, [navigate, to, replace, state]);

    return null;
};

export default RedirectTo;
