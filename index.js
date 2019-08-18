
console.log("initializing...");
const SlackBot = require("slackbots");
const fs = require("fs");
const slackToken = fs.readFileSync("/etc/.slackToken", "utf8").trim();

const Gpio = require('pigpio').Gpio;

var isRunning = false;
var hasCrashed = false;

setTimeout(function(){
    startBot();
    isRunning=true;
},1000*30);


setInterval(function() {
    try{
        if(isRunning==false || hasCrashed==true)
        {
            startBot();
            isRunning=true;
        }
        else{
            console.log("No crash detected");
        }
    }
    catch(exception)
    {
        console.log("Crash. Exception is below");
        console.error(exception);
        hasCrashed=true;
        isRunning=false;
    }
    
},10*60*1000);


function startBot() {
    console.log("Starting...");
    let motor = new Gpio(14, {mode: Gpio.OUTPUT});


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
        console.log("connected to slack");
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
                },500);
            }
            bot.disconnect=true;
        });
        bot.on("error",function(data){
            console.log("Crash");
            console.log(data);
            hasCrashed=true;
            isRunning=false;
        })
    });
}
