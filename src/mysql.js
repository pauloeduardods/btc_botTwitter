const mysql = require('mysql');
const moment = require('moment');

if(process.env.ENVIRONMENT == "development"){
  require('dotenv/config')
}

const options = {
  host: process.env.BTCBOT_SQLHOST,
  port: process.env.BTCBOT_SQLPORT,
  user: process.env.BTCBOT_SQLUSER,
  password: process.env.BTCBOT_SQLPASSWD,
  database: process.env.BTCBOT_SQLDATABASE
};
const mysqlConnection = mysql.createConnection(options);

async function mysqlTask(sql) {
  if (!sql) return new Error('Sql commnad missing');
  return new Promise((resolve, reject) => {
    mysqlConnection.query(sql, (error, result) => {
      if (error) return reject(new Error(error));
      console.log(result);
      resolve(result);
    });
    return;
  });
};

const insertPrice = (coinName, price, dateTime) => {
  if (!coinName || price) return 'Missing params';
  dateTime = dateTime ? dateTime : moment().format('YYYY-MM-DD HH:mm:ss');
  return new Promise((resolve, reject) => {
    try {
      return resolve(`INSERT INTO price (name, price, datetime) VALUES("${coinName}", "${parseFloat(price).toFixed(2)}", "${dateTime}")`);
    } catch (error) {
      reject(error);
    }
  });
}

async function ola() {
  try {
    const date = moment().format('YYYY-MM-DD HH:mm:ss');
    //mysqlTask(`INSERT INTO price (name, price, datetime) VALUES("teste", "20.1", "${date}")`);
    
    //console.log(await mysqlTask(`INSERT INTO price (name, price, datetime) VALUES("teste", "20.1", "${date}")`));
    //console.log(await mysqlTask('SELECT * FROM price'));
    const datetime_start = moment().subtract(29, 'minutes').format('YYYY-MM-DD HH:mm:ss')
    const datetime_end = moment().add(1, 'minutes').format('YYYY-MM-DD HH:mm:ss')
    console.log(await getPrice('teste', datetime_start, datetime_end));
  } catch (err) {
    console.log(err);
  }
 
}
ola()

async function getPrice(exchange, datetime_start, datetime_end) {
  return new Promise((result, reject) => {
    const sql = `SELECT price FROM price WHERE name = "${exchange}" AND datetime >= "${datetime_start}" AND datetime <= "${datetime_end}"`;
    return mysqlTask(sql).then((res) => result(res)).catch((error) => reject(error));
  })
}

module.exports = { mysqlConnection, mysqlTask, getPrice }