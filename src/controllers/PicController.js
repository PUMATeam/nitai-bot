const Api  = require('../bot.js').api;
const Https = require('https');
const Fs = require('fs');
const NitaiBaseController = require('./NitaiBaseController.js');
const Creds = require('./../../creds.js');
const TwitterApi = require('../twitter.js');
const Twitter = new TwitterApi.client(Creds);
let file;

var downloadTelegramFile = function(filePath, fileId, callback) {
    const Address =`https://api.telegram.org/file/bot${Creds.key}/${filePath}`;
    file = Fs.createWriteStream(fileId);
    Https.get(Address,callback);
}

var  uploadAndSend = function(fileId, $) {
    TwitterApi.uploadMedia(fileId,Twitter,function(media){
        // send media
        console.log('deleting File');
        Fs.unlinkSync(fileId);
        console.log(media);
        let text = '';
        if ($._message._caption != null){
            text = $._message._caption;
        }
        else{
            text = "i'm eating";
        }

        var params = {
            status: text,
            media_ids: media.media_id_string
        }

        console.log("sending status");

        TwitterApi.sendTweet(params, Twitter,
        function(reply){
            console.log(reply);
            $.sendMessage(reply);
            $.sendMessage('תעשו לייק ;)');
        });

    });
}

class PicController extends NitaiBaseController {
    handle($){
        if ($._message._photo != null ){
            const FileId = $._message._photo[$._message._photo.length - 1]._fileId;
            Api.getFile(FileId)
            .then( function(value){
                downloadTelegramFile(value._filePath, FileId, 
                function(response) {
                    response.pipe(file)                         
                    .on('close', function() {
                    console.log("uploading");
                    uploadAndSend(FileId, $);
                    })
                })
             })
        };        
    }
}


module.exports = PicController;