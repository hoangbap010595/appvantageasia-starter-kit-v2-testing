import { EJSON } from 'bson';
import type { GenericObject } from 'moleculer';
import { Serializers } from 'moleculer';

class EJSONSerializer extends Serializers.Base {
    serialize(obj: GenericObject): Buffer {
        return Buffer.from(JSON.stringify(EJSON.serialize(obj)));
    }

    deserialize(buf: Buffer): GenericObject {
        return EJSON.deserialize(JSON.parse(buf.toString()));
    }
}

export default EJSONSerializer;
