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
        json_params: ['price'],
        
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
const twitter = {
    twitterBR:{
        binance_usd:{
            symbol:'  U$\n',
            name: ''
        },
        binance_brl:{
            symbol:'R$',
            name: 'Binance'
        },
        biscoint:{
            symbol:'R$',
            name: 'Biscoint'
        },
        bitpreco:{
            symbol:'R$',
            name: 'BitPreço'
        }
    },
    twitterBR_config:{
        exchange: 'binance_usd',
        days_before:{
            1:'24H',
            7:'7Dias',
            30:'30Dias'
        }
    },
    twitterUSA:{
        binance_usd:{
            symbol:'U$',
        },
        binance_eur:{
            symbol:'€U',
        },
        binance_brl:{
            symbol:'R$',
        }
    },
    twitterUSA_config:{
        exchange: 'binance_usd',
        days_before:{
            1:'24H',
            7:'Week',
            30:'Month'
        }
    }
}
exports.coins = coins
exports.twitter = twitter