/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/
This is a bot built using BotKit to implement IOU functionality
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./node_modules/botkit/lib/Botkit.js');
var request = require('request');

var controller = Botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();


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

controller.hears('(.*) owes (.*) (.*)', 'direct_message,direct_mention,mention', function(bot, message) {

    var ownee = message.match[1];
    var owner = message.match[2];
    var amount_owned = parseInt(message.match[3]);
    var isOwneeAUser = false;
    var isOwnerAUser = false;

    bot.reply(message, "trying to get every users in the team Slack.");


    bot.api.users.list({}, 
        function(err, res) {

        if (err) {
            bot.reply(message, "I got an error while trying to get all users: " + err);
            bot.botkit.log('Failed to get the list of all users :(', err);
            return;
        }

        res.members.foreach(function(element)
        {
            if(element == ownee)
            {
                isOwneeAUser = true;
            }

            if(element == owner)
            {
                isOwnerAUser = true;
            }
        });

    });

    if (isNaN(amount_owned)) {
        bot.reply(message, "I\'d try to add that as debt, but it's not a number");
    }
    else if(!isOwneeAUser)
    {
        bot.reply(message, "The user that is owed money is not part of this team Slack!");
    }
    else if(isOwnerAUser)
    {
        bot.reply(message, "The user owes money is not part of this team Slack!");
    }
    else
    {
        bot.reply(message,ownee + " now owes " + amount_owned + " to " + owner);
    }

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