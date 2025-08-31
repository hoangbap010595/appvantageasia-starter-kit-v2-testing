import { print } from '@appvantageasia/core-node-utils';
import * as Sentry from '@sentry/node';
import type { Document } from 'bson';
import { EJSON } from 'bson';
import type { Job, JobOptions } from 'bull';
import isEmpty from 'lodash/fp/isEmpty.js';
import queue from './queue.js';
import { client, subscriber } from './redis.js';

type SentryTrace = Pick<ReturnType<typeof Sentry.getTraceData>, 'sentry-trace' | 'baggage'>;

export type HandleFunction<T> = (data: T, job: Job<Document>) => Promise<any>;

export const process = <T>(jobName: string, handleFunction: HandleFunction<T>, concurrency = 1) => {
    return queue.process(jobName, concurrency, job => {
        const id = job.opts.repeat ? `repeatable job ${job.opts.repeat.key} (${job.id})` : `job ID ${job.id}`;
        const { __sentryTrace: sentryTraceData, ...data } = EJSON.deserialize(job.data) as T & {
            __sentryTrace?: SentryTrace;
        };

        const execute = async () => {
            print.info(`Processing ${id} from queue ${jobName}`, 'BULL');

            return Sentry.startSpan({ op: 'bull', name: jobName }, async span => {
                span.setAttribute('jobId', job.id);

                return handleFunction(data as T, job)
                    .then(async response => {
                        print.info(`Completed ${id} from queue ${jobName}`, 'BULL');

                        return response;
                    })
                    .catch(async error => {
                        Sentry.withScope(scope => {
                            scope.setExtras({
                                jobId: job.id,
                                data: data ?? null,
                            });

                            Sentry.captureException(error);
                        });

                        console.error(error);
                        print.error(`Failed ${id} from queue ${jobName}`, 'BULL');

                        // throw back the error
                        throw error;
                    });
            });
        };

        if (sentryTraceData) {
            const sentryTrace = sentryTraceData['sentry-trace'];
            const baggage = sentryTraceData.baggage;

            return Sentry.continueTrace({ sentryTrace, baggage }, execute);
        }

        return Sentry.startNewTrace(execute);
    });
};

interface CreateCallResult<T = any> {
    call: (data: T, options?: Omit<JobOptions, 'repeat'>) => Promise<Job<Document>>;
    syncRepeatableJobs: (
        repeatableJobs: {
            jobId: string;
            data: T;
            repeat: JobOptions['repeat'];
            options?: Omit<JobOptions, 'repeat' | 'jobId'>;
        }[]
    ) => Promise<void>;
}

export const createCalls = <T = any>(jobName: string): CreateCallResult<T> => ({
    call: async (data, options) => {
        const traceData = Sentry.getTraceData();
        const job = await queue.add(
            jobName,
            EJSON.serialize({
                ...data,
                __sentryTrace: !isEmpty(isEmpty)
                    ? ({
                          'sentry-trace': traceData['sentry-trace'],
                          baggage: traceData.baggage,
                      } as SentryTrace)
                    : null,
            }),
            { ...options }
        );

        print.info(`Added job ${job.id} to queue ${jobName}`, 'BULL');

        return job;
    },
    syncRepeatableJobs: async repeatableJobs => {
        const activeJobIds: Record<string, string> = {};

        for (const repeatableJob of repeatableJobs) {
            const job = await queue.add(jobName, EJSON.serialize(repeatableJob.data), {
                ...repeatableJob.options,
                jobId: repeatableJob.jobId,
                repeat: repeatableJob.repeat,
            });

            print.info(`Configure repeatable job ${job.opts.repeat!.key} from queue ${jobName}`, 'BULL');

            // track the latest job key
            activeJobIds[repeatableJob.jobId] = job.opts.repeat!.key as string;
        }

        const jobs = await queue.getRepeatableJobs();

        for (const job of jobs) {
            if (job.name === jobName && job.id && activeJobIds[job.id] !== job.key) {
                print.info(`Remove repeatable job ${job.key} from queue ${jobName}`, 'BULL');

                await queue.removeRepeatableByKey(job.key);
            }
        }
    },
});

export const isHealthy = async () => Promise.resolve(client.status === 'ready' && subscriber.status === 'ready');
