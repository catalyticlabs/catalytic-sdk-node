module.exports = {
    env: {
        node: true,
        browser: true,
        es6: true
    },
    extends: ['eslint:recommended', 'plugin:import/errors', 'plugin:import/typescript', 'plugin:prettier/recommended'],
    rules: {
        'no-undef': 2
    }
};
