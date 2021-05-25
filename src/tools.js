const fs = require('fs')
const mysql = require('./mysql').pool
const moment = require('moment')
const { dirname } = require('path')

const path = dirname(__dirname) + '/data'
const log = path + '/logs'
const erro = path + '/err'
const price_path = path + '/price_btc'

const paths = [log, erro, price_path]

function write_log(path_num = Number, file_name = String, ...text){
    if(!fs.existsSync(paths[path_num])) fs.mkdirSync(paths[path_num], { recursive: true })
    var path_ = paths[path_num] + '/' + file_name + '.txt'
    stream = fs.createWriteStream(path_, {flags:'a'});
    stream.write(text + '\n')
    stream.end()
}
async function get_price(exchange, datetime_start, datetime_end){
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
function format_price(value = Number, locale = String){
    locale = locale || 'en-US'
    value0 = Number(value).toFixed(2)
    content = String(value0).split('.')
    var replacer = /,/gi
    if (Number(content[1]) >= 1){
        if (locale == 'en-US')return String(Number(content[0]).toLocaleString('en-US')) + '.' + String(content[1])
        else{
            var value1 = String(Number(content[0]).toLocaleString('en-US'))
            var value2 = value1.replace(replacer, '.')
            return String(value2) + ',' + String(content[1])  
        }
    }else{
        var value1 = Number(content[0]).toLocaleString('en-US')
        if (locale == 'en-US') return value1 + '.00'
        else{
            var value2 = value1.replace('.', '/')
            value2 = value2.replace(replacer, '.')
            value2 = value2.replace('/', ',')
            return value2 + ',00'
        }
    }
}
module.exports = {write_log, get_price, format_price}