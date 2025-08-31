import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import v8 from 'node:v8';
import { print } from '@appvantageasia/core-node-utils';
import type { RequestHandler } from 'express';

const serveCoverage: RequestHandler = async (req, res, next) => {
    try {
        // NODE_V8_COVERAGE refers to the temporary directory where the coverage report is written
        // we need to read the final report from the parent directory
        const coverageReport = path.resolve(process.env.NODE_V8_COVERAGE!, '../coverage-final.json');

        print.warn(`coverage report will be read from ${coverageReport}`);

        // write coverage report on disk
        v8.takeCoverage();

        // then get the latest coverage report
        await new Promise<void>(resolve => {
            const childProcess = spawn('yarn', ['c8', 'report']);
            childProcess.on('close', resolve);
        });

        // read the report
        const coverage = await fs.readFile(coverageReport, 'utf8').then(content => JSON.parse(content));

        // send the report
        res.json({ coverage });
    } catch (error) {
        next(error);
    }
};

export default serveCoverage;
