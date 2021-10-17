const axios = require('axios');
const { insertPrice } = require('./mysql');
const { writeError } = require('./utils/writeLog');
const coins = require('./coins').coins;

async function request(url, params) {
  try {
    return (await axios.get(url, { params: params })).data;
  } catch (error) {
    writeError('request-requestPrice', error);
  }
}

function objParams(content, ...params){
  return params.reduce((acc, cur) => {
    try {
      return acc[cur];
    } catch {
      return acc;
    }
  }, content);
}

async function requestPrices() {
  const coinKeys = Object.keys(coins);
  const asyncLoop = coinKeys.map(async (coinName) => {
    const coin = coins[coinName];
    const content = await request(coin.url, coin.params);
    const price = objParams(content, ...coin.jsonParams);
    if (!isNaN(price)) {
      insertPrice(coinName, price);
    }
    return;
  });
  await Promise.all(asyncLoop);
  return true;
}

module.exports = { requestPrices, objParams, request }
