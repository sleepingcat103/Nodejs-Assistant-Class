const AmqpSender = require('./AmqpSender');

let amqpConfig = {
  amqpUrl: 'amqp://root:root@localhost',
  exchange: 'project'
}

let amqpSender = new AmqpSender(amqpConfig);

// wait for amqp connection
setTimeout(() => {
  // (O)
  amqpSender.publish('tryerror', 111);
  amqpSender.publish('tryerror', `111`);
  amqpSender.publish('reqres', {"data": 222});
  amqpSender.publish('reqres', ["data", 222]);
  amqpSender.publish('reqres', JSON.stringify({"data": 222}));
  
  // (X)
  // amqpSender.publish('reqres', () => { return true }); 
}, 1000)
