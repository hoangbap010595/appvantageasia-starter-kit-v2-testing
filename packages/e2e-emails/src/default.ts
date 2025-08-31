import Mailpit from './Mailpit.js';

const mailpit = new Mailpit(
    process.env.MAILPIT_HOSTNAME || 'localhost',
    parseInt(process.env.MAILPIT_PORT || '8025', 10)
);

export default mailpit;
