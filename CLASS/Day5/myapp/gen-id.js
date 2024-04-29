const { uuid } = require('uuidv4');
const fs = require('fs');

const uuids = new Array(950).fill(0).map(d => uuid());
const uuidFileExist = fs.existsSync('./data/uuids.json');

if(!uuidFileExist) {
  fs.writeFileSync('./data/uuids.json', JSON.stringify(uuids));
  console.log('genrate 950 uuids!');
}
console.log('uuid file exists!, no need to generate');