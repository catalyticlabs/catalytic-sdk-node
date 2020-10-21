/* eslint-disable no-console */
import axios from 'axios';
import Bluebird from 'bluebird';
import fs from 'fs';
import { join, parse } from 'path';

function listLocalDocs(includedDocs?: string[], path?: string): string[] {
    if (!path) {
        path = join(__dirname, '../docs');
    }
    const files = [];

    fs.readdirSync(path).forEach(file => {
        if (file.endsWith('.md')) {
            files.push(join(path, file));
        } else if (!file.includes('.')) {
            files.push(...listLocalDocs(includedDocs, join(path, file)));
        }
    });

    if (!includedDocs || !includedDocs.length) {
        return files;
    }

    return files.filter(f => includedDocs.includes(parse(f).name));
}

async function pullContent(filename: string): Promise<string> {
    try {
        const response = await axios.get(`https://dash.readme.io/api/v1/docs/${filename}`, {
            headers: { authorization: process.env.READMEIO_AUTH }
        });
        return response.data.body;
    } catch (err) {
        console.log(filename);
        console.error(err.response.data);
    }
}

async function pullAllDocs(args): Promise<void[]> {
    const docs = listLocalDocs(args);
    return Bluebird.map(
        docs,
        async filepath => {
            const file = parse(filepath);
            const filename = file.name;
            const content = await pullContent(filename);
            const local = fs.readFileSync(filepath).toString();

            if (content.trim() !== local.trim()) {
                fs.writeFileSync(filepath, content);
                console.log('🔄', filename);
            } else {
                console.log('✅', filename);
            }
        },
        { concurrency: 5 }
    );
}

async function pushContent(filename: string, body: object): Promise<string> {
    try {
        const response = await axios.put(`https://dash.readme.io/api/v1/docs/${filename}`, body, {
            headers: { authorization: process.env.READMEIO_AUTH }
        });
        return response.data.body;
    } catch (err) {
        console.log(filename);
        console.error(err.response.data);
    }
}

async function pushAllDocs(args): Promise<void[]> {
    const docs = listLocalDocs(args);
    return Bluebird.map(
        docs,
        async filepath => {
            const file = parse(filepath);
            const filename = file.name;
            const body = fs
                .readFileSync(filepath)
                .toString()
                .trim();
            await pushContent(filename, { body });
            console.log('⬆️', filename);
        },
        { concurrency: 5 }
    );
}

async function identifyDifferingDocs(args): Promise<void[]> {
    const docs = listLocalDocs(args);
    return Bluebird.map(docs, async filepath => {
        const file = parse(filepath);
        const filename = file.name;
        const content = await pullContent(filename);

        const local = fs.readFileSync(filepath).toString();
        console.log(content.trim() === local.trim() ? '✅' : '❌', filename);
    });
}

const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
    case 'compare':
        identifyDifferingDocs(args);
        break;
    case 'pull':
        pullAllDocs(args);
        break;
    case 'push':
        pushAllDocs(args);
        break;
    default:
        throw new Error(`Unidentified Command ${command}`);
}
