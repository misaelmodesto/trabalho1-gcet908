import js from '@eslint/js';
import globals from 'globals';

export default [
    {
        ignores: [
            'generated/**',
            'node_modules/**',
            'prisma/migrations/**',
            'coverage/**'
        ]
    },
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: globals.node
        },
        rules: {
            'no-console': 'off',
            'no-unused-vars': ['error', { args: 'none' }]
        }
    }
];
