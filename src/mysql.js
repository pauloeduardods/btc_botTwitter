const mysql = require('mysql')

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
    mysqlConnection.connect((err) => reject(new Error(err)));
    mysqlConnection.query(sql, (error, result) => {
      if (error) return reject(new Error(error));
      mysqlConnection.end((err) => reject(new Error(err)));
      resolve(result);
    });
    mysqlConnection.destroy();
    return;
  });
}

async function getPrice(exchange, datetime_start, datetime_end) {
  return new Promise((result, reject) => {
    const sql = `SELECT price FROM price WHERE name = "${exchange}" AND datetime >= "${datetime_start}" AND datetime <= "${datetime_end}"`;
    return mysqlTask(sql).then((res) => result(res)).catch((error) => reject(error));
  })
}

module.exports = { mysqlConnection, mysqlTask, getPrice }