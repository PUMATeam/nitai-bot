const PingController = require('./controllers/PingController');
const TimeController = require('./controllers/TimeController');
const PicController = require('./controllers/PicController.js');

const router = require('./bot').router;
const winston = require('winston');

router.when(['ping'], new PingController());
router.when('/time :command', new TimeController())
      .otherwise(new PicController());
