const config = require('../config');
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
                ending_time: document.ending_time
            }).then((success, err) => {
                if (err) {
                    winston.error('An error occured while updating', err);
                } else {
                    winston.log('debug', `Successfuly updated ${util.inspect(document)}`);
                }
            });
    },

    getRowById: function(doc_id) {
        return pg(config.table_name)
            .where({id: doc_id})
            .select('id');
    }
};