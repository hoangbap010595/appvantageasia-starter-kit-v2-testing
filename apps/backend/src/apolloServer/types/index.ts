import Upload from 'graphql-upload/GraphQLUpload.mjs';
import type { GqlResolvers } from '../resolver-types.js';
import DateTime from './DateTime.js';
import MSALConfiguration from './MSALConfiguration.js';
import OIDCConfiguration from './OIDCConfiguration.js';
import ObjectID from './ObjectID.js';
import SSOConfiguration from './SSOConfiguration.js';
import Tenant from './Tenant.js';
import TenantMembership from './TenantMembership.js';
import UploadedFile from './UploadedFile.js';
import User from './User.js';
import UserSession from './UserSession.js';

const resolvers: GqlResolvers = {
    DateTime,
    Upload,
    ObjectID,
    User,
    UserSession,
    UploadedFile,
    SSOConfiguration,
    MSALConfiguration,
    OIDCConfiguration,
    Tenant,
    TenantMembership,
};

export default resolvers;
