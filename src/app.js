const express = require('express');
const dotenv = require('dotenv');

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

app.listen(port, () => {
    console.log(`Servidor executando na porta ${port}`);
});