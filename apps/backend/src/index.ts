import 'source-map-support/register.js';
import { Command } from 'commander';

const program = new Command();

program.command('worker').action(async () => {
    const { startWorker } = await import('./commands.js');
    await startWorker();
});

program.command('api').action(async () => {
    const { startApi } = await import('./commands.js');
    await startApi();
});

program.command('broker').action(async () => {
    const { startBroker } = await import('./commands.js');
    await startBroker();
});

program.command('migrate').action(async () => {
    const { runMigrations } = await import('./commands.js');
    await runMigrations();
});

program.command('standalone').action(async () => {
    const { startAll } = await import('./commands.js');
    await startAll();
});

program.command('createUser').action(async () => {
    const { createUser } = await import('./commands.js');
    await createUser();
});

program.command('dumpDatabase').action(async () => {
    const { dumpDatabase } = await import('./commands.js');
    await dumpDatabase();
});

program.parse();

export default program;
