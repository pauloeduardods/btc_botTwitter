const Twitter = require('twitter')
const moment = require('moment')
const twitter = require('../coins').twitter
const tools = require('./tools')
if(process.env.ENVIRONMENT == "development"){
    require('dotenv/config')
}

var client_br = new Twitter({
    consumer_key: process.env.BTCBOT_APIKEY_TWITTER_BR,
    consumer_secret: process.env.BTCBOT_APISECRET_TWITTER_BR,
    access_token_key: process.env.BTCBOT_ACCESSTOKEN_TWITTER_BR,
    access_token_secret: process.env.BTCBOT_ACCESSSECRET_TWITTER_BR
})
var client_usa = new Twitter({
    consumer_key: process.env.BTCBOT_APIKEY_TWITTER_USA,
    consumer_secret: process.env.BTCBOT_APISECRET_TWITTER_USA,
    access_token_key: process.env.BTCBOT_ACCESSTOKEN_TWITTER_USA,
    access_token_secret: process.env.BTCBOT_ACCESSSECRET_TWITTER_USA
})
async function tweet_br(){
    const coins = twitter.twitterBR
    const coins_keys = Object.keys(coins)
    const days_before = twitter.twitterBR_config.days_before
    const days_before_keys = Object.keys(days_before)
    const exchangeChange = twitter.twitterBR_config.exchange
    const datetime_now = moment().format('YYYY-MM-DD HH:mm:ss')
    const datetime_start = moment().subtract(29, 'minutes').format('YYYY-MM-DD HH:mm:ss')
    const datetime_end = moment().add(1, 'minutes').format('YYYY-MM-DD HH:mm:ss')

    var status = 'Preço do Bitcoin:\n\n'
    var price_today 
    for(let i = 0; i < coins_keys.length; i++){
        const result = await tools.getPrice(coins_keys[i], datetime_start, datetime_end)
        if (result){
            status = status + `${tools.format_price(result, 'pt-BR')} ${coins[coins_keys[i]].symbol}    ${coins[coins_keys[i]].name}\n`
            if (coins_keys[i] == exchangeChange) price_today = result
        }
    }
    for(let i = 0; i < days_before_keys.length; i++){
        const momentBefore = moment().subtract(days_before_keys[i], 'days')
        const momentBefore_start = moment(momentBefore).subtract(29, 'minutes').format('YYYY-MM-DD HH:mm:ss')
        const momentBefore_end = moment(momentBefore).add(50, 'seconds').format('YYYY-MM-DD HH:mm:ss')
        const result = await tools.getPrice(exchangeChange, momentBefore_start, momentBefore_end)
        if (result && price_today){
            const variation = (((Number(price_today) / Number(result))*100)-100)
            status = status + `\nVariação ${days_before[days_before_keys[i]]} : ${tools.format_price(variation)}%`
        }
    }
    status = status + '\n\n#bitcoin'
    if (status.replace(/\r?\n|\r/g, '') != 'Preço do Bitcoin:#bitcoin'){
        client_br.post('/statuses/update', {status: status}, (error, tweet, response)=>{ 
            if(error){
                tools.write_log(1, 'TwitterError', datetime_now, error)
                console.log(error)
                return new Promise(resolve => resolve(false))
            }
            if(!error){
                tools.write_log(0, 'TwitterIdsBR', datetime_now, tweet['id_str'])
                console.log('twitter_bra:   ' + tweet['id_str'] + '//--//' + datetime_now)
                return new Promise(resolve => resolve(true))
            }
        })
    }else{
        tools.write_log(1, 'StatusError', datetime_now, 'Status == "Preço do Bitcoin:#bitcoin"')
        console.error('error')
        return new Promise(resolve => resolve(false))
    }
}
async function tweet_usa(){
    const coins = twitter.twitterUSA
    const coinsKeys = Object.keys(coins)
    const days_before = twitter.twitterUSA_config.days_before
    const days_before_keys = Object.keys(days_before)
    const exchangeChange = twitter.twitterUSA_config.exchange
    const datetime_now = moment().format('YYYY-MM-DD HH:mm:ss')
    const datetime_start = moment().subtract(29, 'minutes').format('YYYY-MM-DD HH:mm:ss')
    const datetime_end = moment().add(1, 'minutes').format('YYYY-MM-DD HH:mm:ss')

    var status = 'Price of Bitcoin:\n\n'
    var price_today
    for(let i = 0; i < coinsKeys.length; i++){
        const result = await tools.getPrice(coinsKeys[i], datetime_start, datetime_end)
        if (result){
            status = status + `${coins[coinsKeys[i]].symbol}    ${tools.format_price(result)}\n`
            if (coinsKeys[i] == exchangeChange) price_today = result
        }
    }
    for(let i = 0; i < days_before_keys.length; i++){
        const momentBefore = moment().subtract(days_before_keys[i], 'days')
        const momentBefore_start = moment(momentBefore).subtract(29, 'minutes').format('YYYY-MM-DD HH:mm:ss')
        const momentBefore_end = moment(momentBefore).add(50, 'seconds').format('YYYY-MM-DD HH:mm:ss')
        const result = await tools.getPrice(exchangeChange, momentBefore_start, momentBefore_end)
        if (result && price_today){
            const variation = (((Number(price_today) / Number(result))*100)-100)
            status = status + `\n${days_before[days_before_keys[i]]} % change: ${tools.format_price(variation)}%`
        }
    }
    status = status + '\n\n#bitcoin'
    if (status.replace(/\r?\n|\r/g, '') != 'Price of Bitcoin:#bitcoin'){
        client_usa.post('/statuses/update', {status: String(status)}, (error, tweet, response)=>{

            if(error){
                tools.write_log(1, 'TwitterError', datetime_now, error)
                console.log(error)
                return new Promise(resolve => resolve(false))
            }
            if(!error){
                tools.write_log(0, 'TwitterIdsUSA', datetime_now, tweet['id_str'])
                console.log('twitter_usa:   ' + tweet['id_str'] + '//--//' + datetime_now)
                return new Promise(resolve => resolve(true))
            }
        })
    }else{
        tools.write_log(1, 'StatusError', datetime_now, 'Status == "Price of Bitcoin:#bitcoin"')
        console.error('error')
        return new Promise(resolve => resolve(false))
    }
}
module.exports = {tweet_usa, tweet_br}