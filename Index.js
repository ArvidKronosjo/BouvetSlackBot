const SlackBot = require("slackbots");
const fs = require("fs");
const slackToken = fs.readFileSync("./.slackToken", "utf8").trim();
console.log("Starting...");

const Gpio = require('pigpio').Gpio;
 
const motor = new Gpio(14, {mode: Gpio.OUTPUT});
 
let pulseWidth = 1000;
let increment = 100;
 
setInterval(() => {
  motor.servoWrite(pulseWidth);
 
  pulseWidth += increment;
  if (pulseWidth >= 2000) {
    increment = -100;
  } else if (pulseWidth <= 1000) {
    increment = 100;
  }
}, 1000);

// create a bot
var bot = new SlackBot({
    token: slackToken, // Add a bot https://my.slack.com/services/new/bot and put the token 
    name: 'Arrebot'
});


bot.on('start', function() {
    // more information about additional params https://api.slack.com/methods/chat.postMessage
    var params = {
        icon_emoji: ':arvid:'
    };
    
    // define channel, where bot exist. You can adjust it there https://my.slack.com/services 
    //bot.postMessageToChannel('general', 'meow!', params);
    //var users = bot.getUsers();
   // console.log(JSON.stringify(users));
    // define existing username instead of 'user_name'
    bot.postMessageToUser('arvid.kronosjo', 'Du kan vara en andvändare!', params); 
   // bot.postMessageToChannel('arreslask', 'hej!', params);
    bot.on('message', function(data) {
        // all ingoing events https://api.slack.com/rtm
        if(data.type=="message" && data.text.toLowerCase().indexOf('deal won! :tada:')!=-1)
        {
            console.log("Move Servo!");
        }
        else
        {
            //console.log(data);
        }
    });
    //bot.postMessageToUser('oskar.kronosjo', 'hej').then(function(data) {
        // ...
     //   console.log(data);
    //})
    
    // If you add a 'slackbot' property, 
    // you will post to another user's slackbot channel instead of a direct message
    //bot.postMessageToUser('user_name', 'meow!', { 'slackbot': true, icon_emoji: ':cat:' }); 
    
    // define private group instead of 'private_group', where bot exist
   // bot.postMessageToGroup('private_group', 'meow!', params); 
});