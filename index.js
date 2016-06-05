if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./node_modules/botkit/lib/Botkit.js');
var request = require("request");

var controller = Botkit.slackbot({
    debug: true
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

var createEventStarted = false;
var payEventStarted = false;
var submitEventReady = false;
var eventName = "";
var description = "";
var creatorId = "";
var channelId = "";
var creatorUsername = "";
var deadlineRegister = "";
var channelName = "";

var payerId = "";
var payerUsername = "";
var amount = "";
var eventId = "";

controller.hears('CREATE_EVENT_IOU (.*) (.*) (.*) (.*) (.*)', 'direct_message,direct_mention,mention', function(bot, message){
    var EventName = message.match[1];
    var CreatorUserId = message.match[2];
    var CreatorUsername = message.match[3];
    var ChannelId = message.match[4];
    var ChannelName = message.match[5]; 

    eventName = EventName;
    creatorId = CreatorUserId;
    creatorUsername = CreatorUsername;
    channelId = ChannelId;
    channelName = ChannelName;

    bot.api.chat.postMessage(
        {token: process.env.token,
         channel : "@" + CreatorUsername,
         text : "Welcome to IOU!",
         as_user:true,
         username:"ioubot"}
         ,  function(err, res)
            {
                if(err)
                {
                    console.log("Couldn't post message " + err);
                }
            }
    );

    bot.api.chat.postMessage(
        {token: process.env.token,
         channel : "@" + CreatorUsername,
         text : "I'm here to help you create " + EventName,
         as_user:true,
         username:"ioubot"}
         ,  function(err, res)
            {
                if(err)
                {
                    console.log("Couldn't post message " + err);
                }
            }
    );

    bot.api.chat.postMessage(
        {token: process.env.token,
         channel : "@" + CreatorUsername,
         text : "Please enter \"Ready\" when you are ready",
         as_user:true,
         username:"ioubot"}
         ,  function(err, res)
            {
                if(err)
                {
                    console.log("Couldn't post message " + err);
                }
            }
    );
    createEventStarted = true;
});

controller.hears('PAY_EVENT_IOU (.*) (.*) (.*) (.*) (.*) (.*)', 'direct_message,direct_mention,mention', function(bot, message){
    var Amount = message.match[1];
    var EventName = message.match[2];
    var EventId = message.match[3];
    var PayerUsername = message.match[4];
    var PayerId = message.match[5];
    var CreatorUsername = message.match[6];

    amount = Amount;
    eventName = EventName;
    eventId = EventId;
    payerUsername = PayerUsername;
    payerId = PayerId;
    creatorUsername = CreatorUsername;

    bot.api.chat.postMessage(
        {token: process.env.token,
         channel : "@" + CreatorUsername,
         text : payerUsername + " wants to pay, please enter \"Ready\" when you are ready to acknowledge the payment.",
         as_user:true,
         username:"ioubot"}
         ,  function(err, res)
            {
                if(err)
                {
                    console.log("Couldn't post message " + err);
                }
            }
    );
});

controller.hears('SPLIT_EVENT_IOU (.*) (.*) (.*) (.*)', function(bot, message){
	var Amount = parseInt(message.match[1]);
	var EventName = message.match[2];
	var DeadlinePay = message.match[2];
	var ChannelId = message.match[4];
	var userArray = JSON.parse(message.match[5]);

	userArray.forEach(function(element){
		bot.api.chat.postMessage(
			        {token: process.env.token,
			         channel : '@' + element,
			         text : 'You owe ' + Amount + 'for event ' + EventName + '.',
			         as_user:true,
			         username:"ioubot"}
			         ,  function(err, res)
			            {
			                if(err)
			                {
			                    console.log("Couldn't post message " + err);
			                }
			            }
			    );
		bot.api.chat.postMessage(
			        {token: process.env.token,
			         channel : '@' + element,
			         text : 'You have until ' + DeadlinePay + ' your debt.',
			         as_user:true,
			         username:"ioubot"}
			         ,  function(err, res)
			            {
			                if(err)
			                {
			                    console.log("Couldn't post message " + err);
			                }
			            }
			    );
	});

	bot.api.chat.postMessage(
			        {token: process.env.token,
			         channel : ChannelId,
			         text : 'Registration for the event ' + EventName + ' is now closed.',
			         as_user:true,
			         username:"ioubot"}
			         ,  function(err, res)
			            {
			                if(err)
			                {
			                    console.log("Couldn't post message " + err);
			                }
			            }
			    );
});

controller.hears('FIX_EVENT_IOU (.*) (.*) (.*) (.*)', function(bot, message){
	var Amount = parseInt(message.match[1]);
	var EventName = message.match[2];
	var DeadlinePay = message.match[2];
	var ChannelId = message.match[4];
	var userArray = JSON.parse(message.match[5]);

	userArray.forEach(function(element){
		bot.api.chat.postMessage(
			        {token: process.env.token,
			         channel : '@' + element,
			         text : 'You owe ' + Amount + 'for event ' + EventName + '.',
			         as_user:true,
			         username:"ioubot"}
			         ,  function(err, res)
			            {
			                if(err)
			                {
			                    console.log("Couldn't post message " + err);
			                }
			            }
			    );

		bot.api.chat.postMessage(
			        {token: process.env.token,
			         channel : ChannelId,
			         text : 'Registration for the event ' + EventName + ' is now closed.',
			         as_user:true,
			         username:"ioubot"}
			         ,  function(err, res)
			            {
			                if(err)
			                {
			                    console.log("Couldn't post message " + err);
			                }
			            }
			    );
	});

	bot.api.chat.postMessage(
			        {token: process.env.token,
			         channel : ChannelId,
			         text : 'Registration for the event ' + EventName + ' is now closed.',
			         as_user:true,
			         username:"ioubot"}
			         ,  function(err, res)
			            {
			                if(err)
			                {
			                    console.log("Couldn't post message " + err);
			                }
			            }
			    );
});

controller.hears(['Ready', 'ready', 'rdy'], 'direct_message,direct_mention,mention', function(bot, message){
	if(createEventStarted)
	{
		askDescription = function(response, convo) {
	      convo.ask('Please enter the description of your event.', function(response, convo) {
	        convo.say('Awesome.');
	        description = response.text;
	        console.log('description is ' + Object.getOwnPropertyNames(description));
	        askDeadineRegister(response, convo);
	        convo.next();
	      });
	    }
	    askDeadineRegister = function(response, convo) {
	    	convo.say("When is the deadline to register to the event?");
	      convo.ask('Please enter a date in the following format : *YYYY-MM-DD*. Example : 2012-12-12', function(response, convo) {
	      	deadlineRegister = response.text;
	        console.log('deadlineRegister is ' + deadlineRegister);
	        convo.say('Awesome! I hope your event will be awesome!');
	        endConvo(response, convo);
	        convo.next();
	      });
	    }

	    endConvo = function(response, convo) {
	      convo.say("Please enter \"Submit\" to submit your information");
	      submitEventReady = true;
	    }

	    bot.startConversation(message, askDescription);
	    createEventStarted = false;
	}
	else if(payEventStarted)
	{
		askConfirmationPayment = function(response, convo) {
			convo.ask('Please say yes if ' + payerUsername + ' paid ' + amount + '$ for the event ' + eventName + '.',[
		      {
		        pattern: bot.utterances.yes,
		        callback: function(response,convo) {
		          convo.say('Great! I hope it\'s going well!');

		          bot.api.chat.postMessage(
			        {token: process.env.token,
			         channel : "@" + payerUsername,
			         text : creatorUsername + " confirmed that you paid " + amount + " for event " + eventName,
			         as_user:true,
			         username:"ioubot"}
			         ,  function(err, res)
			            {
			                if(err)
			                {
			                    console.log("Couldn't post message " + err);
			                }
			            }
			    );

		          request.post('http://ec2-52-90-46-132.compute-1.amazonaws.com/api/payment/' + eventId + '/' + payerId, {
				  form: {
						  Amount : amount},
				  json: true
				}, function (err, res, body) {
				  // assert.equal(typeof body, 'object')
				})

		          convo.next();

		        }
		      },
		      {
		        pattern: bot.utterances.no,
		        callback: function(response,convo) {
		          convo.say('Ok, I will tell ' + payerUsername);
		          bot.api.chat.postMessage(
			        {token: process.env.token,
			         channel : "@" + payerUsername,
			         text : creatorUsername + " says that you did not pay " + amount + "for" + eventName,
			         as_user:true,
			         username:"ioubot"}
			         ,  function(err, res)
			            {
			                if(err)
			                {
			                    console.log("Couldn't post message " + err);
			                }
			            }
			    );
		          convo.next();
		        }
		      },
		      {
		        default: true,
		        callback: function(response,convo) {
		          // just repeat the question
		          convo.repeat();
		          convo.next();
		        }
		      }
		    ]);
		}

	    bot.startConversation(message, askConfirmationPayment);
	    payEventStarted = false;
	}	
});

controller.hears(['Submit', 'submit'], 'direct_message,direct_mention,mention', function(bot, message){
	if(!submitEventReady)
	{
		return;
	}

	console.log("eventName " + eventName);
	console.log("description " + description);
	console.log("creatorId " + creatorId);
	console.log("creatorUsername " + creatorUsername);
	console.log("channelId " + channelId);
	console.log("channelName " + channelName);
	console.log("deadlineRegister " + deadlineRegister);

	request.post('http://ec2-52-90-46-132.compute-1.amazonaws.com/api/event', {
	  form: {
			  Name: eventName,
			  Description: description,
			  CreatorID: creatorId,
			  CreatorUsername: creatorUsername,
			  ChannelID: channelId,
			  ChannelName: channelName,
			  RegistrationDeadline: deadlineRegister},
	  json: true
	}, function (err, res, body) {
	  // assert.equal(typeof body, 'object')
	})

	bot.reply(message, "I have created your event, have an awesome day!");
	bot.api.chat.postMessage(
			        {token: process.env.token,
			         channel : channelId,
			         text : '*' + creatorUsername + '*' + ' has created the new event ' + '*' + eventName  + '*' + ' \n ' + '_' + description + '_',
			         as_user:true,
			         username:"ioubot"}
			         ,  function(err, res)
			            {
			                if(err)
			                {
			                    console.log("Couldn't post message " + err);
			                }
			            }
			    );

	bot.api.chat.postMessage(
			        {token: process.env.token,
			         channel : channelId,
			         text : 'Please type /iou join ' + eventName + ' to join the event!',
			         as_user:true,
			         username:"ioubot"}
			         ,  function(err, res)
			            {
			                if(err)
			                {
			                    console.log("Couldn't post message " + err);
			                }
			            }
			    );
	submitEventReady = false;
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

    console.log("Hello received");


    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!');
        } else {
            bot.reply(message, 'Hello awesome!');
        }
    });
});


controller.hears('open the (.*) doors',['direct_message,direct_mention,mention'],function(bot,message) {
  var doorType = message.match[1]; //match[1] is the (.*) group. match[0] is the entire group (open the (.*) doors). 
  if (doorType === 'pod bay') {
    return bot.reply(message, 'I\'m sorry, Dave. I\'m afraid I can\'t do that.');
  }
});

controller.hears('fly',['direct_message,direct_mention,mention'],function(bot,message) {
  return bot.reply(message, 'I wanna fllllyyyyyyyyyyy away!');
});

controller.hears('booty',['direct_message,direct_mention,mention'],function(bot,message) {
  return bot.reply(message, 'Ah yeah shake dat booty!');
});

controller.hears('shuffle',['direct_message,direct_mention,mention'],function(bot,message) {
  return bot.reply(message, 'Everyday I\'m shuffling!');
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