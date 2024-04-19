const lineService = require('../service/lineService');
const waService = require('../service/watsonAssistantV1');
const redisService = require('../service/redisService');

class LineController {
  constructor() {

  }

  webhook(req, res, next) {
  
    res.send('respond with a resource');
  
    try {
      req.body.events.forEach(async event => {
        // 文字訊息 => call watson assistant 
        if(event.type === 'message' && event.message.type === 'text') {
          const text = event.message.text;
          console.log('user say:', text);
          
          // call watson
          const userContext = await redisService.getUserContext(   /** todo */  );
          const result = await waService.message(text, userContext);
          console.log(JSON.stringify(result, null, 2));

          // 回存 context
           /** todo */

          // reply message
          const message = [{
            type: 'text',
            text: text /** adjust */
          }]
          lineService.replyMessage(event.replyToken, message);
        }
      })
    } catch (error) {
      console.error(error);
    } 
    // log
    
  }

}

module.exports = new LineController();