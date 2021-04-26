const gp = require('./src/get_price')
const tw = require('./src/twitter')
const tweet_mode = true

async function main(){
    let last_min = (new Date).getMinutes()
    while(true){
        await new Promise(resolve => setTimeout(resolve, 3000))
        let d = new Date()
        let min = d.getMinutes()
        if (min != last_min) { 
            let get_price = await gp.get_price()
            if (get_price == true && min % 30 == 0 && tweet_mode == true){
                await new Promise(resolve => setTimeout(resolve, 3000))
                await tw.tweet_br()
                await tw.tweet_usa()
            }
            last_min = min
        }
    }
}
main()