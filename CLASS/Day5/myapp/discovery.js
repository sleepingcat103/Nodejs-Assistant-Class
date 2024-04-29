const DiscoveryV2 = require('ibm-watson/discovery/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
const fs = require('fs');

const discovery = new DiscoveryV2({
  authenticator: new IamAuthenticator({
    apikey: '7ESUS2fzPsGpzcbnITfDXnn1oqVXlgbEeLX5BVaAOvWC',
  }),
  version: '2020-08-30',
  serviceUrl: 'https://api.jp-tok.discovery.watson.cloud.ibm.com',
});

const params = {
  projectId: '54306532-1b55-4b5b-9574-52c1f44f4e45',
  // query: 'text:交通局',
  naturalLanguageQuery: '當被保險人年齡達到九十九歲，保險契約會發生什麼事',
  // count: 5
  // passages: {
  //   enabled: true,
  //   per_document: false,
  //   max_per_document: 3
  // },
  _return: ["results"]
};

discovery.query(params)
  .then(response => {
    fs.writeFileSync('discoveryReturn.json', JSON.stringify(response.result, null, 2));
  })
  .catch(err => {
    console.log('error:', err);
  });