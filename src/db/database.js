const config = require('../config');

if (config.database_url === undefined) {
    throw new Error('DATABASE_URL is not set!');
}

let pg = require('knex')({
    client: 'pg',
    connection: config.database_url,
    debug: true
});

const winston = require('winston');
const util = require('util');

module.exports = {
    insertDocument: function (document) {
        return pg(config.table_name).insert(document).returning('id');
    },

    updateDocument: function (document, doc_id) {
        return pg(config.table_name)
            .where('id', '=', parseInt(doc_id))
            .update({
                finishing_time: document.finishing_time,
                has_finished: document.has_finished
            }).then((success, err) => {
                if (err) {
                    winston.error('An error occured while updating', err);
                } else {
                    winston.log('debug', `Successfully updated ${util.inspect(document)}`);
                }
            });
    },

    getRowById: function(doc_id) {
        winston.log('debug', `doc_id: ${doc_id}`);

        return pg(config.table_name)
            .where({ id: doc_id })
            .select('id');
    },

    getRowByField: function(field, value, selectField) {
        const whereClause = {};
        whereClause[field] = value;

        return pg(config.table_name)
            .where(whereClause)
            .select(selectField);
    } 
};