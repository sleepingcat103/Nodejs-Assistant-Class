
// 1. 引用函示庫
const AssistantV1 = require('ibm-watson/assistant/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const APIKEY = '2LKJH8ZZX58NWf7Nh3JsmyFa50T6vpHYwH4i0VugW11k';
const URL = 'https://api.au-syd.assistant.watson.cloud.ibm.com';
const SKILLID = '8e8a5517-6085-4ba2-ac69-3d0e27094134';

let context = undefined;

// ibm-watson/assistant/v1 使用的初始化
const assistant = new AssistantV1({
  version: '2021-06-14',
  authenticator: new IamAuthenticator({
    apikey: APIKEY,
  }),
  serviceUrl: URL,
});

async function askWatson(text) {
  // 對assistant發訊息
  await assistant.message({
    workspaceId: SKILLID,
    input: { 'text': text },
    context: context
  })
  .then(res => {
    const watsonReturn = res.result;
    context = watsonReturn.context;
    console.log(watsonReturn.output.text[0]);
  })
  .catch(err => {
    console.log(err)
  });
}

async function main() {
  await askWatson('我想吃披薩');
  await askWatson('海陸');
  await askWatson('大');
}

main()


