import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'dotenv';
import type { DotenvExpandOutput } from 'dotenv-expand';
import { expand } from 'dotenv-expand';

export interface EnvResult {
    combinedEnv: DotenvExpandOutput['parsed'];
    parsedEnv: DotenvExpandOutput['parsed'];
    loadedEnvFiles: { path: string; contents: string }[];
}

const processEnv = (
    cwd: string,
    loadedEnvFiles: EnvResult['loadedEnvFiles'],
    verbose = true,
    baseEnv = process.env
): Pick<EnvResult, 'combinedEnv' | 'parsedEnv'> => {
    const origEnv = { ...baseEnv };
    const parsed: DotenvExpandOutput['parsed'] = {};

    process.env = { ...baseEnv };

    for (const envFile of loadedEnvFiles) {
        try {
            let result: DotenvExpandOutput = {};

            result.parsed = parse(envFile.contents);
            result = expand(result);

            if (result.parsed && verbose) {
                console.info(`Loaded env from ${path.join(cwd, envFile.path)}`);
            }

            for (const key of Object.keys(result.parsed || {})) {
                if (typeof parsed[key] === 'undefined' && typeof origEnv[key] === 'undefined') {
                    const value = result.parsed?.[key];

                    if (value !== undefined) {
                        parsed[key] = value;
                    }
                }
            }
        } catch (error) {
            console.error(`Failed to load env from ${path.join(cwd, envFile.path)}`, error);
        }
    }

    return {
        combinedEnv: Object.assign(process.env, parsed),
        parsedEnv: parsed,
    };
};

const loadEnvironment = (
    cwd: string,
    mode: 'development' | 'production' | 'test',
    verbose = true,
    baseEnv = process.env
): EnvResult => {
    const skipDotEnv = process.env.DOTENV_DISABLE === 'true';
    const isCodespaces = !!process.env.CODESPACES;

    const dotenvFiles = skipDotEnv
        ? []
        : ([
              `.env.${mode}.local`,
              // Don't include `.env.local` for `test` environment
              // since normally you expect tests to produce the same
              // results for everyone
              mode !== 'test' && `.env.local`,
              isCodespaces ? `.env.codespaces.${mode}` : null,
              `.env.${mode}`,
              '.env',
          ].filter(Boolean) as string[]);

    const loadedEnvFiles: EnvResult['loadedEnvFiles'] = [];

    for (const envFile of dotenvFiles) {
        // only load .env if the user provided has an env config file
        const dotEnvPath = path.join(cwd, envFile);

        try {
            const stats = fs.statSync(dotEnvPath);

            // make sure to only attempt to read files
            if (!stats.isFile()) {
                continue;
            }

            const contents = fs.readFileSync(dotEnvPath, 'utf8');
            loadedEnvFiles.push({ path: envFile, contents });
        } catch (error) {
            if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
                console.error(`Failed to load env from ${envFile}`, error);
            }
        }
    }

    return { ...processEnv(cwd, loadedEnvFiles, verbose, baseEnv), loadedEnvFiles };
};

export default loadEnvironment;
