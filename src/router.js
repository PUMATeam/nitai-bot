const PingController = require('./controllers/PingController.js');
const router = require('./bot').router;

router.when(['ping'], new PingController());