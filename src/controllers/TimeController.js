const Telegram = require('telegram-node-bot');
const NitaiBaseController = require('./NitaiBaseController.js');
const winston = require('winston');
const moment = require('moment');
const util = require('util');
const database = require('../db/database');

class TimeController extends NitaiBaseController {

    // TODO: extract stuff to a method
    constructor() {
        super();
        database.getRowByField('has_finished', false, ['id', 'has_finished', 'starting_time']).then((value) => {
            winston.log('debug', `return value: ${util.inspect(value)}`);
            if (value.length > 0) {
                let returnedObject = value[value.length - 1];
                this.started = !returnedObject.has_finished;

                if (this.started) {
                    this.lastId = returnedObject.id;
                    this.startingTime = returnedObject.starting_time;
                }
            }
        }).catch((err) => {
            winston.error('Something bad has happened while trying to query the database', err);
        });
    }

    handleTime($) {
        let command = $.query.command;
        let date = $._update.message.date;
        let username = $._update.message._from._username
        this.currentDocument = {};
        this.started = this.started || $.chatSession.food_started;
        this.lastId = this.lastId || $.chatSession.lastId;

        switch (command) {
            case 'started': this.logStartingTime($, date, username);
                break;
            case 'finished': this.logFinishingTime($, date, username);
                break;
        }
    }

    logStartingTime($, date, username) {
        if (this.started) {
            $.sendMessage(`@${username}, Nitai has already started eating`);
        } else {
            let startingTime = moment.unix(date).format('HH:mm:ss');

            winston.log('info', `Started: logged at ${startingTime} by ${username}`);

            $.sendMessage(`Nitai has started eating at ${startingTime}. Logged by ${username}`);

            this.currentDocument.starting_time = this.startingTime = date;
            this.currentDocument.user_id = username;

            database.insertDocument(this.currentDocument).then((id) => {
                this.lastId = $.chatSession.lastId = id;
            }).catch((err) => {
                winston.error('Something bad has happened while trying to log time', err);
            });

            this.started = $.chatSession.food_started = true;
        }
    }

    logFinishingTime($, date, username) {
        if (!this.started) {
            $.sendMessage(`@${username}, Nitai has not started eating yet`)
        } else {
            let finishingTime = moment.unix(date).format('HH:mm:ss');

            winston.log('info', `Finished: logged at ${finishingTime} by ${username}`);
            $.sendMessage(`Nitai has finished eating at ${finishingTime}. Logged by ${username}`);

            database.getRowById(parseInt(this.lastId)).then((result) => {
                console.log(result[0]);
                this.currentDocument = result[0];
                this.currentDocument.finishing_time = date;
                this.currentDocument.has_finished = true;
                database.updateDocument(this.currentDocument, this.lastId);
                this.started = $.chatSession.food_started = false;
                this.sendSummary($, this.currentDocument);
            }).catch((err) => {
                winston.error(`Getting row failed: ${err}`);
            });

        }
    }

    // TODO: extract time difference to a utility method
    sendSummary($, document) {
        winston.log('debug', `Summary document: ${util.inspect(document)}`);
        let start = moment.unix(document.starting_time);
        let end = moment.unix(document.finishing_time);

        winston.log('debug', `Starting time: ${start.format('HH:mm:ss')} Finishing time: ${end.format('HH:mm:ss')}`);

        let difference = end.diff(start);
        let duration = moment.duration(difference, 'minutes').humanize();
        $.sendMessage(`It took me ${duration} to eat!`);
    }

    get routes() {
        return {
            '/time :command': 'handleTime'
        }
    }
}

module.exports = TimeController;