import { createServer } from 'http';
import express from 'express';

export const expressServer = express();

export const httpServer = createServer(expressServer);
