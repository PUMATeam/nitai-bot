const api  = require('../bot.js').api;
var https = require('https');
var fs = require('fs');
const NitaiBaseController = require('./NitaiBaseController.js');
var creds = require('./../../apikey.js');
var twitter_api = require('../twitter.js');
var twitter = new twitter_api.client(creds);


class PicController extends NitaiBaseController {
    handle($){
        if ($._message._photo != null ){
/*            console.log(twitter);
            var params = {
                status: "john " + $._message._photo[$._message._photo.length - 1]._fileId,
            }
            twitter_api.sendTweet(params, twitter,
             function(reply){
                console.log(reply);
                $.sendMessage(reply);
                $.sendMessage('תעשו לייק ;)');
            });
            
   
            exit;*/
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
                // upload media
                               twitter_api.uploadMedia('file.jpg',twitter,function(media){
                                // send media
                               
                                    console.log(media);
                                    var text = "i'm eating";
                                    if ($._message._caption != null){
                                        text = $._message._caption;
                                    }
                                    var params = {
                                        status: text,
                                        media_ids: media.media_id_string
                                    }
                                    console.log("sending status");
                                    twitter_api.sendTweet(params, twitter,
                                    function(reply){
                                        console.log(reply);
                                        $.sendMessage(reply);
                                        $.sendMessage('תעשו לייק ;)');
                                    });

                                });
                              });
                
            });            
        }
    }
}

module.exports = PicController;