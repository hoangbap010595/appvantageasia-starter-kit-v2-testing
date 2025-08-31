export interface ProgressBarProps {
    value: number;
}

const ProgressBar = ({ value }: ProgressBarProps) => (
    <div className="w-full overflow-hidden rounded-full bg-gray-200">
        <div
            className="h-2 rounded-full bg-pink-400 transition-all duration-500 ease-in-out"
            style={{ width: `${value}%` }}
        />
    </div>
);

export default ProgressBar;
