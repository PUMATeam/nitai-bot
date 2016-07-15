const massive = require('massive');
const winston = require('winston');
const util = require('util');

class Database {
    constructor(url, table) {
        this.table = table;
        this.db = massive.connectSync({connectionString: url });
        winston.log('info', 'Successfully connected');
    }

    saveDocument(document) {
        winston.log('info', `Saving document...`);
        this.db[this.table].save(document, (err, result) => {
            if (err) winston.log('error', `An error occurred while trying to save a document: ${err}`);
            return result;
        });
    }
}

module.exports = Database;