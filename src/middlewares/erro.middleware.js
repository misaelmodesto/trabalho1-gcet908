function erroMiddleware(err, req, res, next) {

    const status = err.status || 500;

    const codigo = err.codigo || 'ERRO_INTERNO';

    const mensagem =
        status === 500
            ? 'Ocorreu um erro interno no servidor'
            : err.message;

    return res.status(status).json({
        erro: {
            codigo,
            mensagem
        }
    });
}

module.exports = erroMiddleware;