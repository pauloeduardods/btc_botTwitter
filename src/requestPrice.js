const axios = require('axios');
const moment = require('moment');
const mysql = require('./mysql').pool;
const coins = require('../coins').coins;
const tools = require('./tools');

async function request(url, params) {
  return new Promise(async (resolve) => {
    const datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    try {
      return resolve((await axios.get(url, { params: params })).data);
    } catch (error) {
      tools.write_log(1, 'request', datetime, error);
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

async function mysqlTask(sql) {
  if (!sql) return;
  //const date = moment().format('YYYY-MM-DD HH:mm:ss');
  return new Promise((resolve, reject) => {
    mysql.getConnection((err, conn) => {
      if (err) return reject(err);
      conn.query(sql, (error, result) => {
        conn.release();
        if (error) return reject(error);
        return resolve(result);
      });
    });
  });
}

function requestPrices() {
  return new Promise(async (resolve) => {
    const date = moment().format('YYYY-MM-DD HH:mm:ss')
    const coinKeys = Object.keys(coins)
    const asyncLoop = coinKeys.map(async coinName => {
      const coin = coins[coinName];
      const content = await request(coin.url, coin.params);
      const price = objParams(content, ...coin.jsonParams);
      if (!isNaN(price)) {
        const sql = `INSERT INTO price (name, price, datetime) VALUES("${coinName}", "${parseFloat(price).toFixed(2)}", "${date}")`;
        mysqlTask(sql);
        return sql;
      }
    });
    await Promise.all(asyncLoop);
    return resolve(asyncLoop);
  });
};  

const ola = async () => {
  await requestPrices();
  //'https://api.binance.com/api/v3/avgPrice', {symbol : 'BTCEUR'}
  //'https://api.bitpreco.com/btc-brl/ticker'
  //console.log(await request('https://api.binance.com/api/v3/avgPrice', { symbol: 'BTCEUR' }));
}
ola();
module.exports = { requestPrices, objParams, requestPrices }