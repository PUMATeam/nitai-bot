const massive = require('massive');
const winston = require('winston');
const util = require('util');

class Database {
    constructor(url, table) {
        this.table = table;
        this.db = massive.connectSync({ connectionString: url });
        winston.log('info', 'Successfully connected');
    }

    saveDocument(document) {
        winston.log('info', `Saving document... ${util.inspect(document)}`);
        return new Promise((resolve, reject) => {
            this.db[this.table].save(document, (err, res) => {
                if (err) {
                    winston.log('error', `An error occurred while trying to save a document: ${err}`);
                    reject(err);
                }

                resolve(res);
            });
        });
    }

    getRowById(id) {
        return new Promise((resolve, reject) => {
            this.db[this.table].findOne({ id: id }, (err, result) => {
                if (err) {
                    winston.log('error', `An error occurred while trying to query: ${err}`);  
                    reject(err);
                }

                 resolve(result);
            });
        });
    }
}


module.exports = Database;