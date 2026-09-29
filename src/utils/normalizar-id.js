import { AppError } from '../errors/app-error.js';

export function normalizarId(valor) {
    const id = Number.parseInt(valor, 10);

    if (!Number.isInteger(id) || id < 1) {
        throw new AppError(
            'O ID informado deve ser um número inteiro maior que zero',
            400,
            'ID_INVALIDO'
        );
    }

    return id;
}
