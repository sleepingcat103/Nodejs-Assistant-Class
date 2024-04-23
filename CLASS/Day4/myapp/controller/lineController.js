const lineService = require('../service/lineService');
const waService = require('../service/watsonAssistantV1');
const redisService = require('../service/redisService');

const ANSWER_PACK = require('../model/ANSWER_PACK');
const amqpSender = require('../service/amqpSender');
const uuids = require('../data/uuids.json');

class LineController {
  constructor() {}

  async webhook(req, res, next) {
  
    res.status(200).send('');

    let userId, method, requestData, responseData, intent, confidence, entity, error;
  
    try {
      
      // const event = req.body.events[0];

      for(let event of req.body.events) {
        // 文字訊息 => call watson assistant
        // if(event.type === 'postbact') {
        //   `callapi=CallBirthdayApi&params=userId`
        // } 
        if(event.type === 'message' && event.message.type === 'text') {

          // 取得必要資訊
          const text = event.message.text;
          requestData = text;
          userId = event.source.userId;
          // console.log(userId, 'say:', text);
          
          // call watson assistant
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

          const { result } = await waService.message(text, JSON.parse(userContext));
          // console.log(JSON.stringify(result, null, 2));

          // 取得 watson 吐回內容
          const context = result.context;
          const returnMessage = result.output.text[0];
          intent = result.intents[0]?.intent;
          confidence = result.intents[0]?.confidence;
          entity = result.entities[0]?.entity;
          
          // 回存 context
          await redisService.saveUserContext(userId, JSON.stringify(context));
          
          // 取得答案包
          const ansId = JSON.parse(returnMessage).ansId;
          const { MESSAGES } = await ANSWER_PACK.getAnswerPack(ansId);

          // reply message
          const replacesMessageString = replaceContextVariables(MESSAGES, context);
          const message = await toLineMsg(JSON.parse(replacesMessageString), { /* ...variables  */ });
          responseData = JSON.stringify(message);
          lineService.replyMessage(event.replyToken, message);
        }
      }

    } catch (err) {
      console.error(err);
      error = err;
    }

    // log
    const log = {
      USER_ID: userId,
      METHOD: 'line',
      REQUEST_DATA: requestData,
      RESPONSE_DATA: responseData,
      INTENT: intent,
      CONFIDENCE: confidence,
      ENTITY: entity,
      ERROR: error
    }
    amqpSender.sendConversationLog(log)
    // CONVERSATION_LOG.insertLog(log);

  }

}

module.exports = new LineController();

function replaceContextVariables(answerpackString, context) {
  const workingKeys = Object.keys(context).filter(key => typeof context[key] === 'string');
  workingKeys.forEach(key => {
    const regexStr = `\\$${key}`;
    const regex = new RegExp(regexStr, 'g');
    answerpackString = answerpackString.replace(regex , context[key]);
  })
  return answerpackString;
}

async function toLineMsg(messages, variables) {
  return messages.map(msg => {
    switch (msg.type) {
      case 'text':
        return {
          type: 'text',
          text: msg.value
        }
      case 'api-call':
        // ...messages....

      default: 
        return undefined; 
    }
  })

}
