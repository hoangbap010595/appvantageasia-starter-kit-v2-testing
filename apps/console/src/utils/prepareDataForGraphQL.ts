import dayjs from 'dayjs';
import isObject from 'lodash/fp/isObject';

const prepareDataForGraphQL = (data: any): any => {
    if (dayjs.isDayjs(data) || data instanceof Date) {
        return data.toISOString();
    }

    if (Array.isArray(data)) {
        return data.map(prepareDataForGraphQL);
    }

    if (data instanceof File) {
        return data;
    }

    if (isObject(data)) {
        return Object.entries(data).reduce((acc, [key, value]) => {
            if (key === '__typename') {
                return acc;
            }

            return { ...acc, [key]: prepareDataForGraphQL(value) };
        }, {});
    }

    return data;
};

export default prepareDataForGraphQL;
