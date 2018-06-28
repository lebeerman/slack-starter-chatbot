// TODO: Move cron job here from bot.js 


module.exports = function (controller) {

  controller.hears(['^projects$'], 'direct_message,direct_mention', function (bot, message) {
    bot.reply(message, {
      "text": "What did you work on this ____ (AM/PM)?",
      "attachments": [{
        "text": "Choose the project you've allocated time to:",
        "fallback": "Sorry, you don't have any Projects or you arent part of a Unit.",
            "callback_id": "project_work",
            "color": "#000000",
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