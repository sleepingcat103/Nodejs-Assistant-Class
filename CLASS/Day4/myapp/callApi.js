const axios = require('axios');
const userId = 'user01';
const answerpackString = JSON.stringify({
  ansId: 'ANS-TEST',
  messages: [{
    type: 'api-call',
    api: 'CallBirthdayApi(" %userId ")',
    template: '%userId 的生日是 %response.birthday'
  }]
})

const answerpack = JSON.parse(answerpackString);

for(message of answerpack.messages) {
  const result = replaceVariables(message.api, { userId });

  eval(result)
  .then(response => {
    const result = replaceVariables(message.template, { response, userId });
    console.log(result);
  })
  .catch(e => console.log)
}

function CallBirthdayApi(userId) {
  return axios({
    method: 'GET',
    url: `http://localhost:3000/api/${userId}`
  })
  .then(response => response.data)
}

function replaceVariables(originString, variables) {
  return originString.replace(/\s*%([^\s])+\s*/g, (match) => {
    const variable = match.trim().replace('%', '');
    return eval(`variables.${variable}`);
  })
}