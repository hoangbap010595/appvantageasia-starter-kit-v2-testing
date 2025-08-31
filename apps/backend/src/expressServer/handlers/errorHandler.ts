import type { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (error, request, response) => {
    // print it for logs
    console.error(error);
    // answer as 500 response
    response.status(500).send('Internal error');
};

export default errorHandler;
