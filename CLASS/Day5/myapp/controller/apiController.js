const CONVERSATION_LOG = require('../model/CONVERSATION_LOG');
const waService = require('../service/watsonAssistantV1');
const redisService = require('../service/redisService');

const ANSWER_PACK = require('../model/ANSWER_PACK');
const uuids = require('../data/uuids.json');

// const {
//   WA_APIKEY: APIKEY,
//   WA_URL: URL,
//   WA_SKILLID: SKILLID
// } = process.env;

// let context = new Map();

// // ibm-watson/assistant/v1 使用的初始化
// const assistant = new AssistantV1({
//   version: '2021-06-14',
//   authenticator: new IamAuthenticator({
//     apikey: APIKEY,
//   }),
//   serviceUrl: URL,
// });

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

    // 取得對話進度 context
    let userContext = await redisService.getUserContext(userId);
    if(!userContext) {
      const uuidNo = await redisService.getUuidNo() || 0;
      const uuid = uuids[uuidNo];
      const newUuidNo = uuidNo + 1 > 950 ? 0 : uuidNo + 1;
      await redisService.saveUuidNo(newUuidNo);

      userContext = JSON.stringify({
        conversation_id: uuid,
      });
    }

    // 呼叫 watson assistant api
    const { result } = await waService.message(text, JSON.parse(userContext));
    const context = result.context;
    const returnMessage = result.output.text[0];
    
    // 回存對話進度 context
    await redisService.saveUserContext(userId, JSON.stringify(context));
    
    // 取得答案包
    const ansId = JSON.parse(returnMessage).ansId;
    const { MESSAGES } = await ANSWER_PACK.getAnswerPack(ansId);
    const replacedMessages = replaceContextVariables(MESSAGES, context);

    if(ansId) {
      res.status(200).send({ result: replacedMessages });
    } else {
      res.status(500).send({ error: 'fail to call watson api' });
    }
    
  }

  async getAnswerpack(req, res, next) {
    const { userId, ansId } = req.body;
    const { MESSAGES } = await ANSWER_PACK.getAnswerPack(ansId);

    if(ansId) {
      res.status(200).send({ result: MESSAGES });
    } else {
      res.status(500).send({ error: 'fail to call watson api' });
    }
  }

  async conversationLog(req, res, next) {
    const {
      startTime,
      endTime,
      offset,
      limit
    } = req.body;

    CONVERSATION_LOG.findConversationLog(startTime, endTime, offset, limit)
    .then(result => {
      res.status(200).send({
        success: 1,
        data: result
      })
    })
    .catch(error => {
      res.status(500).send({
        success: 0,
        desc: error
      })
    })
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

function replaceContextVariables(answerpackString, context) {
  const workingKeys = Object.keys(context).filter(key => {
    return typeof context[key] === 'string';
  });
  workingKeys.forEach(key => {
    const regexStr = `\\$${key}`;
    const regex = new RegExp(regexStr, 'g');
    answerpackString = answerpackString.replace(regex , context[key]);
  })
  return answerpackString;
}