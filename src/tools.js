const fs = require('fs')
const {} = require('./mysql')
const moment = require('moment')
const { dirname } = require('path')

const path = dirname(__dirname) + '/data'
const log = path + '/logs'
const erro = path + '/errors'
const paths = [log, erro]
function write_log(path_num = Number, file_name = String, ...text){
  if(!fs.existsSync(paths[path_num])) fs.mkdirSync(paths[path_num], { recursive: true })
  var path_ = paths[path_num] + '/' + file_name + '.txt'
  stream = fs.createWriteStream(path_, {flags:'a'});
  stream.write(text + '\n')
  stream.end()
}

function format_price(value = Number, locale = 'en-US'){
  value = Number(value).toFixed(2)
  value = String(value).split('.')
  if (locale == 'en-US') return `${Number(value[0]).toLocaleString('en-US')}.${value[1]}`
  return `${Number(value[0]).toLocaleString('pt-BR')},${value[1]}`
}
module.exports = {write_log, getPrice, format_price}