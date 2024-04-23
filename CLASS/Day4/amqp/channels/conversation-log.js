const CONVERSATION_LOG = require('../model/CONVERSATION_LOG');

module.exports = {
  exchange: 'project',
  queue: 'conversation-log',
  key: 'conversation-log',
  handler: msg => {
    console.log('get conversation-log message', msg);
    return CONVERSATION_LOG.insertLog(msg.data);
  }
}