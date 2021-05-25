const mysql = require('mysql')

if(process.env.ENVIRONMENT == "development"){
    require('dotenv/config')
}

var pool = mysql.createPool({
    host: process.env.BTCBOT_SQLHOST,
    port: process.env.BTCBOT_SQLPORT,
    user: process.env.BTCBOT_SQLUSER,
    password: process.env.BTCBOT_SQLPASSWD,
    database: process.env.BTCBOT_SQLDATABASE
})
exports.pool = pool