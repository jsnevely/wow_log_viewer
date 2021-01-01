const fs = require('fs');
const path = require('path');
const LOG_PATH = path.join(process.env[`ProgramFiles(x86)`], `World of Warcraft`, `_retail_`, `Logs`, `WoWCombatLog.txt`);
const TailingReadableStream = require('tailing-stream');
const LogEntry = require('./LogEntry');
let entries = [];

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
            // return resolve(JSON.stringify(data.toString()).length - 1);
        });
    });
}

function readFile(len) {
    return new Promise((resolve, reject) => {
        let initial_read = true;
        console.log('reading file');
        const stream = TailingReadableStream.createReadStream(LOG_PATH, {timeout: 0, start: 0});

        stream.on('data', buffer => {
            let data = buffer.toString()
            if(initial_read) {
                data = data.split('\r\n');
                entries = data.map(e => new LogEntry(e));
                initial_read = false;
            } else {
                let entry = new LogEntry(data);
                if(entry) {
                    console.log(entry);
                    entries.push(entry);
                }
            }
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