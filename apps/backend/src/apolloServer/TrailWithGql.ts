import { Trail } from '@appvantageasia/core-trail';
import type { GraphQLResolveInfo } from 'graphql';

class TrailWithGql extends Trail {
    public graphql(info: GraphQLResolveInfo) {
        return this.setSpec('graphql', {
            operation: info.operation.operation,
            name: info.fieldName,
        });
    }
}

export default TrailWithGql;
