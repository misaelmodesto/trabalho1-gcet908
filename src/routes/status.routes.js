import express from 'express';

export default function criarRotasStatus({ controller }) {
    const router = express.Router();

    router.get('/', controller.index.bind(controller));

    return router;
}
