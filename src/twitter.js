const Twitter = require('twitter')
const to = require('./tools')

var client_br = new Twitter({
    consumer_key: process.env.API_KEY_TWITTER_BR,
    consumer_secret: process.env.API_SECRET_TWITTER_BR,
    access_token_key: process.env.ACCESS_TOKEN_KEY_BR,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET_BR
})

var client_usa = new Twitter({
    consumer_key: process.env.API_KEY_TWITTER_USA,
    consumer_secret: process.env.API_SECRET_TWITTER_USA,
    access_token_key: process.env.ACCESS_TOKEN_KEY_USA,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET_USA
})

async function tweet_br(){
    let exchages = ['binanceusd', 'binancebrl', 'biscoint', 'bitpreco']
    let exchages_names = ['  U$\n','R$    Binance', 'R$    Biscoint', 'R$    BitPreco']
    let days_before_name = ['24H  ', '7Dias', '30Dias']
    let days_before = [1, 7, 30]
    let d = new Date()
    let hours = d.getHours()
    let min = d.getMinutes()
    let date = to.get_datetime(1)
    let prices = []

    var status = 'Preço do Bitcoin:\n\n'

    for (let i = 0; i < exchages.length; i++) {
        to.get_price(String(exchages[i]), String(date), Number(hours), Number(min), function(res){
            res = false || res 
            if (res != false){
                status = status + to.format_price(res, 'pt-BR')+ ' '+ exchages_names[i]+ '\n'
                prices[i] = res
            }else{
                prices[i] = false
            }
        })
    }

    for(let i = 0; i < days_before.length; i++){
        to.get_price(String(exchages[0]), String(to.get_datetime(1, days_before[i])), Number(hours), Number(min), function(res){
            res = false || res 
            if (res != false && prices[0] != false){
                let variation = (((Number(prices[0]) / Number(res))*100)-100)
                status = status + `\nVariação ${days_before_name[i]} : ${to.format_price(variation)}%`
            }
        })
    }
    status = status + '\n\n#bitcoin'

    if (status != 'Price of Bitcoin\n\n\n\n#bitcoin'){
        client_br.post('/statuses/update', {status: String(status)}, function(error, tweet, response){ 
            if(error){
                to.write_log(0, 'tweet_error', to.get_datetime(0), error)
                console.log(error)
                return new Promise(resolve => resolve(false))
            }
            if(!error){
                to.write_log(0, 'tweet_ids_bra', to.get_datetime(0), tweet['id_str'])
                console.log('twitter_bra:   ' + tweet['id_str'] + '//--//' + date)
                return new Promise(resolve => resolve(true))
            }
        })
    }else{
        to.write_log(0, 'tweet_error', to.get_datetime(0), 'Status == "Price of Bitcoin\n\n\n\n#bitcoin"')
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