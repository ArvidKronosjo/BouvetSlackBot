
const SlackBot = require("slackbots");
const fs = require("fs");
const slackToken = fs.readFileSync("./.slackToken", "utf8").trim();

const Gpio = require('pigpio').Gpio;
let motor = new Gpio(14, {mode: Gpio.OUTPUT});
console.log("Starting...");
motor.servoWrite(noSwing);
console.log("Data written to servo...");

const fullSwing = 500;
const noSwing = 100;


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
    
    bot.on('message', function(data) {
        // all ingoing events https://api.slack.com/rtm
        if(data.type=="message" && data.text.toLowerCase().indexOf('deal won! :tada:')!=-1)
        {
            console.log("Move Servo!");
            motor.servoWrite(fullSwing);
            setTimeout(function()
            {
                motor.servoWrite(noSwing);
            },1500);
        }
    });
});
