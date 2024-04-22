
module.exports = {
  exchange: 'toyota',
  queue: 'xxx',
  key: 'xxx',
  handler: msg => {
    console.log('get tryerror message', msg);
    return Promise.resolve();
  }
}