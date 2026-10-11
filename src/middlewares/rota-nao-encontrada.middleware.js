export default function rotaNaoEncontradaMiddleware(req, res) {
    return res.status(404).json({
        erro: {
            codigo: 'ROTA_NAO_ENCONTRADA',
            mensagem: 'A rota solicitada não existe'
        }
    });
}
