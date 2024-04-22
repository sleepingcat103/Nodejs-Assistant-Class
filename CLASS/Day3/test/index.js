const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

const assistant = new AssistantV2({
  version: '2021-06-14',
  authenticator: new IamAuthenticator({
    apikey: '2LKJH8ZZX58NWf7Nh3JsmyFa50T6vpHYwH4i0VugW11k',
  }),
  serviceUrl: 'https://api.au-syd.assistant.watson.cloud.ibm.com',
});

  
async function main () {
  const data = await assistant.createSession({
    assistantId: '586b60ec-4543-4458-87ff-305431528c99'
  })
  const session_id = data.result.session_id;
  // v2 => by session_id 計費

  const result = await assistant.message({
    assistantId: '586b60ec-4543-4458-87ff-305431528c99',
    sessionId: session_id,
    input: {
      'message_type': 'text',
      'text': '我想吃披薩'
      }
    });

  console.log('call wa v2 api result:', JSON.stringify(result.result, null, 2));
}

main();