const Twitter = require('twitter')
const moment = require('moment')
const twitter = require('./coins').twitter
const { getPrice } = require('./mysql');
const formatPrice = require('./utils/formatPrice');
const { writeLog, writeError } = require('./utils/writeLog');
if(process.env.ENVIRONMENT == "development"){
  require('dotenv/config')
}

let clientBR = new Twitter({
  consumer_key: process.env.BTCBOT_APIKEY_TWITTER_BR,
  consumer_secret: process.env.BTCBOT_APISECRET_TWITTER_BR,
  access_token_key: process.env.BTCBOT_ACCESSTOKEN_TWITTER_BR,
  access_token_secret: process.env.BTCBOT_ACCESSSECRET_TWITTER_BR
})
let client_usa = new Twitter({
  consumer_key: process.env.BTCBOT_APIKEY_TWITTER_USA,
  consumer_secret: process.env.BTCBOT_APISECRET_TWITTER_USA,
  access_token_key: process.env.BTCBOT_ACCESSTOKEN_TWITTER_USA,
  access_token_secret: process.env.BTCBOT_ACCESSSECRET_TWITTER_USA
})
async function tweetBR(){
  const coins = twitter.twitterBR;
  const coinKeys = Object.keys(coins);
  const { days_before: daysBefore } = twitter.twitterBR_config;
  const daysBeforeKeys = Object.keys(daysBefore);
  const { exchange } = twitter.twitterBR_config;
  const datetimeNow = moment().format('YYYY-MM-DD HH:mm:ss');
  const dateTimeStart = moment().subtract(29, 'minutes').format('YYYY-MM-DD HH:mm:ss');
  const dateTimeEnd = moment().add(1, 'minutes').format('YYYY-MM-DD HH:mm:ss');

  let status = 'Preço do Bitcoin:\n\n';
  let priceToday;

  for (let i = 0; i < coinKeys.length; i += 1) {
    const key = coinKeys[i];
    const result = await getPrice(key, dateTimeStart, dateTimeEnd);
    if (result) {
      status = status + `${formatPrice(result, 'pt-BR')} ${coins[key].symbol}    ${coins[key].name}\n`;
      if (key === exchange) priceToday = result;
    }
  }

  for (let i = 0; i < daysBeforeKeys.length; i += 1) {
    const key = daysBeforeKeys[i];
    const momentBefore = moment().subtract(key, 'days');
    const momentBeforeStart = moment(momentBefore).subtract(29, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    const momentBeforeEnd = moment(momentBefore).add(50, 'seconds').format('YYYY-MM-DD HH:mm:ss');
    const result = await getPrice(exchange, momentBeforeStart, momentBeforeEnd);
    if (result && priceToday) {
      const variation = (((Number(priceToday) / Number(result)) * 100) - 100);
      if (!isNaN(variation)) {
        status = status + `\nVariação ${daysBefore[key]} : ${formatPrice(variation)}%`;
      }
    }
  }

  status = status + '\n\n#bitcoin';

  if (status.replace(/\r?\n|\r/g, '') !== 'Preço do Bitcoin:#bitcoin') {
    clientBR.post('/statuses/update', {status: status}, (error, tweet)=>{ 
      if (error) {
        writeError('TwitterError', error);
        console.error(error);
        return Promise.resolve(false);
      }
      if (!error) {
        writeLog('TwitterIdsBR', tweet['id_str']);
        console.log('twitterBR:   ' + tweet['id_str'] + '//--//' + datetimeNow);
        return Promise.resolve(true);
      }
    });
  } else {
    writeError('StatusError', 'Status == "Preço do Bitcoin:#bitcoin"');
    console.error('Status == "Preço do Bitcoin:#bitcoin"');
    return Promise.resolve(false);
  }
}
async function tweetUSA(){
  const coins = twitter.twitterUSA;
  const coinsKeys = Object.keys(coins);
  const { days_before: daysBefore } = twitter.twitterUSA_config;
  const daysBeforeKeys = Object.keys(daysBefore);
  const { exchange } = twitter.twitterUSA_config;
  const datetimeNow = moment().format('YYYY-MM-DD HH:mm:ss');
  const dateTimeStart = moment().subtract(29, 'minutes').format('YYYY-MM-DD HH:mm:ss');
  const dateTimeEnd = moment().add(1, 'minutes').format('YYYY-MM-DD HH:mm:ss');

  let status = 'Price of Bitcoin:\n\n';
  let priceToday;

  for (let i = 0; i < coinsKeys.length; i += 1) {
    const key = coinsKeys[i];
    const result = await getPrice(key, dateTimeStart, dateTimeEnd);
    if (result){
      status = status + `${coins[key].symbol}    ${formatPrice(result)}\n`;
      if (key == exchange) priceToday = result;
    }
  }

  for (let i = 0; i < daysBeforeKeys.length; i += 1) {
    const key = daysBeforeKeys[i];
    const momentBefore = moment().subtract(key, 'days');
    const momentBeforeStart = moment(momentBefore).subtract(29, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    const momentBeforeEnd = moment(momentBefore).add(50, 'seconds').format('YYYY-MM-DD HH:mm:ss');
    const result = await getPrice(exchange, momentBeforeStart, momentBeforeEnd);
    if (result && priceToday){
      const variation = (((Number(priceToday) / Number(result))*100)-100);
      if (!isNaN(variation)) {
        status = status + `\n${daysBefore[key]} % change: ${formatPrice(variation)}%`;
      }
    }
  }

  status = status + '\n\n#bitcoin';

  if (status.replace(/\r?\n|\r/g, '') !== 'Price of Bitcoin:#bitcoin'){
    client_usa.post('/statuses/update', {status: String(status)}, (error, tweet, response)=>{
      if (error) {
        writeError('TwitterError', error);
        console.error(error);
        return Promise.resolve(false);
      }
      if (!error) {
        writeLog('TwitterIdsUSA', tweet['id_str']);
        console.log('twitterUSA:   ' + tweet['id_str'] + '//--//' + datetimeNow);
        return Promise.resolve(true);
      }
    });
  } else {
    writeError('StatusError', 'Status == "Price of Bitcoin:#bitcoin"');
    console.error('Status == "Price of Bitcoin:#bitcoin"');
    return Promise.resolve(false);
  }
}

module.exports = { tweetUSA, tweetBR }