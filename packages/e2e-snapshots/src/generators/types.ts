export interface Snapshot {
    execute: () => Promise<unknown>;
    dependencies?: string[];
}
