const api  = require('../bot.js').api;
var https = require('https');
var fs = require('fs');
const NitaiBaseController = require('./NitaiBaseController.js');
var creds = require('./../../apikey.js');
var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
                consumerKey: creds.tw_consumer,
                consumerSecret: creds.tw_consumer_secret,
                callback: 'stam'          
            });


class PicController extends NitaiBaseController {
    handle($){
        if ($._message._photo != null ){
            var img = api.getFile($._message._photo[$._message._photo.length - 1]._fileId);
            img.then(function(value) {
                var file = fs.createWriteStream("file.jpg");
                console.log(`https://api.telegram.org/file/bot${creds.key}/${value._filePath}`)
                var request = https.get(`https://api.telegram.org/file/bot${creds.key}/${value._filePath}` ,
                              function(response) {
                              response.pipe(file);                          
                              }).on('close', function() {

                var data = fs.readFileSync('file.jpg');
                console.log("uploading");
                console.log(data);

                var send = { "media": '/home/john/Coding/nitai-bot/file.jpg' };
                console.log(send);
               
                twitter.uploadMedia(send, creds.tw_access, creds.tw_acc_secret, 
                function(error, media, response) {

                    if (!error) {

                        // If successful, a media object will be returned.
                        console.log(media);
                        var text = "i'm eating";
                        if ($._message._caption != null){
                            text = $._message._caption;
                        }
                       console.log("sending status")
                        twitter.statuses("update", {
                            status: text,
                            media_ids: media.media_id_string
                        },
                        creds.tw_access,
                        creds.tw_acc_secret,
                            function(error, data, response) {
                                if (error) {
                                    console.log('creds suck'); 
                                } else {
                                    console.log("creds ok"); 
                                }
                            }
                        );

                    }
                    else {
                        console.log("error 1");
                        console.log(error);
                        fs.unlinkSync("file.jpg");
                        console.log("deleted");
                    }
                 });
                });
            });
            


            
        }
    }
}

module.exports = PicController;