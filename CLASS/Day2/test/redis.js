const { createClient } = require('redis');

// library
async function main() {
  const connectionConfig = {
    url: 'redis://127.0.0.1',
    password: '123456',
    port: 6379
  }
  const client = await createClient(connectionConfig)
    .on('error', err => console.log('Redis Client Error', err))
    .connect();

  return client;
}

module.exports = main;

