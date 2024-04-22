let amqp = require('amqplib');

class AmqpSender {
  constructor ({ amqpUrl, exchange }) {
    this.exchange = exchange;
    this.amqpUrl = amqpUrl || 'amqp://root:root@localhost';

    this.connect();
  }

  connect() {
    let _this = this;
    
    return amqp.connect(_this.amqpUrl).then(connection => {
      return connection.createChannel().then(channel => {
        var ok = channel.assertExchange(_this.exchange, 'direct');
        return ok.then(function() {
          _this.channel = channel;
          console.log('[AMQP] channel', _this.exchange, 'established!');
        });
      })
    }).catch(err => {
      console.error('[AMQP] channel', _this.exchange, 'establish failed!');
      console.error(err);
    });
  }

  /**
   * publish message to amqp message broker
   * @param {*} key amqp queue subscribed key name
   * @param {*} data can be string, number, array or JSON
   * @returns 
   */
  async publish(key, data) {
    if(!key || !data) {
      return;
    }

    if(typeof(data) == 'number') {
      data = {
        type: 'number',
        data: data
      }
    } else if(data != '' && typeof(data) == 'string') {
      data = {
        type: 'string',
        data: data
      }
    } else {
      try {
        let str = JSON.stringify(data);
        JSON.parse(str);

        if(str.startsWith('[')){
          data = {
            type: 'array',
            data: data
          }
        } else {
          data = {
            type: 'json',
            data: data
          }
        }
      } catch(err) {
        // console.error(err)
        throw new Error('data must be not empty string, number or JSON object');
      }
    }

    
    if(this.channel) {
      this.channel.publish(this.exchange, key, Buffer.from(JSON.stringify(data)));
    }
  }
}

module.exports = AmqpSender;