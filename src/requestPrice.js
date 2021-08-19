const axios = require('axios')
const moment = require('moment')
const mysql = require('./mysql').pool
const coins = require('../coins').coins
const tools = require('./tools')

async function request(url, params) {
  return new Promise(async (resolve, reject) => {
    const datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    try {
      return resolve(await axios.get(url, { params: params }));
    } catch (error) {
      tools.write_log(1, 'request', datetime, error);
      reject(error);
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

function requestPrices() {
  return new Promise(async (resolve) => {
    const date = moment().format('YYYY-MM-DD HH:mm:ss')
    const coinKeys = Object.keys(coins)
    const asyncLoop = coinKeys.map(coinName => {
      try {
        const coin = coins[coinName];
        const content = request(coin.url, coin.params);
        //console.log(content)
        const price = objParams(content, coin.jsonParams).toFixed(2)
        const sql = `INSERT INTO price (name, price, datetime) VALUES("${coinName}", "${price}", "${date}")`;
        insertDatabase(sql);
        return sql;
      }
      catch (error) {
        tools.write_log(1, "errorRP", date, error);
        return;
      }
    });
    await Promise.all(asyncLoop);
    console.log(asyncLoop)
    return resolve(asyncLoop);
  });
};  

const ola = async () => {
  console.log(await requestPrices())
  await requestPrices();
}
ola();

function mysqlTask(sql) {
  return new Promise((resolve, reject) => {
    mysql.getConnection((err, conn) => {
      if (err) tools.write_log(1, 'sqlConnError', err, date)
      conn.query(sql, (error, result) => {
        conn.release()
        if (error) tools.write_log(1, 'sqlQuerryError', error, date)
        return resolve(result)
      });
    });
  })
}

async function requestPrice(){
  return new Promise(async res =>{
    
    res(true)
  })
}
module.exports ={ requestPrice, objParams, requestPrices }