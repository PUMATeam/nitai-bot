const Telegram  = require('telegram-node-bot');
const NitaiBaseController = require('./NitaiBaseController.js');
const winston = require('winston');
const moment = require('moment');
const util = require('util');
const database = require('../db/database');

class TimeController extends NitaiBaseController {
    
    constructor() {
        super();
        this.started = false;
    }

    handleTime($) {
        let command = $.query.command;
        let date = $._update.message.date;
        let username = $._update.message._from._username
        this.currentDocument = {};
        this.started = $.chatSession.food_started || false;

        switch (command) {
            case 'started': this.logStartingTime($, date, username);
                break;
            case 'finished': this.logFinishingTime($, date, username);
                break;
        }
    }



    logStartingTime($, date, username)  {
        if (this.started) {
            $.sendMessage(`@${username}, Nitai has already started eating`);
        } else {
            let startingTime = moment.unix(date).format('HH:mm:ss');

            winston.log('info', `Started: logged at ${startingTime} by ${username}`);
        
            $.sendMessage(`Nitai has started eating at ${startingTime}. Logged by ${username}`);

            this.currentDocument.starting_time = date;
            this.currentDocument.user_id = username;
            
            database.insertDocument(this.currentDocument).then((id) => {
                $.chatSession.lastId = id;
            });
            this.started = $.chatSession.food_started = true;   
     }
    } 

    logFinishingTime($, date, username) {
        if (!this.started) {
            $.sendMessage(`@${username}, Nitai has not started eating yet`)
        } else {
            let endingTime = moment.unix(date).format('HH:mm:ss');

            winston.log('info', `Finished: logged at ${endingTime} by ${username}`);
            $.sendMessage(`Nitai has finished eating at ${endingTime}. Logged by ${username}`);
            
            database.getRowById($.chatSession.lastId).then((result) => {
                this.currentDocument = result;
            }).catch((err) => {
                winston.error(`Getting row failed: ${err}`);
            });

            this.currentDocument.ending_time = date;
            winston.log('info', `Last food_log id  ${$.chatSession.lastId}`);

            database.updateDocument(this.currentDocument, $.chatSession.lastId);
            this.started = $.chatSession.food_started = false;
            this.sendSummary($, this.currentDocument);
        }
    }

    // TODO: extract time difference to a utility method
    sendSummary($, document) {
        let start = moment.unix(document.starting_time);
        let end = moment.unix(document.ending_time);
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