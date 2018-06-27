var CronJob = require('cron').CronJob;

var job = new CronJob({
  cronTime: '* * * * *',
  onTick: function () {
    /*
     * RUN EVERY MINUTE PLEASE! 
     */
    creaateConv()
  },
  start: false,
  timeZone: 'America/Los_Angeles'
});


async function createConv(person, appOptions, timeOfDay) {
  // let appInv = {};
  // for (let app of unit_apps) {
  //   lowerArr.push(app.toLowerCase());
  // }
  // aw.forEach(appObj => {
  //   appInv[appObj.app_name.toLowerCase()] = appObj.app_id;
  // });
  
  let askCounter = 0;
  let qCt = 0;
  let user = {
    user: UBEN7TR38,
    text: "dummy",
    channel: UBEN7TR38
  };
  
  bot.createPrivateConversation(user, async function (err, convo) {
    //Ask the question
    if (err) {
      console.log(err);
    }
    
    let _appNames = []; // Store the names of the options 
    let lowerCaseOptions = {}; // Will store a hash of the lowercase name and the app id

    // Populate the above variables
    for (let _option in appOptions) {
      _appNames.push(_option);
      lowerCaseOptions[_option.toLowerCase()] = appOptions[_option];
    };
    
    convo.setVar("person", "USERNAME!");
    convo.setVar("appNames", _appNames); // Needed for asking
    convo.setVar("appOptions", lowerCaseOptions); // Needed for saving the choosen app
    
    //Ask the question
    convo.setVar("timeOfDay", timeOfDay);
    console.log("Asking the " + convo.vars.timeOfDay + " question.");
    

    // _appNames.join(", "),
    //   askQuestion, {},
    convo.addQuestion(message, {
          "text": "What did you work on this "+ convo.vars.timeOfDay ,
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
        });

    
    convo.setTimeout(600000 * 3); //Wait for 30 minutes
    convo.onTimeout(async function (convo) {
      askCounter++;
      if (askCounter < 3) {
        convo.transitionTo(
          "default",
          "You must be having a busy day! Let's try that again"
        ); //todo: use a separate thread for this so as not to repeat the opening line
      } else {
        if (qCt === 0) {
          await saveUserResp(person, timeOfDay, "", null);
          // await saveUserResp(person, "pm", "", null);
          convo.say(
            "Unable to get your response, todays work will be logged as Unanswered."
          );
        }
        convo.next();
        qCt++;
      }
    });
    
    // convo.say("Thank you for you time! ;)");
    
    convo.on("end", function (convo) {
      console.log("Conversation has ended");
    });
    
    //Start the conversation
    convo.activate();
  });
  
  //bot.createPrivateConversation(user, await askPMQuestion);
}
  
module.exports = function (controller) {
  // controller.say()
  controller.hears(['^projects$'], 'direct_message,direct_mention', function (bot, message) {
    bot.reply(message, {
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
      });

};