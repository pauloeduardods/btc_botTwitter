const axios = require('axios');
const moment = require('moment');
const { mysqlTask } = require('./mysql');
const coins = require('../coins').coins;
const tools = require('./tools');

async function request(url, params) {
  return new Promise(async (resolve, reject) => {
    try {
      return resolve((await axios.get(url, { params: params })).data);
    } catch (error) {
      return reject(new Error(error));
    }
  });
}

function objParams(content, ...params){
  return params.reduce((acc, cur) => {
    try {
      return acc[cur];
    } catch {
      return;
    }
  }, content);
}

async function requestPrices(requestResult_TEST) {
  return new Promise(async (resolve, reject) => {
    const date = moment().format('YYYY-MM-DD HH:mm:ss')
    const coinKeys = Object.keys(coins);
    const result = [];
    const asyncLoop = coinKeys.map(async coinName => {
      const coin = coins[coinName];
      const content = await requestResult_TEST ? requestResult_TEST 
        : await request(coin.url, coin.params);
      const price = objParams(content, ...coin.jsonParams);
      if (!isNaN(price)) {
        const sql = `INSERT INTO price (name, price, datetime) VALUES("${coinName}", "${parseFloat(price).toFixed(2)}", "${date}")`;
        mysqlTask(sql);
        return result.push(sql);
      }
    });
    await Promise.all(asyncLoop);
    //mysql.end((endError) => reject(new Error(endError)));
    return resolve(result);
  });
};  

const ola = async () => {
  await requestPrices();
}
//ola();
module.exports = { requestPrices, objParams, requestPrices, request }