if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./node_modules/botkit/lib/Botkit.js');

var controller = Botkit.slackbot({
    debug: true
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

controller.hears('CREATE_EVENT_IOU (.*) (.*) (.*) (.*) (.*)', 'direct_message,direct_mention,mention', function(bot, message){
    var EventName = message.match[1];
    var CreatorUserId = message.match[2];
    var CreatorUsername = message.match[3];
    var ChannelId = message.match[4];
    var ChannelName = message.match[5]; 

    bot.api.chat.postMessage(
        {token: process.env.token,
         channel : "@CreatorUsername",
         text : "Welcome to IOU!",
         as_user:false}
         ,  function(err, res)
            {
                if(err)
                {
                    console.log("Couldn't post message " + err);
                }
            }
    );

    /*bot.api.chat.postMessage(
        {token: process.env.token,
         channel : ChannelId,
         text : "The command was called here.",
         as_user:false}
         ,  function(err, res)
            {
                if(err)
                {
                    console.log("Couldn't post message " + err + ".");
                }
            }
    );*/
});

controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });


    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!');
        } else {
            bot.reply(message, 'Hello.');
        }
    });
});


controller.hears('open the (.*) doors',['direct_message,direct_mention,mention'],function(bot,message) {
  var doorType = message.match[1]; //match[1] is the (.*) group. match[0] is the entire group (open the (.*) doors). 
  if (doorType === 'pod bay') {
    return bot.reply(message, 'I\'m sorry, Dave. I\'m afraid I can\'t do that.');
  }
});

controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'],
    'direct_message,direct_mention,mention', function(bot, message) {

        var uptime = formatUptime(process.uptime());

        bot.reply(message,
            ':robot_face: I am a bot named <@' + bot.identity.name +
             '>. I have been running for ' + uptime + ' on heroku.');

        bot.reply(message,
            'This is version 1.01 of ioubot');

    });

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}