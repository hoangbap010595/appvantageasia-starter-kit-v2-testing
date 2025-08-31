import os from 'node:os';

// provide an unique ID for the instance running which will be unique in a kubernetes cluster
const nodeId = `${os.hostname().toLowerCase()}-${process.pid}`;

export default nodeId;
