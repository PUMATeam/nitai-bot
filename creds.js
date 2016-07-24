let api = {};
api.key = process.env.TELEGRAM_KEY;
api.tw_consumer = process.env.TW_CONS;
api.tw_consumer_secret = process.env.TW_CONS_SEC;
api.tw_access = process.env.TW_ACC;
api.tw_acc_secret = process.env.TW_ACC_SEC;
api.github_token = process.env.GITHUB_API;

module.exports = api;
