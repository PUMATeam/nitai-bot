var twitterAPI = require('node-twitter-api');

var twitter = function (creds){
    this.creds = creds;
    this.handler = new twitterAPI({
                consumerKey: creds.tw_consumer,
                consumerSecret: creds.tw_consumer_secret,
                callback: 'stam'          
            });
}

var sendTweet = function(params, client, callback) {
    client.handler.statuses("update", 
    params,
    client.creds.tw_access,
    client.creds.tw_acc_secret,
        function(error, data, response) {
            if (error) {
                console.log('creds suck'); 
            } else {
                var link = "https://twitter.com/nitai_lunch_bot/status/" + data.id_str;
                console.log(link);
                console.log("creds ok"); 
                return callback(link);
            }
        }
    );
}

var uploadMedia = function(image_path, client, callback){
    var send = { "media": image_path };
                console.log(send);
    
    client.handler.uploadMedia(send, client.creds.tw_access, client.creds.tw_acc_secret,
     function(error, media, response){
        if (!error) {
            console.log("media uploaded");
            console.log(media);
            return callback(media);
        }
        else {
            console.log("error uploading media");
        }
    });
}

module.exports.client = twitter;
module.exports.sendTweet = sendTweet;
module.exports.uploadMedia= uploadMedia;