import { clsx } from 'clsx';

interface BadgeProps {
    color:
        | 'gray'
        | 'red'
        | 'yellow'
        | 'green'
        | 'blue'
        | 'indigo'
        | 'purple'
        | 'pink'
        | 'emerald'
        | 'violet'
        | 'lime'
        | 'fuchsia'
        | 'orange'
        | 'amber';
    text: string;
}
const Badge = ({ color, text }: BadgeProps) => (
    <span
        className={clsx(
            'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
            color === 'gray' && 'bg-gray-50 text-gray-400 ring-gray-400/10',
            color === 'red' && 'bg-red-50 text-red-700 ring-red-600/10',
            color === 'yellow' && 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
            color === 'green' && 'bg-green-50 text-green-700 ring-green-600/20',
            color === 'blue' && 'bg-blue-50 text-blue-500 ring-blue-500/10',
            color === 'indigo' && 'bg-indigo-50 text-indigo-700 ring-indigo-700/10',
            color === 'purple' && 'bg-purple-50 text-purple-500 ring-purple-500/10',
            color === 'pink' && 'bg-pink-50 text-pink-500 ring-pink-700/10',
            color === 'emerald' && 'bg-emerald-50 text-emerald-500 ring-emerald-500/10',
            color === 'violet' && 'bg-violet-50 text-violet-500 ring-violet-700/10',
            color === 'lime' && 'bg-lime-50 text-lime-600 ring-lime-700/10',
            color === 'fuchsia' && 'bg-fuchsia-50 text-fuchsia-500 ring-fuchsia-500/10',
            color === 'orange' && 'bg-orange-50 text-orange-500 ring-orange-500/10',
            color === 'amber' && 'bg-amber-50 text-amber-400 ring-amber-400/10'
        )}
    >
        {text}
    </span>
);

export default Badge;
