const PingController = require('./controllers/PingController');
const TimeController = require('./controllers/TimeController');

const router = require('./bot').router;
const winston = require('winston');

router.when(['ping'], new PingController());
router.when('/time :command', new TimeController());