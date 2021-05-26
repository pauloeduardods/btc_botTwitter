const rp = require('./src/requestPrice')
const tw = require('./src/twitter')

async function main(){
    var last_min = (new Date).getMinutes()
    while(true){
        await new Promise(resolve => setTimeout(resolve, 3000))
        var d = new Date()
        var min = d.getMinutes()
        if (min != last_min) { 
            var requestPrice = await rp.requestPrice()
            if (requestPrice == true && min % 30 == 0){
                await new Promise(resolve => setTimeout(resolve, 3000))
                await tw.tweet_br()
                await tw.tweet_usa()
            }
            last_min = min
        }
    }
}
main()