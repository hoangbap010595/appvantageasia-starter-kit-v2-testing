import { ChevronDownIcon, ChevronUpIcon, MinusIcon } from '@heroicons/react/20/solid';
import type { SorterProps } from './types';

const Sorter = ({ column, onSortOrderChange }: SorterProps) => (
    <button
        className="group inline-flex items-center"
        data-cy="tableSort"
        onClick={() => onSortOrderChange(column.key, column.sortOrder)}
        type="button"
    >
        {column.title}
        <span className="ml-2 flex-none rounded bg-gray-100 text-gray-400 group-hover:visible group-focus:visible">
            {column.sortOrder === 'ascend' && <ChevronUpIcon aria-hidden="true" className="h-5 w-5" />}
            {column.sortOrder === 'descend' && <ChevronDownIcon aria-hidden="true" className="h-5 w-5" />}
            {!column.sortOrder && <MinusIcon aria-hidden="true" className="h-5 w-5" />}
        </span>
    </button>
);

export default Sorter;
