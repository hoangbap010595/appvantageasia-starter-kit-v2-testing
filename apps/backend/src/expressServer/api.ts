import { Router } from 'express';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import downloadAuditTrail from './downloadAuditTrail.js';
import serveApolloServer from './handlers/serveApolloServer.js';
import passKeyAuth from './passKeyAuth.js';

const router = Router();

// graphqlUploadExpress is a middleware that processes multipart/form-data requests
// and adds the files to req.files
// and adds the non-file multipart fields to req.body
router.use('/graphql', graphqlUploadExpress(), serveApolloServer);

// WebAuthn API
router.use('/webauthn', passKeyAuth);

// audit trail API
router.post('/trails/download', downloadAuditTrail);

router.use('*', (req, res) => {
    // same as what we do with public asset
    // avoid going to the entry point rendering for routes which does not exist on the /api
    res.send(404);
});

export default router;
