const coins = {
    binance_brl:{
        url: 'https://api.binance.com/api/v3/avgPrice',
        params: {symbol : 'BTCBRL'},
        json_params: ['price']
    },
    binance_usd:{
        url: 'https://api.binance.com/api/v3/avgPrice',
        params: {symbol : 'BTCUSDT'},
        json_params: ['price']
    },
    binance_eur:{
        url: 'https://api.binance.com/api/v3/avgPrice',
        params: {symbol : 'BTCEUR'},
        json_params: ['price']
    },
    biscoint:{
        url:'https://api.biscoint.io/v1/ticker?base=BTC&quote=BRL',
        json_params: ['data','last']
    },
    bitpreco:{
        url: 'https://api.bitpreco.com/btc-brl/ticker',
        json_params: ['last']
    }    
}
exports.coins = coins