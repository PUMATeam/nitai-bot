const massive = require('massive');
const winston = require('winston')

class Database {
    constructor(url, table) {
        this.table = table;
        this.db = massive.connect({connectionString: this.url }, (err, db) => {
                if (err) winston.log('error', `An error occurred while trying to connect to the database: ${err}`);
                return db;
        });
    }

    saveDocument(document) {
        db.saveDocument(this.table, document, (err, result) => {
            if (err) winston.log('error', `An error occurred while trying to save a document: ${err}`);
            return result;
        });
    }
}

module.exports = Database;