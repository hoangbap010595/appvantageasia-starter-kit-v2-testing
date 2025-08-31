export const getRecordTime = () => ({
    startAt: process.hrtime(),
    startTime: new Date(),
});

export type RecordTime = ReturnType<typeof getRecordTime>;

export const getTimeElapsed = (start: RecordTime, end: RecordTime = getRecordTime()) => {
    // calculate diff
    const ms = (end.startAt[0] - start.startAt[0]) * 1e3 + (end.startAt[1] - start.startAt[1]) * 1e-6;

    // return truncated value
    return ms.toFixed(3);
};
