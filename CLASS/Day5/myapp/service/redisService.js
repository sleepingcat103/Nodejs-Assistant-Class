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
    return client.set(`context:${user}`, context, { "EX": 600 });
  }

  async getUserContext(user) {
    const client = await this.#getClient();
    return client.get(`context:${user}`);
  }

  async saveUuidNo(no) {
    const client = await this.#getClient();
    return client.set(`uuidNo`, no);
  }

  async getUuidNo() {
    const client = await this.#getClient();
    return client.get(`uuidNo`);
  }

}

module.exports = new RedisService();