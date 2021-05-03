const fs = require('fs')
const { dirname } = require('path')

const path = dirname(__dirname) + '/data'
const path_writelog = path + '/logs'
const path_writeerr = path + '/err'
const path_btcprice = path + '/price_btc'

const paths = [path_writelog, path_writeerr, path_btcprice]

function write_log(path_num = Number, file_name = String, ...text){
    var path_ = paths[path_num] + '/' + file_name + '.txt'
    stream = fs.createWriteStream(path_, {flags:'a'});
    stream.write(text + '\n')
    stream.end()
}

function get_datetime(mode = Number, days_before = 0){
    let date = new Date()
    date.setDate(date.getDate()-days_before)
    let year = date.getUTCFullYear()
    let months = ('0' + Number(date.getMonth() + 1)).slice(-2)
    let days = ('0' + Number(date.getDate())).slice(-2)
    let hours = ('0' + Number(date.getHours())).slice(-2)
    let minutes = ('0' + Number(date.getMinutes())).slice(-2)

    let seconds = ('0' + Number(date.getSeconds())).slice(-2)

    if (mode == 0) return `${year}-${months}-${days} ${hours}:${minutes}:${seconds}`

    if (mode == 1) return `${year}-${months}-${days}`

    if (mode == 2) return `${hours}:${minutes}:${seconds}`

}
function get_price(broker = String,date = String,hours = Number, minutes = Number, callback){
    let _path = path_btcprice + '/' + broker + date + '.txt'
    if (!fs.existsSync(_path)) return false
    let time_request = [hours, minutes]
    let data = fs.readFileSync(_path, {encoding: 'utf-8'})
    let file_content = String(data).split('\n')
    file_content.forEach(content => {        
        var element = String(content).split(',')
        var time = String(element[0]).split(':')
        if (time[0] == time_request[0] && time[1] == time_request[1]) return callback(element[1]); return true
    })
    return false
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

module.exports = {write_log, get_datetime, get_price, format_price}