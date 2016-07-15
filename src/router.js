const PingController = require('./controllers/PingController');
const TimeController = require('./controllers/TimeController');
const Database = require('./db/database');

const config = require('./config')
const router = require('./bot').router;

database = new Database(config.database_url, config.table_name);

router.when(['ping'], new PingController());
router.when('/time :command', new TimeController(database));