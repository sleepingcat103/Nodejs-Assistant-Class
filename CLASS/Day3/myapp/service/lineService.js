const line = require('@line/bot-sdk');

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_ACCESS_TOKEN
});

function replyMessage(replyToken, messages) {
  return client.replyMessage({
    replyToken: replyToken,
    messages: messages,
  });
}

module.exports = {
  replyMessage,
  // pushMessage,
  // ...
}
