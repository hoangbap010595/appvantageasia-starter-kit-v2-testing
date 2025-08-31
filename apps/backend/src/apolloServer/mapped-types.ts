import type { MSALConfig, OIDCConfig } from '@appvantageasia/core-auth';
import type { Loaders } from '@appvantageasia/core-dataloaders';
import type { TenantMembership, TenantDocument } from '@appvantageasia/core-tenants';
import type { UserDocument, UserSession } from '@appvantageasia/core-users';
import type { Request, Response } from 'express';
import type { FileUpload } from 'graphql-upload/processRequest.mjs';
import type { LazyUserAbility } from '../abilities/createLazyUserAbility.js';
export type { UserDocument, UserSession } from '@appvantageasia/core-users';

export type { UploadedFileDocument } from '@appvantageasia/core-storage';

export type Upload = FileUpload;

export interface Context {
    user: UserDocument | null;
    session: UserSession | null;
    getAbilities: LazyUserAbility;
    userAgent?: string;
    dataLoader: Loaders;
    hostname: string;
    ip: string | null;
    http?: { req: Request; res: Response };
}

export type MSALConfiguration = MSALConfig & { __type: 'MSALConfiguration' };

export type OIDCConfiguration = OIDCConfig & { __type: 'OIDCConfiguration' };

export type SSOConfiguration = MSALConfiguration | OIDCConfiguration;

export type ExtendedTenantMembership = TenantMembership & { tenant: TenantDocument };

export type { TenantDocument } from '@appvantageasia/core-tenants';
