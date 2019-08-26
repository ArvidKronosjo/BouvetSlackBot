
console.log("initializing...");
const SlackBot = require("slackbots");
const fs = require("fs");
var slackToken = "";
var Gpio = {};
var isWindows = false;
if(process.platform == "win32")
{
    console.log("Windows detected");
    slackToken = fs.readFileSync("./etc/.slackToken", "utf8").trim();
    Gpio = function(){this.servoWrite = function(){}};
    isWindows=true;
}
else
{
    console.log("Linux detected");
    Gpio = require('pigpio').Gpio;
    slackToken = fs.readFileSync("/etc/.slackToken", "utf8").trim();
}

var startDelay = isWindows ? 0 : 30*1000;

//

var isRunning = false;
var hasCrashed = false;
console.log("Connecting in " + (startDelay/1000) + " seconds");
setTimeout(function(){
    
    startBot();
    isRunning=true;
},startDelay);


setInterval(function() {
    try{
        if(isRunning==false || hasCrashed==true)
        {
            startBot();
            isRunning=true;
            hasCrashed=false;
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
    //console.log(slackToken);

    // create a bot
    var bot = new SlackBot({
        token: slackToken, // Add a bot https://my.slack.com/services/new/bot and put the token 
        name: 'Arrebot'
    });

    console.log("connecting to slack");
    bot.on('start', function() {
        try
        {
            console.log("connected to slack");
            // more information about additional params https://api.slack.com/methods/chat.postMessage
            var params = {
                icon_emoji: ':arvid:'
            };
            //bot.postMessageToUser('arvid.kronosjo', 'Du kan vara en andvändare!', params);    
            bot.on('message', function(data) {
                
                // all ingoing events https://api.slack.com/rtm
                if(data.type=="message" && data.text!=undefined && data.text.toLowerCase().indexOf('deal won! :tada:')!=-1)
                {
                    console.log("Move Servo 1!");
                    motor.servoWrite(fullSwing);
                    setTimeout(function()
                    {
                        motor.servoWrite(noSwing);
                        setTimeout(function()
                        {
                            motor.servoWrite(fullSwing);
                            console.log("Move Servo 2!");
                            setTimeout(function()
                            {
                                motor.servoWrite(noSwing);
                                setTimeout(function()
                                {
                                    motor.servoWrite(fullSwing);
                                    console.log("Move Servo 3!");
                                    setTimeout(function()
                                    {
                                        motor.servoWrite(noSwing);
                                    },1000);
                                },1000);
                            },1000);
                        },1000);
                    },1000);
                }
            });
            bot.on("error",function(data){
                console.log("Connection crashed. Restarting soon...");
                console.log(data);
                hasCrashed=true;
                isRunning=false;
            });
            bot.on("close",function(data){
                console.log("Connection closed. Restarting soon...");
                console.log(data);
                hasCrashed=true;
                isRunning=false;
            })
        }
        catch(exception)
        {
            console.log("Crash");
            console.log(exception);
            hasCrashed=true;
            isRunning=false;
        }
    });
}
