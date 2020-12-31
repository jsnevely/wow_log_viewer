const fs = require('fs');
const path = require('path');
const LOG_PATH = path.join(process.env[`ProgramFiles(x86)`], `World of Warcraft`, `_retail_`, `Logs`, `WoWCombatLog.txt`);
const TailingReadableStream = require('tailing-stream');

async function main() {
    try {
        let len = await checkFile();
        await readFile(len);
    } catch (ex) {
        throw ex;
    }
};

function checkFile() {
    return new Promise((resolve, reject) => {
        fs.stat(LOG_PATH, (err, stats) => {
            if(err) return reject(err);
            getFileLength().then(resolve).catch(reject);
        });
    });
}

function getFileLength() {
    return new Promise((resolve, reject) => {
        fs.readFile(LOG_PATH, 'utf-8', (err, data) => {
            if(err) return reject(err);
            return resolve(data.length);
        });
    });
}

function readFile(len) {
    return new Promise((resolve, reject) => {
        console.log('reading file');
        const stream = TailingReadableStream.createReadStream(LOG_PATH, {timeout: 0, start: len});

        stream.on('data', buffer => {
            console.log(buffer.toString());
        });

        stream.on('close', () => {
            console.log('closed');
            resolve();
        });
    });
}


main().then(() => {
    process.exit(0);
}).catch(() => {
    process.exit(1);
})