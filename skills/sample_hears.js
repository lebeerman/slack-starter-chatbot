/*

WHAT IS THIS?

This is a collection of skills triggered by the 'hears' method.
Type a word triggers the bot. 
https: //botkit.ai/docs/readme-slack.html#interactive-messages

*/

module.exports = function(controller) {

    // INSERT NEW SKILLS HERE!

    controller.hears(['^hello$'], 'direct_message,direct_mention', function(bot, message) {
        bot.reply(message, "Hi there, you're on workspace: " + message.team)
    });
    
    controller.hears(['^goodbye$'], 'direct_message,direct_mention', function(bot, message) {
        bot.reply(message, "Later gator!")
    });

    controller.hears('interactive', 'direct_message', function (bot, message) {
        bot.reply(message, {
            attachments: [{
                title: 'Do you want to interact with my buttons?',
                callback_id: '123',
                attachment_type: 'default',
                actions: [{
                        "name": "yes",
                        "text": "Yes",
                        "value": "yes",
                        "type": "button",
                    },
                    {
                        "name": "no",
                        "text": "No",
                        "value": "no",
                        "type": "button",
                    }
                ]
            }]
        });
    });

    controller.hears(['^projects$'], 'direct_message,direct_mention', function (bot, message) {
        bot.reply(message, {
            "text": "What did you work on this ____ (AM/PM)?",
            "attachments": [{
                "title": 'Hello World!',
                "text": "Choose the project you've allocated time to:",
                "fallback": "Sorry, you don't have any Projects or you arent part of a Unit.",
                "callback_id": "interactive_message_callback",
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
                }]
            }]
        })
    })
    // receive an interactive message, and reply with a message that will replace the original
    controller.on('interactive_message_callback', function (bot, message) {

        // check message.actions and message.callback_id to see what action to take...
        console.log('REPLYING:', message )
        bot.replyInteractive(message, {
            attachments: [{
                title: 'Thanks for answering!',
                callback_id: 'thankyou',
                attachment_type: 'default',
                text: "Response Saved: " + message.raw_message.user.name + " worked on " + message.actions[0].name
            }]
        });

    });
  
};
