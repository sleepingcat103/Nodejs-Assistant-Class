
const AssistantV1 = require('ibm-watson/assistant/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const APIKEY = '<APIKEY>';
const URL = '<URL>';
const SKILLID = '<SKILLID>';

let context = new Map();

// ibm-watson/assistant/v1 使用的初始化
const assistant = new AssistantV1({
  version: '2021-06-14',
  authenticator: new IamAuthenticator({
    apikey: APIKEY,
  }),
  serviceUrl: URL,
});

class ApiController {
  constructor() {}

  async getUser(req, res, next) {
    const userId = req.params.userId;
    console.log('find data of', userId);
  
    const data = await getUserFromDB(userId);
  
    if(data) {
      res.status(200).send(data);
    } else {
      res.status(400).send();
    }
  }

  async conversation(req, res, next) {
    const { text, userId } = req.body;

    // 對 assistant 發訊息
    const result = await assistant.message({
      workspaceId: SKILLID,
      input: { text: text },
      context: context.get(userId)
    })
    .then(res => {
      const watsonReturn = res.result;
      context.set(userId, watsonReturn.context);
      return watsonReturn.output.text[0];
    })
    .catch(err => {
      console.log(err)
      return;
    });

    if(result) {
      res.status(200).send({ result: result });
    } else {
      res.status(500).send({ error: 'fail to call watson api' });
    }

  }

}

module.exports = new ApiController();

function getUserFromDB(userId) {
  let data = {
    user01: {
      birthday: '2023/02/01'
    },
    user02: {
      birthday: '2021/10/01'
    },
    user03: {
      birthday: '2021/05/02'
    },
  }

  return new Promise(resolve => {

    setTimeout(() => {
      resolve(data[userId]);
    }, 1000);

  });

}