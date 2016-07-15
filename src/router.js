const PingController = require('./controllers/PingController.js');
const PicController = require('./controllers/PicController.js');
const router = require('./bot').router;

router.when(['ping'], new PingController())
      .otherwise(new PicController());
