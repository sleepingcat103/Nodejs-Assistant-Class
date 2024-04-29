// 選填
var assistantName = "Assistant";

$(function() {
    AssistantSay("你好，請問有什麼可以為您服務的地方嗎");

    /**
     * 按下 Enter 發話
     */
    $(document).on('keypress',(e) => {
        if(e.which == 13) {
            talk();
        }
    });

    /**
     * 按鈕點擊動作 
     */
    $(document).on('click', 'button[btn-type]', e => {
        const button = e.target;
        const btnType = button.getAttribute('btn-type');
        const btnValue = button.getAttribute('btn-value');

        clickButton(btnType, btnValue);
    })

} ());

/**
 * 用戶發話
 * @returns 
 */
function talk() {

    // 取得對話內容
    var chat = $(".chat-txt input").val();

    // 無對話不動作
    if(!chat) return;

    // 你說話
    youSay(chat);
    // 清空輸入框
    $(".chat-txt input").val("");

    const data = {
        // 對話內容
        text: chat,
        userId: "testuser"
    }

    callApi('/api/conversation', 'POST', data) // 省略headers，default已經有了
    .then(response => {
        console.log("API 回覆物件:", response);
        const answerpacks = JSON.parse(response.result.replace(/\n/g, '<br>'));
        
        // answerpacks: [{}, {}, {}]
        console.log("回覆答案包", answerpacks);
        answerpacks.forEach(answerpack => AssistantSay(answerpack));
    })
    .catch(e => {
        AssistantSay("呼叫失敗，請檢查api是否正確");
    })

    // $.ajax({
    //     url: '/api/conversation',
    //     type: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     data: JSON.stringify({
	// 		// 對話內容
    //         text: chat,
    //         userId: "testuser"
    //     }),
    //     success: function (data) {
    //         console.log("API 回覆物件: ", data);
    //         const answerpacks = JSON.parse(data.result.replace(/\n/g, '<br>'));
            
    //         // answerpacks: [{}, {}, {}]
    //         console.log("回覆答案包", answerpacks);
    //         answerpacks.forEach(answerpack => AssistantSay(answerpack));
    //     },
    //     error: function() {
    //         AssistantSay("呼叫失敗，請檢查api是否正確");
    //     }
    // });
}

/**
 * 用戶點擊按鈕
 * @param {*} btnType 
 * @param {*} btnValue 
 */
function clickButton(btnType, btnValue) {
    switch(btnType) {
        case 'answerpack': generateAnswerpack(btnValue); break;
        default: 
    }

    function generateAnswerpack(btnValue) {
        // call api
        const data = {
            // 答案包Id
            ansId: btnValue,
            userId: "testuser"
        }
        callApi('/api/getAnswerpack', 'POST', data)
        .then(response => {
            // { result: "string" }
            console.log("API 回覆物件:", response);
            const answerpacks = JSON.parse(response.result.replace(/\n/g, '<br>'));
            
            // answerpacks: [{}, {}, {}]
            console.log("回覆答案包", answerpacks);
            answerpacks.forEach(answerpack => AssistantSay(answerpack));
        })
        .catch(e => {
            
        })
    }
}

/**
 * 產生對話方塊
 * @param {string} msg 
 */
function youSay(msg) {
    $(".chat-room-content").append(`
    <div class="group-rom">
        <div class="first-part odd">You</div>
        <div class="second-part">${msg}</div>
        <div class="third-part">${new Date(Date.now()).toLocaleString('zh-Hans-CN')}</div>
    </div>`);

    // 自動捲動
    $('.chat-room-content').scrollTo($(this).height());
}

function AssistantSay(msg) {

    if(typeof msg === 'string') {
        msg = {
            type: 'text',
            value: msg
        }
    }

    let msgHtml = '';

    switch(msg.type) {
        case 'text': msgHtml = parseTextMsg(msg); break;
        case 'buttons': msgHtml = parseButtonsMsg(msg); break;
        default: msgHtml = JSON.stringify(msg); break;
    }

    $(".chat-room-content").append(msgHtml);

    // 自動捲動
    $('.chat-room-content').scrollTo($(this).height());

    function parseTextMsg(msg) {
        // msg => { "type": "text", "value": "xxx" }
        return `
        <div class="group-rom">
            <div class="first-part">${assistantName}</div>
            <div class="second-part">${msg.value}</div>
            <div class="third-part">${new Date(Date.now()).toLocaleString('zh-Hans-CN')}</div>
        </div>`
    }
    function parseButtonsMsg(msg) {
        // msg => { "type": "buttons", "desc": "xxx", "value": [button]}
        // button => { "label": "", "type": "", "value": ""}
        return `
        <div class="group-rom">
            <div class="first-part">${assistantName}</div>
            <div class="second-part">
                <div>${msg.desc}</div> 
                <div>${msg.value.map(btn => {
                    return `
                    <button type="button" btn-type="${btn.type}" btn-value="${btn.value}">
                        ${btn.label}
                    </button>`
                }).join('')}</div>
            </div>
            <div class="third-part">${new Date(Date.now()).toLocaleString('zh-Hans-CN')}</div>
        </div>`
    }
}

/**
 * 呼叫api
 * @param {*} path 
 * @param {*} method 
 * @param {*} data 
 * @param {*} headers 
 * @returns 
 */
function callApi(path, method, data, headers) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: path,
            type: method,
            headers: Object.assign({
                'Content-Type': 'application/json'
            }, headers),
            data: JSON.stringify(data),

            success: function (data) {
                resolve(data);
            },
            error: function(e) {
                reject(e);
            }
        });
    })
}