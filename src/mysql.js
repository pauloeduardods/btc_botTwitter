const mysql = require('mysql');
const moment = require('moment');
const { writeError } = require('./utils/writeLog');

if (process.env.ENVIRONMENT == 'development') {
  require('dotenv/config');
}

const options = {
  host: process.env.BTCBOT_SQLHOST,
  port: process.env.BTCBOT_SQLPORT,
  user: process.env.BTCBOT_SQLUSER,
  password: process.env.BTCBOT_SQLPASSWD,
  database: process.env.BTCBOT_SQLDATABASE
};

async function mysqlTask(sql) {
  if (!sql) return new Error('Sql commnad missing');
  return new Promise((resolve, reject) => {
    try {
      const mysqlConnection = mysql.createConnection(options);
      mysqlConnection.query(sql, (error, result) => {
        mysqlConnection.destroy();
        if (error) return reject(new Error(error));
        resolve(result);
      });
    } catch (error) {
      return reject(new Error(error));
    }
  });
}

const insertPrice = (coinName, price, dateTime) => {
  return new Promise((resolve) => {
    if (!coinName || !price) return writeError('insetPrice-mysql', 'missing params', coinName, price, dateTime);
    const date = dateTime || moment().format('YYYY-MM-DD HH:mm:ss');
    try {
      resolve(mysqlTask(`INSERT INTO price (name, price, datetime) VALUES("${coinName}", "${parseFloat(price).toFixed(2)}", "${date}")`));
    } catch (error) {
      writeError('insetPrice-mysql', error);
    }
  });
}

async function getPrice(exchange, dateTimeStart, dateTimeEnd) {
  return new Promise((resolve) => {
    const startDateTime = dateTimeStart || moment().subtract(30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    const endDateTime = dateTimeEnd || moment().add(1, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    if (!exchange) return writeError('getPrice-mysql', 'missing params', exchange, dateTimeStart, dateTimeEnd);
    try {
      const sql = `SELECT price FROM price WHERE name = "${exchange}" AND datetime >= "${startDateTime}" AND datetime <= "${endDateTime}"`;
      resolve(mysqlTask(sql));
    } catch (error) {
      writeError('getPrice-mysql', error);
    }
  })
}

module.exports = { getPrice, insertPrice };