const fs = require('fs');
const {Tail} = require('tail');
const path = require('path');
const LOG_PATH = path.join(process.env[`ProgramFiles(x86)`], `World of Warcraft`, `_retail_`, `Logs`, `sample.txt`);

async function main() {
    try {
        if(await checkFile()) {
            await readFile();
        }
    } catch (ex) {
        throw ex;
    }
};

function checkFile() {
    return new Promise((resolve, reject) => {
        fs.stat(LOG_PATH, (err, stats) => {
            if(err) return reject(err);
            return resolve(true);
        });
    });
}

function readFile() {
    return new Promise((resolve, reject) => {
        console.log('reading file');
        let log = new Tail(LOG_PATH, { fromBeginning: false, follow: true, flushAtEOF: false, logger: console, useWatchFile:false});
        log.on('line', data => {
            console.log(data);
            let x = data;
        });
        log.on('error', reject);
    });
}


main().then(() => {
    process.exit(0);
}).catch(() => {
    process.exit(1);
})