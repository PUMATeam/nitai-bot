const NitaiBaseController = require('./NitaiBaseController');
const Github = require('github'); 
const {repoName, userName} = require('../config');
const util = require('util');
const winston = require('winston');

class GithubController extends NitaiBaseController {
    constructor() {
        super();
        this.github = new Github({
            debug: true,
            protocol: 'https',
            host: 'api.github.com',
            pathPrefix: '',
            Promise: require('bluebird'),
            followRedirects: 'false',
            timeout: 5000
        });
    }

    handle($) {
        $.sendMessage('I have the following issues (please help me resolve them ): )  ');
        let message = '';

        this.getIssues(repoName, userName).then((issues) => {
            winston.log('debug', `${util.inspect(issues)}`);

            issues.forEach((issue) => {
                let asignee = 
                message += `#${issue['number']} ${issue['title']} - Opened by ${issue['user']['login']}\n`;
            });

            $.sendMessage(message);
        });

    }

    getIssues(repo, user) {
       return this.github.issues.getForRepo({
            'repo': repo,
            'user': user,
            'state': 'open'
        });
    }

    get routes() {
        return {
          '/issues' : 'handle'  
        }  
    }
}

module.exports = GithubController;