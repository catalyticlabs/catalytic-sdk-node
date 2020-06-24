import axios from 'axios';
import fs from 'fs';
import { join, parse } from 'path';

async function pullContent(filename: string): Promise<string> {
    try {
        const response = await axios.get(`https://dash.readme.io/api/v1/docs/${filename}`, {
            headers: { authorization: process.env.READMEIO_AUTH }
        });
        return response.data.body;
    } catch (err) {
        console.log(filename);
        // console.error(err);
    }
}

function getDocs(path?: string): string[] {
    if (!path) {
        path = __dirname;
    }
    const files = [];

    fs.readdirSync(path).forEach(file => {
        if (file.endsWith('.md')) {
            files.push(join(path, file));
        } else if (!file.includes('.')) {
            files.push(...getDocs(join(path, file)));
        }
    });

    return files;
}

const docs = getDocs();
// const docs = [join(__dirname, 'catalytic-sdk-node.md')];

docs.forEach(async filepath => {
    const file = parse(filepath);
    const filename = file.name;
    const content = await pullContent(filename);

    if (content) {
        fs.writeFileSync(filepath, content);
    }
});

// docs.slice(0, 5).forEach(d => pullContent(d));
