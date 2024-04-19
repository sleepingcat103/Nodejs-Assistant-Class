const redisConnection = require('./redis');

// Serice
class Redis {
  constructor() {}

  async init() {
    this.redisClient = await redisConnection();
    return;
  }

  setUser(userId, key, value) {
    return this.redisClient.hSet(`user:${userId}`, key, value);
  }

  getUser(userId, key) {
    return this.redisClient.hGet(`user:${userId}`, key);
  }

  setData(dataId, key, value) {
    return this.redisClient.hSet(`data:${dataId}`, key, value);
  }

  getData(dataId, key) {
    return this.redisClient.hGet(`data:${dataId}`, key);
  }

}

///////////////////////////////////
// ////////////////////////////////

// Controller
async function main () {
  // Business login
  const redisRepo = new Redis();
  await redisRepo.init();

  redisRepo.setUser('A123456789', 'name', 'Bob');
}

main();

