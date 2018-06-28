/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


This is a sample Slack bot built with Botkit.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var CronJob = require('cron').CronJob;
var env = require('node-env-file');
env(__dirname + '/.env');


if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
  console.log('Error: Specify clientId clientSecret and PORT in environment');
  usage_tip();
  process.exit(1);
}

var Botkit = require('botkit');
var debug = require('debug')('botkit:main');

var bot_options = {
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    debug: true,
    scopes: ['bot']
};

bot_options.json_file_store = __dirname + '/.data/db/'; // store user data in a simple JSON format

// Create the Botkit controller, which controls all instances of the bot.
const controller = Botkit.slackbot(bot_options);

// create the bot instance for direct messages on a timer
const bot = controller
  .spawn({
    token: process.env.slackbot_token
  })
  .startRTM();
controller.startTicking();

new CronJob('*/2 * * * *', () => {
    bot.api.im.open({
      user: 'UBEN7TR38' // any user id
    }, (err, res) => {
      if (err) {
        bot.botkit.log('Failed to open IM with user', err)
      }
      console.log(res);
      bot.startConversation({
        user: 'UBEN7TR38', // any user id
        channel: res.channel.id,
        text: 'WOWZA... 1....2'
      }, (err, convo) => {
        convo.say({
              "text": "What did you work on this ____ (AM/PM)?",
              "attachments": [{
              "text": "Choose the project you've allocated time to:",
              "fallback": "Sorry, you don't have any Projects or you arent part of a Unit.",
              "callback_id": "project_work",
              "color": "#FF6D27",
              "attachment_type": "default",
              "actions": [{
                  "name": "test-proj1",
                  "text": "Project 1",
                  "style": "good",
                  "type": "button",
                  "value": "project1"
                },
                {
                  "name": "test-proj2",
                  "text": "Project 2",
                  "style": "warning",
                  "type": "button",
                  "value": "project2"
                },
                {
                  "name": "test-proj3",
                  "text": "Project 3",
                  "style": "danger",
                  "type": "button",
                  "value": "project3",
                  "confirm": {
                    "title": "Are you sure?",
                    "text": "Have you really been working on this project?!",
                    "ok_text": "DEFINITELY!",
                    "dismiss_text": "No way!"
                  }
                }
              ]
          }]
        })
      })
    })
}, null, true, 'Africa/Lagos')

// Set up an Express-powered webserver to expose oauth and webhook endpoints
var webserver = require(__dirname + '/components/express_webserver.js')(controller);

// Set up a simple storage backend for keeping a record of customers
// who sign up for the app via the oauth
require(__dirname + '/components/user_registration.js')(controller);

// Send an onboarding message when a new team joins
require(__dirname + '/components/onboarding.js')(controller);

var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./skills/" + file)(controller);
});

