/* eslint-disable @typescript-eslint/camelcase */
import dotenv from 'dotenv';
dotenv.config();

import { App, ButtonAction } from '@slack/bolt'

const botToken = process.env.BOT_TOKEN;

const app = new App({
    signingSecret: process.env.SIGNING_SECRET,
    token: botToken
});

const questions = [
    'In 1800, the capital of the USA was transferred to Washington DC from which city?'
]

app.view({callback_id: 'quiz-picker'}, ({ack, body, context}) => {
    ack();
    console.log(body);
    console.log(context);

    app.client.chat.postMessage({
        token: context.botToken,
        text: '',
        blocks: [
            {
              type: 'section',
              text: {
                type: 'plain_text',
                text: questions[0],
                emoji: true,
              },
            },
            {
              type: 'actions',
              block_id: 'answers',
              elements: [
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'San Francisco',
                    emoji: true,
                  },
                  value: 'SF',
                },
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'New York',
                    emoji: true,
                  },
                  value: 'NYC',
                },
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'Delaware',
                    emoji: true,
                  },
                  value: 'delaware',
                },
              ],
            },
          ],
        channel: body.view.private_metadata
    })
});

app.action({type: 'block_actions', block_id: 'answers'}, ({ack, body, context}) => {
    ack();
    console.log(body);
    const answer = (body.actions[0] as ButtonAction).text;
    if ((body.actions[0] as ButtonAction).value === 'NYC') {
        app.client.chat.postMessage({
            token: context.botToken,
            text: `<@${body.user.id}> answered *correctly*! <!date^1392734382^Posted {date_num} {time_secs}|Posted 2014-02-18 6:39:42 AM PST>`,
            channel: body.channel!.id as string,
        })
    } else {
        app.client.chat.postEphemeral({
            token: context.botToken,
            text: `WRONG!`,
            channel: body.channel!.id as string,
            user: body.user.id
        })
    }
});

app.command('/tablequiz', ({ack, body, context}) => {
    ack();
    console.log(body);
    app.client.views.open({
        trigger_id: body.trigger_id,
        token: context.botToken,
        view: {
            callback_id: 'quiz-picker',
            type: 'modal',
            private_metadata: `${body.channel_id}`,
            title: {
              type: 'plain_text',
              text: 'Let\'s get quizzy',
              emoji: true,
            },
            submit: {
                type: 'plain_text',
                text: 'Start the quiz!',
                emoji: true,
              },
            close: {
              type: 'plain_text',
              text: 'Cancel',
              emoji: true,
            },
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: 'Hello, looks like you want to start a quiz.\n\n *Please select a type from the options below:*',
                },
              },
              {
                type: 'divider',
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: 'This is a section block with radio button accessory',
                },
                accessory: {
                action_id:'quiz-radios',
                  type: 'radio_buttons',
                  initial_option: {
                    text: {
                      type: 'plain_text',
                      text: 'Option 1',
                    },
                    value: 'option 1',
                    description: {
                      type: 'plain_text',
                      text: 'Description for option 1',
                    },
                  },
                  options: [
                    {
                      text: {
                        type: 'plain_text',
                        text: 'Option 1',
                      },
                      value: 'option 1',
                      description: {
                        type: 'plain_text',
                        text: 'Description for option 1',
                      },
                    },
                    {
                      text: {
                        type: 'plain_text',
                        text: 'Option 2',
                      },
                      value: 'option 2',
                      description: {
                        type: 'plain_text',
                        text: 'Description for option 2',
                      },
                    },
                    {
                      text: {
                        type: 'plain_text',
                        text: 'Option 3',
                      },
                      value: 'option 3',
                      description: {
                        type: 'plain_text',
                        text: 'Description for option 3',
                      },
                    },
                  ],
                },
              },              {
                type: 'divider',
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: 'Music questions',
                },
                accessory: {
                  type: 'image',
                  image_url: 'https://rachelcorbett.com.au/wp-content/uploads/2017/08/Drawing-of-man-playing-music-on-a-guitar.jpg',
                  alt_text: 'music',
                },
              },
            ],
          }
    })    
})

app.action({ type: 'block_actions', action_id: 'general-knowledge' }, ({ack, body}) => {
    ack();
    console.log(body);
    
});

app.action({ type: 'block_actions', action_id: 'quiz-radios' }, ({ack, body}) => {
    ack();
    console.log(body);
    
});

app.action({ type: 'block_actions', action_id: 'channel-picker-action' }, ({ack, body}) => {
    ack();
    console.log(body);
});

(async (): Promise<void> => {
    // Start your app
    await app.start(process.env.PORT || 3000);
    console.log('Bolt is ready and waiting...');
})();