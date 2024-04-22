const AmqpSender = require('../lib/AmqpSender');
const { AMQP_URL, AMQP_EXCHANGE } = process.env;

const amqpSender = new AmqpSender({
  amqpUrl: AMQP_URL,
  exchange: AMQP_EXCHANGE
});

function sendConversationLog({ USER_ID, METHOD, REQUEST_DATA, RESPONSE_DATA, INTENT, CONFIDENCE, ENTITY, ERROR }) {
  const data = {
    USER_ID: USER_ID || '',
    METHOD: METHOD || '',
    REQUEST_DATA: REQUEST_DATA || '',
    RESPONSE_DATA: RESPONSE_DATA || '',
    INTENT: INTENT || '',
    CONFIDENCE: CONFIDENCE || '',
    ENTITY: ENTITY || '',
    ERROR: ERROR || ''
  };
  return amqpSender.publish('conversation-log', data);
}

module.exports = {
  sendConversationLog
}