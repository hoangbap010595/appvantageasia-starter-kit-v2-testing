import { clsx } from 'clsx';
import get from 'lodash/fp/get';
import { useCallback } from 'react';
import Loader from '../Loader';
import Sorter from './Sorter';
import type { SortOrder, TableProps } from './types';
import { SortingOrder } from './types';

const Table = <Item = any,>({
    columns,
    dataSource,
    rowKey = 'id',
    striped,
    onSortChange,
    onRowClick,
    cellClassName,
    rowClassName,
    headCellClassName,
    loading,
}: TableProps<Item>) => {
    const onSortOrderChange = useCallback(
        (columnKey: string, currentSortOrder?: SortOrder) => {
            let next: SortOrder = SortingOrder.Asc;

            if (currentSortOrder === SortingOrder.Asc) {
                next = SortingOrder.Desc;
            } else if (currentSortOrder === SortingOrder.Desc) {
                next = null;
            }

            if (onSortChange) {
                onSortChange(columnKey, next);
            }
        },
        [onSortChange]
    );

    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
                <thead>
                    <tr>
                        {columns.map((i, colIndex) => (
                            <th
                                key={i.key || i.dataIndex.toString() || colIndex.toString()}
                                className={clsx(
                                    'py-3.5 text-left text-sm font-semibold text-black',
                                    colIndex > 0 && colIndex < columns.length - 1 && 'px-3',
                                    colIndex === 0 && 'pr-3 pl-4 sm:pl-0',
                                    colIndex === columns.length - 1 && 'pr-4 pl-3 text-right sm:pr-0'
                                )}
                                scope="col"
                            >
                                <div
                                    className={clsx('h-full w-full', headCellClassName && headCellClassName(colIndex))}
                                >
                                    {!i.sorter && i.title}
                                    {i.sorter && <Sorter column={i} onSortOrderChange={onSortOrderChange} />}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className={clsx(!striped && 'divide-y divide-gray-200')}>
                    {loading && (
                        <tr>
                            <td colSpan={columns.length}>
                                <Loader />
                            </td>
                        </tr>
                    )}
                    {dataSource?.map((data, rowIndex) => (
                        <tr
                            key={
                                typeof rowKey === 'function'
                                    ? rowKey(data)
                                    : get(rowKey, data)?.toString() || rowIndex.toString()
                            }
                            className={(clsx(striped && 'even:bg-gray-50'), rowClassName?.(rowIndex, data))}
                            data-cy="tableRow"
                            onClick={() => onRowClick && onRowClick(data)}
                        >
                            {columns.map((column, colIndex) => (
                                <td
                                    key={column.key}
                                    className={clsx(
                                        'py-4 text-sm whitespace-nowrap text-gray-500',
                                        colIndex > 0 && colIndex < columns.length - 1 && 'px-3 py-4',
                                        colIndex === 0 && 'py-4 pr-3 pl-4 sm:pl-0',
                                        colIndex === columns.length - 1 && 'pr-4 pl-3 text-right sm:pr-0',
                                        onRowClick && 'cursor-pointer'
                                    )}
                                >
                                    <div
                                        className={clsx(
                                            'h-full w-full',
                                            cellClassName && cellClassName(colIndex, rowIndex)
                                        )}
                                    >
                                        {column.render && column.render(get(column.dataIndex, data), data)}
                                        {!column.render && get(column.dataIndex, data)?.toString()}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
