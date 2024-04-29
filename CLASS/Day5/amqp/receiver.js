// Amqp Receiver
require('dotenv').config();
const { AMQP_URL, MAX_RETRY_COUNT } = process.env;

let amqp = require('amqp-connection-manager');
let fs = require('fs');
let path = require('path');

// 根據檔案來增加channel
let channelsPath = path.join(__dirname , './channels');
let files = fs.readdirSync('./channels');
let channelConfigs = files
    .filter(file => { return file.match(/.+\.js/g); })
    .map(file => { return require(path.join(channelsPath, file)); })
    .filter(({ exchange, queue, key, handler }) => {
        if(!exchange || !queue || !key || !handler) { return false; }
        return true;
    })

// 沒有可用的 channel 設定
if(channelConfigs.length == 0) {
    console.log('no configs');
    process.exit(1);
}

let connection = amqp.connect([AMQP_URL]);
    connection.on('connect', () => console.log('Connected!'));
    connection.on('disconnect', err => console.log('Disconnected.', err));


let channelWrapper = connection.createChannel({
    json: true,
    setup: channel => {
        let { exchange, queue, key, handler } = channelConfigs.shift();
        return createChannel(channel, exchange, queue, key, handler);
    }
});

channelWrapper.waitForConnect()
.then(() => {
    return Promise.all(channelConfigs.map(({ exchange, queue, key, handler }) => {
        return channelWrapper.addSetup(function (channel) {
            return createChannel(channel, exchange, queue, key, handler);
        });
    }));
}).then(() => {
    console.log("start listening for messages");
}).catch((err) => {
    console.error('err:', err)
});



/**
 * 建立 amqp 通道方法
 * 錯誤處理參考
 * https://medium.com/@lalayueh/%E5%A6%82%E4%BD%95%E5%84%AA%E9%9B%85%E5%9C%B0%E5%9C%A8rabbitmq%E5%AF%A6%E7%8F%BE%E5%A4%B1%E6%95%97%E9%87%8D%E8%A9%A6-c050efd72cdb
 * @exchange {string} 交換器名稱
 * @queue {string} 隊列名稱
 * @topic {string} 訂閱topic
 * @handler {function} 訊息處理方法 (不須包含channel ack)
 * 
 * @returns amqp channel
 */
function createChannel(channel, exchange, queue, key, handler) {
    console.log(`[new channel created]:\n  - exchange: ${exchange}\n  - queue: ${queue}\n  - key: ${key}`);

    return Promise.all([
        // 建立交換器(同時建立一般交換器與失敗重作等待器)
        // 重送機制目前僅支援direct模式 (2022/2/8)
        channel.assertExchange(exchange, 'direct', { during: true }),
        channel.assertExchange(`${exchange}_wait`, 'direct', { during: true })
    ])
    // 建立隊列
    .then(() => channel.assertQueue(queue, { exclusive: true, autoDelete: true } ))
    // 同時取出處理中訊息
    .then(() => channel.prefetch(1))
    // 隊列訂閱交換器
    .then(() => channel.bindQueue(queue, exchange, key))
    // 消化訊息
    .then(() => channel.consume(queue, (message) => handlerWrapper({ message }) ))
    .catch(e => {
        console.error('[unexpected error]', e);
    });

    // 包裝消化訊息方法
    function handlerWrapper({ message }) {
        return handler(JSON.parse(message.content.toString()))
        .then(() => {
            channel.ack(message);
        }).catch(e => {
            console.error('[handlerWrapper]', e)
            errorHandler();
        })
        
        // 錯誤處理部分
        function errorHandler() {
            let retryCount = message.properties.headers['x-retry-count'] || 0;
            if (retryCount > MAX_RETRY_COUNT) {
                console.error('[fail to handle] reach max retry times:', MAX_RETRY_COUNT);
                console.info(`[fail to handle] exchange: ${exchange}, queue: ${queue}, key: ${key}`);
                console.info(message.content.toString());
                // console.log('fail to handle', message.content.toString());
                return channel.ack(message);
            }
    
            // randomlize delay time
            let delaySeconds = Math.floor(Math.random() * (1 << retryCount)) + 1;
            let waitExchange = `${exchange}_wait`;
            let waitQueue = `${queue}_wait@${delaySeconds}`;
            let waitKey = `${key}_wait@${delaySeconds}`;

            // [now ] project log reqres
            // [wait] project_wait log_wait@1 reqres_wait@1

            // console.log('[now ]', exchange, queue, key)
            // console.log('[wait]', waitExchange, waitQueue, waitKey)

            // create delay retry queue
            return channel.assertQueue(waitQueue, {
                arguments: {
                    'x-dead-letter-exchange': exchange,
                    'x-dead-letter-routing-key': key,
                    'x-message-ttl': delaySeconds * 1000 * 2,
                    'x-expires': delaySeconds * 1000 * 4,
                },
            })
            // bind delay retry queue
            .then(() => channel.bindQueue(waitQueue, waitExchange, waitKey))
            // ack the original meesage
            .then(() => channel.ack(message))
            // push the message to the wait exchange
            .then(() => channel.publish(waitExchange, waitKey, message.content, {
                headers: {
                    'x-retry-count': retryCount + 1,
                },
            }))
        }
    }
}
