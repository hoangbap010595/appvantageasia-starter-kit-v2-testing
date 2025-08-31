import { join } from 'node:path';

export const cwd = process.cwd();
export const consoleBuildPathname = join(cwd, 'apps/console/build');
export const backendBuildPath = join(cwd, 'apps/backend/build');
