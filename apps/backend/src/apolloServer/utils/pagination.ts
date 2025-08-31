import getOr from 'lodash/fp/getOr.js';
import type { Collection, SortDirection, Filter, Document } from 'mongodb';
import { SortingOrder } from '../enums.js';

export interface Page<TResult> {
    items: TResult[];
    count: number;
}

export interface PageInput {
    limit: number;
    offset: number;
}

export const paginateAggregation = async <TDocument extends Document, TAggregationResult extends Document = TDocument>(
    collection: Collection<TDocument>,
    pipelines: Document[],
    pagination?: PageInput | null
): Promise<Page<TAggregationResult>> => {
    if (!pagination) {
        const items = await collection.aggregate<TAggregationResult>(pipelines).toArray();

        return { count: items.length, items };
    }

    const { limit, offset } = pagination;

    const [{ metadata, items }] = await collection
        .aggregate([
            ...pipelines,
            {
                $facet: {
                    metadata: [{ $count: 'count' }],
                    items: [{ $skip: offset }, { $limit: limit }],
                },
            },
        ])
        .toArray();

    return { count: getOr(0, '[0].count', metadata), items };
};

export const paginate = async <TDocument extends Document>(
    collection: Collection<TDocument>,
    filter: Filter<TDocument>,
    page: PageInput
) => paginateAggregation<TDocument>(collection, [{ $match: filter }], page);

export const getSortingValue = (order: SortingOrder): SortDirection => {
    switch (order) {
        case SortingOrder.Asc:
            return 1;

        case SortingOrder.Desc:
            return -1;

        default:
            throw new Error('Sorting order not implemented');
    }
};
