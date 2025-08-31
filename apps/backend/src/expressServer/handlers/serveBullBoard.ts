import serverAdapter from '../../bullJobs/board.js';

serverAdapter.setBasePath('/.bullBoard');

export default serverAdapter.getRouter();
