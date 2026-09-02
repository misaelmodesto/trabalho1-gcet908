const express = require('express');
const dotenv = require('dotenv');

const erroMiddleware = require('./middlewares/erro.middleware');

const estudantesRoutes = require('./routes/estudantes.routes');
const turmasRoutes = require('./routes/turmas.routes');
const matriculasRoutes = require('./routes/matriculas.routes');

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        mensagem: 'API de Gestão de Turmas Acadêmicas'
    });
});

app.use('/api/v1/estudantes', estudantesRoutes);
app.use('/api/v1/turmas', turmasRoutes);
app.use('/api/v1/matriculas', matriculasRoutes);


// MEU TESTE
/*app.get('/teste-erro', (req, res, next) => {
    next(new Error('Erro proposital'));
});*/

// Middleware para rotas inexistentes 404
app.use((req, res) => {

    return res.status(404).json({
        erro: {
            codigo: 'ROTA_NAO_ENCONTRADA',
            mensagem: 'A rota solicitada não existe'
        }
    });

});

// Middleware centralizado de erros
app.use(erroMiddleware);


app.listen(port, () => {
    console.log(`Servidor executando na porta ${port}`);
});