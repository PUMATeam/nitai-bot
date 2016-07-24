const PingController = require('./controllers/PingController');
const TimeController = require('./controllers/TimeController');
const PicController = require('./controllers/PicController.js');
const GithubController = require('./controllers/GithubController.js');

const router = require('./bot').router;
const winston = require('winston');

router.when(['ping'], new PingController())
      .when('/time :command', new TimeController())
      .when('/issues', new GithubController())
      .otherwise(new PicController());
