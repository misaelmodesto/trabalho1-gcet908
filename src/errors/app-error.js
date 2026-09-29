export class AppError extends Error {
    constructor(mensagem, status = 500, codigo = 'ERRO_INTERNO') {
        super(mensagem);
        this.name = 'AppError';
        this.status = status;
        this.codigo = codigo;
    }
}
