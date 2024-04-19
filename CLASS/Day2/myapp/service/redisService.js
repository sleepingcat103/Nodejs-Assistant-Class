const { createClient } = require('redis');

const { REDIS_URL, REDIS_PASSWORD, REDIS_PORT } = process.env;

const connectionConfig = {
  url: REDIS_URL,
  password: REDIS_PASSWORD,
  port: REDIS_PORT
}

class RedisService {
  constructor() {}

  async #getClient() {
    if(!this.redisClient) {
      this.redisClient = await createClient(connectionConfig);
    }
    try {
      await this.redisClient.ping();
      return this.redisClient;
    } catch (err) {
      return this.redisClient.connect();
    }
  }

  async saveUserContext(user, context) {
    const client = await this.#getClient();
    return client.set(`context:${user}`, context);
  }

  async getUserContext(user) {
    const client = await this.#getClient();
    return client.get(`context:${user}`);
  }

}

module.exports = new RedisService();


// const { createClient } = require('redis');

// // library
// async function main() {
//   const connectionConfig = {
//     url: 'redis://127.0.0.1',
//     password: '123456',
//     port: 6379
//   }
//   const client = await createClient(connectionConfig)
//     .on('error', err => console.log('Redis Client Error', err))
//     .connect();

//   return client;
// }

// module.exports = main;