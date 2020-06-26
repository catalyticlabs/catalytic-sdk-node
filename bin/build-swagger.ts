/* eslint-disable @typescript-eslint/no-use-before-define */

import _ from 'lodash';
import axios from 'axios';
import Bluebird from 'bluebird';
import { exec } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { BaseUri as BASE_URI } from '../src/constants';
const SWAGGER_URL = `${BASE_URI}/swagger/v1/swagger.json`;

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

function getSwagger(swaggerUrl): Bluebird<any> {
    return Bluebird.resolve(axios.get(swaggerUrl).then(response => response.data));
}

function autorest(swaggerPath: string): Bluebird<string> {
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

function clean(obj: any): any {
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