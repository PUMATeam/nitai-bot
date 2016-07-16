const config = require('../config');
let pg = require('knex')({
    client: 'pg',
    connection: config.database_url,
    debug: true
});

const winston = require('winston');
const util = require('util');

module.exports = {
    insertDocument : function(document) {
        return pg(config.table_name).insert(document).returning('id');
    }
};