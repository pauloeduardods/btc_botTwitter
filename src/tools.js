const fs = require('fs')
const mysql = require('./mysql').pool
const moment = require('moment')
const { dirname } = require('path')

const path = dirname(__dirname) + '/data'
const log = path + '/logs'
const erro = path + '/err'
const paths = [log, erro]
function write_log(path_num = Number, file_name = String, ...text){
    if(!fs.existsSync(paths[path_num])) fs.mkdirSync(paths[path_num], { recursive: true })
    var path_ = paths[path_num] + '/' + file_name + '.txt'
    stream = fs.createWriteStream(path_, {flags:'a'});
    stream.write(text + '\n')
    stream.end()
}
async function getPrice(exchange, datetime_start, datetime_end){
    return new Promise(result =>{
        const date = moment().format('YYYY-MM-DD HH:mm:ss')
        const sql = `SELECT price FROM price WHERE name = "${exchange}" AND datetime >= "${datetime_start}" AND datetime <= "${datetime_end}"`
        mysql.getConnection((err, conn)=>{
            if (err) write_log(1, 'getPriceSQLCONN', date, err)
            conn.query(sql, (error, res, fields)=>{
                if (error) write_log(1, 'getPriceSQLQUERRY', date, error)
                conn.release()
                res.length > 0? result(Number(res[res.length - 1].price).toFixed(2)) : result(false)
            })
        })
    })
}
function format_price(value = Number, locale = 'en-US'){
    value = Number(value).toFixed(2)
    value = String(value).split('.')
    if (locale == 'en-US') return `${Number(value[0]).toLocaleString('en-US')}.${value[1]}`
    return `${Number(value[0]).toLocaleString('pt-BR')},${value[1]}`
}
module.exports = {write_log, getPrice, format_price}