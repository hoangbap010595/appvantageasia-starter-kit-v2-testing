import type { ReactNode } from 'react';

export enum SortingOrder {
    /** Ascending order */
    Asc = 'ascend',
    /** Descending order */
    Desc = 'descend',
}

export type SortOrder = SortingOrder | null;

export interface Column<Item = any> {
    title?: ReactNode;
    dataIndex: string | string[];
    key: string;
    render?: (value: any, record: Item) => ReactNode;
    sorter?: boolean;
    sortOrder?: SortOrder;
}

export interface TableProps<Item = any> {
    columns: Column<Item>[];
    dataSource?: Item[];
    rowKey?: string | ((item: Item) => string);
    striped?: boolean;
    onSortChange?: (columnKey?: string, order?: SortOrder) => void;
    onRowClick?: (item: Item) => void;
    headCellClassName?: (columnIndex: number) => string | undefined;
    cellClassName?: (columnIndex: number, rowIndex: number) => string | undefined;
    rowClassName?: (rowIndex: number, record: Item) => string | undefined;
    loading?: boolean;
}

export interface SorterProps {
    column: Column;
    onSortOrderChange: (key: string, orderValue?: SortOrder) => void;
}
