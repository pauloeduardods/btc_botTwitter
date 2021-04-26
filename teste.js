const to = require('./packages/tools')
var d = new Date()
var f = d.getHours()
//console.log(f)
//console.log(d)
//console.log(process.env.API_KEY_TESTE) 
//var f = to.get_price('binancebrl', '2021-02-19', 3, 51,function(retorno){
    //console.log(retorno)
//})
//var f = to.get_datetime(1)
//console.log(f)
//var preco = []
//to.get_price('binancebrl', '2021-02-19', 3, 51,function(res){
    //preco.push(res)
//})
//console.log(preco)
const { dirname } = require('path')
const path = dirname(__dirname) + '/data'
const path_writelog = path + '/logs'
const path_writeerr = path + '/err'
const path_btcprice = path + '/price_btc'
const path_telegram = path + '/telegram'
//var num = 12213213.40
//var num0 = 124121243.00
const fs = require('fs')
//var f = to.format_price(num0, '')
//console.log(f)
//to.get_datetime(1, last)
//tww.tweet()
//tw.tweet()

function get_price(hours = Number, minutes = Number){
    let _path = 'binancebrl2021-02-22.txt'
    if (!fs.existsSync(_path)) return false
    let time_request = [hours, minutes]
    let data = fs.createReadStream(_path, {encoding: 'utf-8'})
    let file_content = String(data).split('\n')
    file_content.forEach(content =>{        
        var element = String(content).split(',')
        var time = String(element[0]).split(':')
        if (time[0] == time_request[0] && time[1] == time_request[1]){
            return (element[1])
        }
    })
}
function get_price(hours = Number, minutes = Number, callback){
    let _path = 'binancebrl2021-02-22.txt'
    if (!fs.existsSync(_path)) return false
    let time_request = [hours, minutes]
        let data = fs.readFileSync(_path, {encoding: 'utf-8'})
        let file_content = String(data).split('\n')
        file_content.forEach(content => {        
            var element = String(content).split(',')
            var time = String(element[0]).split(':')
            if (time[0] == time_request[0] && time[1] == time_request[1]){
                return callback(element[1])
            }
        })
    return false
}
// get_price('00','30',async(res)=>{
//     let f = to.format_price(res, 'pt_BR')
//     console.log(f)
// })
//let j = to.get_datetime(1,2)
//console.log(j)
//let variation = (((false / 10)*100)-100)
//console.log(variation)
function aa(params = Number){
    params = params || 0
    console.log(params)
    // if (params == null) console.log('é null')
    // else console.log('nao é null')
}
const biscoint = 'https://api.biscoint.io/v1/ticker?base=BTC&quote=BRL';
const binance = 'https://api.binance.com/api/v3/avgPrice'
const mercado_btc = 'https://www.mercadobitcoin.net/api/BTC/ticker/'
const bitpreco = 'https://api.bitpreco.com/btc-brl/ticker'

const binance_ = ['price']
const biscoint_ = ['data','last']
const mercadobtc_ = ['ticker', 'last']
const bitpreco_ = ['last']

const params_binance_brl = {symbol : 'BTCBRL'}
const params_binance_usd = {symbol : 'BTCUSDT'}
const params_binance_eur = {symbol : 'BTCEUR'}

const brazil = [[binance, binance_, 'binancebrl', params_binance_brl], [biscoint, biscoint_, 'biscoint'], [bitpreco, bitpreco_, 'bitpreco']]
const usa = [[binance, binance_ , 'binanceusd', params_binance_usd]]
const eur = [[binance, binance_, 'binanceeur', params_binance_eur]]

const currency = [brazil, usa, eur]
const fo = currency.map(res => {
    console.log(res)
})