module.exports = {
    env: {
        node: true,
        browser: true,
        es6: true
    },
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/errors',
        'plugin:import/typescript',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended'
    ],
    plugins: ['@typescript-eslint'],
    rules: {
        'no-undef': 2,
        '@typescript-eslint/explicit-function-return-type': 2,
        '@typescript-eslint/no-unused-vars': 2
    }
};
