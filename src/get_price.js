const axios = require('axios')
const moment = require('moment')()
const mysql = require('./mysql').pool
const coins = require('../coins').coins
const tools = require('./tools')

async function request(url, params){
    const datetime = tools.get_datetime(0)
    var data
    await axios
    .get(url, {params: params})
    .then(res => { data = res.data; })
    .catch(error =>{tools.write_log(1, 'request',datetime, error) })

    return new Promise(result => result(data))
}

function json_params(content, params){
    params.forEach(param => {
        content = content[String(param)]
    })
    return content
}

async function get_price(){
    const date = moment.format('YYYY-MM-DD HH:mm:ss')
    const coin_keys = Object.keys(coins)
    const loop_async = coin_keys.map(async coin_name => {
        const coin = coins[coin_name]
        const content = await request(coin.url, coin.params)
        const price = Number(json_params(content, coin.json_params)).toFixed(2)
        const sql = `INSERT INTO price (name, price, datetime) VALUES("${coin_name}", "${price}", "${date}")`
        mysql.getConnection((err, conn)=>{
            if (err) throw err
            conn.query(sql, (error, result, fields)=>{
                conn.release()
                if (error) throw error
            })
        })
    })
    await Promise.all(loop_async)
    return new Promise(res => res(true))
}
module.exports ={get_price}