
module.exports = {
  exchange: 'toyota',
  queue: 'conversation-log',
  key: 'conversation-log',
  handler: msg => {
    console.log('get reqres message', msg);
    return Promise.reject();
  }
}