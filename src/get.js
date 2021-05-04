const axios = require('axios');
const to = require('./tools')

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

async function request(url, params){
    params = params || null
    let datetime = to.get_datetime(0)
    let data;
    if (params == null){
        await axios
        .get(url)
        .then(res => { data = res.data; })
        .catch(error =>{ to.write_log(1, 'request',datetime, error) });
    }else{
        await axios
        .get(url, {params: params})
        .then(res => { data = res.data; })
        .catch(error =>{ to.write_log(1, 'request',datetime, error) });
    }
    return new Promise(result => result(data))
}

async function async_loop(country){
    try{
        const async_loop = country.map(async element => {
            let date = to.get_datetime(1)
            let time = to.get_datetime(2)
            let file_name = element[2] + date
            var content = await request(element[0], element[3])

            if (element[1][1] == null) to.write_log(2, file_name, time, Number(content[String(element[1][0])]).toFixed(2))

            else to.write_log(2, file_name, time, Number(content[String(element[1][0])][String(element[1][1])]).toFixed(2)) 
        })
        await Promise.all(async_loop)
    }catch(error){
            console.log(error)
            to.write_log(1, 'get_price', datetime, error)
        }
    return new Promise(result => result(true))
}

async function get_price(){
    const loop = currency.map(async country =>{
        await async_loop(country)
    })
    await Promise.all(loop)
    return new Promise(result => result(true))
}
module.exports = {get_price}
