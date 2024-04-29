const AssistantV1 = require('ibm-watson/assistant/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const { WA_APIKEY, WA_URL, WA_SKILLID } = process.env;

// ibm-watson/assistant/v1 使用的初始化
const assistant = new AssistantV1({
  version: '2021-06-14',
  authenticator: new IamAuthenticator({
    apikey: WA_APIKEY,
  }),
  serviceUrl: WA_URL,
});

function message(text, context = undefined) {
  // 對 assistant 發訊息
  return assistant.message({
    workspaceId: WA_SKILLID,
    input: { 'text': text },
    context: context
  })
}

module.exports = {
  message
}