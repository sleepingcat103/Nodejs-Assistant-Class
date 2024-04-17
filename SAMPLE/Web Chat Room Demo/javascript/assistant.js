// 自行填寫
var skillId = "******************************";
var url = "******************************";
var apikey = "******************************";

//選填
var assistantName = "Assistant";

// 不用管他
var context = {};

$(function(){

	// assistant message api url
    url = url + `/v1/workspaces/${skillId}/message?version=2019-02-28`;
	console.log(url)

    AssistantSay("你好，請問有什麼可以為您服務的地方嗎");

    /**
     * 按下 Enter 發話
     */
    $(document).on('keypress',(e) => {
        if(e.which == 13) {
            talk();
        }
    });

}());

function talk(){

    // 取得對話內容
    var chat = $(".chat-txt input").val();

    // 無對話不動作
    if(!chat) return;

    // 你說話
    youSay(chat);
    // 清空輸入框
    $(".chat-txt input").val("");

    // 溝通 assistant
    $.ajax({
        url: url,
        beforeSend: function(xhr) { 
            xhr.setRequestHeader("Authorization", "Basic " + btoa("apikey:" + apikey)); 
        },
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify({
			// 對話內容
            "input": {
                "text": chat
            },
			// 記錄上文
            "context": context
        }),
        success: function (data) {
            console.log("assistant 回覆物件: ", data);

            //取得回覆內容
            try{
                result = data.output.text[0];

                console.log("assistant 回覆內容: ", result);
                context = data.context;

                AssistantSay(result);
            }catch{
                AssistantSay("assistant 回覆錯誤");
            }
        },
        error: function(){
            AssistantSay("呼叫失敗，請檢查 apikey & url 是否正確");
        }
    });
}

/**
 * 產生對話方塊
 * @param {string} msg 
 */
function youSay(msg){
    $(".chat-room-content").append(`
    <div class="group-rom">
        <div class="first-part odd">You</div>
        <div class="second-part">${msg}</div>
        <div class="third-part">${new Date(Date.now()).toLocaleString('zh-Hans-CN')}</div>
    </div>`);

    // 自動捲動
    $('.chat-room-content').scrollTo($(this).height());
}

function AssistantSay(msg){
    $(".chat-room-content").append(`
    <div class="group-rom">
        <div class="first-part">${assistantName}</div>
        <div class="second-part">${msg}</div>
        <div class="third-part">${new Date(Date.now()).toLocaleString('zh-Hans-CN')}</div>
    </div>`);

    // 自動捲動
    $('.chat-room-content').scrollTo($(this).height());
}
