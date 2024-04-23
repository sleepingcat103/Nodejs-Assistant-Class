
require('dotenv').config();

const ANSWER_PACK = require('./model/ANSWER_PACK');
const answerpacks = require('./answerpacks.json'); 

console.log('insert', answerpacks.length, 'answerpacks');

(async () => {
  for(answerpack of answerpacks) {
    await ANSWER_PACK.insertAnswerPack({
      ANS_ID: answerpack.ansId,
      MESSAGES: JSON.stringify(answerpack.messages)
    })
  }
}) ();


// async function main() {
//   for(answerpack of answerpacks) {
//     await ANSWER_PACK.insertAnswerPack({
//       ANS_ID: answerpack.ansId,
//       MESSAGES: JSON.stringify(answerpack.messages)
//     })
//   }
// }
// main();

