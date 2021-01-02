class LogEntry{
    constructor(_str) {
        const DATE_SPLIT = _str.indexOf('  ');
        let _data = _str.substring(DATE_SPLIT + 2).replace(/"/g, '').split(',');
        this.data = _data;
        this.type = this.data[0];
        this.damage = this.type.indexOf('_DAMAGE') > 0;
    }
};

module.exports = LogEntry;