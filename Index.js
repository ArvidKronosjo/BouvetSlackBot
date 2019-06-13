const SlackBot = require("slackbots");
const fs = require("fs");
const piblaster = require('pi-servo-blaster.js'); 
const slackToken = fs.readFileSync("./.slackToken", "utf8").trim();
console.log("Starting...");

 
// pass the GPIO number

function angleToPercent(angle) {
  return Math.floor((angle/180) * 100);
}

var curAngle = 0;
var direction = 1;
setInterval(() => {
  piblaster.setServoPwm("P1-11", angleToPercent(curAngle) + "%");
  console.log("Setting angle at: ", curAngle, angleToPercent(curAngle));
  curAngle += direction;
  // Change direction when it exceeds the max angle.
  if (curAngle >= 180) {
    direction = -1;
  } else if (curAngle <= 0) {
    direction = 1;
  }
}, 10);
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
            servo.setDegree(175);
            setTimeout(() => servo.setDegree(5),1500);
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