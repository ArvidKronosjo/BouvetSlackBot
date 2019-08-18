
console.log("initializing...");
const SlackBot = require("slackbots");
const fs = require("fs");
const slackToken = fs.readFileSync("./etc/.slackToken", "utf8").trim();

const Gpio = require('pigpio').Gpio;
let motor = new Gpio(14, {mode: Gpio.OUTPUT});
console.log("Starting...");


const fullSwing = 500;
const noSwing = 2000;

setTimeout(function(){
    motor.servoWrite(noSwing);
    console.log("Data written to servo...");

},1500);
console.log(slackToken);

// create a bot
var bot = new SlackBot({
    token: slackToken, // Add a bot https://my.slack.com/services/new/bot and put the token 
    name: 'Arrebot'
});

console.log("connecting to slack");
bot.on('start', function() {
    console.log("connected?");
    // more information about additional params https://api.slack.com/methods/chat.postMessage
    var params = {
        icon_emoji: ':arvid:'
    };
    //bot.postMessageToUser('arvid.kronosjo', 'Du kan vara en andvändare!', params);    
    console.log('aaaaaaaaaaaaaaaaa');    
    bot.on('message', function(data) {
        // all ingoing events https://api.slack.com/rtm
        if(data.type=="message" && data.text!=undefined && data.text.toLowerCase().indexOf('deal won! :tada:')!=-1)
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
