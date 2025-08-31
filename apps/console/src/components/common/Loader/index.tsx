import { clsx } from 'clsx';

interface LoaderProps {
    height?: 'auto' | 'screen';
}

const Loader = ({ height = 'auto' }: LoaderProps) => (
    <div
        className={clsx(
            'flex items-center justify-center p-3',
            height === 'auto' && 'h-auto',
            height === 'screen' && 'h-screen'
        )}
    >
        <div className="size-10 animate-spin rounded-full border-4 border-solid border-pink-500 border-t-transparent" />
    </div>
);

export default Loader;
