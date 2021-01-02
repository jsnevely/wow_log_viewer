const fs = require('fs');
const path = require('path');
const LOG_PATH = path.join(process.env[`ProgramFiles(x86)`], `World of Warcraft`, `_retail_`, `Logs`, `WoWCombatLog.txt`);
const TailingReadableStream = require('tailing-stream');
const LogEntry = require('./LogEntry');
const LineByLine = require('n-readlines');

let entries = [];

async function main() {
    try {
        let len = await checkFile();
        initializeFile();
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
            return resolve(Buffer.byteLength(data, 'utf-8'));
        });
    });
}

function initializeFile() {
        let file_length = 0;
        const liner = new LineByLine(LOG_PATH);

        let line;
        let line_number = 0;
        
        while(line = liner.next()) {
            let data = line.toString('ascii');
            file_length += data.length;
            line_number++;
            entries.push(new LogEntry(data));
        }

        console.log(`file_length: ${file_length}, lines: ${line_number}`);
        return file_length;
}

function readFile(len) {
    return new Promise((resolve, reject) => {
        console.log('reading file');
        const stream = TailingReadableStream.createReadStream(LOG_PATH, {timeout: 0, start: len});

        stream.on('data', buffer => {
            let data = buffer.toString();
            data = data.split('\r\n').filter(a => a.length > 0);
            for(let d of data) {
                let e = new LogEntry(d);
                console.log(e);
                entries.push(e)
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
}).catch((ex) => {
    throw ex;
})