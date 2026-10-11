export class StatusController {
    index(req, res) {
        return res.status(200).json({
            mensagem: 'API de Gestão de Turmas Acadêmicas'
        });
    }
}
