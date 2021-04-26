const Twitter = require('twitter')
const to = require('./tools')

var client = new Twitter({
    consumer_key: process.env.API_KEY_TWITTER_USA,
    consumer_secret: process.env.API_SECRET_TWITTER_USA,
    access_token_key: process.env.ACCESS_TOKEN_KEY_USA,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET_USA
})

async function tweet_usa(callback){
    var brokers = ['binanceusd','binanceeur','binancebrl']
    var currency_symbol = ['U$', '€U', 'R$']
    let days_before_name = ['24H', 'Week', 'Month']
    let days_before = [1, 7, 30]
    let d = new Date()
    let hours = d.getHours()
    let min = d.getMinutes()
    let date = to.get_datetime(1)
    var prices = []

    var status = 'Price of Bitcoin\n\n'

    for (let i = 0; i < brokers.length; i++) {
        to.get_price(String(brokers[i]), String(date), Number(hours), Number(min), function(res){
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
            if (res != false && prices[0] != false){
                let variation = (((Number(prices[0]) / Number(res))*100)-100)
                status = status + `\n${days_before_name[i]} % change: ${to.format_price(variation)}%`
            }
        })
    }
    status = status + '\n\n#bitcoin'

    if (status != 'Price of Bitcoin\n\n\n\n#bitcoin'){
        client.post('/statuses/update', {status: String(status)}, function(error, tweet, response){

            if(error){
                to.write_log(0, 'tweet_error', to.get_datetime(0), error)
                console.log(error)
                return false
            }
            if(!error){
                to.write_log(0, 'tweet_ids_usa', to.get_datetime(0), tweet['id_str'])
                console.log('twitter_usa:   ' + tweet['id_str'] + '//--//' + date)
                return callback(true)
            }
        })
    }else{
        to.write_log(0, 'tweet_error', to.get_datetime(0), 'Status == "Price of Bitcoin\n\n\n\n#bitcoin"')
        console.error('error')
        return false
    }
}
async function run_tweet(){
    var posted = false
    while(true){
        await new Promise(resolve => setTimeout(resolve, 10000))
        var d = new Date()
        var min = d.getMinutes()
        if (Number(min) % 30 == 0 && posted == false){
            await new Promise(resolve => setTimeout(resolve, 10000))
            tweet(async (res) =>{
                if(await res == false) to.write_log(0, 'tweet_error', to.get_datetime(0), 'Error in post')
                posted = res
            })
            posted = true 
        }else if (Number(min) % 30 != 0){
            posted = false
        }
    }
}
module.exports = {run_tweet, tweet_usa}
