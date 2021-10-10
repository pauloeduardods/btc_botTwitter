const fs = require('fs');
const moment = require('moment')
const { dirname } = require('path');

const dirPath = dirname(__dirname) + '/data';

function writeLog(fileName, ...text) {
  const path = `${dirPath}/Logs`
  if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
  const finalPath = `${path}/${fileName}.log`
  const stream = fs.createWriteStream(finalPath, { flags: 'a' });
  stream.write(`${moment().format('YYYY-MM-DD HH:mm:ss')},${text.join(',')}\n`);
  stream.end();
}

function writeError(fileName, ...text) {
  const path = `${dirPath}/Errors`
  if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
  const finalPath = `${path}/${fileName}.err`
  const stream = fs.createWriteStream(finalPath, { flags: 'a' });
  stream.write(`${moment().format('YYYY-MM-DD HH:mm:ss')},${text.join(',')}\n`);
  stream.end();
}

module.exports = { writeLog, writeError };
