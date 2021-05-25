const Twitter = require('twitter')
const moment = require('moment')
const twitter = require('../coins').twitter
const tools = require('./src/tools')
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
    const exchangeChange = twitter.twitterBR_configexchange
    const datetime_now = moment().format('YYYY-MM-DD HH:mm:ss')
    const datetime_start = moment().subtract(29, 'minutes').format('YYYY-MM-DD HH:mm:ss')
    const datetime_end = moment().add(1, 'minutes').format('YYYY-MM-DD HH:mm:ss')

    var status = 'Preço do Bitcoin:\n\n'
    var price_today 
    const pricesLoop = coins_keys.map(async coin => {
        const result = await tools.get_price(coin, datetime_start, datetime_end)
        if (result){
            status = status + `${tools.format_price(result, 'pt-BR')} ${coins[coin].symbol}    ${coins[coin].name}\n`
            if (coin == exchangeChange) price_today = result
        }
    })
    await Promise.all(pricesLoop)
    const changeLoop = days_before_keys.map(async day_before =>{
        const momentBefore = moment().subtract(day_before, 'days')
        const momentBefore_start = momentBefore.subtract(29, 'minutes').format('YYYY-MM-DD HH:mm:ss')
        const momentBefore_end = momentBefore.add(50, 'seconds').format('YYYY-MM-DD HH:mm:ss')
        const result = await tools.get_price(exchangeChange, momentBefore_start, momentBefore_end)
        //const price_today = await tools.get_price(exchangeChange, datetime_start, datetime_end)
        if (result && price_today){
            const variation = (((Number(price_today) / Number(result))*100)-100)
            status = status + `\nVariação ${days_before[day_before]} : ${to.format_price(variation)}%`
        }
    })
    await Promise.all(changeLoop)
    status = status + '\n\n#bitcoin'

    if (status != 'Price of Bitcoin\n\n\n\n#bitcoin'){
        client_br.post('/statuses/update', {status: status}, function(error, tweet, response){ 
            if(error){
                to.write_log(1, 'TwitterError', datetime_now, error)
                console.log(error)
                return new Promise(resolve => resolve(false))
            }
            if(!error){
                to.write_log(0, 'TwitterIdsBR', datetime_now, tweet['id_str'])
                console.log('twitter_bra:   ' + tweet['id_str'] + '//--//' + date)
                return new Promise(resolve => resolve(true))
            }
        })
    }else{
        to.write_log(1, 'StatusError', datetime_now, 'Status == "Price of Bitcoin\n\n\n\n#bitcoin"')
        console.error('error')
        return new Promise(resolve => resolve(false))
    }
}







async function tweet_usa(){
    let brokers = ['binanceusd','binanceeur','binancebrl']
    let currency_symbol = ['U$', '€U', 'R$']
    let days_before_name = ['24H', 'Week', 'Month']
    let days_before = [1, 7, 30]
    let d = new Date()
    let hours = d.getHours()
    let min = d.getMinutes()
    let date = to.get_datetime(1)
    let prices = []

    var status = 'Price of Bitcoin\n\n'

    for (let i = 0; i < brokers.length; i++) {
        to.get_price(String(brokers[i]), String(date), Number(hours), Number(min), function(res){
            res = false || res 
            if (res != false){
                status = status + currency_symbol[i] + '    ' + to.format_price(res) + '\n'
                prices[i] = res
            }else{
                prices[i] = false
            }
        })
    }

    for(let i = 0; i < days_before.length; i++){
        to.get_price(String(brokers[0]), String(to.get_datetime(1, days_before[i])), Number(hours), Number(min), function(res){
            res = false || res 
            if (res != false && prices[0] != false){
                let variation = (((Number(prices[0]) / Number(res))*100)-100)
                status = status + `\n${days_before_name[i]} % change: ${to.format_price(variation)}%`
            }
        })
    }
    status = status + '\n\n#bitcoin'

    if (status != 'Price of Bitcoin\n\n\n\n#bitcoin'){
        client_usa.post('/statuses/update', {status: String(status)}, function(error, tweet, response){

            if(error){
                to.write_log(0, 'tweet_error', to.get_datetime(0), error)
                console.log(error)
                return new Promise(resolve => resolve(false))
            }
            if(!error){
                to.write_log(0, 'tweet_ids_usa', to.get_datetime(0), tweet['id_str'])
                console.log('twitter_usa:   ' + tweet['id_str'] + '//--//' + date)
                return new Promise(resolve => resolve(true))
            }
        })
    }else{
        to.write_log(0, 'tweet_error', to.get_datetime(0), 'Status == "Price of Bitcoin\n\n\n\n#bitcoin"')
        console.error('error')
        return new Promise(resolve => resolve(false))
    }
}

module.exports = {tweet_usa, tweet_br}