const _ = require('lodash');
const axios = require('axios');
const Bluebird = require('bluebird');
const exec = require('child_process').exec;
const fs = require('fs');
const os = require('os');
const path = require('path');

const SWAGGER_URL = 'https://sdk.catalytic.com/v1.0.1-pre-33/swagger/v1/swagger.json';

getSwagger(SWAGGER_URL)
    .then(swagger => {
        return Bluebird.fromCallback(callback => fs.mkdtemp(path.join(os.tmpdir(), 'foo-'), callback)).then(folder => {
            const swaggerPath = path.join(folder, 'swagger.json');
            const cleanSwagger = clean(swagger);
            fs.writeFileSync(swaggerPath, JSON.stringify(cleanSwagger, null, 2));
            return autorest(swaggerPath);
        });
    })
    .tap(() => console.log('done'))
    .catch(err => console.error(err));

function getSwagger(swaggerUrl) {
    return Bluebird.resolve(axios.get(swaggerUrl).then(response => response.data));
}

function autorest(swaggerPath) {
    return Bluebird.fromCallback(callback => {
        exec(
            `npm run autorest -- README.md --input-file="${swaggerPath}"`,
            {
                maxBuffer: 10000 * 1024
            },
            (error, stdout, stderr) => {
                if (error) {
                    return callback(error);
                }
                if (stderr) {
                    return callback(stderr);
                }
                console.log(stdout);
                return callback(null, stdout);
            }
        );
    });
}

function clean(obj) {
    return _.transform(
        obj,
        (result, value, key) => {
            if (key === 'additionalProperties' && value == false) {
                return result;
            }
            if (!Array.isArray(value) && typeof value == 'object') {
                result[key] = clean(value);
            } else {
                result[key] = value;
            }
            return result;
        },
        {}
    );
}
