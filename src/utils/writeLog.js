const fs = require('fs');
const moment = require('moment');
const { dirname } = require('path');

const dirPath = dirname(dirname(__dirname)) + '/data';

function write(local, type, fileName, ...text) {
  const path = `${dirPath}/${local}`;
  if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
  const finalPath = `${path}/${fileName}.${type}`;
  const stream = fs.createWriteStream(finalPath, { flags: 'a' });
  stream.write(`${moment().format('YYYY-MM-DD HH:mm:ss')},${text.join(',')}\n`);
  stream.end();
}

function writeLog(fileName, ...text) {
  write('Logs', 'log', fileName, ...text);
}

function writeError(fileName, ...text) {
  write('Errors', 'err', fileName, ...text);
}

module.exports = { writeLog, writeError };
