import loadSnapshots from '@appvantageasia/e2e-snapshots';

let currentSnapshots: Awaited<ReturnType<typeof loadSnapshots>> | null = null;

export const getCurrentSnapshots = () => {
    if (!currentSnapshots) {
        throw new Error('Snapshots not loaded');
    }

    return currentSnapshots;
};

const task = async (snapshotNames: string[]) =>
    loadSnapshots(...snapshotNames).then(snapshots => {
        currentSnapshots = snapshots;

        return null;
    });

export default task;
