const mysql = require('mysql')

var pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'paulopaulo',
    database: 'btc_bot'
})
exports.pool = pool