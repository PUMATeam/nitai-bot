const PingController = require('./controllers/PingController.js');
const TimeController = require('./controllers/TimeController.js');
const router = require('./bot').router;


router.when(['ping'], new PingController());
router.when(['time'], new TimeController());