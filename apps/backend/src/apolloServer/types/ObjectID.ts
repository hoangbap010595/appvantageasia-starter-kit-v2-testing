import { regexp } from '@appvantageasia/core-node-utils';
import { Kind, GraphQLError, GraphQLScalarType } from 'graphql';
import { ObjectId } from 'mongodb';

const ObjectID = new GraphQLScalarType<ObjectId, string>({
    name: 'ObjectID',

    description:
        'A field whose value conforms with the standard mongodb object ID as described here: ' +
        'https://docs.mongodb.com/manual/reference/method/ObjectId/#ObjectId. Example: 5e5677d71bdc2ae76344968c',

    serialize(value) {
        if (value instanceof ObjectId) {
            return value.toString();
        }

        if (typeof value !== 'string' || !regexp.objectId.test(value)) {
            throw new TypeError(`Value is not a valid mongodb object id of form: ${value}`);
        }

        return value;
    },

    parseValue(value) {
        if (typeof value !== 'string' || !regexp.objectId.test(value)) {
            throw new TypeError(`Value is not a valid mongodb object id of form: ${value}`);
        }

        return new ObjectId(value);
    },

    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw new GraphQLError(`Can only validate strings as mongodb object id but got a: ${ast.kind}`);
        }

        if (!regexp.objectId.test(ast.value)) {
            throw new TypeError(`Value is not a valid mongodb object id of form: ${ast.value}`);
        }

        return new ObjectId(ast.value);
    },
});

export default ObjectID;
