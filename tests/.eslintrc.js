// eslint-disable-next-line @typescript-eslint/no-var-requires
const base = require('../.eslintrc.js');

module.exports = {
    ...base,
    rules: {
        ...base.rules,
        '@typescript-eslint/no-explicit-any': 0
    }
};
