const data = new Array(2024).fill(1).map(e => {
    return {
        apiCall: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).getTime(),
        user: uuid(),
        text: randomString(Math.floor(Math.random() * 50)),
        assistantOut: {
            intents: [{
                intent: randomString(Math.floor(Math.random() * 50)),
                confidence: Math.random().toFixed(2)
            }]
        },
        messages: randomString(100)
    }
})

console.log(data)

function randomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

function uuid() {
    var d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }