class LogEntry{
    constructor(_str) {
        _str = _str.split('\r\n').filter(a => a.length > 0);
        if(_str.length) {
            _str = _str[0];
            const DATE_SPLIT = _str.indexOf('  ');
            this.date = new Date(_str.substring(0, DATE_SPLIT));
            let _data = _str.substring(DATE_SPLIT + 2).replace(/"/g, '').split(',');
            this.data = _data
        }
    }
};

module.exports = LogEntry;