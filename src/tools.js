const fs = require('fs');
// const {} = require('./mysql')
// const moment = require('moment')
const { dirname } = require('path');

const dirPath = dirname(__dirname) + '/data';
const log = dirPath + '/logs';
const erro = dirPath + '/errors';
const paths = [log, erro];

function write_log(pathNum = Number, fileName = String, ...text){
  if (!fs.existsSync(paths[pathNum])) fs.mkdirSync(paths[pathNum], { recursive: true });
  let path = paths[pathNum] + '/' + fileName + '.txt';
  const stream = fs.createWriteStream(path, {flags:'a'});
  stream.write(text + '\n');
  stream.end();
}

function format_price(value = Number, locale = 'en-US'){
  value = Number(value).toFixed(2)
  value = String(value).split('.')
  if (locale == 'en-US') return `${Number(value[0]).toLocaleString('en-US')}.${value[1]}`
  return `${Number(value[0]).toLocaleString('pt-BR')},${value[1]}`
}

module.exports = { write_log, format_price}