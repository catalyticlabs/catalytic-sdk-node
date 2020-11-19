/* eslint-disable no-console */
import { transform, Dictionary } from 'lodash';
import axios from 'axios';
import Bluebird from 'bluebird';
import { exec } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { BaseUri as BASE_URI } from '../src/constants';
const SWAGGER_URL = `${BASE_URI}/swagger/v1/swagger.json`;
getSwagger(SWAGGER_URL)
    .then((swagger: Dictionary<object>) => {
        swagger.servers[0].url = BASE_URI;
        return Bluebird.fromCallback(callback => fs.mkdtemp(path.join(os.tmpdir(), 'foo-'), callback)).then(
            (folder: string) => {
                const swaggerPath = path.join(folder, 'swagger.json');
                const cleanSwagger = clean(swagger);
                fs.writeFileSync(swaggerPath, JSON.stringify(cleanSwagger, null, 2));
                return autorest(swaggerPath);
            }
        );
    })
    .tap(() => console.log('done'))
    .catch(err => console.error(err));

function getSwagger(swaggerUrl): Bluebird<object> {
    if (process.env.SWAGGER_FILE) {
        return Bluebird.resolve(JSON.parse(fs.readFileSync(process.env.SWAGGER_FILE).toString()));
    }
    return Bluebird.resolve(axios.get(swaggerUrl).then(response => response.data));
}

function autorest(swaggerPath: string): Bluebird<string> {
    return Bluebird.fromCallback(callback => {
        exec(
            // Pinned to specific version due to regression bug https://github.com/Azure/autorest/issues/3441#issuecomment-730558073
            `npm run autorest -- autorest.yaml --input-file="${swaggerPath}" --version:3.0.6130`,
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

function clean(obj: Dictionary<object>): object {
    return transform(
        obj,
        (result, value, key) => {
            if (key === 'additionalProperties' && !value) {
                return result;
            }
            if (!Array.isArray(value) && typeof value == 'object') {
                result[key] = clean(value as Dictionary<object>);
            } else {
                result[key] = value;
            }
            return result;
        },
        {}
    );
}
